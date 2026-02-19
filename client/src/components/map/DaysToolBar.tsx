import type React from "react";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import DaysDropdown from "./DaysDropdown";

interface DaysTabBarPropsType {
  selectedDay: string | null;
  onClickSelectDay: (day: string | null) => void;
}

interface FormatDaysType {
  label: string;
  value: string | null;
}

const DaysToolBar: React.FC<DaysTabBarPropsType> = ({
  selectedDay,
  onClickSelectDay,
}) => {
  const { travelSchedule } = useTravelScheduleStore();

  const formatDays: FormatDaysType[] = [
    { label: "전체", value: null },
    ...travelSchedule.map(({ date, day }) => ({
      label: day,
      value: date,
    })),
  ];

  return (
    <DaysDropdown
      formatDays={formatDays}
      selectedDay={selectedDay}
      onClickSelectDay={onClickSelectDay}
    />
  );
};

export default DaysToolBar;
