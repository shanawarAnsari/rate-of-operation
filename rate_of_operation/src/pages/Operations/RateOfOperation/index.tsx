import React from "react";
import { Box, Typography, Paper, Container, Stack } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import RateOfOperationTable from "./components/RateOfOperationTable";

const RateOfOperation: React.FC = () => {
  return (
    <Paper sx={{ p: 2, overflow: "hidden" }}>
      <Stack direction="row">
        <SpeedIcon sx={{ fontSize: "28px" }} />
        <Typography sx={{ ml: 1, fontSize: "20px" }}>Rate of Operation</Typography>
      </Stack>
      <RateOfOperationTable />
    </Paper>
  );
};

export default RateOfOperation;
