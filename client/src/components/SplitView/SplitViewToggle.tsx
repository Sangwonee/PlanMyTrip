import type React from "react";
import styled from "styled-components";
import { SplitViewIcon } from "../Icons";
import { useSplitViewStore } from "../../store/splitViewStore";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--color-bg-secondary);
  border: 1.5px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 1001;
  box-shadow: var(--shadow-card);
  color: var(--color-text-secondary);

  &:hover {
    background: var(--color-accent-light);
    border-color: var(--color-accent);
    color: var(--color-accent-dark);
    box-shadow: var(--shadow-hover);
  }

  &:active { transform: scale(0.93); }
`;

export const SplitViewToggle: React.FC = () => {
  const { showSplitView, toggleSplitView } = useSplitViewStore();
  const { travelSchedule } = useTravelScheduleStore();

  return (
    <>
      {!showSplitView && travelSchedule.length > 0 && (
        <ToggleButton onClick={toggleSplitView} title="지도 보기">
          <SplitViewIcon size={18} />
        </ToggleButton>
      )}
    </>
  );
};
