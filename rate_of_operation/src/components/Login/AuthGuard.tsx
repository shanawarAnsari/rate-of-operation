import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { oktaAuth } from "../../configs/oktaConfig";
import { useUserStore } from "../../store/userStore";
import NoAccess from "./NoAccess";

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

  useEffect(() => {
    if (!authToken && !isLoggedIn) {
      oktaAuth.token.getWithRedirect({
        responseType: ["token", "id_token"],
        state: "defaultrandomstring",
      });
    }
  }, [navigate, location, isLoggedIn, authToken]);

  // Show nothing until the user data is loaded
  if (isUserLoading || (!isLoggedIn && !authToken)) {
    return null;
  }
  // Check if user has the required permissions
  const hasValidAccess =
    user &&
    (user as any).myregion &&
    (user as any).myregion.length > 0 &&
    (user as any).myrole &&
    (user as any).myrole.length > 0 &&
    (user as any).mygroups &&
    (user as any).mygroups.length > 0;

  // If permissions are invalid, show the NoAccess component
  if (!hasValidAccess && isLoggedIn) {
    return <NoAccess />;
  }

  return children;
};

export default AuthGuard;
