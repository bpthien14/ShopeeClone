import Cookies from 'js-cookie';

import { accessTokenName, AuthResponse, refreshTokenName } from '@/types/auth.type';

import axiosInstance from './axios';

export const URL_LOGIN = process.env.NEXT_PUBLIC_API_LOGIN || '/auth/login';
export const URL_REGISTER = process.env.NEXT_PUBLIC_API_REGISTER || '/auth/register';
export const URL_LOGOUT = process.env.NEXT_PUBLIC_API_LOGOUT || '/auth/logout';
export const URL_REFRESH_TOKEN = process.env.NEXT_PUBLIC_API_REFRESH_TOKEN || '/auth/refresh-tokens';
export const URL_GET_CURRENT_USER = process.env.NEXT_PUBLIC_API_GET_CURRENT_USER || '/auth/get-current-user';

export const loginAccount = async (body: { email: string; password: string }) => {
  // return http.post<AuthResponse>(URL_LOGIN, body)
  const res = await axiosInstance.post<AuthResponse>(URL_LOGIN, body);
  // Store tokens in cookies
  Cookies.set(accessTokenName, res.data.tokens.access.token, {
    secure: true,
    sameSite: 'strict',
  });

  Cookies.set(refreshTokenName, res.data.tokens.refresh.token, {
    secure: true,
    sameSite: 'strict',
  });

  return res.data;
};

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export const register = async (params: RegisterParams) => {
  const response = await axiosInstance.post<AuthResponse>(URL_REGISTER, params);
  
  // Store tokens in cookies
  Cookies.set(accessTokenName, response.data.tokens.access.token, {
    secure: true,
    sameSite: 'strict',
  });

  Cookies.set(refreshTokenName, response.data.tokens.refresh.token, {
    secure: true,
    sameSite: 'strict',
  });

  return response.data;
};

export const logoutAccount = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.post('/auth/get-current-user');
  return response.data;
};
