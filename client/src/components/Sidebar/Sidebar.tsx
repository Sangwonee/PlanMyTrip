import type React from "react";
import styled from "styled-components";
import { SidebarMenu } from "./SidebarMenu";

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background-color: #f7f7f8;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

export const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SidebarMenu />
    </SidebarContainer>
  );
};
