import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body2">
              Overall system performance metrics and KPIs will be displayed here.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2">
              Recent operations and activities will appear in this section.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Alerts
            </Typography>
            <Typography variant="body2">
              System alerts and notifications will be shown here.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
