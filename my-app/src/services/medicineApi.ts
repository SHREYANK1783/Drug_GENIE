import axios from 'axios';
import { getToken } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface MedicineData {
  name: string;
  link?: string;
  introduction: string;
  uses: string;
  benefits: string;
  side_effect: string;
  how_to_use: string;
  how_works: string;
  quick_tips: string;
}

export interface MedicineSearchResult {
  _id: string;
  NAME: string;
  INTRODUCTION: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  total?: number;
  currentPage?: number;
  totalPages?: number;
  message?: string;
}

// Search medicines by query
export const searchMedicines = async (query: string): Promise<MedicineSearchResult[]> => {
  try {
    const response = await axios.get<ApiResponse<MedicineSearchResult[]>>(
      `${API_BASE_URL}/medicines/search?query=${encodeURIComponent(query)}`,
      { headers: getAuthHeaders() }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error searching medicines:', error);
    throw error;
  }
};

// Get medicine details by name
export const getMedicineByName = async (name: string): Promise<MedicineData | null> => {
  try {
    const response = await axios.get<ApiResponse<MedicineData>>(
      `${API_BASE_URL}/medicines/${encodeURIComponent(name)}`,
      { headers: getAuthHeaders() }
    );
    return response.data.data || null;
  } catch (error) {
    console.error('Error getting medicine details:', error);
    throw error;
  }
};

// Get all medicines with pagination
export const getAllMedicines = async (page: number = 1, limit: number = 10): Promise<{
  medicines: MedicineSearchResult[];
  total: number;
  currentPage: number;
  totalPages: number;
}> => {
  try {
    const response = await axios.get<ApiResponse<MedicineSearchResult[]>>(
      `${API_BASE_URL}/medicines?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return {
      medicines: response.data.data || [],
      total: response.data.total || 0,
      currentPage: response.data.currentPage || 1,
      totalPages: response.data.totalPages || 0,
    };
  } catch (error) {
    console.error('Error getting all medicines:', error);
    throw error;
  }
};
