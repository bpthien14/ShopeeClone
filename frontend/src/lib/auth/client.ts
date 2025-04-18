'use client';

import { getCurrentUser, logoutAccount } from '@/apis/auth.api';
import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  phoneNumber:string
  role: 'merchant' | 'customer';
  isEmailVerified: boolean;
  shop?: {
    name: string;
  };
  customerClass?: string;
  amountPaid: number;
}


export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }


  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request

    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
    if (email !== 'sofia@devias.io' || password !== 'Secret1') {
      return { error: 'Invalid credentials' };
    }

    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    try {
      const res = await getCurrentUser();

      return { data: res.user };
    } catch (error) {
      return { data : null};
    }

    // We do not handle the API, so just check if we have a token in localStorage.
    // const token = localStorage.getItem('custom-auth-token');

    // if (!token) {
    //   return { data: null };
    // }

  }

  async signOut(): Promise<{ error?: string }> {
    await logoutAccount()

    return {};
  }
}

export const authClient = new AuthClient();