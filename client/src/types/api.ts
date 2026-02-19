export interface ResponseDataType {
  text: string;
  travelSchedule: PlanDataType[];
}

export interface PlanDataType {
  date: string;
  day: string;
  plan: PlaceDataType[];
}

export interface PlaceDataType {
  activity: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  order: number;
  place: string;
  address: string;
}
