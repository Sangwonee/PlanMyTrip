import React from "react";
import type { PlanDataType } from "../../types/api";
import * as S from "../../styles/MessagePlanContent.style";

interface MessagePlanContentPropsType {
  content: PlanDataType[];
}

const MessagePlanContent: React.FC<MessagePlanContentPropsType> = ({
  content,
}) => {
  return (
    <S.Wrapper>
      {content.map((plan) => (
        <S.PlanDayWrapper key={plan.day}>
          <S.DayTitle>
            <span className="day">{plan.day}</span>
            <span className="date">{plan.date}</span>
          </S.DayTitle>

          {plan.plan.map((item) => (
            <S.PlanItem key={item.order}>
              {item.image && <S.Image src={item.image} alt={item.place} />}

              <S.Header>
                {item.order}. {item.place}
              </S.Header>

              <S.Address>{item.address}</S.Address>

              <S.Description>{item.description}</S.Description>

              <S.Activity>{item.activity}</S.Activity>
            </S.PlanItem>
          ))}
        </S.PlanDayWrapper>
      ))}
    </S.Wrapper>
  );
};

export default MessagePlanContent;
