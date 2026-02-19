import styled from "styled-components";

export const WelcomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: var(--color-bg);
  gap: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    background: radial-gradient(ellipse, rgba(74, 156, 93, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
`;

export const WelcomeTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;

  .subtitle {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .title {
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    background: linear-gradient(135deg, var(--color-accent-dark) 0%, var(--color-accent) 60%, var(--color-accent-bright) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .description {
    font-size: 15px;
    color: var(--color-text-secondary);
    font-weight: 400;
    margin-top: 4px;
    line-height: 1.7;
  }
`;
