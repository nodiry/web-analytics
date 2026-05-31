import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';

export function GoogleSignUpButton() {
  const navigate = useNavigate();

  const handleSuccess = async (response: any) => {
    try {
      const data = await authApi.googleSignUp(response.credential) as any;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('web',  JSON.stringify(data.web));
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-up failed', err);
    }
  };

  return (
    <GoogleLogin
      useOneTap
      onSuccess={handleSuccess}
      onError={() => console.error('Google Sign-Up Failed')}
      text="signup_with"
      locale="en_EN"
    />
  );
}
