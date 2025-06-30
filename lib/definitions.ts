export interface User {
  _id?: string;
  id?: string;
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: SessionUser;
}
