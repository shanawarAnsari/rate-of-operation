import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { oktaAuth } from "../../configs/oktaConfig";
import { useUserStore } from "../../store/userStore";
import NoAccess from "./NoAccess";
import { Box, CircularProgress } from "@mui/material";

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: any) => {
  const navigate = useNavigate();
  const { isLoggedIn, authToken, user, isUserLoading } = useUserStore((state) => ({
    isLoggedIn: state.isLoggedIn,
    authToken: state.authToken,
    user: state.user,
    isUserLoading: state.isUserLoading,
  }));
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    // Check if we have an active Okta session before redirecting
    if (
      !authToken &&
      !isLoggedIn &&
      !isUserLoading &&
      !location.pathname.includes("/login/callback") &&
      !isRedirecting
    ) {
      // Check session status to prevent unnecessary redirects
      oktaAuth.session
        .exists()
        .then((exists) => {
          if (!exists) {
            setIsRedirecting(true);
            oktaAuth.token.getWithRedirect({
              responseType: ["token", "id_token"],
              state: "defaultrandomstring",
            });
          }
        })
        .catch(() => {
          setIsRedirecting(true);
          oktaAuth.token.getWithRedirect({
            responseType: ["token", "id_token"],
            state: "defaultrandomstring",
          });
        });
    }
  }, [navigate, location, isLoggedIn, authToken, isUserLoading, isRedirecting]);

  // Show loading indicator while user data is loading or during redirection
  if (isUserLoading || isRedirecting || (!isLoggedIn && !authToken)) {
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
  } // Check if user has the specific required permissions
  const requiredGroups = [
    "Azure_KC_ProdRate_Access_Prod",
    "Azure_KC_ProdRate_Access_NonProd",
  ];
  const requiredRegions = ["Azure_KC_ProdRate_Region_KCNA"];

  const hasValidAccess =
    user &&
    (user as any).myregion &&
    (user as any).myregion.some((region: string) =>
      requiredRegions.includes(region)
    ) &&
    (user as any).mygroups &&
    (user as any).mygroups.some((group: string) => requiredGroups.includes(group));

  // If permissions are invalid, show the NoAccess component
  if (!hasValidAccess && isLoggedIn) {
    return <NoAccess />;
  }

  return children;
};

export default AuthGuard;
