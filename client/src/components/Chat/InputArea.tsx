import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useChatStore } from "../../store/chatStore";
import { SendIcon } from "../Icons";
import type { Message } from "../../types/chat";
import { useUserPlanInfoStore } from "../../store/userPlanInfoStore";
import { getAIResponse } from "../../api/travel";

const InputContainer = styled.div`
  padding: 12px 20px 20px;
  background: transparent;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 10px 16px;
  width: 100%;
  font-size: 14px;
  resize: none;
  background: transparent;
  color: var(--color-text-primary);
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.6;

  &::placeholder { color: var(--color-text-muted); }
`;

const InputWrapper = styled.form`
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: flex-end;
  border-radius: 16px;
  border: 1.5px solid var(--color-border);
  background: var(--color-bg-secondary);
  overflow: hidden;
  padding: 8px 8px 8px 4px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);

  &:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-muted), var(--shadow-card);
  }
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  background: ${(props) =>
    props.$variant === "primary"
      ? "linear-gradient(135deg, var(--color-accent-bright), var(--color-accent))"
      : "transparent"};
  color: ${(props) => (props.$variant === "primary" ? "#fff" : "var(--color-text-muted)")};
  font-weight: 700;

  &:hover {
    background: ${(props) =>
    props.$variant === "primary"
      ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))"
      : "var(--color-accent-light)"};
    transform: ${(props) => (props.$variant === "primary" ? "scale(1.05)" : "none")};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  bottom: -24px;
  left: 16px;
  color: #e53e3e;
  font-size: 12px;
`;

export const InputArea: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState("");
  const [inputLoading, setInputLoding] = useState(false);

  const { currentChatId, chats, updateChat, addChat, updateMessage } = useChatStore();
  const { userPlanInfo, updateUserPlanInfoField } = useUserPlanInfoStore();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputLoading && userPlanInfo.userInput.trim()) handleSubmit();
  };

  const handleSubmit = async () => {
    if (!userPlanInfo.userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: userPlanInfo.userInput.trim(),
      content: [],
      role: "user",
      timestamp: new Date(),
      isError: false,
    };

    let chatId = currentChatId;
    let currentMessages: Message[] = [];

    if (!chatId) {
      const newChat = {
        id: Date.now().toString(),
        title: userPlanInfo.userInput.trim().slice(0, 30) + (userPlanInfo.userInput.length > 30 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addChat(newChat);
      chatId = newChat.id;
      currentMessages = [userMessage];
    } else {
      const currentChat = chats.find((chat) => chat.id === chatId);
      if (currentChat) {
        currentMessages = [...currentChat.messages, userMessage];
        updateChat(chatId, { messages: currentMessages, updatedAt: new Date() });
      }
    }

    updateUserPlanInfoField("userInput", "");
    setError("");

    const loadingMessageId = (Date.now() + 1).toString();
    setInputLoding(true);

    try {
      const loadingMessage: Message = {
        id: loadingMessageId,
        message: "",
        content: [],
        role: "assistant",
        timestamp: new Date(),
        isLoading: true,
        isError: false,
      };
      updateChat(chatId!, { messages: [...currentMessages, loadingMessage], updatedAt: new Date() });

      const { text, travelSchedule } = await getAIResponse({
        userInput: userPlanInfo.userInput,
        date: `${userPlanInfo.startDate} ~ ${userPlanInfo.endDate}`,
        region: userPlanInfo.region,
        travelType: userPlanInfo.travelType.join(","),
        transportation: userPlanInfo.transportation,
        companions: userPlanInfo.companions,
        pace: userPlanInfo.pace,
      });

      updateMessage(chatId!, loadingMessageId, { message: text, content: travelSchedule, isLoading: false, isError: false });
      setInputLoding(false);
    } catch {
      setInputLoding(false);
      updateMessage(chatId!, loadingMessageId, { message: "AI 응답 중 오류가 발생했습니다. 다시 시도해주세요", content: [], isLoading: false, isError: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!inputLoading && userPlanInfo.userInput.trim()) handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserPlanInfoField("userInput", e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (textAreaRef.current) textAreaRef.current.style.height = "auto";
  }, []);

  return (
    <InputContainer>
      <InputWrapper onSubmit={handleFormSubmit}>
        <TextArea
          ref={textAreaRef}
          value={userPlanInfo.userInput}
          onChange={handleInputChange}
          placeholder="여행 관련 내용을 자유롭게 작성해 주세요"
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={inputLoading}
        />
        <ActionButton $variant="primary" type="submit" disabled={!userPlanInfo.userInput.trim() || inputLoading}>
          <SendIcon size={16} />
        </ActionButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    </InputContainer>
  );
};
