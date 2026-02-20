import type { PlanDataType } from "./api";
import type { PlaceDataType } from "./api";

export interface TravelScheduleStoreType {
  travelSchedule: PlanDataType[];
  colors: string[];

  addTravelSchedule: (travelSchedule: PlanDataType[]) => void;
  deleteTravelSchedule: () => void;
  changeColor: (color: string, index: number) => void;
  removePlace: (dayIndex: number, placeIndex: number) => void;
  movePlace: (
    sourceDayIndex: number,
    sourcePlaceIndex: number,
    targetDayIndex: number,
    targetPlaceIndex: number
  ) => void;
  addPlace: (dayIndex: number, place: PlaceDataType) => void;
}
