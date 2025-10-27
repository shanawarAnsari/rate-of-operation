import React from "react";
import { Box, Typography, Paper, Grid, Card, CardContent } from "@mui/material";

const SetupTimeContent: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Setup Time
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Monitor and analyze setup time metrics and performance
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Average Setup Time
              </Typography>
              <Typography variant="h4" color="text.primary">
                12.5 min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per operation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Best Setup Time
              </Typography>
              <Typography variant="h4" color="text.primary">
                8.3 min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best recorded time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Setup Time Distribution
              </Typography>
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Setup time distribution chart will be displayed here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SetupTimeContent;
