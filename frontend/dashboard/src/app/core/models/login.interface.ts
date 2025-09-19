export interface LoginPayload {
  email: string;
  password: string
}

export interface LoginResponse {
  data: {
    token: string;
    refreshToken?: string
  },
  user: {
    id: number;
    email: string;
    role: string
  }
}
