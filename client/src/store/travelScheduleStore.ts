import { create } from "zustand";
import type { TravelScheduleStoreType } from "../types/travelSchedule";
import type { PlanDataType, PlaceDataType } from "../types/api";

const normalizeSchedule = (schedule: PlanDataType[]): PlanDataType[] =>
  schedule.map((day) => ({
    ...day,
    plan: day.plan.map((item, idx) => ({
      ...item,
      order: idx + 1,
    })),
  }));

export const useTravelScheduleStore = create<TravelScheduleStoreType>()(
  (set) => ({
    travelSchedule: [],
    colors: ["#156bf0", "#f01562", "#15f062", "#f0d215"],

    addTravelSchedule: (travelSchedule: PlanDataType[]) => {
      set(() => ({
        travelSchedule: normalizeSchedule(travelSchedule),
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

    removePlace: (dayIndex: number, placeIndex: number) => {
      set((state) => {
        if (dayIndex < 0 || dayIndex >= state.travelSchedule.length) return state;
        const targetDay = state.travelSchedule[dayIndex];
        if (placeIndex < 0 || placeIndex >= targetDay.plan.length) return state;

        const nextSchedule = state.travelSchedule.map((day, idx) =>
          idx === dayIndex
            ? {
                ...day,
                plan: day.plan.filter((_, i) => i !== placeIndex),
              }
            : day
        );

        return {
          travelSchedule: normalizeSchedule(nextSchedule),
        };
      });
    },

    movePlace: (
      sourceDayIndex: number,
      sourcePlaceIndex: number,
      targetDayIndex: number,
      targetPlaceIndex: number
    ) => {
      set((state) => {
        if (
          sourceDayIndex < 0 ||
          sourceDayIndex >= state.travelSchedule.length ||
          targetDayIndex < 0 ||
          targetDayIndex >= state.travelSchedule.length
        ) {
          return state;
        }

        const sourceDay = state.travelSchedule[sourceDayIndex];
        if (sourcePlaceIndex < 0 || sourcePlaceIndex >= sourceDay.plan.length) return state;

        const nextSchedule = state.travelSchedule.map((day) => ({
          ...day,
          plan: [...day.plan],
        }));

        const sourceList = nextSchedule[sourceDayIndex].plan;
        const targetList = nextSchedule[targetDayIndex].plan;
        const [moved] = sourceList.splice(sourcePlaceIndex, 1);
        if (!moved) return state;

        let insertAt = Math.max(0, Math.min(targetPlaceIndex, targetList.length));
        if (sourceDayIndex === targetDayIndex && sourcePlaceIndex < insertAt) {
          insertAt -= 1;
        }
        targetList.splice(insertAt, 0, moved);

        return {
          travelSchedule: normalizeSchedule(nextSchedule),
        };
      });
    },

    addPlace: (dayIndex: number, place: PlaceDataType) => {
      set((state) => {
        if (dayIndex < 0 || dayIndex >= state.travelSchedule.length) return state;

        const nextSchedule = state.travelSchedule.map((day, idx) =>
          idx === dayIndex
            ? {
                ...day,
                plan: [...day.plan, place],
              }
            : day
        );

        return {
          travelSchedule: normalizeSchedule(nextSchedule),
        };
      });
    },
  })
);
