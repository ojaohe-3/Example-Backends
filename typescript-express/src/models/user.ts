export type Email = `${string}@${string}.${string}`
export default interface User {
  id: number; // Uniqe
  first_name: string;
  last_name: string;
  email: Email; // Uniqe
  password: string;
  updated_at?: Date;
  last_login?: Date;
  created_at: Date;
  admin: boolean;
  timestamp?: number;
}
