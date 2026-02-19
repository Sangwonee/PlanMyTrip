export interface UserPlanInfoType {
  region: string;
  travelType: string[];
  startDate: string;
  endDate: string;
  transportation: string;
  companions: string;  // "혼자" | "커플" | "가족" | "친구들"
  pace: string;        // "여유롭게" | "보통" | "알차게"
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
