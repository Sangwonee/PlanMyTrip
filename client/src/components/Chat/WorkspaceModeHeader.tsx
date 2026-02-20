import React from "react";
import styled from "styled-components";
import { MapIcon } from "../Icons";
import { useChatStore } from "../../store/chatStore";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
`;

const Segment = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
`;

const SegmentButton = styled.button<{ $active: boolean }>`
  padding: 7px 10px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#fff" : "var(--color-text-secondary)")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, var(--color-accent), var(--color-accent-bright))"
      : "transparent"};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountBadge = styled.span`
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-accent-light);
  color: var(--color-accent-dark);
  font-size: 11px;
  font-weight: 700;
`;

const MapButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#fff" : "var(--color-text-secondary)")};
  background: ${({ $active }) =>
    $active
      ? "linear-gradient(135deg, var(--color-accent-dark), var(--color-accent))"
      : "var(--color-bg-secondary)"};
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "var(--color-border)")};

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

interface WorkspaceModeHeaderProps {
  showSplitView: boolean;
  onToggleSplitView: () => void;
  placeCount: number;
}

const WorkspaceModeHeader: React.FC<WorkspaceModeHeaderProps> = ({
  showSplitView,
  onToggleSplitView,
  placeCount,
}) => {
  const { panelMode, setPanelMode } = useChatStore();
  const hasSchedule = placeCount > 0;

  return (
    <Header>
      <Segment>
        <SegmentButton
          $active={panelMode === "chat"}
          onClick={() => setPanelMode("chat")}
        >
          채팅
        </SegmentButton>
        <SegmentButton
          $active={panelMode === "editor"}
          onClick={() => setPanelMode("editor")}
        >
          일정 편집
        </SegmentButton>
      </Segment>

      <Right>
        <CountBadge>{placeCount}개 장소</CountBadge>
        <MapButton
          $active={showSplitView}
          onClick={onToggleSplitView}
          disabled={!hasSchedule}
          title={hasSchedule ? "지도 보기 토글" : "일정이 있어야 지도를 열 수 있어요"}
        >
          <MapIcon size={14} />
          {showSplitView ? "지도 닫기" : "지도 보기"}
        </MapButton>
      </Right>
    </Header>
  );
};

export default WorkspaceModeHeader;
