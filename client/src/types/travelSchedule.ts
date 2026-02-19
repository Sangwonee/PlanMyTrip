import type { PlanDataType } from "./api";

export interface TravelScheduleStoreType {
  travelSchedule: PlanDataType[];
  colors: string[];

  addTravelSchedule: (travelSchedule: PlanDataType[]) => void;
  deleteTravelSchedule: () => void;
  changeColor: (color: string, index: number) => void;
}
