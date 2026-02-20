import copy
import json
import os
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Set, Tuple, Union

from openai import OpenAI

from app.schemas import PlaceCandidate, ResponseDto

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


def _normalize_date_str(s: str) -> str:
    # "2025. 12. 09" -> "2025-12-09"
    s = (s or "").strip()
    s = s.replace(".", "-")
    s = re.sub(r"\s+", "", s)
    s = re.sub(r"-{2,}", "-", s)
    return s


def _parse_date_range(date_str: str) -> Tuple[str, str]:
    s = _normalize_date_str(date_str)
    if not s:
        return "", ""
    if "~" in s:
        a, b = s.split("~", 1)
        return a.strip(), b.strip()
    return s.strip(), ""


def _date_list(start: str, end: str) -> List[str]:
    if not start:
        return []
    try:
        s = datetime.strptime(start, "%Y-%m-%d")
    except ValueError:
        return []
    if not end:
        return [start]
    try:
        e = datetime.strptime(end, "%Y-%m-%d")
    except ValueError:
        return [start]
    if e < s:
        return [start]
    days = []
    cur = s
    while cur <= e and len(days) < 10:
        days.append(cur.strftime("%Y-%m-%d"))
        cur += timedelta(days=1)
    return days


def _sort_candidates(places: List[PlaceCandidate]) -> List[PlaceCandidate]:
    """
    이미지가 있는 장소를 우선으로 정렬.
    이미 조회순(arrange=B)으로 받아왔으므로 그 순서를 최대한 유지하면서
    이미지 없는 장소를 뒤로 밀어냄.
    """
    with_image = [p for p in places if p.firstimage]
    without_image = [p for p in places if not p.firstimage]
    return with_image + without_image


def _to_float(v: Any) -> float:
    try:
        return float(v or 0.0)
    except (TypeError, ValueError):
        return 0.0


def _extract_json_object(text: str) -> Dict[str, Any]:
    if not text:
        return {}

    try:
        data = json.loads(text)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            data = json.loads(match.group(0))
            return data if isinstance(data, dict) else {}
        except json.JSONDecodeError:
            return {}

    return {}


def _call_model_json(system: str, user_payload: Dict[str, Any], retry: int = 1) -> Dict[str, Any]:
    for _ in range(retry + 1):
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.35,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": json.dumps(user_payload, ensure_ascii=False)},
            ],
        )
        content = resp.choices[0].message.content or "{}"
        parsed = _extract_json_object(content)
        if parsed and isinstance(parsed.get("travelSchedule"), list):
            return parsed
    raise ValueError("Failed to parse model JSON response")


def _build_candidates(places: List[PlaceCandidate], limit: int = 100) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    seen: Set[str] = set()

    for p in _sort_candidates(places):
        title = (p.title or "").strip()
        if not title or title in seen:
            continue
        seen.add(title)
        out.append(
            {
                "title": title,
                "address": p.addr1 or "",
                "image": p.firstimage or "",
                "latitude": _to_float(p.mapy),
                "longitude": _to_float(p.mapx),
            }
        )
        if len(out) >= limit:
            break

    return out


