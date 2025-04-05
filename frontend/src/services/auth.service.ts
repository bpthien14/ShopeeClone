import axios from '../utils/axios';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  roles: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User> {
    const response = await axios.get<User>('/auth/me');
    return response.data;
  }
}; 