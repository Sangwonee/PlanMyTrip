import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PlanDayWrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

export const DayTitle = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: #333;

  .day {
    background-color: #a3bd6c;
    padding: 8px 15px;
    border-radius: 20px;
    color: white;
    line-height: 1;
  }

  .date {
    font-size: 20px;
    line-height: 1;
  }
`;

export const PlanItem = styled.article`
  border-top: 1px solid #ddd;
  padding-top: 12px;
  margin-top: 12px;
`;

export const Image = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

export const Header = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0 2px;
`;

export const Activity = styled.div`
  font-size: 14px;
  color: #444;
  margin: 2px 0;
`;

export const Description = styled.div`
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  line-height: 1.4;
`;

export const Address = styled.div`
  font-size: 13px;
  color: #444;
  margin-top: 2px;
  line-height: 1.4;
`;
