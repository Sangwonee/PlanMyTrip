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
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
`;

const slideInOnce = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

/** top 메인 로딩화면 */
export const TopSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

export const AnimatedBrandTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #a3bd6c;
  display: inline-block;
`;

export const AnimatedLetter = styled.span<{ $delay: number }>`
  display: inline-block;
  opacity: 0;
  animation: ${slideInOnce} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export const SubTitle = styled.p`
  font-size: 13px;
  margin-top: 5px;
  color: #a3bd6c;
`;

/** 각 섹션 처리 로딩 */
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const LodingMessageList = styled.ul`
  background-color: #f5f5f5;
  padding: 15px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const LodingMessageItem = styled.li<{
  $isCurrent: boolean;
  $isCompleted: boolean;
}>`
  display: flex;
  align-items: center;
  opacity: ${({ $isCurrent, $isCompleted }) =>
    $isCurrent || $isCompleted ? 1 : 0.3};
  animation: ${fadeIn} 0.4s ease;
  transition: opacity 0.4s ease;
`;

export const Spinner = styled.span`
  display: inline-block;
  width: ${CHECK_ITEM_WIDTH};
  height: ${CHECK_ITEM_WIDTH};
  margin-right: 10px;
  border: 2px solid #a3bd6c;
  border-top-color: transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const CheckMark = styled.span`
  display: inline-block;
  margin-right: 10px;
  color: #a3bd6c;
  font-weight: bold;
  font-size: ${CHECK_ITEM_WIDTH};
  line-height: 1;
`;

export const MessageText = styled.span`
  font-size: ${CHECK_ITEM_WIDTH};
  color: #333;
  font-weight: 500;
`;

export const LongLoadingMessage = styled.div`
  margin-top: 16px;
  color: #7da86c;
  font-style: italic;
  font-size: 14px;
  animation: ${fadeIn} 0.4s ease;
`;

/* 점 로딩 */
export const DotLoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  background-color: #f5f5f5;
  padding: 15px 20px;
  border-radius: 20px;
`;

export const Dot = styled.div<{ delay?: string }>`
  width: 7px;
  height: 7px;
  background-color: rgb(202, 202, 202);
  border-radius: 50%;
  animation: ${bounce} 1s infinite;
  animation-delay: ${({ delay }) => delay || "0s"};
`;
