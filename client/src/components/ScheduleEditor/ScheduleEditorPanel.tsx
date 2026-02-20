import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import { useChatStore } from "../../store/chatStore";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 940px;
  width: 100%;
  margin: 0 auto;
  padding: 22px 20px 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

const TitleGroup = styled.div`
  h2 {
    font-size: 18px;
    color: var(--color-text-primary);
    margin: 0;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--color-text-secondary);
  }
`;

const SaveButton = styled.button`
  border-radius: 10px;
  padding: 9px 12px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-bright));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
`;

const SavedText = styled.span`
  margin-left: 6px;
  color: var(--color-accent-dark);
`;

const DayList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
`;

const DayCard = styled.article<{ $activeDrop: boolean }>`
  border: 1px solid ${({ $activeDrop }) => ($activeDrop ? "var(--color-accent)" : "var(--color-border)")};
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
  box-shadow: ${({ $activeDrop }) => ($activeDrop ? "var(--shadow-hover)" : "var(--shadow-sm)")};
`;

const DayCardHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
`;

const DayName = styled.strong`
  font-size: 13px;
  color: var(--color-accent-dark);
`;

const DayDate = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`;

const PlaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PlaceCard = styled.div<{ $dragOver: boolean }>`
  border: 1px solid ${({ $dragOver }) => ($dragOver ? "var(--color-accent)" : "var(--color-border)")};
  border-radius: 10px;
  padding: 8px;
  background: ${({ $dragOver }) => ($dragOver ? "var(--color-accent-light)" : "var(--color-bg-secondary)")};
  cursor: grab;
`;

const PlaceHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;

const PlaceOrder = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--color-accent);
  min-width: 28px;
`;

const PlaceTitle = styled.span`
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const RemoveButton = styled.button`
  font-size: 11px;
  color: #d84a4a;
  padding: 3px 6px;
  border-radius: 6px;
  background: #fff2f2;
`;

const PlaceMeta = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: var(--color-text-muted);
  line-height: 1.4;
  word-break: break-word;
`;

const EmptyState = styled.div`
  margin: auto;
  padding: 18px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.6;
`;

const EmptyActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const EmptyActionButton = styled.button<{ $primary?: boolean }>`
  padding: 8px 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $primary }) =>
    $primary
      ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-bright))"
      : "var(--color-bg-secondary)"};
  color: ${({ $primary }) => ($primary ? "#fff" : "var(--color-text-secondary)")};
  border: 1px solid ${({ $primary }) => ($primary ? "transparent" : "var(--color-border)")};
`;

interface DragItem {
  dayIndex: number;
  placeIndex: number;
}

interface DropTarget {
  dayIndex: number;
  placeIndex: number | null;
}

const ScheduleEditorPanel: React.FC = () => {
  const { travelSchedule, removePlace, movePlace } = useTravelScheduleStore();
  const { currentChatId, chats, updateMessage, setPanelMode } = useChatStore();
  const navigate = useNavigate();

  const [dragItem, setDragItem] = useState<DragItem | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [savedAt, setSavedAt] = useState<string>("");

  const totalPlaces = useMemo(
    () => travelSchedule.reduce((acc, day) => acc + day.plan.length, 0),
    [travelSchedule]
  );

  const clearDrag = () => {
    setDragItem(null);
    setDropTarget(null);
  };

  const handleDrop = (dayIndex: number, placeIndex: number | null) => {
    if (!dragItem) return;

    if (
      placeIndex !== null &&
      dragItem.dayIndex === dayIndex &&
      dragItem.placeIndex === placeIndex
    ) {
      clearDrag();
      return;
    }

    const targetIndex =
      placeIndex === null ? travelSchedule[dayIndex]?.plan.length ?? 0 : placeIndex;

    movePlace(
      dragItem.dayIndex,
      dragItem.placeIndex,
      dayIndex,
      targetIndex
    );
    clearDrag();
  };

  const handleSave = () => {
    const payload = {
      savedAt: new Date().toISOString(),
      schedule: travelSchedule,
    };
    localStorage.setItem("plandl-schedule-draft", JSON.stringify(payload));

    if (currentChatId) {
      const currentChat = chats.find((chat) => chat.id === currentChatId);
      const lastAssistant = currentChat?.messages
        .slice()
        .reverse()
        .find((msg) => msg.role === "assistant" && msg.content.length > 0 && !msg.isLoading);

      if (lastAssistant) {
        updateMessage(currentChatId, lastAssistant.id, {
          content: travelSchedule,
        });
      }
    }

    setSavedAt(
      new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <Wrapper>
      <Header>
        <TitleGroup>
          <h2>일정 편집 카드</h2>
          <p>
            총 {totalPlaces}개 장소 · 드래그로 순서 변경 / 삭제
            {savedAt ? <SavedText>저장됨 {savedAt}</SavedText> : null}
          </p>
        </TitleGroup>
        <SaveButton onClick={handleSave}>저장</SaveButton>
      </Header>

      {travelSchedule.length === 0 ? (
        <EmptyState>
          편집할 일정이 없습니다.
          <br />
          채팅에서 먼저 일정을 생성한 뒤 편집 화면으로 전환해 주세요.
          <EmptyActions>
            <EmptyActionButton onClick={() => setPanelMode("chat")}>
              채팅으로 이동
            </EmptyActionButton>
            <EmptyActionButton
              $primary
              onClick={() => {
                setPanelMode("chat");
                navigate("/plan");
              }}
            >
              새 계획 만들기
            </EmptyActionButton>
          </EmptyActions>
        </EmptyState>
      ) : (
        <DayList>
          {travelSchedule.map((day, dayIndex) => (
            <DayCard
              key={`${day.day}-${day.date}-${dayIndex}`}
              $activeDrop={dropTarget?.dayIndex === dayIndex && dropTarget?.placeIndex === null}
              onDragOver={(e) => {
                if (e.currentTarget !== e.target) return;
                e.preventDefault();
                setDropTarget({ dayIndex, placeIndex: null });
              }}
              onDrop={(e) => {
                if (e.currentTarget !== e.target) return;
                e.preventDefault();
                handleDrop(dayIndex, null);
              }}
            >
              <DayCardHead>
                <DayName>{day.day}</DayName>
                <DayDate>{day.date}</DayDate>
              </DayCardHead>

              <PlaceList>
                {day.plan.map((place, placeIndex) => (
                  <PlaceCard
                    key={`${dayIndex}-${placeIndex}-${place.place}`}
                    draggable
                    $dragOver={
                      dropTarget?.dayIndex === dayIndex &&
                      dropTarget?.placeIndex === placeIndex
                    }
                    onDragStart={() => setDragItem({ dayIndex, placeIndex })}
                    onDragEnd={clearDrag}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDropTarget({ dayIndex, placeIndex });
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDrop(dayIndex, placeIndex);
                    }}
                  >
                    <PlaceHead>
                      <PlaceOrder>{place.order}.</PlaceOrder>
                      <PlaceTitle>{place.place}</PlaceTitle>
                      <RemoveButton onClick={() => removePlace(dayIndex, placeIndex)}>
                        삭제
                      </RemoveButton>
                    </PlaceHead>
                    {place.address ? <PlaceMeta>{place.address}</PlaceMeta> : null}
                  </PlaceCard>
                ))}
              </PlaceList>
            </DayCard>
          ))}
        </DayList>
      )}
    </Wrapper>
  );
};

export default ScheduleEditorPanel;
