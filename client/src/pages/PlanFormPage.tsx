import React, { useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUserPlanInfoStore } from "../store/userPlanInfoStore";
import { useChatStore } from "../store/chatStore";
import { getAIResponse } from "../api/travel";
import MultiSelect from "../components/Chat/MultiSelect";
import DateRangePicker from "../components/Chat/DateRangePicker";
import type { Message } from "../types/chat";

/* ── 애니메이션 ────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── 전체 페이지 ────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(160deg, #f0f7ea 0%, #f8fbf5 50%, #edf5f7 100%);
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  background: rgba(240, 247, 234, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(74, 156, 93, 0.15);
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all var(--transition-fast);
  &:hover { color: var(--color-accent-dark); background: var(--color-accent-light); }
`;

const LogoText = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: var(--color-text-primary);
  span { color: var(--color-accent); }
`;

const Body = styled.main`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 44px 24px 80px;
`;

/* ── 메인 컨테이너 ────────────────────── */
const Container = styled.div`
  width: 100%;
  max-width: 660px;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: ${fadeUp} 0.45s ease both;
`;

/* ── 헤더 ────────────────────── */
const Header = styled.div`
  text-align: center;
  margin-bottom: 28px;

  h1 {
    font-size: 28px;
    font-weight: 800;
    color: var(--color-text-primary);
    letter-spacing: -0.04em;
    margin-bottom: 6px;
  }
  p {
    font-size: 14px;
    color: var(--color-text-secondary);
  }
`;

/* ── 카드 ────────────────────── */
const Card = styled.div<{ $delay?: number; $zIndex?: number }>`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 156, 93, 0.14);
  border-radius: 20px;
  padding: 24px 26px;
  margin-bottom: 14px;
  box-shadow: 0 2px 16px rgba(74, 156, 93, 0.07);
  overflow: visible;
  position: relative;
  z-index: ${({ $zIndex = 1 }) => $zIndex};
  ${({ $delay = 0 }) => css`animation: ${fadeUp} 0.5s ${$delay}ms ease both;`}
`;

/* ── 카드 제목 ────────────────────── */
const CardLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--color-accent-dark);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 14px;
`;

const LabelDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  display: inline-block;
  flex-shrink: 0;
`;



const FieldLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
`;


const TextInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 11px;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: inherit;
  transition: all var(--transition-fast);
  box-sizing: border-box;
  &::placeholder { color: var(--color-text-muted); }
  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
    outline: none;
  }
`;

/* ── 칩 선택 ────────────────────── */
const ChipRow = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: ${({ $cols = 4 }) => `repeat(${$cols}, 1fr)`};
  gap: 8px;
`;

const Chip = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 12px 8px;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 600;
  transition: all 0.18s ease;
  line-height: 1.2;
  cursor: pointer;

  border: 1.5px solid ${({ $active }) => $active ? "var(--color-accent)" : "var(--color-border)"};
  background: ${({ $active }) => $active ? "linear-gradient(135deg, #e8f5e9, #f1f8f2)" : "var(--color-bg)"};
  color: ${({ $active }) => $active ? "var(--color-accent-dark)" : "var(--color-text-secondary)"};
  box-shadow: ${({ $active }) => $active ? "0 2px 8px rgba(74, 156, 93, 0.2)" : "none"};
  transform: ${({ $active }) => $active ? "translateY(-1px)" : "none"};

  &:hover {
    border-color: var(--color-accent);
    background: linear-gradient(135deg, #e8f5e9, #f1f8f2);
    color: var(--color-accent-dark);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(74, 156, 93, 0.18);
  }
`;

const ChipEmoji = styled.span`
  font-size: 22px;
  line-height: 1;
`;

const ChipLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

/* ── AI 요청 ────────────────────── */
const RequestTextarea = styled.textarea`
  width: 100%;
  min-height: 88px;
  max-height: 160px;
  padding: 12px 14px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 11px;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: inherit;
  resize: vertical;
  line-height: 1.65;
  box-sizing: border-box;
  transition: all var(--transition-fast);
  &::placeholder { color: var(--color-text-muted); }
  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
    outline: none;
  }
`;

const CharRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--color-text-muted);
`;

/* ── 제출 버튼 ────────────────────── */
const SubmitCard = styled.div<{ $delay?: number }>`
  ${({ $delay = 0 }) => css`animation: ${fadeUp} 0.5s ${$delay}ms ease both;`}
