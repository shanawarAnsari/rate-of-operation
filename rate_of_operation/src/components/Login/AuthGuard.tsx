import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { oktaAuth } from '../../configs/oktaConfig';
import { useUserStore } from '../../store/userStore';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: any) => {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore(state => state.isLoggedIn)
  const authToken = useUserStore(state => state.authToken);
  const location = useLocation();

  useEffect(() => {
    if (!authToken) {
      oktaAuth.token.getWithRedirect({
        responseType: ['token', 'id_token'],
        state: 'defaultrandomstring'
      });
    }
  }, [navigate, location, isLoggedIn]);

  return children;
};

export default AuthGuard;
