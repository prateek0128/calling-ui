import { ApiRequest } from '../services/api';

export interface AssignmentStats {
  assigned_to: string;
  total: number;
  interested: number;
  not_interested: number;
  escalate_to_sonia: number;
  declined: number;
  busy_call_later: number;
  married_engaged: number;
  complete_soon: number;
  need_help_completing: number;
  not_serious: number;
  pending: number;
  no_status: number;
}

export interface AssignmentStatsResponse {
  success: boolean;
  message: string;
  data: AssignmentStats[];
}

export const getAssignmentStats = async (currentDay?: boolean): Promise<AssignmentStatsResponse> => {
  const endpoint = currentDay 
    ? "admin/assignment-stats?current_day=true"
    : "admin/assignment-stats";
  return await ApiRequest("GET", endpoint);
};

export const sendStatsEmail = async (username: string, email: string, time: string = "all") => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('time', time);
  return await ApiRequest("POST", "admin/send-employee-statics-excelfile", formData);
};