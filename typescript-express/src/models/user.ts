export type Email = `${string}@${string}.${string}`
export default interface User {
  id: number; 
  first_name: string;
  last_name: string;
  email: Email;
  password: string;
  updated_at?: Date;
  last_login?: Date;
  created_at: Date;
  admin: boolean;
  timestamp?: number;
}
