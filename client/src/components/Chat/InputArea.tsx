import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useChatStore } from "../../store/chatStore";
import { SendIcon } from "../Icons";
import type { Message } from "../../types/chat";
import { useUserPlanInfoStore } from "../../store/userPlanInfoStore";
import { getAIResponse } from "../../api/travel";

const InputContainer = styled.div`
  padding: 20px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 8px 20px;
  width: 100%;
  font-size: 16px;
  resize: none;
  background-color: white;
  color: #111827;
  letter-spacing: normal;
  word-spacing: normal;
  max-height: 200px;
  overflow-y: auto;

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputWrapper = styled.form`
  width: 100%;
  max-width: 768px;
  display: flex;
  align-items: center;
  border-radius: 30px;
  border: 1px solid #d1d5db;
  overflow: hidden;
  padding: 8px;

  &:focus-within {
    border-color: #b7d37a;
    outline: none;
  }
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background-color: ${(props) =>
    props.$variant === "primary" ? "#b7d37a" : "transparent"};
  color: ${(props) => (props.$variant === "primary" ? "white" : "#6b7280")};

  &:hover {
    background-color: ${(props) =>
      props.$variant === "primary" ? "#798E65" : "#f3f4f6"};
  }

  &:disabled {
    opacity: 0.5;
    background-color: #6b7280;
    color: white;
    cursor: not-allowed;
  }

  svg {
    display: block;
    margin: auto;
  }
`;

const ErrorMessage = styled.div`
  position: absolute;
  bottom: -24px;
  left: 16px;
  color: #ef4444;
  font-size: 12px;
`;

export const InputArea: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [error, setError] = useState("");
  const [inputLoading, setInputLoding] = useState(false);

  const { currentChatId, chats, updateChat, addChat, updateMessage } =
    useChatStore();
  const { userPlanInfo, updateUserPlanInfoField } = useUserPlanInfoStore();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // form의 기본 제출 동작 막기
    if (!inputLoading && userPlanInfo.userInput.trim()) {
      handleSubmit();
    }
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

    // 새 채팅 생성 또는 기존 채팅에 사용자 메시지 추가
    if (!chatId) {
      const newChat = {
        id: Date.now().toString(),
        title:
          userPlanInfo.userInput.trim().slice(0, 30) +
          (userPlanInfo.userInput.length > 30 ? "..." : ""),
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
        updateChat(chatId, {
          messages: currentMessages,
          updatedAt: new Date(),
        });
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

      const finalMessages = [...currentMessages, loadingMessage];
      updateChat(chatId!, {
        messages: finalMessages,
        updatedAt: new Date(),
      });

      const { text, travelSchedule } = await getAIResponse({
        userInput: userPlanInfo.userInput,
        date: `${userPlanInfo.startDate} ~ ${userPlanInfo.endDate}`,
        region: userPlanInfo.region,
        travelType: userPlanInfo.travelType.join(","),
        transportation: userPlanInfo.transportation,
      });

      updateMessage(chatId!, loadingMessageId, {
        message: text,
        content: travelSchedule,
        isLoading: false,
        isError: false,
      });

      setInputLoding(false);
    } catch (error) {
      setInputLoding(false);
      updateMessage(chatId!, loadingMessageId, {
        message: "AI 응답 중 오류가 발생했습니다. 다시 시도해주세요",
        content: [],
        isLoading: false,
        isError: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!inputLoading && userPlanInfo.userInput.trim()) {
        handleSubmit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserPlanInfoField("userInput", e.target.value);

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = "auto";
    }
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

        <ActionButton
          $variant="primary"
          type="submit"
          disabled={!userPlanInfo.userInput.trim() || inputLoading}
        >
          <SendIcon size={18} />
        </ActionButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    </InputContainer>
  );
};
