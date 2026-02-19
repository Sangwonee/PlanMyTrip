import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    color: #202123;
    overflow: hidden;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
  }

  input, textarea {
    outline: none;
    border: none;
  }
`;

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
`;