`;

const SubmitBtn = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  transition: all 0.2s ease;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  background: ${({ $loading }) =>
    $loading
      ? "var(--color-text-muted)"
      : "linear-gradient(135deg, #6ab870 0%, #4a9c5d 60%, #357a45 100%)"};
  box-shadow: 0 4px 20px rgba(74, 156, 93, 0.35);
  &:not(:disabled):hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(74, 156, 93, 0.45);
  }
  &:disabled { opacity: 0.55; }
`;

const ErrorMsg = styled.p`
  font-size: 13px;
  color: #e53e3e;
  text-align: center;
  margin-bottom: 10px;
`;

/* ── 데이터 ────────────────────── */
const COMPANIONS = [
  { value: "혼자", emoji: "🧘", label: "혼자" },
  { value: "커플", emoji: "💑", label: "커플" },
  { value: "가족", emoji: "👨‍👩‍👧", label: "가족" },
  { value: "친구들", emoji: "👯", label: "친구" },
];

const PACES = [
  { value: "여유롭게", emoji: "🌿", label: "여유롭게" },
  { value: "보통", emoji: "⚖️", label: "보통" },
  { value: "알차게", emoji: "⚡", label: "알차게" },
];

const TRANSPORT = [
  { value: "자가용", emoji: "🚗", label: "자가용" },
  { value: "대중교통", emoji: "🚌", label: "대중교통" },
];

const travelTypeOptions = ["관광", "문화시설", "축제 / 공연 / 행사", "쇼핑", "음식점"];

