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
  gap: 10px;
  cursor: pointer;
  transition: opacity var(--transition-fast);

  &:hover { opacity: 0.8; }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-accent-bright), var(--color-accent));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: var(--shadow-card);
`;

const LogoText = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;

  span {
    color: var(--color-accent);
  }
`;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <LogoArea onClick={() => navigate("/")}>
        <LogoIcon>🗺️</LogoIcon>
        <LogoText>Plan<span>My</span>Trip</LogoText>
      </LogoArea>
      <SidebarMenu />
    </SidebarContainer>
  );
};
