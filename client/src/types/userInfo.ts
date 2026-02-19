export interface UserPlanInfoType {
  region: string;
  travelType: string[];
  startDate: string;
  endDate: string;
  transportation: string;
  userInput: string;
}

export interface UserPlanInfoStoreType {
  userPlanInfo: UserPlanInfoType;

  addUserPlanInfo: (info: UserPlanInfoType) => void;
  resetUserPlanInfo: () => void;
  updateUserPlanInfoField: <K extends keyof UserPlanInfoType>(
    key: K,
    value: UserPlanInfoType[K]
  ) => void;
}
