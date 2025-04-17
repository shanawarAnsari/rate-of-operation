import { useEffect, useState } from 'react';
import { oktaAuth } from '../../configs/oktaConfig';
import { useNavigate } from 'react-router-dom';
import LoginCallbackError from './LoginCallbackError';
import { ping } from 'ldrs';
import { Box } from "@mui/material";
import { useUserStore } from '../../store/userStore';

const LoginCallback = () => {
  ping.register();
  const navigate = useNavigate();
  const [isUserAllowed, setIsUserAllowed] = useState(null)
  const { isLoggedIn, setIsLoggedIn, isUserLoading, setIsUserLoading, setUser, setAuthToken, authToken } = useUserStore(state => { return state });

  useEffect(() => {
    if (!isLoggedIn) {
      oktaAuth.token.parseFromUrl().then(async function (res) {
        setIsUserLoading(true);
        setIsLoggedIn(true);
        let tokens = res.tokens;
        oktaAuth.tokenManager.setTokens(tokens);
        let token = oktaAuth.tokenManager.getTokensSync();
        let authToken = token.accessToken?.accessToken || token.idToken?.idToken;
        setAuthToken(authToken)
        oktaAuth.token
          .getUserInfo()
          .then(function (userResp) {
            setUser(userResp);
            setIsUserLoading(false);
            setIsLoggedIn(true);
            setIsUserAllowed(true);
            navigate("/")
          })
          .catch((error) => {
            setIsUserLoading(false);
            setIsLoggedIn(false);
            console.log('error', error);
          });
      }).catch((err) => {
        setIsLoggedIn(false);
      });
    } else {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isUserAllowed === false) {
    return <LoginCallbackError />
  }

  return (<>
    {isUserLoading ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', }}>
      <l-ping
        size="45"
        speed="0.7"
        color="black"
      ></l-ping>
    </Box> : <></>}
  </>);
};

export default LoginCallback;
