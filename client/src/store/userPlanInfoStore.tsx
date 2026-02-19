import { create } from "zustand";
import type {
  UserPlanInfoStoreType,
  UserPlanInfoType,
} from "../types/userInfo";

export const useUserPlanInfoStore = create<UserPlanInfoStoreType>()((set) => ({
  userPlanInfo: {
    userInput: "",
    region: "",
    startDate: "",
    endDate: "",
    transportation: "자가용",
    travelType: ["관광"],
  },

  addUserPlanInfo: (userPlanInfo: UserPlanInfoType) => {
    set(() => ({
      userPlanInfo,
    }));
  },

  resetUserPlanInfo: () => {
    set(() => ({
      userPlanInfo: {
        userInput: "",
        region: "",
        startDate: "",
        endDate: "",
        transportation: "자가용",
        travelType: ["관광"],
      },
    }));
  },

  updateUserPlanInfoField: <K extends keyof UserPlanInfoType>(
    key: K,
    value: UserPlanInfoType[K]
  ) => {
    set((state) => ({
      userPlanInfo: {
        ...state.userPlanInfo,
        [key]: value,
      },
    }));
  },
}));
