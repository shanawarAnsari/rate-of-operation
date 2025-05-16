import { Grid, Paper, Box, Typography, Alert } from "@mui/material";
import { LockRounded } from "@mui/icons-material";

const NoAccess = () => {
  return (
    <Grid container justifyContent="center" padding={2} className="no-access-error">
      <Grid item xs={4}>
        <Paper sx={{ padding: 2, color: "#585252" }}>
          <Box
            sx={{
              textAlign: "center",
              fontSize: "1.75rem",
              padding: 2,
              color: "#b4afaf",
            }}
          >
            <LockRounded />
          </Box>
          <Box sx={{ padding: 1 }}>
            <Alert severity="error">
              <Typography variant="h4" color="#585252" alignContent="center">
                Access Denied
              </Typography>
            </Alert>
          </Box>
          <Box sx={{ textAlign: "center", padding: 1 }}>
            <Typography>
              You don't have the required permissions to access this application.
            </Typography>
            <Typography sx={{ padding: 0.5 }}>
              You need valid region, role, and group assignments. Please contact your
              administrator.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NoAccess;
