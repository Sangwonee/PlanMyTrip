"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import type { Message } from "../../types/chat";
import { MessageItem } from "./MessageItem";

const ListContainer = styled.div`
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 0;
`;

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ListContainer>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </ListContainer>
  );
};
