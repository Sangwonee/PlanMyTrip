import type React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useUserPlanInfoStore } from "../../store/userPlanInfoStore";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import { useChatStore } from "../../store/chatStore";
import { ChatHistory } from "./ChatHistory";

const MenuContainer = styled.div`
  padding: 12px 10px 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const TopActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
`;

const MenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  background: ${({ $active }) => ($active ? "var(--color-accent-light)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--color-accent-dark)" : "var(--color-text-secondary)")};
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  transition: all var(--transition-fast);
  border: 1px solid ${({ $active }) => ($active ? "var(--color-border)" : "transparent")};

  &:hover {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
    border-color: var(--color-border);
  }
`;

const NewPlanBtn = styled.button`
  width: 100%;
  padding: 10px 14px;
  background: linear-gradient(135deg, var(--color-accent-bright), var(--color-accent));
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 700;
  text-align: left;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(74, 156, 93, 0.25);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(74, 156, 93, 0.35);
  }
`;

const HistorySection = styled.div`
  flex: 1;
  min-height: 0;
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
`;

export const SidebarMenu: React.FC = () => {
  const { panelMode, setPanelMode } = useChatStore();
  const { resetUserPlanInfo } = useUserPlanInfoStore();
  const { deleteTravelSchedule } = useTravelScheduleStore();
  const navigate = useNavigate();

  const handleNewPlan = () => {
    resetUserPlanInfo();
    deleteTravelSchedule();
    setPanelMode("chat");
    navigate("/plan");
  };

  const handleToggleEditor = () => {
    setPanelMode(panelMode === "editor" ? "chat" : "editor");
    navigate("/chat");
  };

  return (
    <MenuContainer>
      <TopActions>
        <NewPlanBtn onClick={handleNewPlan}>
          ✦ 새 여행 계획
        </NewPlanBtn>

        <MenuItem onClick={handleToggleEditor} $active={panelMode === "editor"}>
          {panelMode === "editor" ? "채팅으로 돌아가기" : "일정 편집 카드 열기"}
        </MenuItem>
      </TopActions>

      <HistorySection>
        <ChatHistory />
      </HistorySection>
    </MenuContainer>
  );
};
