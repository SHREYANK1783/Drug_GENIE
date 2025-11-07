import { User, Reminder, BloodRequest } from '../types';

// Use empty string for local dev (Vite proxy handles it)
// Use full URL for production
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  : ''; // Empty string uses Vite proxy in development

// Token management - Use sessionStorage for tab isolation
export const getToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  sessionStorage.setItem('authToken', token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem('authToken');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    bloodGroup: string;
    gender: string;
  }): Promise<{ user: User; token: string }> => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getProfile: async (): Promise<User> => {
    return apiRequest('/api/auth/profile');
  },

  updateProfile: async (profileData: {
    name?: string;
    age?: number;
    bloodGroup?: string;
    gender?: string;
    phone?: string;
  }): Promise<User> => {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  changePassword: async (passwordData: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return apiRequest('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  deleteAccount: async (password: string): Promise<{ message: string; success: boolean }> => {
    return apiRequest('/api/auth/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  },

  uploadProfilePhoto: async (photoData: string): Promise<{ message: string; profilePhoto: string }> => {
    return apiRequest('/api/auth/upload-photo', {
      method: 'POST',
      body: JSON.stringify({ photoData }),
    });
  },
};

// Reminders API
export const remindersAPI = {
  getReminders: async (): Promise<Reminder[]> => {
    return apiRequest('/api/reminders');
  },

  createReminder: async (reminderData: Omit<Reminder, 'id' | 'userId'>): Promise<Reminder> => {
    return apiRequest('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  deleteReminder: async (id: string): Promise<void> => {
    return apiRequest(`/api/reminders/${id}`, {
      method: 'DELETE',
    });
  },
};

// Blood Requests API
export const bloodRequestsAPI = {
  getActiveRequests: async (): Promise<BloodRequest[]> => {
    return apiRequest('/api/blood-requests');
  },

  createRequest: async (requestData: Omit<BloodRequest, 'id' | 'requesterId' | 'requesterName' | 'createdAt' | 'status'>): Promise<BloodRequest> => {
    return apiRequest('/api/blood-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  cancelRequest: async (requestId: string): Promise<BloodRequest> => {
    return apiRequest(`/api/blood-requests/${requestId}/cancel`, {
      method: 'PUT',
    });
  },
};

// AI Assistant API
export const aiAPI = {
  chat: async (message: string, conversationHistory?: any[]): Promise<{ success: boolean; response: string; timestamp: Date }> => {
    return apiRequest('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory }),
    });
  },

  getHistory: async (limit?: number, skip?: number): Promise<{ success: boolean; consultations: any[]; total: number }> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (skip) params.append('skip', skip.toString());
    return apiRequest(`/api/ai/history?${params.toString()}`);
  },

  clearHistory: async (): Promise<{ success: boolean; message: string; deletedCount: number }> => {
    return apiRequest('/api/ai/history', {
      method: 'DELETE',
    });
  },
};

// Axios-like API interface for compatibility
export const api = {
  get: async (endpoint: string) => {
    const data = await apiRequest(endpoint);
    return { data };
  },
  
  post: async (endpoint: string, body?: any) => {
    const data = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { data };
  },
  
  put: async (endpoint: string, body?: any) => {
    const data = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return { data };
  },
  
  delete: async (endpoint: string) => {
    const data = await apiRequest(endpoint, {
      method: 'DELETE',
    });
    return { data };
  },
};
