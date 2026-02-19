import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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
`;

export const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const SplitContainer = styled.div`
  width: 50%;
  height: 100vh;
  background-color: #fafafa;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

export const SplitHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: white;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  flex-shrink: 0;
`;

export const SplitContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
`;
