import { Grid, Paper, Box, Typography, Alert } from "@mui/material";
import { LockRounded } from "@mui/icons-material";
import { useState, useEffect } from "react";

const LoginCallbackError = () => {
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
