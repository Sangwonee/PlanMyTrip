import type React from "react";
import styled from "styled-components";
import type { Message } from "../../types/chat";
import LoadingBubble from "./LoadingBubble";
import { useSplitViewStore } from "../../store/splitViewStore";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import MessagePlanContent from "./MessagePlanContent";
import type { PlanDataType } from "../../types/api";
import CreatePlanButton from "./CreatePlanButton";

const MessageContainer = styled.div<{ $isUser: boolean }>`
  display: flex;
  margin-bottom: 18px;
  justify-content: center;
  width: 100%;
`;

const MessageBubble = styled.div<{
  $isUser: boolean;
  $hasSplitView?: boolean;
  $isError: boolean;
}>`
  max-width: ${(props) => (props.$hasSplitView ? "100%" : "70%")};
  padding: 12px 18px;
  border-radius: ${(props) => (props.$isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px")};
  background: ${(props) =>
    props.$isUser
      ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))"
      : "var(--color-bg-secondary)"};
  border: ${(props) => (props.$isUser ? "none" : "1px solid var(--color-border)")};
  color: ${(props) => (props.$isUser ? "#fff" : "var(--color-text-primary)")};
  font-size: 14px;
  line-height: 1.7;
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: ${(props) => (props.$isUser ? "0 4px 12px rgba(74,156,93,0.25)" : "var(--shadow-sm)")};

  .message { color: ${({ $isError }) => $isError && "#e53e3e"}; }
`;

const Avatar = styled.div<{ $isUser: boolean }>`
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 700;
  margin: ${(props) => (props.$isUser ? "0 0 0 10px" : "0 10px 0 0")};
  flex-shrink: 0;
  align-self: flex-start;
`;

const MessageContent = styled.div<{ $isUser: boolean; $hasSplitView?: boolean }>`
  display: flex;
  gap: 4px;
  align-items: flex-start;
  flex-direction: ${(props) => (props.$isUser ? "row-reverse" : "column")};
  width: 100%;
  max-width: ${(props) => (props.$hasSplitView ? "100%" : "768px")};
  padding: 0 ${(props) => (props.$hasSplitView ? "15px" : "20px")};
`;

interface MessageItemProps { message: Message; }

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === "user";
  const { showSplitView, setSplitViewOpen } = useSplitViewStore();
  const { addTravelSchedule } = useTravelScheduleStore();

  const onClickCreateTravelSchedule = (content: PlanDataType[]) => {
    addTravelSchedule(content);
    setSplitViewOpen(true);
  };

  return (
    <MessageContainer $isUser={isUser}>
      <MessageContent $isUser={isUser} $hasSplitView={showSplitView}>
        {!isUser && <Avatar $isUser={isUser}>✦ AI</Avatar>}

        {message.isLoading ? (
          <LoadingBubble />
        ) : (
          <>
            {isUser ? (
              <MessageBubble $isUser={isUser} $hasSplitView={showSplitView} $isError={message.isError}>
                <p>{message.message}</p>
              </MessageBubble>
            ) : (
              <>
                {message.content.length > 0 && (
                  <MessageBubble $isUser={isUser} $hasSplitView={showSplitView} $isError={message.isError}>
                    <MessagePlanContent content={message.content} />
                  </MessageBubble>
                )}
                <MessageBubble $isUser={isUser} $hasSplitView={showSplitView} $isError={message.isError}>
                  <p className="message">{message.message}</p>
                  {!isUser && !message.isError && !message.isLoading && message.content.length > 0 && (
                    <div style={{ padding: "8px 0px 2px" }}>
                      <CreatePlanButton onClick={() => onClickCreateTravelSchedule(message.content)} />
                    </div>
                  )}
                </MessageBubble>
              </>
            )}
          </>
        )}
      </MessageContent>
    </MessageContainer>
  );
};