def _build_schedule_place_map(current_schedule: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    place_map: Dict[str, Dict[str, Any]] = {}
    for day in current_schedule:
        for item in day.get("plan", []):
            title = (item.get("place") or "").strip()
            if not title or title in place_map:
                continue
            place_map[title] = {
                "address": item.get("address") or "",
                "image": item.get("image") or "",
                "latitude": _to_float(item.get("latitude")),
                "longitude": _to_float(item.get("longitude")),
            }
    return place_map


def _resolve_place_title(raw_title: str, allowed_titles: Set[str]) -> str:
    title = (raw_title or "").strip()
    if not title:
        return ""
    if title in allowed_titles:
        return title

    normalized = title.replace(" ", "")
    for t in allowed_titles:
        tn = t.replace(" ", "")
        if normalized == tn or normalized in tn or tn in normalized:
            return t
    return ""


def _clean_schedule(
    *,
    source_schedule: List[Dict[str, Any]],
    dates: List[str],
    fallback_schedule: List[Dict[str, Any]],
    allowed_titles: Set[str],
    place_map: Dict[str, Dict[str, Any]],
) -> List[Dict[str, Any]]:
    cleaned_schedule: List[Dict[str, Any]] = []

    for i, day in enumerate(source_schedule):
        if not isinstance(day, dict):
            continue

        raw_plans = day.get("plan", [])
        if not isinstance(raw_plans, list):
            raw_plans = []

        seen_titles: Set[str] = set()
        cleaned_plans: List[Dict[str, Any]] = []
        for plan in raw_plans:
            if not isinstance(plan, dict):
                continue

            resolved_title = _resolve_place_title(plan.get("place", ""), allowed_titles)
            if not resolved_title or resolved_title in seen_titles:
                continue
            seen_titles.add(resolved_title)

            ref = place_map.get(resolved_title, {})
            cleaned_plans.append(
                {
                    "order": len(cleaned_plans) + 1,
                    "place": resolved_title,
                    "description": plan.get("description") or "",
                    "activity": plan.get("activity") or "",
                    "address": plan.get("address") or ref.get("address") or "",
                    "image": plan.get("image") or ref.get("image") or "",
                    "latitude": _to_float(ref.get("latitude", plan.get("latitude"))),
                    "longitude": _to_float(ref.get("longitude", plan.get("longitude"))),
                }
            )

        date_val = day.get("date") or ""
        if dates and i < len(dates):
            date_val = dates[i]
        elif not date_val and i < len(fallback_schedule):
            date_val = fallback_schedule[i].get("date", "")

        cleaned_schedule.append(
            {
                "day": day.get("day") or f"Day {i + 1}",
                "date": date_val,
                "plan": cleaned_plans,
            }
        )

    if fallback_schedule and len(cleaned_schedule) < len(fallback_schedule):
        start = len(cleaned_schedule)
        for i in range(start, len(fallback_schedule)):
            fallback_day = fallback_schedule[i] if isinstance(fallback_schedule[i], dict) else {}
            raw_plans = fallback_day.get("plan", [])
            if not isinstance(raw_plans, list):
                raw_plans = []

            seen_titles: Set[str] = set()
            cleaned_plans: List[Dict[str, Any]] = []
            for plan in raw_plans:
                if not isinstance(plan, dict):
                    continue
                resolved_title = _resolve_place_title(plan.get("place", ""), allowed_titles)
                if not resolved_title or resolved_title in seen_titles:
                    continue
                seen_titles.add(resolved_title)
                ref = place_map.get(resolved_title, {})
                cleaned_plans.append(
                    {
                        "order": len(cleaned_plans) + 1,
                        "place": resolved_title,
                        "description": plan.get("description") or "",
                        "activity": plan.get("activity") or "",
                        "address": plan.get("address") or ref.get("address") or "",
                        "image": plan.get("image") or ref.get("image") or "",
                        "latitude": _to_float(ref.get("latitude", plan.get("latitude"))),
                        "longitude": _to_float(ref.get("longitude", plan.get("longitude"))),
                    }
                )

            cleaned_schedule.append(
                {
                    "day": fallback_day.get("day") or f"Day {i + 1}",
                    "date": dates[i] if dates and i < len(dates) else fallback_day.get("date", ""),
                    "plan": cleaned_plans,
                }
            )

    if dates:
        while len(cleaned_schedule) < len(dates):
            i = len(cleaned_schedule)
            cleaned_schedule.append({"day": f"Day {i + 1}", "date": dates[i], "plan": []})
        for i, day in enumerate(cleaned_schedule):
            if i < len(dates):
                day["day"] = day.get("day") or f"Day {i + 1}"
                day["date"] = dates[i]

    return cleaned_schedule


PACE_TARGETS: Dict[str, Tuple[int, int]] = {
    "여유롭게": (2, 3),
    "보통": (3, 4),
    "알차게": (4, 5),
}


def _build_plan_item_from_title(title: str, place_map: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    ref = place_map.get(title, {})
    return {
        "order": 0,  # _reindex_day_plans에서 재할당
        "place": title,
        "description": f"{title} 방문",
        "activity": "추천 장소 방문",
        "address": ref.get("address") or "",
        "image": ref.get("image") or "",
        "latitude": _to_float(ref.get("latitude")),
        "longitude": _to_float(ref.get("longitude")),
    }


def _enforce_pace_target(
    *,
    schedule: List[Dict[str, Any]],
    pace: str,
    candidates: List[Dict[str, Any]],
    place_map: Dict[str, Dict[str, Any]],
) -> List[Dict[str, Any]]:
    target = PACE_TARGETS.get((pace or "").strip())
    if not target:
        return schedule

    min_count, max_count = target
    adjusted = copy.deepcopy(schedule)
    candidate_titles = [(c.get("title") or "").strip() for c in candidates if (c.get("title") or "").strip()]

    # 하루 중복 제거 + 최대 개수 컷
    for day in adjusted:
        plans = day.get("plan", [])
        if not isinstance(plans, list):
            day["plan"] = []
            continue

        seen_day: Set[str] = set()
        compact: List[Dict[str, Any]] = []
        for item in plans:
            if not isinstance(item, dict):
                continue
            title = (item.get("place") or "").strip()
            if not title:
                continue
            key = _normalize_text(title)
            if key in seen_day:
                continue
            seen_day.add(key)
            compact.append(item)

        day["plan"] = compact[:max_count]

    # 현재 전체 사용 장소 집합
    used_global: Set[str] = set()
    for day in adjusted:
        for item in day.get("plan", []):
            if isinstance(item, dict):
                used_global.add(_normalize_text(item.get("place", "")))

    # 최소 개수까지 후보로 채움(가능하면 일정 전체 중복 회피)
    for day in adjusted:
        plans = day.get("plan", [])
        if not isinstance(plans, list):
            plans = []

        seen_day = {_normalize_text((p.get("place") or "").strip()) for p in plans if isinstance(p, dict)}

        while len(plans) < min_count:
            chosen_title = ""

            # 1순위: 전체 일정에서 아직 안 쓴 장소
            for title in candidate_titles:
                key = _normalize_text(title)
                if key in seen_day or key in used_global:
                    continue
                chosen_title = title
                break

            # 2순위: 같은 날만 중복 아니면 허용
            if not chosen_title:
                for title in candidate_titles:
                    key = _normalize_text(title)
                    if key in seen_day:
                        continue
                    chosen_title = title
                    break

            if not chosen_title:
                break

            plans.append(_build_plan_item_from_title(chosen_title, place_map))
            key = _normalize_text(chosen_title)
            seen_day.add(key)
            used_global.add(key)

        day["plan"] = plans

    _reindex_day_plans(adjusted)
    return adjusted


ADD_KEYWORDS = (
    "추가",
    "추가해",
    "추가해줘",
    "넣어",
    "넣어줘",
    "넣어줘요",
    "넣고",
    "배치",
    "포함",
)
REMOVE_KEYWORDS = (
    "빼줘",
    "빼주고",
    "빼고",
    "빼",
    "삭제",
    "삭제해",
    "제거",
    "제외",
    "없애",
    "지워",
)
EDIT_INTENT_KEYWORDS = tuple(
    dict.fromkeys(
        ADD_KEYWORDS
        + REMOVE_KEYWORDS
        + ("수정", "변경", "교체", "바꿔", "옮겨", "순서")
    )
)
REPLAN_INTENT_KEYWORDS = (
    "처음부터",
    "완전히새로",
    "전부새로",
    "다시만들",
    "다시짜",
    "재생성",
    "새일정",
)


def _normalize_text(s: str) -> str:
    return re.sub(r"\s+", "", (s or "").lower())


def _strip_trailing_particle(s: str) -> str:
    return re.sub(r"(은|는|이|가|을|를|와|과)$", "", s.strip())


def _match_term(term: str, place: str, address: str) -> bool:
    term_n = _normalize_text(term)
    if not term_n:
        return False

    place_n = _normalize_text(place)
    addr_n = _normalize_text(address)
    variants = [term_n]
    if term_n.endswith("지역") and len(term_n) > 2:
        variants.append(term_n[:-2])

    for v in variants:
        if not v:
            continue
        if v in place_n or place_n in v:
            return True
        if addr_n and v in addr_n:
            return True
    return False


def _pick_candidate_for_term(term: str, places: List[PlaceCandidate]) -> Optional[PlaceCandidate]:
    if not places:
        return None

    term_n = _normalize_text(term)
    variants = [term_n]
    if term_n.endswith("지역") and len(term_n) > 2:
        variants.append(term_n[:-2])

    ranked: List[Tuple[int, int, PlaceCandidate]] = []
    for p in places:
        title = (p.title or "").strip()
        if not title:
            continue
        title_n = _normalize_text(title)
        addr_n = _normalize_text(p.addr1 or "")
        score = 0
        for v in variants:
            if not v:
                continue
            if v == title_n:
                score = max(score, 100)
            elif v in title_n or title_n in v:
                score = max(score, 80)
            elif addr_n and v in addr_n:
                score = max(score, 60)
        if score > 0:
            ranked.append((score, 1 if p.firstimage else 0, p))

    if not ranked:
        return None

    ranked.sort(key=lambda x: (x[0], x[1]), reverse=True)
    return ranked[0][2]


def _reindex_day_plans(schedule: List[Dict[str, Any]]) -> None:
    for day in schedule:
        plans = day.get("plan", [])
        if not isinstance(plans, list):
            day["plan"] = []
            continue
        for i, plan in enumerate(plans):
            if isinstance(plan, dict):
                plan["order"] = i + 1


def has_add_intent(user_input: str) -> bool:
    text = (user_input or "").strip()
    if not text:
        return False
    return any(k in text for k in ADD_KEYWORDS)


def has_edit_intent(user_input: str) -> bool:
    text = (user_input or "").strip()
    if not text:
        return False
    return any(k in text for k in EDIT_INTENT_KEYWORDS)


def has_replan_intent(user_input: str) -> bool:
    text_n = _normalize_text(user_input or "")
    if not text_n:
        return False
    return any(k in text_n for k in REPLAN_INTENT_KEYWORDS)


def _split_edit_chunks(text: str) -> List[str]:
    normalized = text
    replacements = {
        "빼고": "빼,",
        "빼주고": "빼,",
        "제외하고": "제외,",
        "삭제하고": "삭제,",
        "제거하고": "제거,",
        "없애고": "없애,",
        "넣고": "넣어,",
        "추가하고": "추가,",
        "배치하고": "배치,",
    }
    for src, dst in replacements.items():
        normalized = normalized.replace(src, dst)

    return [
        chunk.strip()
        for chunk in re.split(r"(?:,|;|\n|그리고|또한|또|및|/)", normalized)
        if chunk.strip()
    ]


def _extract_day_index(chunk: str) -> Optional[int]:
    day_match = re.search(r"([1-9][0-9]*)\s*(?:일차|일째|째날|일)\s*(?:에|날에)?", chunk)
    if not day_match:
        return None
    try:
        day_idx = int(day_match.group(1)) - 1
    except (TypeError, ValueError):
        return None
    return max(day_idx, 0)


def _clean_edit_target(text: str) -> str:
    target = re.sub(r"[0-9]+\s*(?:일차|일째|째날|일)\s*(?:에|날에)?", " ", text)
    for k in REMOVE_KEYWORDS + ADD_KEYWORDS:
        target = target.replace(k, " ")
    target = re.sub(r"(해줘요|해줘|해주세요|줘요|줘|좀|해주고|해주시고|하고)", " ", target)
    target = re.sub(r"[\"'`]", " ", target)
    target = _strip_trailing_particle(" ".join(target.split()))
    return target


def apply_schedule_edit_locally(
    *,
    user_input: str,
    current_schedule: List[Dict[str, Any]],
    places: List[PlaceCandidate],
) -> Optional[ResponseDto]:
    if not current_schedule:
        return None

    text = (user_input or "").strip()
    if not text:
        return None

    chunks = _split_edit_chunks(text)
    remove_terms: List[str] = []
    add_requests: List[Tuple[Optional[int], str]] = []

    for chunk in chunks:
        # "A를 B로 바꿔줘/교체해줘" 형태를 우선 처리
        replace_match = re.search(
            r"(.+?)\s*(?:을|를)\s*(.+?)\s*로\s*(?:바꿔|교체|변경)",
            chunk,
        )
        if replace_match:
            old_target = _clean_edit_target(replace_match.group(1))
            new_target = _clean_edit_target(replace_match.group(2))
            day_idx = _extract_day_index(chunk)
            if old_target:
                remove_terms.append(old_target)
            if new_target:
                add_requests.append((day_idx, new_target))
            continue

        has_remove = any(k in chunk for k in REMOVE_KEYWORDS)
        has_add = any(k in chunk for k in ADD_KEYWORDS)

        if has_remove:
            target = _clean_edit_target(chunk)
            if target:
                remove_terms.append(target)

        if has_add:
            day_idx = _extract_day_index(chunk)
            target = _clean_edit_target(chunk)
            if target:
                add_requests.append((day_idx, target))

    # 중복 요청 정리
    seen_remove = set()
    compact_remove_terms = []
    for term in remove_terms:
        key = _normalize_text(term)
        if not key or key in seen_remove:
            continue
        seen_remove.add(key)
        compact_remove_terms.append(term)
    remove_terms = compact_remove_terms

    seen_add = set()
    compact_add_requests: List[Tuple[Optional[int], str]] = []
    for day_idx, term in add_requests:
        key = (day_idx, _normalize_text(term))
        if not key[1] or key in seen_add:
            continue
        seen_add.add(key)
        compact_add_requests.append((day_idx, term))
    add_requests = compact_add_requests

    recognized = bool(remove_terms or add_requests)
    if not recognized:
        return None

    edited = copy.deepcopy(current_schedule)
    removed_notes: List[str] = []
    add_notes: List[str] = []
    miss_notes: List[str] = []

    for term in remove_terms:
        removed = 0
        for day in edited:
            plans = day.get("plan", [])
            if not isinstance(plans, list):
                day["plan"] = []
                continue
            filtered = []
            for item in plans:
                if not isinstance(item, dict):
                    continue
                if _match_term(term, item.get("place", ""), item.get("address", "")):
                    removed += 1
                    continue
                filtered.append(item)
            day["plan"] = filtered

        if removed > 0:
            removed_notes.append(f"'{term}' {removed}개 삭제")
        else:
            miss_notes.append(f"'{term}' 삭제 대상을 찾지 못함")

    for day_idx, term in add_requests:
        candidate = _pick_candidate_for_term(term, places)
        target_idx = day_idx if day_idx is not None else (len(edited) - 1)
        if target_idx < 0:
            target_idx = 0
        if edited:
            target_idx = min(target_idx, len(edited) - 1)
        else:
            target_idx = 0

        if not candidate:
            miss_notes.append(f"'{term}' 추가 후보를 찾지 못함")
            continue

        title = (candidate.title or "").strip()
        if not title:
            miss_notes.append(f"'{term}' 추가 실패")
            continue

        moved_item: Optional[Dict[str, Any]] = None
        for day in edited:
            plans = day.get("plan", [])
            if not isinstance(plans, list):
                continue
            new_plans = []
            for item in plans:
                if not isinstance(item, dict):
                    continue
                if _normalize_text(item.get("place", "")) == _normalize_text(title):
                    if moved_item is None:
                        moved_item = copy.deepcopy(item)
                    continue
                new_plans.append(item)
            day["plan"] = new_plans

        if moved_item is None:
            moved_item = {
                "place": title,
                "description": f"{title} 방문",
                "activity": "추천 장소 방문",
                "address": candidate.addr1 or "",
                "image": candidate.firstimage or "",
                "latitude": _to_float(candidate.mapy),
                "longitude": _to_float(candidate.mapx),
            }
        else:
            moved_item["place"] = moved_item.get("place") or title
            moved_item["address"] = moved_item.get("address") or candidate.addr1 or ""
            moved_item["image"] = moved_item.get("image") or candidate.firstimage or ""
            moved_item["latitude"] = _to_float(moved_item.get("latitude", candidate.mapy))
            moved_item["longitude"] = _to_float(moved_item.get("longitude", candidate.mapx))
            moved_item["description"] = moved_item.get("description") or f"{title} 방문"
            moved_item["activity"] = moved_item.get("activity") or "추천 장소 방문"

        if edited:
            target_day = edited[target_idx]
            target_plans = target_day.get("plan", [])
            if not isinstance(target_plans, list):
                target_plans = []
            target_plans.append(moved_item)
            target_day["plan"] = target_plans
            add_notes.append(f"{target_idx + 1}일차에 '{title}' 추가")

    _reindex_day_plans(edited)

    text_parts: List[str] = []
    if removed_notes:
        text_parts.append(", ".join(removed_notes))
    if add_notes:
        text_parts.append(", ".join(add_notes))
    if miss_notes:
        text_parts.append("미반영: " + ", ".join(miss_notes))

    return ResponseDto(
        text=" / ".join(text_parts) if text_parts else "요청을 반영해 일정을 수정했어요.",
        travelSchedule=edited,
    )


def build_plan_from_front(
    *,
    user_input: str,
    date_str: str,
    region: str,
    travel_type: Union[str, List[str]],
    transportation: str,
    companions: str = "",
    pace: str = "",
    places: List[PlaceCandidate],
    current_schedule: Optional[List[Dict[str, Any]]] = None,
) -> ResponseDto:
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set")

    start_date, end_date = _parse_date_range(date_str)
    dates = _date_list(start_date, end_date)

    if isinstance(travel_type, list):
        travel_types = [str(x).strip() for x in travel_type if str(x).strip()]
    else:
        travel_types = [x.strip() for x in str(travel_type or "").split(",") if x.strip()]

    base_schedule = current_schedule or []
    is_edit_mode = len(base_schedule) > 0

    candidates = _build_candidates(places, limit=100)
    candidate_titles = {c["title"] for c in candidates}

    place_map: Dict[str, Dict[str, Any]] = {}
    for p in places:
        title = (p.title or "").strip()
        if not title:
            continue
        place_map[title] = {
            "address": p.addr1 or "",
            "image": p.firstimage or "",
            "latitude": _to_float(p.mapy),
            "longitude": _to_float(p.mapx),
        }

    schedule_place_map = _build_schedule_place_map(base_schedule)
    for title, info in schedule_place_map.items():
        place_map.setdefault(title, info)

    allowed_titles = set(candidate_titles) | set(schedule_place_map.keys())

    response_schema = {
        "text": "string",
        "travelSchedule": [
            {
                "day": "Day 1",
                "date": "YYYY-MM-DD",
                "plan": [
                    {
                        "order": 1,
                        "place": "string",
                        "description": "string",
                        "activity": "string",
                        "address": "string",
                        "image": "string",
                        "latitude": 0.0,
                        "longitude": 0.0,
                    }
                ],
            }
        ],
    }

    companion_rules = {
        "혼자": "혼자 여행에 적합한 장소 선택 — 혼밥 가능 식당, 산책로, 문화공간, 혼자 즐기기 좋은 명소 우선",
        "커플": "커플 여행에 적합한 장소 선택 — 야경 명소, 감성 카페, 로맨틱한 분위기의 소규모 장소 우선",
        "가족": "가족(어린이 동반) 여행에 적합한 장소 선택 — 어린이 친화 명소, 체험 프로그램, 넓고 안전한 공간 우선",
        "친구들": "친구들과의 여행에 적합한 장소 선택 — 활동적이고 재미있는 명소, 단체 식사 가능한 식당 우선",
    }
    pace_rules = {
        "여유롭게": "하루 2~3곳만 방문하고 각 장소에 충분한 시간을 배분할 것",
        "보통": "하루 3~4곳을 균형 있게 배분할 것",
        "알차게": "하루 4~5곳까지 방문하되 이동 시간을 고려해 동선을 최적화할 것",
    }

    extra_rules = []
    if companions and companions in companion_rules:
        extra_rules.append(companion_rules[companions])
    if pace and pace in pace_rules:
        extra_rules.append(pace_rules[pace])

    if is_edit_mode:
        system = (
            "너는 여행 일정 수정 전문가다.\n"
            "baseSchedule을 기준으로 editRequest를 반영해 일정을 수정한다.\n"
            "사용자가 언급하지 않은 장소/날짜는 최대한 유지한다.\n"
            "새로 추가하는 장소는 반드시 candidates.title 중 하나를 사용한다.\n"
            "삭제 요청된 장소/키워드/지역은 결과 일정에서 제거한다.\n"
            "반환은 오직 JSON만 출력한다(설명 문장/마크다운 금지).\n"
            "JSON 스키마는 response_schema를 따른다.\n"
        )

        user_payload = {
            "region": region,
            "date_range": {"start": start_date, "end": end_date},
            "travelTypes": travel_types,
            "transportation": transportation,
            "companions": companions,
            "pace": pace,
            "editRequest": user_input,
            "baseSchedule": base_schedule,
            "candidates": candidates,
            "response_schema": response_schema,
            "rules": [
                "baseSchedule의 day/date 구조는 가능하면 유지",
                "place는 baseSchedule의 기존 장소 또는 candidates.title 중 하나",
                "삭제 요청된 장소/지역은 결과 plan에서 제거",
                "추가 요청은 해당 날짜(day/date 표현 포함)에 반영",
                "order는 각 day 기준 1부터 연속 정수",
                "text에는 어떤 수정이 반영됐는지 짧게 요약",
            ] + extra_rules,
            "date_hint_list": dates,
        }
    else:
        system = (
            "너는 감성 힐링 여행 플래너다.\n"
            "반드시 입력 받은 지역(region)과 날짜(date_range)를 지켜서 일정을 만든다.\n"
            "반드시 candidates 목록 안의 title만 장소로 사용한다(목록 밖 장소 금지).\n"
            "반환은 오직 JSON만 출력한다(설명 문장/마크다운 금지).\n"
            "JSON 스키마는 response_schema를 따른다.\n"
        )

        user_payload = {
            "region": region,
            "date_range": {"start": start_date, "end": end_date},
            "travelTypes": travel_types,
            "transportation": transportation,
            "companions": companions,
            "pace": pace,
            "userInput": user_input,
            "candidates": candidates,
            "response_schema": response_schema,
            "rules": [
                "place는 candidates.title 중 하나여야 함",
                "latitude/longitude는 해당 후보의 좌표를 그대로 사용",
                "1박 이상이면 숙소 1개 포함",
                "userInput의 키워드와 분위기를 최우선으로 반영하여 place를 선택할 것",
                "travelTypes에 맞지 않는 장소는 제외할 것",
                "image 필드가 비어 있는 candidates는 image가 있는 candidates보다 낮은 우선순위로 선택",
                "transportation이 '대중교통'이면 이동 거리가 짧고 접근성 좋은 장소 우선 선택",
                "transportation이 '자가용'이면 드라이브 코스, 외곽 명소도 포함 가능",
                "pace가 '여유롭게'면 하루 2~3곳, '보통'이면 3~4곳, '알차게'면 4~5곳으로 구성",
            ] + extra_rules,
            "date_hint_list": dates,
        }

    try:
        data = _call_model_json(system=system, user_payload=user_payload, retry=1)
    except Exception:
        if is_edit_mode:
            return ResponseDto(
                text="요청을 반영하는 중 오류가 발생해 기존 일정을 유지했어요. 다시 시도해주세요.",
                travelSchedule=base_schedule,
            )
        return ResponseDto(
            text="AI 일정 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
            travelSchedule=[],
        )

    cleaned_schedule = _clean_schedule(
        source_schedule=data.get("travelSchedule", []),
        dates=dates,
        fallback_schedule=base_schedule,
        allowed_titles=allowed_titles,
        place_map=place_map,
    )
    if not is_edit_mode:
        cleaned_schedule = _enforce_pace_target(
            schedule=cleaned_schedule,
            pace=pace,
            candidates=candidates,
            place_map=place_map,
        )

    text = data.get("text")
    if not isinstance(text, str) or not text.strip():
        text = "요청을 반영해 일정을 수정했어요." if is_edit_mode else "요청을 반영해 일정을 생성했어요."

    return ResponseDto.model_validate(
        {
            "text": text,
            "travelSchedule": cleaned_schedule,
        }
    )
