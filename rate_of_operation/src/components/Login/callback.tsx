import { useEffect, useState } from "react";
import { oktaAuth } from "../../configs/oktaConfig";
import { useNavigate } from "react-router-dom";
import LoginCallbackError from "./LoginCallbackError";
import { Box, CircularProgress } from "@mui/material";
import { useUserStore } from "../../store/userStore";
import { generateApiToken } from "../../services/apiTokenGen";

const LoginCallback = () => {
  const navigate = useNavigate();
  const [isUserAllowed, setIsUserAllowed] = useState<boolean | null>(null);
  const [callbackProgress, setCallbackProgress] = useState(true);
  const {
    isLoggedIn,
    setIsLoggedIn,
    isUserLoading,
    setIsUserLoading,
    setUser,
    authToken,
    setAuthToken,
    setIsUserAdmin,
  } = useUserStore((state) => state);

  useEffect(() => {
    setCallbackProgress(true)
    if (!isLoggedIn && !isUserLoading) {
      setIsUserLoading(true);
      oktaAuth.token
        .parseFromUrl()
        .then(async function (res) {
          let tokens = res.tokens;
          oktaAuth.tokenManager.setTokens(tokens);
          let token = oktaAuth.tokenManager.getTokensSync();
          let authToken = token.accessToken?.accessToken || token.idToken?.idToken;
          if (authToken) {
            setAuthToken(authToken);
          } else {
            setAuthToken("");
          }

          oktaAuth.token
            .getUserInfo()
            .then(function (userResp: any) {
              const requiredRegions = ["Azure_KC_ProdRate_Region_KCNA"];
              const hasValidAccess =
                userResp.myregion &&
                userResp.myregion.some((region: string) =>
                  requiredRegions.includes(region)
                );
              if (userResp.myrole.some((role: string) => ["Azure_KC_ProdRate_Role_Admin"].includes(role))) {
                setIsUserAdmin(true);
              }
              setUser(userResp);
              setIsLoggedIn(true);
              if (hasValidAccess) {
                setIsUserAllowed(true);
                generateApiToken(authToken, userResp.mygroup, userResp.myregion, userResp.myrole)
                  .then((res) => {
                    localStorage.setItem('authToken', res.jwtApiToken);
                    setIsUserLoading(false);
                    setCallbackProgress(false);
                    navigate('/');
                  })
                  .catch((err) => {
                    setIsUserLoading(false);
                    setCallbackProgress(false);
                    console.log('error', err);
                  });
              } else {
                setIsUserAllowed(false);
                setIsUserLoading(false);
                setCallbackProgress(false);
                navigate("/login/callbackError")
              }
            })
            .catch((error) => {
              setIsUserLoading(false);
              setIsLoggedIn(false);
              setIsUserAllowed(false);
              setCallbackProgress(false);
              console.log("error", error);
              navigate("/login/callbackError")
            });
        })
        .catch((err) => {
          setIsUserLoading(false);
          setIsLoggedIn(false);
          setCallbackProgress(false);
          setIsUserAllowed(false);
        });
    } else {
      navigate("/");
    }
  }, []);
  const [showAccessErrorAfterDelay, setShowAccessErrorAfterDelay] = useState(false);
  let timer: NodeJS.Timeout;
  useEffect(() => {
    if (isUserAllowed === false && !isUserLoading) {
      timer = setTimeout(() => {
        setShowAccessErrorAfterDelay(true)
      }, 2500);
    } else {
      setShowAccessErrorAfterDelay(false);
    }
    return () => {
      clearTimeout(timer);
    }
  }, [isUserAllowed, isUserLoading])


  if (isUserAllowed === false && !isUserLoading && !callbackProgress && showAccessErrorAfterDelay) {
    return <LoginCallbackError />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoginCallback;