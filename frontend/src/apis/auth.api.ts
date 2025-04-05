import Cookies from 'js-cookie';

import { accessTokenName, AuthResponse, refreshTokenName } from '@/types/auth.type';

import axiosInstance from './axios';

export const URL_LOGIN = '/auth/login';
export const URL_REGISTER = '/auth/register';
export const URL_LOGOUT = '/auth/logout';
export const URL_REFRESH_TOKEN = '/auth/refresh-tokens';
export const URL_GET_CURRENT_USER = '/auth/get-current-user';

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

// export const registerAccount = (body: { email: string; password: string }) => {
//   return http.post<AuthResponse>(URL_REGISTER, body)
// }

export const logoutAccount = async () => {
  const refreshToken = Cookies.get(refreshTokenName);
  Cookies.remove(accessTokenName);
  Cookies.remove(refreshTokenName);
await axiosInstance.post(URL_LOGOUT, { refreshToken });

};

export const getCurrentUser = async () => {
  const res = await axiosInstance.post<AuthResponse>(URL_GET_CURRENT_USER);
  // Store tokens in cookies
  // Cookies.set(accessTokenName, res.data.tokens.access.token, {
  //   secure: true,
  //   sameSite: 'strict',
  // });

  // Cookies.set(refreshTokenName, res.data.tokens.refresh.token, {
  //   secure: true,
  //   sameSite: 'strict',
  // });

  return res.data;
};
