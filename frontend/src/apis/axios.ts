import type { AxiosError } from 'axios';
import axios from 'axios';
import Cookies from 'js-cookie';

import { accessTokenName, refreshTokenName, type AuthResponse } from '@/types/auth.type';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/v1',
  // timeout: 10000,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to track refresh token request
let isRefreshing = false;
// Store failed requests to retry after token refresh
let failedQueue: any[] = [];

// Processes queued requests after token refresh
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Function to refresh token
const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get(refreshTokenName);
    const response = await axios.post<AuthResponse>('http://localhost:3000/v1/auth/refresh-tokens', {
      refreshToken,
    });
    const newAccessToken = response.data.tokens.access.token;
    const newRefreshToken = response.data.tokens.refresh.token;
    // console.log('new token expire at: ',new Date(response.data.tokens.access.expires))

    Cookies.set(accessTokenName, newAccessToken, {
      secure: true,
      sameSite: 'strict',
    });

    Cookies.set(refreshTokenName, newRefreshToken, {
      secure: true,
      sameSite: 'strict',
    });

    return newAccessToken;
  } catch (error) {
    Cookies.remove(accessTokenName);
    Cookies.remove(refreshTokenName);
    window.location.reload();
    return null;
  }
};

// Add auth token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get(accessTokenName);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // If error is 401 and it's not a refresh token request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      (!originalRequest.url?.includes('/auth') || originalRequest.url?.includes('/auth/get-current-user'))
    ) {
      if (isRefreshing) {
        // If token refresh is in progress, queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      // try {
      //   const newAccessToken = await refreshToken();
      //   if (newAccessToken) {
      //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //     processQueue(null, newAccessToken);
      //     return axiosInstance(originalRequest);
      //   }
      // } catch (refreshError) {
      //   processQueue(refreshError as AxiosError);
      //   return Promise.reject(refreshError);
      // } finally {
      //   isRefreshing = false;
      // }

      isRefreshing = false;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
