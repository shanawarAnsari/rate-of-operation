import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Wrenchtime: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Wrenchtime
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Wrenchtime Analysis
        </Typography>
        <Typography variant="body1">
          This page will display Wrenchtime analytics and performance data.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Wrenchtime;
