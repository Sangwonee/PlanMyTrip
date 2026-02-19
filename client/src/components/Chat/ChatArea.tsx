import type React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import { MessageList } from "./MessageList";

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--color-text-muted);
  text-align: center;
  padding: 40px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.6;
`;

const EmptyTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-secondary);
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
`;

const StartBtn = styled.button`
  margin-top: 4px;
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--color-accent-bright), var(--color-accent));
  color: #fff;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: 0 3px 10px rgba(74, 156, 93, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(74, 156, 93, 0.4);
  }
`;

export const ChatArea: React.FC = () => {
  const { currentChatId, chats } = useChatStore();
  const navigate = useNavigate();

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  if (!currentChat || currentChat.messages.length === 0) {
    return (
      <ChatContainer>
        <EmptyState>
          <EmptyIcon>✈️</EmptyIcon>
          <EmptyTitle>아직 여행 계획이 없어요</EmptyTitle>
          <EmptyDesc>
            새 여행 계획을 만들거나<br />
            왼쪽 사이드바에서 이전 대화를 선택하세요
          </EmptyDesc>
          <StartBtn onClick={() => navigate("/plan")}>✨ 새 여행 계획 만들기</StartBtn>
        </EmptyState>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <MessageList messages={currentChat.messages} />
    </ChatContainer>
  );
};
