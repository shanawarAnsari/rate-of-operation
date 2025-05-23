import { useEffect, useState } from "react";
import { oktaAuth } from "../../configs/oktaConfig";
import { useNavigate } from "react-router-dom";
import LoginCallbackError from "./LoginCallbackError";
import { Box, CircularProgress } from "@mui/material";
import { useUserStore } from "../../store/userStore";

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
              setUser(userResp);
              setIsLoggedIn(true);
              if (hasValidAccess) {
                setIsUserAllowed(true);
                setIsUserLoading(false);
                setCallbackProgress(false);
                navigate("/");
              } else {
                setIsUserAllowed(false);
                setIsUserLoading(false);
                setCallbackProgress(false);
              }
            })
            .catch((error) => {
              setIsUserLoading(false);
              setIsLoggedIn(false);
              setIsUserAllowed(false);
              setCallbackProgress(false);
              console.log("error", error);
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
      <CircularProgress />
    </Box>
  );
};

export default LoginCallback;