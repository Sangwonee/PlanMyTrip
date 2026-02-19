import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUserPlanInfoStore } from "../store/userPlanInfoStore";
import { useChatStore } from "../store/chatStore";
import { getAIResponse } from "../api/travel";
import MultiSelect from "../components/Chat/MultiSelect";
import { formatDate } from "../utils";
import type { Message } from "../types/chat";

/* ── 애니메이션 ────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── 레이아웃 ────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
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
  background: rgba(245, 249, 242, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color var(--transition-fast);
  padding: 6px 12px;
  border-radius: 8px;

  &:hover {
    color: var(--color-accent-dark);
    background: var(--color-accent-light);
  }
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
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 700px; height: 500px;
    background: radial-gradient(ellipse, rgba(74, 156, 93, 0.1) 0%, transparent 65%);
    pointer-events: none;
  }
`;

const FormCard = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 40px 44px;
  width: 100%;
  max-width: 560px;
  box-shadow: var(--shadow-card);
  animation: ${fadeUp} 0.5s ease both;
  position: relative;
  z-index: 1;
`;

const CardHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const CardEmoji = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const CardTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.03em;
  margin-bottom: 6px;
`;

const CardSubtitle = styled.p`
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--color-accent-dark);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Field = styled.div``;

const DateRow = styled.div`
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 11px 14px;
    background: var(--color-bg);
    border: 1.5px solid var(--color-border);
    border-radius: 12px;
    font-size: 14px;
    color: var(--color-text-primary);
    font-family: inherit;
    transition: all var(--transition-fast);

    &:focus {
      border-color: var(--color-accent);
      background: #fff;
      box-shadow: 0 0 0 3px var(--color-accent-muted);
      outline: none;
    }
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: inherit;
  transition: all var(--transition-fast);

  &::placeholder { color: var(--color-text-muted); }
  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
    outline: none;
  }
`;

const SelectInput = styled.select`
  width: 100%;
  padding: 11px 14px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: inherit;
  transition: all var(--transition-fast);
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
    outline: none;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 4px 0 20px;
`;

const RequestLabel = styled.label`
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--color-accent-dark);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const RequestTextarea = styled.textarea`
  width: 100%;
  min-height: 90px;
  max-height: 180px;
  padding: 13px 16px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: inherit;
  resize: vertical;
  line-height: 1.6;
  transition: all var(--transition-fast);

  &::placeholder { color: var(--color-text-muted); }
  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
    outline: none;
  }
`;

const SubmitBtn = styled.button<{ $loading?: boolean }>`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background: ${({ $loading }) =>
        $loading ? "var(--color-text-muted)" : "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))"};
  color: #fff;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 16px rgba(74, 156, 93, 0.3);
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 156, 93, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: #e53e3e;
  text-align: center;
`;

const travelTypeOptions = ["관광", "문화시설", "축제 / 공연 / 행사", "쇼핑", "음식점"];

const PlanFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { userPlanInfo, updateUserPlanInfoField } = useUserPlanInfoStore();
    const { addChat, updateMessage } = useChatStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const maxEndDate =
        userPlanInfo.startDate &&
        formatDate(new Date(new Date(userPlanInfo.startDate).getTime() + 6 * 24 * 60 * 60 * 1000));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userPlanInfo.userInput.trim()) {
            setError("여행 요청 내용을 입력해주세요");
            return;
        }
        if (!userPlanInfo.startDate || !userPlanInfo.endDate) {
            setError("여행 기간을 선택해주세요");
            return;
        }
        if (!userPlanInfo.region.trim()) {
            setError("여행 장소를 입력해주세요");
            return;
        }

        setLoading(true);
        setError("");

        const chatId = Date.now().toString();
        const userMsgId = `${chatId}-user`;
        const loadingMsgId = `${chatId}-loading`;

        const userMessage: Message = {
            id: userMsgId,
            message: userPlanInfo.userInput.trim(),
            content: [],
            role: "user",
            timestamp: new Date(),
            isError: false,
        };

        const loadingMessage: Message = {
            id: loadingMsgId,
            message: "",
            content: [],
            role: "assistant",
            timestamp: new Date(),
            isLoading: true,
            isError: false,
        };

        addChat({
            id: chatId,
            title: userPlanInfo.userInput.trim().slice(0, 30) + (userPlanInfo.userInput.length > 30 ? "..." : ""),
            messages: [userMessage, loadingMessage],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // 폼 제출 즉시 채팅 페이지로 이동
        navigate("/chat");

        // 백그라운드에서 AI 응답 처리
        try {
            const { text, travelSchedule } = await getAIResponse({
                userInput: userPlanInfo.userInput,
                date: `${userPlanInfo.startDate} ~ ${userPlanInfo.endDate}`,
                region: userPlanInfo.region,
                travelType: userPlanInfo.travelType.join(","),
                transportation: userPlanInfo.transportation,
            });

            updateMessage(chatId, loadingMsgId, {
                message: text,
                content: travelSchedule,
                isLoading: false,
                isError: false,
            });
        } catch {
            updateMessage(chatId, loadingMsgId, {
                message: "AI 응답 중 오류가 발생했습니다. 다시 시도해주세요",
                content: [],
                isLoading: false,
                isError: true,
            });
        }
    };

    return (
        <Page>
            {/* 상단 바 */}
            <TopBar>
                <BackBtn onClick={() => navigate("/")}>← 홈으로</BackBtn>
                <LogoText>Plan<span>My</span>Trip</LogoText>
                <div style={{ width: 80 }} />
            </TopBar>

            {/* 폼 카드 */}
            <Body>
                <FormCard>
                    <CardHeader>
                        <CardEmoji>🗺️</CardEmoji>
                        <CardTitle>여행 계획 만들기</CardTitle>
                        <CardSubtitle>
                            여행 정보를 입력하면 AI가 최적의 일정을 만들어드려요
                        </CardSubtitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>여행 기간</FieldLabel>
                                <DateRow>
                                    <input
                                        type="date"
                                        value={userPlanInfo.startDate}
                                        onChange={(e) => {
                                            updateUserPlanInfoField("startDate", e.target.value);
                                            updateUserPlanInfoField("endDate", "");
                                        }}
                                        max={userPlanInfo.endDate || undefined}
                                    />
                                    <input
                                        type="date"
                                        value={userPlanInfo.endDate}
                                        onChange={(e) => updateUserPlanInfoField("endDate", e.target.value)}
                                        min={userPlanInfo.startDate || undefined}
                                        max={maxEndDate || undefined}
                                    />
                                </DateRow>
                            </Field>

                            <Field>
                                <FieldLabel>여행 장소</FieldLabel>
                                <TextInput
                                    type="text"
                                    value={userPlanInfo.region}
                                    onChange={(e) => updateUserPlanInfoField("region", e.target.value)}
                                    placeholder="예) 서울, 부산, 제주도"
                                />
                            </Field>

                            <Field>
                                <MultiSelect
                                    label="여행 유형"
                                    options={travelTypeOptions}
                                    selected={userPlanInfo.travelType}
                                    onChange={(v) => updateUserPlanInfoField("travelType", v)}
                                />
                            </Field>

                            <Field>
                                <FieldLabel>이동 수단</FieldLabel>
                                <SelectInput
                                    value={userPlanInfo.transportation}
                                    onChange={(e) => updateUserPlanInfoField("transportation", e.target.value)}
                                >
                                    <option value="대중교통">🚌 대중교통</option>
                                    <option value="자가용">🚗 자가용</option>
                                </SelectInput>
                            </Field>
                        </FieldGroup>

                        <Divider />

                        <div>
                            <RequestLabel>AI에게 요청할 내용</RequestLabel>
                            <RequestTextarea
                                ref={textareaRef}
                                value={userPlanInfo.userInput}
                                onChange={(e) => updateUserPlanInfoField("userInput", e.target.value)}
                                placeholder="예) 아이와 함께하는 가족 여행으로 자연 경관이 아름다운 곳 위주로 만들어주세요"
                            />
                        </div>

                        {error && <ErrorMsg>{error}</ErrorMsg>}

                        <SubmitBtn type="submit" $loading={loading} disabled={loading}>
                            {loading ? "⏳ AI가 일정을 만들고 있어요..." : "✨ AI 일정 만들기"}
                        </SubmitBtn>
                    </form>
                </FormCard>
            </Body>
        </Page>
    );
};

export default PlanFormPage;
