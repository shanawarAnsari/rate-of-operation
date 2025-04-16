import { useEffect } from 'react';
import { oktaAuth } from '../../configs/oktaConfig';
import { useNavigate } from 'react-router-dom';
import LoginCallbackError from './LoginCallbackError';
import { ping } from 'ldrs';
import { Box } from "@mui/material";
import { useUserStore } from '../../store/userStore';

const LoginCallback = () => {
  ping.register();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userLoading, setIsUserLoading, setUser, setAuthToken } = useUserStore(state => { return state });

  useEffect(() => {
    debugger;
    oktaAuth.token.parseFromUrl().then(async function (res) {
      setIsUserLoading(true);
      setIsLoggedIn(true);
      let tokens = res.tokens;
      oktaAuth.tokenManager.setTokens(tokens);
      let token = oktaAuth.tokenManager.getTokensSync();
      // if access token does not exist, using Id token 
      let authToken = token.accessToken?.accessToken || token.idToken?.idToken;
      setAuthToken(authToken)
      oktaAuth.token
        .getUserInfo()
        .then(function (userResp) {
          debugger;
          setUser(userResp);
          setIsUserLoading(false);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          setIsUserLoading(false);
          setIsLoggedIn(false);
          console.log('error', error);
        });
    })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  }, []);

  if (!isLoggedIn) {
    return <LoginCallbackError />
  }

  return (<>
    {userLoading ? <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', }}>
      <l-ping
        size="45"
        speed="0.7"
        color="black"
      ></l-ping>
    </Box> : <></>}
  </>);
};

export default LoginCallback;
