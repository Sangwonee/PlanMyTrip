import React, { useEffect, useState } from "react";
import * as S from "../../styles/LoddingBubble.style";
import AnimatedTitle from "./AnimatedTitle";

type LoadingMessage = {
  text: string;
  duration: number;
};

const messages: LoadingMessage[] = [
  { text: "여행기간을 계산 중이에요", duration: 2000 },
  { text: "지역 정보를 수집하고 있어요", duration: 6000 },
  { text: "여행 경로를 계산 중이에요", duration: 10000 },
  { text: "여행일정을 정리 중입니다.", duration: 5000 },
];

const DotLoader: React.FC = () => (
  <S.DotLoaderContainer>
    <S.Dot />
    <S.Dot delay="0.2s" />
    <S.Dot delay="0.4s" />
  </S.DotLoaderContainer>
);

const LoadingBubble: React.FC = () => {
  const [showMessageLoading, setShowMessageLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessageLoading(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showMessageLoading || currentStep >= messages.length - 1) return;

    const timeout = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, messages[currentStep].duration);

    return () => clearTimeout(timeout);
  }, [currentStep, showMessageLoading]);

  return (
    <S.LoadingContainer>
      {!showMessageLoading ? (
        <DotLoader />
      ) : (
        <>
          <S.LodingMessageList>
            <S.TopSection>
              <AnimatedTitle />
              <S.SubTitle>일정을 생성하고 있습니다</S.SubTitle>
            </S.TopSection>

            {messages.map((message, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <S.LodingMessageItem
                  key={index}
                  $isCurrent={isCurrent}
                  $isCompleted={isCompleted}
                >
                  {isCompleted && (
                    <S.CheckMark aria-label="completed">✓</S.CheckMark>
                  )}
                  {isCurrent && (
                    <S.Spinner aria-label="loading spinner"></S.Spinner>
                  )}
                  <S.MessageText>{message.text}</S.MessageText>
                </S.LodingMessageItem>
              );
            })}
          </S.LodingMessageList>
        </>
      )}
    </S.LoadingContainer>
  );
};

export default LoadingBubble;
