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
  margin-bottom: 24px;
  justify-content: center;
  width: 100%;
`;

const MessageBubble = styled.div<{
  $isUser: boolean;
  $hasSplitView?: boolean;
  $isError: boolean;
}>`
  max-width: ${(props) => (props.$hasSplitView ? "100%" : "70%")};
  padding: 10px 20px;
  border-radius: 20px;
  background-color: ${(props) => (props.$isUser ? "#a3bd6c" : "#f5f5f5")};
  color: ${(props) => (props.$isUser ? "white" : "#111827")};
  font-size: 14px;
  line-height: 1.7;
  word-wrap: break-word;

  white-space: pre-wrap !important;
  word-break: break-word;
  overflow-wrap: break-word;

  .message {
    color: ${({ $isError }) => $isError && "red"};
  }

  /* AI 응답의 경우 추가 스타일링 */
  ${(props) =>
    !props.$isUser &&
    `
  `}
`;

const Avatar = styled.div<{ $isUser: boolean }>`
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a3bd6c;
  font-size: 14px;
  font-weight: 600;
  margin: ${(props) => (props.$isUser ? "0 0 0 12px" : "0 12px 0 0")};
  flex-shrink: 0;
  align-self: flex-start;
`;

const MessageContent = styled.div<{
  $isUser: boolean;
  $hasSplitView?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  flex-direction: ${(props) => (props.$isUser ? "row-reverse" : "column")};
  width: 100%;
  max-width: ${(props) => (props.$hasSplitView ? "100%" : "768px")};
  padding: 0 ${(props) => (props.$hasSplitView ? "15px" : "20px")};
`;

interface MessageItemProps {
  message: Message;
}

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
        {!isUser && <Avatar $isUser={isUser}>PlanMyTrip</Avatar>}

        {message.isLoading ? (
          <>
            <LoadingBubble />
          </>
        ) : (
          <>
            {isUser ? (
              <MessageBubble
                $isUser={isUser}
                $hasSplitView={showSplitView}
                $isError={message.isError}
              >
                <p>{message.message}</p>
              </MessageBubble>
            ) : (
              <>
                {message.content.length > 0 && (
                  <MessageBubble
                    $isUser={isUser}
                    $hasSplitView={showSplitView}
                    $isError={message.isError}
                  >
                    <MessagePlanContent content={message.content} />
                  </MessageBubble>
                )}

                <MessageBubble
                  $isUser={isUser}
                  $hasSplitView={showSplitView}
                  $isError={message.isError}
                >
                  <p className="message">{message.message}</p>

                  {!isUser &&
                    !message.isError &&
                    !message.isLoading &&
                    message.content.length > 0 && (
                      <div style={{ padding: "6px 0px 3px" }}>
                        <CreatePlanButton
                          onClick={() =>
                            onClickCreateTravelSchedule(message.content)
                          }
                        />
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
