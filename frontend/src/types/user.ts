export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  country?: string;
  city?: string;
  timezone?: string;
  [key: string]: unknown;
  email: string;
  password: string;
  role: 'merchant' | 'customer';
  photoUrl?: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  shop?: {
    name: string;
  };
  customerClass?: string;
  amountPaid: number;
}
