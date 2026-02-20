import React from "react";
import { InputArea } from "./InputArea";
import * as S from "../../styles/WelcomeScreen.style";
import UserInfoForm from "./UserInfoForm";

export interface UserFormType {
  startDate: string;
  endDate: string;
  region: string;
  travelType: string;
  transportation: string;
}

export const WelcomeScreen: React.FC = () => {
  return (
    <S.WelcomeContainer>
      <S.WelcomeTitle>
        <p className="subtitle">✦ AI Travel Planner ✦</p>
        <img className="logo" src="/brand/PLANDL_horizontal_logo.png" alt="PLANDL 로고" />
        <p className="description">
          여행지, 날짜, 스타일을 알려주시면<br />
          AI가 최적의 여행 일정을 만들어드려요
        </p>
      </S.WelcomeTitle>

      <UserInfoForm />

      <div style={{ width: "500px" }}>
        <InputArea />
      </div>
    </S.WelcomeContainer>
  );
};
