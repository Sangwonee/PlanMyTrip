import styled from "styled-components";

const MenuContainer = styled.div`
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  overflow-y: auto;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  transition: all var(--transition-fast);
  border: 1px solid transparent;

  &:hover {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
    border-color: var(--color-border);
  }
`;

const SectionTitle = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 10px 12px 4px;
`;

import type React from "react";
import { useChatStore } from "../../store/chatStore";
import { HomeIcon } from "../Icons";
import UserInfoForm from "../Chat/UserInfoForm";
import { useUserPlanInfoStore } from "../../store/userPlanInfoStore";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import { useNavigate } from "react-router-dom";

export const SidebarMenu: React.FC = () => {
  const { setCurrentChat, chats, resetChat } = useChatStore();
  const { resetUserPlanInfo } = useUserPlanInfoStore();
  const { deleteTravelSchedule } = useTravelScheduleStore();
  const navigate = useNavigate();

  const handleHome = () => {
    setCurrentChat(null);
    resetChat();
    resetUserPlanInfo();
    deleteTravelSchedule();
    navigate("/");
  };

  return (
    <MenuContainer>
      <MenuItem onClick={handleHome}>
        <HomeIcon size={16} />
        홈으로
      </MenuItem>

      {chats.length > 0 && (
        <>
          <SectionTitle>여행 설정</SectionTitle>
          <UserInfoForm isSmall />
        </>
      )}
    </MenuContainer>
  );
};
