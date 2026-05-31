import { apiPost, apiDeleteRaw } from './client';

interface AuthResponse {
  user: unknown;
  web: unknown[];
}

export const authApi = {
  signIn: (email: string, password: string) =>
    apiPost<AuthResponse>('auth/signin', { email, password }),

  signUp: (form: {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }) => apiPost<void>('auth/signup', form),

  verifyOtp: (email: string, passcode: string) =>
    apiPost<AuthResponse>('auth/twoauth', { email, passcode }),

  forgotPassword: (email: string) =>
    apiPost<void>('auth/forgot', { email }),

  logout: () =>
    apiPost<void>('auth/logout', {}),

  googleSignIn: (token: string) =>
    apiPost<AuthResponse>('auth/google/signin', { token }),

  googleSignUp: (token: string) =>
    apiPost<AuthResponse>('auth/google/signup', { token }),

  updateProfile: (form: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => apiPost<{ user: unknown }>('auth/user', form),

  deleteProfile: (username: string) =>
    apiDeleteRaw<void>('auth/user', username),
};
