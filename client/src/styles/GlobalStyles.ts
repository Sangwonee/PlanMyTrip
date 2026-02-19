import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle``;

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--color-bg);
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
`;
