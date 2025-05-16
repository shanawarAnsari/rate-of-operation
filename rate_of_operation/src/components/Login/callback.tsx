import { useEffect, useState } from "react";
import { oktaAuth } from "../../configs/oktaConfig";
import { useNavigate } from "react-router-dom";
import LoginCallbackError from "./LoginCallbackError";
import { Box, CircularProgress } from "@mui/material";
import { useUserStore } from "../../store/userStore";

const LoginCallback = () => {
  const navigate = useNavigate();
  const [isUserAllowed, setIsUserAllowed] = useState<boolean | null>(null);
  const {
    isLoggedIn,
    setIsLoggedIn,
    isUserLoading,
    setIsUserLoading,
    setUser,
    setAuthToken,
  } = useUserStore((state) => state);

  useEffect(() => {
    // Only process the tokens if we're not already logged in
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
            setAuthToken(""); // or handle error as appropriate
          }

          oktaAuth.token
            .getUserInfo()
            .then(function (userResp: any) {
              // Check if user has the specific required permissions
              const requiredRegions = ["Azure_KC_ProdRate_Region_KCNA"];

              const hasValidAccess =
                userResp.myregion &&
                userResp.myregion.some((region: string) =>
                  requiredRegions.includes(region)
                );

              setUser(userResp);
              setIsUserLoading(false);
              setIsLoggedIn(true);

              if (hasValidAccess) {
                setIsUserAllowed(true);
                navigate("/");
              } else {
                setIsUserAllowed(false);
              }
            })
            .catch((error) => {
              setIsUserLoading(false);
              setIsLoggedIn(false);
              setIsUserAllowed(false);
              console.log("error", error);
            });
        })
        .catch((err) => {
          setIsLoggedIn(false);
          setIsUserAllowed(false);
          console.log("Error parsing tokens:", err);
        });
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Only show the error page when we're absolutely sure the user is not allowed
  // AND the loading process has completed
  if (isUserAllowed === false && !isUserLoading) {
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
