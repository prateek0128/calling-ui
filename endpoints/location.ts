import { ApiRequest, baseURL } from '../services/api';

export interface StatesAndCitiesResponse {
  states: string[];
  cities: string[];
}

export const getStatesAndCities = async (): Promise<StatesAndCitiesResponse> => {
  console.log('🌐 Full API Endpoint:', `${baseURL}admin/states_and_city`);
  return await ApiRequest("GET", "admin/states_and_city");
};