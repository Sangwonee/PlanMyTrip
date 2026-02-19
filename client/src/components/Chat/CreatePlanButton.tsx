import React from "react";
import { PiMapPin } from "react-icons/pi";
import styled, { keyframes } from "styled-components";

const bounceY = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-3px);
  }
`;

const ButtonStyle = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: white;
  padding: 8px 13px;
  border-radius: 999px;
  font-size: 14px;
  background-color: #8e8e8c;
  cursor: pointer;
  transition: all 0.05s ease-out;

  .icon {
    display: inline-flex;
    transition: transform 0.3s ease;
  }

  &:hover .icon {
    animation: ${bounceY} 0.6s infinite alternate ease-in-out;
  }

  &:hover {
    transform: scale(1.03);
    background-color: #a3bd6c;
  }

  .content {
    line-height: 1;
  }
`;

interface CreatePlanButtonPropsType {
  onClick: () => void;
}

const CreatePlanButton: React.FC<CreatePlanButtonPropsType> = ({ onClick }) => {
  return (
    <ButtonStyle onClick={onClick}>
      <span className="icon">
        <PiMapPin />
      </span>
      <span className="content">일정생성</span>
    </ButtonStyle>
  );
};

export default CreatePlanButton;
