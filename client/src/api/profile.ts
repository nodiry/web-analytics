import { apiPut } from './client';

interface ProfileUpdateForm {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const profileApi = {
  update: (form: ProfileUpdateForm) =>
    apiPut<{ user: unknown }>('auth/user', form),

  delete: (username: string) =>
    fetch('https://was.glasscube.io/auth/user', {
      method: 'DELETE',
      credentials: 'include',
      body: username,
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to delete account');
    }),
};
