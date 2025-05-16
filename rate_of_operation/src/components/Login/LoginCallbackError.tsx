import { Grid, Paper, Box, Typography, Alert } from "@mui/material";
import { LockRounded } from "@mui/icons-material";
import { useState, useEffect } from "react";

const LoginCallbackError = () => {  const [showError, setShowError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is in the process of logging in
    const checkAuthStatus = () => {
      // This is a simple check - you might need to adapt this based on how
      // your authentication state is stored (e.g., localStorage, cookies, context)
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      return !!token;
    };

    // First quick check
    if (checkAuthStatus()) {
      setIsAuthenticated(true);
      return; // Exit early if authenticated
    }

    // Wait longer to ensure auth process has time to complete
    const timer = setTimeout(() => {
      // Check again after delay
      if (!checkAuthStatus()) {
        setShowError(true); // Only show error if still not authenticated
      }
    }, 3000); // Increased to 3 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything while in potential transition state
  if (!showError) {
    return null;
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center" // Center vertically
      padding={2}
      className="login-callback-error"
      sx={{ minHeight: "100vh" }} // Ensure it takes full viewport height
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        {" "}
        {/* Responsive width */}
        <Paper
          elevation={3} // Add some shadow
          sx={{
            padding: 4, // Increased padding
            color: "#585252",
            border: "1px solid #e0e0e0", // Add a border
            borderRadius: 2, // Rounded corners
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              fontSize: "3rem",
              padding: 2,
              color: "#d32f2f",
            }}
          >
            {" "}
            {/* Larger icon, error color */}
            <LockRounded fontSize="inherit" /> {/* Inherit size */}
          </Box>
          <Box sx={{ padding: 2 }}>
            {" "}
            {/* Increased padding */}
            <Alert
              severity="error"
              sx={{ backgroundColor: "#ffebee", color: "#c62828" }}
            >
              {" "}
              {/* Custom error colors */}
              <Typography
                variant="h5"
                component="div"
                alignContent="center"
                sx={{ fontWeight: "bold" }}
              >
                {" "}
                {/* Adjusted typography */}
                App Access Locked
              </Typography>
            </Alert>
          </Box>
          <Box sx={{ textAlign: "center", padding: 2 }}>
            {" "}
            {/* Increased padding */}
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              {" "}
              {/* Adjusted typography and margin */}
              You are not allowed to access this app due to a policy set by the
              administrator.
            </Typography>
            <Typography variant="body2" sx={{ color: "#757575" }}>
              {" "}
              {/* Adjusted typography and color */}
              To request access, please contact your administrator.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginCallbackError;
