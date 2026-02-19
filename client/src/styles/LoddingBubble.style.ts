import styled, { keyframes } from "styled-components";

const CHECK_ITEM_WIDTH = "13px";

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
`;

const slideInOnce = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export const TopSection = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const AnimatedBrandTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent-dark), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
`;

export const AnimatedLetter = styled.span<{ $delay: number }>`
  display: inline-block;
  opacity: 0;
  animation: ${slideInOnce} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export const SubTitle = styled.p`
  font-size: 12px;
  margin-top: 6px;
  color: var(--color-accent);
  opacity: 0.8;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const LodingMessageList = styled.ul`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  padding: 14px 18px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: var(--shadow-sm);
`;

export const LodingMessageItem = styled.li<{ $isCurrent: boolean; $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${({ $isCurrent, $isCompleted }) => ($isCurrent || $isCompleted ? 1 : 0.3)};
  animation: ${fadeIn} 0.4s ease;
  transition: opacity 0.4s ease;
`;

export const Spinner = styled.span`
  display: inline-block;
  width: ${CHECK_ITEM_WIDTH};
  height: ${CHECK_ITEM_WIDTH};
  margin-right: 10px;
  border: 2px solid var(--color-accent);
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const CheckMark = styled.span`
  display: inline-block;
  margin-right: 10px;
  color: var(--color-accent);
  font-weight: bold;
  font-size: ${CHECK_ITEM_WIDTH};
  line-height: 1;
`;

export const MessageText = styled.span`
  font-size: ${CHECK_ITEM_WIDTH};
  color: var(--color-text-secondary);
  font-weight: 500;
`;

export const LongLoadingMessage = styled.div`
  margin-top: 14px;
  color: var(--color-accent-dark);
  opacity: 0.8;
  font-style: italic;
  font-size: 13px;
  animation: ${fadeIn} 0.4s ease;
`;

export const DotLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  padding: 14px 20px;
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
`;

export const Dot = styled.div<{ delay?: string }>`
  width: 7px;
  height: 7px;
  background: var(--color-accent);
  opacity: 0.6;
  border-radius: 50%;
  animation: ${bounce} 1s infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
`;
