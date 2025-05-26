import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { oktaAuth } from "../../configs/oktaConfig";
import { useUserStore } from "../../store/userStore";
import { Box, CircularProgress } from "@mui/material";
import LoginCallbackError from "./LoginCallbackError";

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Use the selector pattern with shallow comparison to prevent unnecessary re-renders
  const isLoggedIn = useUserStore((state: any) => state.isLoggedIn);
  const authToken = useUserStore((state: any) => state.authToken);
  const user = useUserStore((state: any) => state.user);
  const isUserLoading = useUserStore((state: any) => state.isUserLoading);

  // Memoize permission check to prevent recalculation on each render
  const hasValidAccess = useMemo(() => {
    if (!user) return false;

    const requiredGroups = [
      "Azure_KC_ProdRate_Access_Prod",
      "Azure_KC_ProdRate_Access_NonProd",
    ];
    const requiredRegions = ["Azure_KC_ProdRate_Region_KCNA"];

    return (
      (user as any)?.myregion &&
      (user as any)?.myregion.some((region: string) =>
        requiredRegions.includes(region)
      ) &&
      (user as any)?.mygroup &&
      (user as any)?.mygroup.some((group: string) => requiredGroups.includes(group))
    );
  }, [user]);

  // Separate effect for auth redirection
  useEffect(() => {
    let isMounted = true;

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
          if (isMounted && !exists) {
            setIsRedirecting(true);
            oktaAuth.token.getWithRedirect({
              responseType: ["token", "id_token"],
              state: "defaultrandomstring",
            });
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsRedirecting(true);
            oktaAuth.token.getWithRedirect({
              responseType: ["token", "id_token"],
              state: "defaultrandomstring",
            });
          }
        });
    }

    return () => {
      isMounted = false;
    };
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
  }

  // If permissions are invalid, show the NoAccess component
  if (!hasValidAccess && isLoggedIn) {
    return <LoginCallbackError />;
  }

  return children;
};

export default AuthGuard;