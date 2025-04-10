export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  country?: string;
  city?: string;
  timezone?: string;
  [key: string]: unknown;
}
