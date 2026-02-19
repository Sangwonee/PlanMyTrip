import type { ResponseDataType } from "../types/api";
import api from "./api";

interface GetMessageArgumentType {
  userInput: string;
  date: string;
  region: string;
  travelType: string;
  transportation: string;
  companions: string;
  pace: string;
}

export const getAIResponse = async (
  formData: GetMessageArgumentType
): Promise<ResponseDataType> => {
  const { data } = await api.post(`/v1/plan`, formData);

  return data;
};
