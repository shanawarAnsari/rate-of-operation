import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { oktaAuth } from '../../configs/oktaConfig';
import { useUserStore } from '../../store/userStore';

const LoginCallback = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processLogin = async () => {
      try {
        // Skip if user already exists in store (persisted)
        if (user) {
          setLoading(false);
          navigate('/');
          return;
        }

        // Handle the redirect and get tokens
        await oktaAuth.handleRedirect();

        // Get user info
        const userInfo = await oktaAuth.getUser();
        setUser({
          name: userInfo.name || "",
          email: userInfo.email || "",
        });

        setLoading(false);
        navigate('/');
      } catch (err) {
        console.error('LoginCallback Error:', err);
        setLoading(false);
        navigate('/error');
      }
    };

    processLogin();
  }, [user, setUser, navigate]);

  return <div>{loading ? 'Logging in...' : 'Redirecting...'}</div>;
};

export default LoginCallback;