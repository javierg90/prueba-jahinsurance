export interface UserInterface {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  createdAt?: Date;
}
