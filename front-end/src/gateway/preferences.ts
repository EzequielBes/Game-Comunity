import axios from 'axios';

const USER_API_URL = 'http://localhost:3001'; // Assuming user service is on port 3001

export interface Preference {
  preference_id: string;
  user_id: string;
  type: string;
  value: string;
  created_at: string;
}

export interface AddPreferenceData {
  userId: string;
  type: string;
  value: string;
}

// Buscar preferências de um usuário
export const getUserPreferences = async (userId: string): Promise<Preference[]> => {
  try {
    const response = await axios.get(`${USER_API_URL}/preferences/${userId}`);
    return response.data.output;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar preferências');
  }
};

// Adicionar uma nova preferência
export const addPreference = async (preferenceData: AddPreferenceData): Promise<void> => {
  try {
    await axios.post(`${USER_API_URL}/preferences`, preferenceData);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao adicionar preferência');
  }
};

// Remover uma preferência
export const removePreference = async (preferenceId: string): Promise<void> => {
  try {
    await axios.delete(`${USER_API_URL}/preferences/${preferenceId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Erro ao remover preferência');
  }
};
