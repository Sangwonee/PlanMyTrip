import type React from "react";
import styled from "styled-components";
import { SidebarMenu } from "./SidebarMenu";
import { useNavigate } from "react-router-dom";

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const LogoArea = styled.div`
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity var(--transition-fast);

  &:hover { opacity: 0.8; }
`;

const LogoImage = styled.img`
  width: 152px;
  height: auto;
  display: block;
`;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <LogoArea onClick={() => navigate("/")}>
        <LogoImage src="/brand/PLANDL_horizontal_logo.png" alt="PLANDL 로고" />
      </LogoArea>
      <SidebarMenu />
    </SidebarContainer>
  );
};
