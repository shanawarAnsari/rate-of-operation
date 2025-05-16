import { useEffect, useState } from "react";
import { oktaAuth } from "../../configs/oktaConfig";
import { useNavigate } from "react-router-dom";
import LoginCallbackError from "./LoginCallbackError";
import { ping } from "ldrs";
import { Box } from "@mui/material";
import { useUserStore } from "../../store/userStore";

const LoginCallback = () => {
  ping.register();
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
    if (!isLoggedIn) {
      oktaAuth.token
        .parseFromUrl()
        .then(async function (res) {
          setIsUserLoading(true);
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
              // Check if user has required permissions
              const hasValidAccess =
                userResp.myregion &&
                userResp.myregion.length > 0 &&
                userResp.myrole &&
                userResp.myrole.length > 0 &&
                userResp.mygroups &&
                userResp.mygroups.length > 0;

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

  if (isUserAllowed === false) {
    return <LoginCallbackError />;
  }

  return (
    <>
      {isUserLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <l-ping size="45" speed="0.7" color="black"></l-ping>
        </Box>
      ) : null}
    </>
  );
};

export default LoginCallback;
