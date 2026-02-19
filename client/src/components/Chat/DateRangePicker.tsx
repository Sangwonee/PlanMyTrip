import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── 트리거 ────────────────────── */
const Trigger = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 11px;
  font-size: 14px;
  color: var(--color-text-primary);
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-fast);

  &:hover { border-color: var(--color-accent); background: #fff; }
  &.active {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
  }
`;

const RangeText = styled.span<{ $placeholder?: boolean }>`
  flex: 1;
  color: ${({ $placeholder }) => ($placeholder ? "var(--color-text-muted)" : "var(--color-text-primary)")};
  font-size: 14px;
`;

/* ── 팝업 ────────────────────── */
const Popup = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: 18px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  padding: 20px 24px 16px;
  animation: ${fadeIn} 0.18s ease;
  width: 640px;

  @media (max-width: 680px) {
    width: calc(100vw - 32px);
    left: 0;
    transform: none;
  }
`;

/* ── 2달 레이아웃 ────────────────────── */
const MonthsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const MonthPanel = styled.div``;

/* ── 달력 헤더 ────────────────────── */
const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const MonthLabel = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const NavBtn = styled.button`
  width: 28px; height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  &:hover { background: var(--color-accent-light); color: var(--color-accent-dark); }
  &:disabled { opacity: 0.25; cursor: default; }
`;

/* ── 요일/날짜 ────────────────────── */
const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 3px;
`;

const WeekDay = styled.span<{ $sun?: boolean; $sat?: boolean }>`
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 0;
  color: ${({ $sun }) => ($sun ? "#e05555" : ({ $sat }: { $sat?: boolean }) => ($sat ? "#4488cc" : "var(--color-text-muted)"))};
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
`;

const Day = styled.button<{
    $inRange?: boolean;
    $isStart?: boolean;
    $isEnd?: boolean;
    $isToday?: boolean;
    $disabled?: boolean;
    $empty?: boolean;
    $isSun?: boolean;
    $isSat?: boolean;
    $outOfRange?: boolean;
}>`
  height: 32px;
  width: 100%;
  border-radius: ${({ $isStart, $isEnd, $inRange }) =>
        $isStart ? "7px 0 0 7px" : $isEnd ? "0 7px 7px 0" : $inRange ? "0" : "7px"};
  font-size: 12.5px;
  font-weight: ${({ $isStart, $isEnd, $isToday }) => ($isStart || $isEnd || $isToday ? "700" : "400")};
  cursor: ${({ $disabled, $empty, $outOfRange }) => ($disabled || $empty || $outOfRange ? "not-allowed" : "pointer")};

  color: ${({ $isStart, $isEnd, $disabled, $isSun, $isSat, $outOfRange }) =>
        $isStart || $isEnd
            ? "#fff"
            : $disabled || $outOfRange
                ? "var(--color-text-muted)"
                : $isSun
                    ? "#e05555"
                    : $isSat
                        ? "#4488cc"
                        : "var(--color-text-primary)"};

  background: ${({ $isStart, $isEnd, $inRange, $outOfRange }) =>
        $isStart || $isEnd
            ? "var(--color-accent)"
            : $inRange
                ? "var(--color-accent-light)"
                : $outOfRange
                    ? "repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)"
                    : "transparent"};

  outline: ${({ $isToday, $isStart, $isEnd }) =>
        $isToday && !$isStart && !$isEnd ? "1.5px solid var(--color-accent)" : "none"};
  outline-offset: -1px;
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  visibility: ${({ $empty }) => ($empty ? "hidden" : "visible")};
  transition: background 0.1s, color 0.1s;

  &:hover:not(:disabled) {
    background: ${({ $isStart, $isEnd, $inRange, $outOfRange }) =>
        $outOfRange
            ? "repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)"
            : $isStart || $isEnd
                ? "var(--color-accent-dark)"
                : $inRange
                    ? "var(--color-accent-light)"
                    : "var(--color-accent-muted)"};
  }
`;

/* ── 하단 ────────────────────── */
const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
`;

const LimitNote = styled.span`
  font-size: 11.5px;
  color: var(--color-text-muted);
`;

const ConfirmBtn = styled.button<{ $active: boolean }>`
  padding: 8px 20px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: ${({ $active }) => ($active ? "var(--color-accent)" : "var(--color-text-muted)")};
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
  transition: all 0.15s;
  &:hover { opacity: ${({ $active }) => ($active ? 0.88 : 1)}; }
`;

/* ── 유틸 ────────────────────── */
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const MAX_DAYS = 14;

function toDateStr(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseDate(s: string): Date | null {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
}
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function diffDays(a: Date, b: Date) { return Math.round((b.getTime() - a.getTime()) / 86400000); }

function formatRange(start: string, end: string) {
    const s = parseDate(start), e = parseDate(end);
    if (!s) return "";
    const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
    if (!e || start === end) return `${fmt(s)} 선택됨`;
    const nights = diffDays(s, e);
    return `${fmt(s)} → ${fmt(e)}  (${nights}박 ${nights + 1}일)`;
}

function buildCells(year: number, month: number): (string | null)[] {
    const first = getFirstDayOfMonth(year, month);
    const days = getDaysInMonth(year, month);
    const cells: (string | null)[] = [
        ...Array(first).fill(null),
        ...Array.from({ length: days }, (_, i) => toDateStr(new Date(year, month, i + 1))),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
}

function addMonths(year: number, month: number, delta: number): [number, number] {
    let m = month + delta;
    let y = year;
    while (m > 11) { m -= 12; y++; }
    while (m < 0) { m += 12; y--; }
    return [y, m];
}

/* ── Props ────────────────────── */
interface Props {
    startDate: string;
    endDate: string;
    onChangeStart: (v: string) => void;
    onChangeEnd: (v: string) => void;
}

/* ── 컴포넌트 ────────────────────── */
const DateRangePicker: React.FC<Props> = ({ startDate, endDate, onChangeStart, onChangeEnd }) => {
    const today = new Date();
    const todayStr = toDateStr(today);

    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [hovered, setHovered] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    // 두 번째 달
    const [y2, m2] = addMonths(viewYear, viewMonth, 1);

    // 외부 클릭 닫기
    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const handleDayClick = (dateStr: string) => {
        const clicked = parseDate(dateStr)!;
        const nowMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (clicked < nowMidnight) return;

        if (!startDate || (startDate && endDate)) {
            onChangeStart(dateStr); onChangeEnd("");
        } else {
            const start = parseDate(startDate)!;
            if (clicked < start) { onChangeStart(dateStr); onChangeEnd(""); }
            else {
                const nights = diffDays(start, clicked);
                if (nights >= MAX_DAYS) {
                    onChangeEnd(toDateStr(new Date(start.getTime() + (MAX_DAYS - 1) * 86400000)));
                } else {
                    onChangeEnd(dateStr);
                }
            }
        }
    };

    const prevM = () => { const [y, m] = addMonths(viewYear, viewMonth, -1); setViewYear(y); setViewMonth(m); };
    const nextM = () => { const [y, m] = addMonths(viewYear, viewMonth, 1); setViewYear(y); setViewMonth(m); };

    const previewEnd = startDate && !endDate ? hovered : endDate;
    const isInRange = (ds: string) => {
        if (!startDate || !previewEnd) return false;
        const s = parseDate(startDate)!, e = parseDate(previewEnd)!;
        const d = parseDate(ds)!;
        if (!d || !s || !e) return false;
        return d > s && d < e;
    };

    // 이전 달 버튼: 현재 달이 오늘 달이면 비활성
    const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());

    const renderMonth = (year: number, month: number, isLeft: boolean) => {
        const cells = buildCells(year, month);

        // 시작일이 선택된 상태에서 아직 종료일이 없을 때, 14일 초과 날짜 비활성화
        const maxSelectable: Date | null =
            startDate && !endDate
                ? new Date(parseDate(startDate)!.getTime() + (MAX_DAYS - 1) * 86400000)
                : null;
        return (
            <MonthPanel key={`${year}-${month}`}>
                <CalHeader>
                    {isLeft ? (
                        <>
                            <NavBtn onClick={prevM} disabled={!canGoPrev}>◀</NavBtn>
                            <MonthLabel>{year}년 {MONTHS[month]}</MonthLabel>
                            <div style={{ width: 28 }} />
                        </>
                    ) : (
                        <>
                            <div style={{ width: 28 }} />
                            <MonthLabel>{year}년 {MONTHS[month]}</MonthLabel>
                            <NavBtn onClick={nextM}>▶</NavBtn>
                        </>
                    )}
                </CalHeader>

                <WeekRow>
                    {WEEKDAYS.map((w, i) => (
                        <WeekDay key={w} $sun={i === 0} $sat={i === 6}
                            style={{ color: i === 0 ? "#e05555" : i === 6 ? "#4488cc" : undefined }}>
                            {w}
                        </WeekDay>
                    ))}
                </WeekRow>

                <DaysGrid>
                    {cells.map((ds, idx) => {
                        if (!ds) return <Day key={`e-${idx}`} $empty type="button" />;
                        const d = parseDate(ds)!;
                        const nowMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        const isPast = d < nowMidnight;
                        const isOutOfRange = !!(maxSelectable && d > maxSelectable);
                        const dow = d.getDay();
                        return (
                            <Day
                                key={ds}
                                type="button"
                                $isStart={ds === startDate}
                                $isEnd={ds === (previewEnd ?? endDate)}
                                $inRange={isInRange(ds)}
                                $isToday={ds === todayStr}
                                $disabled={isPast}
                                $outOfRange={isOutOfRange}
                                $isSun={dow === 0}
                                $isSat={dow === 6}
                                disabled={isPast || isOutOfRange}
                                onMouseEnter={() => !endDate && !isOutOfRange && setHovered(ds)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => !isOutOfRange && handleDayClick(ds)}
                            >
                                {d.getDate()}
                            </Day>
                        );
                    })}
                </DaysGrid>
            </MonthPanel>
        );
    };

    const displayText = formatRange(startDate, endDate);

    return (
        <div style={{ position: "relative" }} ref={ref}>
            <Trigger className={open ? "active" : ""} onClick={() => setOpen(o => !o)}>
                <span style={{ fontSize: 16 }}>📅</span>
                <RangeText $placeholder={!displayText}>
                    {displayText || "여행 날짜를 선택하세요"}
                </RangeText>
                <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{open ? "▲" : "▼"}</span>
            </Trigger>

            {open && (
                <Popup>
                    <MonthsRow>
                        {renderMonth(viewYear, viewMonth, true)}
                        {renderMonth(y2, m2, false)}
                    </MonthsRow>

                    <Footer>
                        <LimitNote>📌 최대 {MAX_DAYS}일 선택 가능</LimitNote>
                        <ConfirmBtn
                            type="button"
                            $active={!!(startDate && endDate)}
                            onClick={() => { if (startDate && endDate) setOpen(false); }}
                        >
                            {startDate && endDate ? "선택 완료" : "날짜를 선택해주세요"}
                        </ConfirmBtn>
                    </Footer>
                </Popup>
            )}
        </div>
    );
};

export default DateRangePicker;
