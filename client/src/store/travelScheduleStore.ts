import { create } from "zustand";
import type { TravelScheduleStoreType } from "../types/travelSchedule";
import type { PlanDataType } from "../types/api";

export const useTravelScheduleStore = create<TravelScheduleStoreType>()(
  (set) => ({
    travelSchedule: [],
    colors: ["#156bf0", "#f01562", "#15f062", "#f0d215"],

    addTravelSchedule: (travelSchedule: PlanDataType[]) => {
      set(() => ({
        travelSchedule,
      }));
    },

    deleteTravelSchedule: () => {
      set(() => ({
        travelSchedule: [],
      }));
    },

    changeColor: (color: string, index: number) => {
      set((state) => {
        const newColors = [...state.colors];
        if (index >= 0 && index < newColors.length) {
          newColors[index] = color;
        }
        return {
          colors: newColors,
        };
      });
    },
  })
);
