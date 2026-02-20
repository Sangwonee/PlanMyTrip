"use client";

import type React from "react";
import styled from "styled-components";
import type { Chat } from "../../types/chat";
import { useChatStore } from "../../store/chatStore";
import { TrashIcon } from "../Icons";

const ItemContainer = styled.div<{ $isActive: boolean }>`
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ $isActive }) => ($isActive ? "var(--color-accent-light)" : "transparent")};
  border: 1px solid ${({ $isActive }) => ($isActive ? "var(--color-border)" : "transparent")};
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-accent-light);
    border-color: var(--color-border);
  }
`;

const ChatTitle = styled.div`
  font-size: 13px;
  color: var(--color-text-secondary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  padding: 4px;
  color: var(--color-text-muted);
  border-radius: 6px;
  opacity: 0;
  transition: all var(--transition-fast);

  ${ItemContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-secondary);
  }
`;

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
  const { currentChatId, setCurrentChat, deleteChat, setPanelMode } = useChatStore();
  const isActive = currentChatId === chat.id;

  const handleClick = () => {
    setCurrentChat(chat.id);
    setPanelMode("chat");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chat.id);
  };

  return (
    <ItemContainer $isActive={isActive} onClick={handleClick}>
      <ChatTitle>{chat.title}</ChatTitle>
      <DeleteButton onClick={handleDelete}>
        <TrashIcon size={14} />
      </DeleteButton>
    </ItemContainer>
  );
};
