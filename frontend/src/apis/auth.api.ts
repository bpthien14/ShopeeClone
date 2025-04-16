import Cookies from 'js-cookie';

import {
  accessTokenName,
  type AuthResponse,
  refreshTokenName,
  type SignUpRequest,
  type UpdateProfileRequest,
} from '@/types/auth.type';

import axiosInstance from './axios';

export const URL_LOGIN = process.env.NEXT_PUBLIC_API_LOGIN || '/auth/login';
export const URL_REGISTER = process.env.NEXT_PUBLIC_API_REGISTER || '/auth/register';
export const URL_LOGOUT = process.env.NEXT_PUBLIC_API_LOGOUT || '/auth/logout';
export const URL_REFRESH_TOKEN = process.env.NEXT_PUBLIC_API_REFRESH_TOKEN || '/auth/refresh-tokens';
export const URL_GET_CURRENT_USER = process.env.NEXT_PUBLIC_API_GET_CURRENT_USER || '/auth/get-current-user';
export const URL_LOGIN = '/auth/login';
export const URL_REGISTER = '/auth/register';
export const URL_LOGOUT = '/auth/logout';
export const URL_REFRESH_TOKEN = '/auth/refresh-tokens';
export const URL_GET_CURRENT_USER = '/auth/get-current-user';
export const URL_UPDATE_PROFILE = '/auth/update-profile';

export const loginAccount = async (body: { email: string; password: string }) => {
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
export const registerAccount = async (body: SignUpRequest) => {
  const res = await axiosInstance.post<AuthResponse>(URL_REGISTER, body);
  // Store tokens in cookies
  Cookies.set(accessTokenName, res.data.tokens.access.token, {
    secure: true,
    sameSite: 'strict',
  });

  Cookies.set(refreshTokenName, response.data.tokens.refresh.token, {
  Cookies.set(refreshTokenName, res.data.tokens.refresh.token, {
    secure: true,
    sameSite: 'strict',
  });

  return response.data;
  return res.data;
};

export const logoutAccount = async () => {
  const refreshToken = Cookies.get(refreshTokenName);
  Cookies.remove(accessTokenName);
  Cookies.remove(refreshTokenName);
  await axiosInstance.post(URL_LOGOUT, { refreshToken });


};

export const getCurrentUser = async () => {
  const response = await axiosInstance.post('/auth/get-current-user');
  return response.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.post<AuthResponse>(URL_GET_CURRENT_USER);
  return res.data;
};

export const updateProfile = async (body: UpdateProfileRequest) => {
  const res = await axiosInstance.post<AuthResponse>(URL_UPDATE_PROFILE, body);
  return res.data;
};
