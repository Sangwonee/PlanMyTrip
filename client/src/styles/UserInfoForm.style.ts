import styled, { css } from "styled-components";

const smallStyle = css`
  font-size: 11px;
  padding: 8px 12px;
  border: none;
  border-radius: 0;
  box-shadow: none;
  max-width: 100%;
  background: transparent;
  gap: 10px;
`;

const normalStyle = css`
  padding: 24px;
  font-size: 14px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-secondary);
  box-shadow: var(--shadow-card);
  max-width: 420px;
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
  color: var(--color-accent-dark);
  text-align: left;
  font-weight: 600;
  font-size: 0.82em;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: inherit;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);

  &::placeholder { color: var(--color-text-muted); }

  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: inherit;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-muted);
  }

  option { background: #fff; color: var(--color-text-primary); }
`;

export const DateBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    padding: 10px 12px;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    color: var(--color-text-primary);
    font-size: inherit;
    font-family: inherit;
    transition: all var(--transition-fast);

    &:focus {
      border-color: var(--color-accent);
      background: #fff;
      box-shadow: 0 0 0 3px var(--color-accent-muted);
    }
  }
`;

export const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 6px;
`;