/* ── 컴포넌트 ────────────────────── */
const PlanFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { userPlanInfo, updateUserPlanInfoField } = useUserPlanInfoStore();
  const { addChat, updateMessage } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPlanInfo.startDate || !userPlanInfo.endDate) { setError("여행 기간을 선택해주세요"); return; }
    if (!userPlanInfo.region.trim()) { setError("여행 장소를 입력해주세요"); return; }

    setLoading(true); setError("");

    const chatId = Date.now().toString();
    const userMsgId = `${chatId}-user`;
    const loadingMsgId = `${chatId}-loading`;

    const parts = [userPlanInfo.region, `${userPlanInfo.startDate} ~ ${userPlanInfo.endDate}`, userPlanInfo.companions, userPlanInfo.pace];
    const userMessage: Message = {
      id: userMsgId,
      message: userPlanInfo.userInput.trim() || parts.filter(Boolean).join(" · "),
      content: [], role: "user", timestamp: new Date(), isError: false,
    };
    const loadingMessage: Message = {
      id: loadingMsgId, message: "", content: [],
      role: "assistant", timestamp: new Date(), isLoading: true, isError: false,
    };

    addChat({
      id: chatId, title: parts.filter(Boolean).join(" | "),
      messages: [userMessage, loadingMessage],
      createdAt: new Date(), updatedAt: new Date(),
    });
    navigate("/chat");

    try {
      const { text, travelSchedule } = await getAIResponse({
        userInput: userPlanInfo.userInput,
        date: `${userPlanInfo.startDate} ~ ${userPlanInfo.endDate}`,
        region: userPlanInfo.region,
        travelType: userPlanInfo.travelType.join(","),
        transportation: userPlanInfo.transportation,
        companions: userPlanInfo.companions,
        pace: userPlanInfo.pace,
      });
      updateMessage(chatId, loadingMsgId, { message: text, content: travelSchedule, isLoading: false, isError: false });
    } catch {
      updateMessage(chatId, loadingMsgId, {
        message: "AI 응답 중 오류가 발생했습니다. 다시 시도해주세요",
        content: [], isLoading: false, isError: true,
      });
    }
  };

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={() => navigate("/")}>← 홈으로</BackBtn>
        <LogoText>Plan<span>My</span>Trip</LogoText>
        <div style={{ width: 80 }} />
      </TopBar>

      <Body>
        <Container>
          <Header>
            <h1>✈️ 여행 계획 만들기</h1>
            <p>여행 정보를 입력하면 AI가 최적의 일정을 만들어드려요</p>
          </Header>

          <form onSubmit={handleSubmit}>
            {/* 카드 1 — 언제 어디로 */}
            <Card $delay={60} $zIndex={30}>
              <CardLabel><LabelDot />언제 어디로</CardLabel>
              <div style={{ marginBottom: 12 }}>
                <FieldLabel style={{ marginBottom: 6, display: "block" }}>여행 날짜</FieldLabel>
                <DateRangePicker
                  startDate={userPlanInfo.startDate}
                  endDate={userPlanInfo.endDate}
                  onChangeStart={(v) => updateUserPlanInfoField("startDate", v)}
                  onChangeEnd={(v) => updateUserPlanInfoField("endDate", v)}
                />
              </div>
              <div>
                <FieldLabel style={{ marginBottom: 6, display: "block" }}>여행 장소</FieldLabel>
                <TextInput
                  type="text"
                  value={userPlanInfo.region}
                  onChange={(e) => updateUserPlanInfoField("region", e.target.value)}
                  placeholder="예) 서울, 부산, 제주도"
                />
              </div>
            </Card>

            {/* 카드 2 — 여행 스타일 */}
            <Card $delay={120}>
              <CardLabel><LabelDot />여행 스타일</CardLabel>
              <div style={{ marginBottom: 16 }}>
                <FieldLabel style={{ marginBottom: 8, display: "block" }}>누구랑 가나요?</FieldLabel>
                <ChipRow $cols={4}>
                  {COMPANIONS.map(({ value, emoji, label }) => (
                    <Chip
                      key={value}
                      type="button"
                      $active={userPlanInfo.companions === value}
                      onClick={() => updateUserPlanInfoField("companions", value)}
                    >
                      <ChipEmoji>{emoji}</ChipEmoji>
                      <ChipLabel>{label}</ChipLabel>
                    </Chip>
                  ))}
                </ChipRow>
              </div>
              <div style={{ marginBottom: 16 }}>
                <FieldLabel style={{ marginBottom: 8, display: "block" }}>여행 페이스</FieldLabel>
                <ChipRow $cols={3}>
                  {PACES.map(({ value, emoji, label }) => (
                    <Chip
                      key={value}
                      type="button"
                      $active={userPlanInfo.pace === value}
                      onClick={() => updateUserPlanInfoField("pace", value)}
                    >
                      <ChipEmoji>{emoji}</ChipEmoji>
                      <ChipLabel>{label}</ChipLabel>
                    </Chip>
                  ))}
                </ChipRow>
              </div>
              <div>
                <FieldLabel style={{ marginBottom: 8, display: "block" }}>이동 수단</FieldLabel>
                <ChipRow $cols={2}>
                  {TRANSPORT.map(({ value, emoji, label }) => (
                    <Chip
                      key={value}
                      type="button"
                      $active={userPlanInfo.transportation === value}
                      onClick={() => updateUserPlanInfoField("transportation", value)}
                    >
                      <ChipEmoji>{emoji}</ChipEmoji>
                      <ChipLabel>{label}</ChipLabel>
                    </Chip>
                  ))}
                </ChipRow>
              </div>
            </Card>

            {/* 카드 3 — 여행 유형 */}
            <Card $delay={170} $zIndex={20}>
              <CardLabel><LabelDot />여행 유형</CardLabel>
              <MultiSelect
                label=""
                options={travelTypeOptions}
                selected={userPlanInfo.travelType}
                onChange={(v) => updateUserPlanInfoField("travelType", v)}
              />
            </Card>

            {/* 카드 4 — AI 요청 */}
            <Card $delay={210}>
              <CardLabel><LabelDot />AI에게 요청하기 <span style={{ fontWeight: 400, opacity: 0.6, textTransform: "none", fontSize: 11 }}>(선택)</span></CardLabel>
              <RequestTextarea
                ref={textareaRef}
                value={userPlanInfo.userInput}
                onChange={(e) => updateUserPlanInfoField("userInput", e.target.value)}
                placeholder="예) 아이와 함께하는 자연 위주의 힐링 여행으로 만들어주세요. 맛집도 포함해 주세요."
                maxLength={300}
              />
              <CharRow>{userPlanInfo.userInput.length} / 300</CharRow>
            </Card>

            {/* 제출 */}
            <SubmitCard $delay={250}>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <SubmitBtn type="submit" $loading={loading} disabled={loading}>
                {loading ? "⏳ AI가 일정을 만들고 있어요..." : "✨ AI 일정 만들기"}
              </SubmitBtn>
            </SubmitCard>
          </form>
        </Container>
      </Body>
    </Page>
  );
};

export default PlanFormPage;
