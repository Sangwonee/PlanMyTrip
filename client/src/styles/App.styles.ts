import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--color-bg);
`;

export const SidebarWrapper = styled.div<{ $isHidden?: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  transform: translateX(${(props) => (props.$isHidden ? "-100%" : "0")});
  transition: transform 0.3s ease;
  z-index: 1000;
`;

export const ChatContainer = styled.div<{ $hasSplitView?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.$hasSplitView ? "none" : "1")};
  margin-left: ${(props) => (props.$hasSplitView ? "0" : "260px")};
  width: ${(props) => (props.$hasSplitView ? "50%" : "auto")};
  transition: all 0.3s ease;
  background: var(--color-bg);
`;

export const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
`;

export const SplitContainer = styled.div`
  width: 50%;
  height: 100vh;
  background: var(--color-bg-secondary);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

export const SplitHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text-primary);
  flex-shrink: 0;
`;

export const SplitContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
`;
