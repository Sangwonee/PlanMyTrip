import React, { useState } from "react";
import DaysToolBar from "./DaysToolBar";
import KakaoMap from "./KakaoMap";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import styled from "styled-components";
import type { PlaceDataType } from "../../types/api";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const DaysMap: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { travelSchedule } = useTravelScheduleStore();

  const placeList: Record<string, PlaceDataType[]> = travelSchedule?.reduce(
    (acc, { date, plan }) => {
      acc[date] = plan;
      return acc;
    },
    {} as Record<string, PlaceDataType[]>
  );

  const onClickSelectDay = (day: string | null): void => {
    setSelectedDay(day);
  };

  return (
    <MapContainer>
      <DaysToolBar
        onClickSelectDay={onClickSelectDay}
        selectedDay={selectedDay}
      />

      <div style={{ width: "100%", height: "100%", flex: "1" }}>
        <KakaoMap day={selectedDay} placeList={placeList} />
      </div>
    </MapContainer>
  );
};

export default DaysMap;
