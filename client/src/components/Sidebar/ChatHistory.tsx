import type React from "react";
import styled from "styled-components";
import { useChatStore } from "../../store/chatStore";
import { ChatItem } from "./ChatItem";

const HistoryContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 6px 2px 0;
`;

const HistoryHeader = styled.div`
  padding: 8px 10px 6px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const EmptyState = styled.div`
  padding: 18px 12px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.5;
`;

export const ChatHistory: React.FC = () => {
  const { chats } = useChatStore();

  return (
    <HistoryContainer>
      {chats.length > 0 && <HistoryHeader>최근 대화</HistoryHeader>}

      {chats.length === 0 ? (
        <EmptyState>아직 생성된 대화가 없습니다.</EmptyState>
      ) : (
        chats.map((chat) => <ChatItem key={chat.id} chat={chat} />)
      )}
    </HistoryContainer>
  );
};
