import type React from "react";
import styled from "styled-components";
import { useChatStore } from "../../store/chatStore";
import { MessageList } from "./MessageList";
import { WelcomeScreen } from "./WelcomeScreen";

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ChatArea: React.FC = () => {
  const { currentChatId, chats } = useChatStore();

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  if (!currentChat || currentChat.messages.length === 0) {
    return (
      <ChatContainer>
        <WelcomeScreen />
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <MessageList messages={currentChat.messages} />
    </ChatContainer>
  );
};
