import type React from "react";
import styled from "styled-components";
import { useChatStore } from "../../store/chatStore";
import { HomeIcon } from "../Icons";
import UserInfoForm from "../Chat/UserInfoForm";
import { useUserPlanInfoStore } from "../../store/userPlanInfoStore";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";

const MenuContainer = styled.div`
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 4px;
  background-color: transparent;
  color: #374151;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  transition: background-color 0.2s;
  border-bottom: 1px solid #eeeae4;

  &:hover {
    background-color: #f3f4f6;
  }

  &.active {
    background-color: #e5e7eb;
  }
`;

export const SidebarMenu: React.FC = () => {
  const { setCurrentChat, chats, resetChat } = useChatStore();
  const { resetUserPlanInfo } = useUserPlanInfoStore();
  const { deleteTravelSchedule } = useTravelScheduleStore();

  const handleHome = () => {
    setCurrentChat(null);
    resetChat();
    resetUserPlanInfo();
    deleteTravelSchedule();
  };

  return (
    <MenuContainer>
      <MenuItem onClick={handleHome}>
        <HomeIcon size={18} />홈
      </MenuItem>

      {chats.length > 0 && <UserInfoForm isSmall />}
    </MenuContainer>
  );
};
