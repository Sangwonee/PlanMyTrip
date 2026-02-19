import type React from "react"
import styled from "styled-components"
import { useChatStore } from "../../store/chatStore"
import { ChatItem } from "./ChatItem"

const HistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
`

const HistoryHeader = styled.div`
  padding: 12px 16px 8px 16px;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const EmptyState = styled.div`
  padding: 20px 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
`

export const ChatHistory: React.FC = () => {
  const { chats } = useChatStore()

  return (
    <HistoryContainer>
      {chats.length > 0 && <HistoryHeader>채팅</HistoryHeader>}

      {chats.length === 0 ? (
        <EmptyState>채팅이 없습니다</EmptyState>
      ) : (
        chats.map((chat) => <ChatItem key={chat.id} chat={chat} />)
      )}
    </HistoryContainer>
  )
}
