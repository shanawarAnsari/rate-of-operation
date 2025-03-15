import React from "react";
import { Typography, Paper, Container, Stack, Divider } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import RateOfOperationTable from "./RateOfOperationTable";

const RateOfOperation: React.FC = () => {
  return (
    <Paper sx={{ p: 2, overflow: "hidden" }}>
      <Stack direction="row" alignItems={"center"} sx={{ ml: 3 }}>
        <SpeedIcon sx={{ fontSize: "28px" }} />
        <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
          Rate of Operations
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2 }} />
      <Container sx={{ maxWidth: "100%", disaply: "flex", flexGrow: 1 }}>
        <RateOfOperationTable />
      </Container>
    </Paper>
  );
};

export default RateOfOperation;
