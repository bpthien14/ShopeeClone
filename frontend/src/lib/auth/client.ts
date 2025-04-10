'use client';

import { getCurrentUser, logoutAccount, register } from '@/apis/auth.api';
import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Sofia',
//   lastName: 'Rivers',
//   email: 'sofia@devias.io',
// } satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const { firstName, lastName, terms, ...rest } = params as SignUpParams & { terms: boolean };
      await register({
        name: `${firstName} ${lastName}`,
        ...rest
      });
      return {};
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || 'Something went wrong' 
      };
    }
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request
    if (email !== 'sofia@devias.io' || password !== 'Secret1') {
      return { error: 'Invalid credentials' };
    }

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const res = await getCurrentUser();
      return { data: res.user };
    } catch (error) {
      return { data: null };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      await logoutAccount();
      return {};
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || 'Something went wrong' 
      };
    }
  }
}

export const authClient = new AuthClient();
