export interface User {
  id: string;
  name: string;
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
