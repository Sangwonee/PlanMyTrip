"use client"

import type React from "react"
import styled from "styled-components"
import type { Chat } from "../../types/chat"
import { useChatStore } from "../../store/chatStore"
import { TrashIcon } from "../Icons"

const ItemContainer = styled.div<{ $isActive: boolean }>`
  padding: 8px 12px;
  margin-bottom: 2px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => (props.$isActive ? "#f3f4f6" : "transparent")};
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`

const ChatTitle = styled.div`
  font-size: 14px;
  color: #374151;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
`

const DeleteButton = styled.button`
  padding: 4px;
  color: #9ca3af;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s;

  ${ItemContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #e5e7eb;
    color: #6b7280;
  }
`

interface ChatItemProps {
  chat: Chat
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
  const { currentChatId, setCurrentChat, deleteChat } = useChatStore()
  const isActive = currentChatId === chat.id

  const handleClick = () => {
    setCurrentChat(chat.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChat(chat.id)
  }

  return (
    <ItemContainer $isActive={isActive} onClick={handleClick}>
      <ChatTitle>{chat.title}</ChatTitle>
      <DeleteButton onClick={handleDelete}>
        <TrashIcon size={14} />
      </DeleteButton>
    </ItemContainer>
  )
}