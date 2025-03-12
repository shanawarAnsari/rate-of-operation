import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const RateOfOperation: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Rate of Operation
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Operation Metrics
        </Typography>
        <Typography variant="body1">
          This page will contain the Rate of Operation metrics and analytics.
        </Typography>
      </Paper>
    </Box>
  );
};

export default RateOfOperation;
