import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

const UsageMetrics: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Usage Metrics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Monitor system usage and performance metrics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h4" color="text.primary">
                234
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current active sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                System Load
              </Typography>
              <Typography variant="h4" color="text.primary">
                67%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current system utilization
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Operations Today
              </Typography>
              <Typography variant="h4" color="text.primary">
                1,542
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total operations processed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Usage Analytics
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Usage analytics charts and detailed metrics will be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UsageMetrics;
