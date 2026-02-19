import React from "react";
import { PiMapPin } from "react-icons/pi";
import styled, { keyframes } from "styled-components";

const bounceY = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-3px); }
`;

const ButtonStyle = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 3px 10px rgba(74,156,93,0.3);

  .icon { display: inline-flex; transition: transform 0.3s ease; }
  &:hover .icon { animation: ${bounceY} 0.5s infinite alternate ease-in-out; }
  &:hover {
    transform: scale(1.04);
    box-shadow: 0 6px 16px rgba(74,156,93,0.4);
  }
`;

interface CreatePlanButtonPropsType { onClick: () => void; }

const CreatePlanButton: React.FC<CreatePlanButtonPropsType> = ({ onClick }) => (
  <ButtonStyle onClick={onClick}>
    <span className="icon"><PiMapPin size={14} /></span>
    <span>일정 보기</span>
  </ButtonStyle>
);

export default CreatePlanButton;
