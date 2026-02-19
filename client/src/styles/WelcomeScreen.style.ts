import styled from "styled-components";

export const WelcomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background-color: white;
  gap: 24px;
`;

export const WelcomeTitle = styled.h1`
  color: #b7d37a;
  margin-bottom: 30px;

  p {
    font-size: 20px;
    color: rgb(127, 127, 127);
    font-weight: 400;
    margin-bottom: 10px;
  }

  .title {
    font-size: 40px;
  }
`;
