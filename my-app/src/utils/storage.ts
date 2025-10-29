import { User, Reminder, BloodRequest, ChatMessage } from '../types';
import { authAPI, remindersAPI, bloodRequestsAPI, setToken, removeToken } from '../services/api';

// User Management - Updated to use API with sessionStorage for tab isolation
export const saveUser = (user: User): void => {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const getUsers = (): User[] => {
  const usersStr = localStorage.getItem('users');
  return usersStr ? JSON.parse(usersStr) : [];
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await authAPI.login({ email, password });
    setToken(response.token);
    saveUser(response.user);
    return response.user;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  age: number;
  bloodGroup: string;
  gender: string;
}): Promise<User | null> => {
  try {
    const response = await authAPI.register(userData);
    setToken(response.token);
    saveUser(response.user);
    return response.user;
  } catch (error) {
    console.error('Registration failed:', error);
    return null;
  }
};

export const logoutUser = (): void => {
  removeToken();
  sessionStorage.removeItem('currentUser');
};

export const updateUser = (userData: Partial<User>): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    saveUser(updatedUser);
  }
};

// Reminders Management - Updated to use API
export const saveReminder = async (reminder: Reminder): Promise<void> => {
  try {
    await remindersAPI.createReminder(reminder);
  } catch (error) {
    console.error('Failed to save reminder:', error);
    throw error;
  }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    return await remindersAPI.getReminders();
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return [];
  }
};

export const getUserReminders = async (userId: string): Promise<Reminder[]> => {
  try {
    const reminders = await remindersAPI.getReminders();
    return reminders.filter(r => r.userId === userId);
  } catch (error) {
    console.error('Failed to fetch user reminders:', error);
    return [];
  }
};

export const deleteReminder = async (id: string): Promise<void> => {
  try {
    await remindersAPI.deleteReminder(id);
  } catch (error) {
    console.error('Failed to delete reminder:', error);
    throw error;
  }
};

// Blood Requests Management - Updated to use API
export const saveBloodRequest = async (request: BloodRequest): Promise<void> => {
  try {
    await bloodRequestsAPI.createRequest(request);
  } catch (error) {
    console.error('Failed to save blood request:', error);
    throw error;
  }
};

export const getBloodRequests = async (): Promise<BloodRequest[]> => {
  try {
    return await bloodRequestsAPI.getActiveRequests();
  } catch (error) {
    console.error('Failed to fetch blood requests:', error);
    return [];
  }
};

// Chat Messages Management - Keep localStorage for now (no backend API)
export const saveChatMessage = (message: ChatMessage): void => {
  const messages = getChatMessages();
  messages.push(message);
  localStorage.setItem('chatMessages', JSON.stringify(messages));
};

export const getChatMessages = (): ChatMessage[] => {
  const messagesStr = localStorage.getItem('chatMessages');
  return messagesStr ? JSON.parse(messagesStr) : [];
};

export const clearChatMessages = (): void => {
  localStorage.removeItem('chatMessages');
};