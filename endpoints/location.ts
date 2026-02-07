import { ApiRequest, baseURL } from '../services/api';

export interface StatesAndCitiesData {
  states: string[];
  cities: string[];
}

export interface StatesAndCitiesResponse {
  success: boolean;
  message?: string;
  data: StatesAndCitiesData;
}

export const getStatesAndCities = async (): Promise<StatesAndCitiesResponse> => {
  console.log('🌐 Full API Endpoint:', `${baseURL}admin/states_and_city`);
  return await ApiRequest("GET", "admin/states_and_city");
};