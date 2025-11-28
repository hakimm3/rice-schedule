export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  last_buy_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Transaction {
  id: number;
  user_id: number;
  date: Date;
  kg: number;
  price: number;
  prove_image?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  last_buy_date?: Date;
}

export interface TransactionResponse {
  id: number;
  user_id: number;
  date: Date;
  kg: number;
  price: number;
  prove_image?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
}
