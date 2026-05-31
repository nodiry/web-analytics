import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

export function GoogleSignInButton() {
  const navigate = useNavigate();

  const handleSuccess = async (response: any) => {
    try {
      const data = await authApi.googleSignIn(response.credential) as any;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('web',  JSON.stringify(data.web));
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error('Google Sign-In Failed')}
      text="signin_with"
      locale="en_EN"
    />
  );
}
