import { User } from '@/types/user';

export const accessTokenName = process.env.NEXT_PUBLIC_ACCESS_TOKEN_NAME || 'accessToken';
export const refreshTokenName = process.env.NEXT_PUBLIC_REFRESH_TOKEN_NAME || 'refreshToken';

export interface AuthResponse {
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
  user: User;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role: 'merchant' | 'customer';
  phoneNumber: string;
  shop?: {
    name: string;
  };
  customerClass?: string;
  amountPaid: number;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface GetUserRequest {
  accessToken: string;
}

export interface UpdateProfileRequest {
  name: string;
  phoneNumber: string;
  photoUrl?: string;
  shop?: {
    name: string;
  };
}
