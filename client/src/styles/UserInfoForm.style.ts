import styled, { css } from "styled-components";

const smallStyle = css`
  font-size: 10px;
  padding: 10px;
`;

const normalStyle = css`
  padding: 24px;
  font-size: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
`;

export const Form = styled.form<{ $isSmall: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  width: 100%;

  ${({ $isSmall }) => ($isSmall ? smallStyle : normalStyle)};
`;

export const Label = styled.label`
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  margin-right: 7px;
  font-weight: bold;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: inherit;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: inherit;
`;

export const DateBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
`;

export const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 5px;
`;
