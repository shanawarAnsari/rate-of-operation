import React from "react";
import { Typography, Paper, Container, Stack, Divider } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import RateOfOperationTable from "./components/RateOfOperationTable";
import { mockData } from "./mockData";

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
      <Container maxWidth="xl" sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
        <RateOfOperationTable data={mockData} />
      </Container>
    </Paper>
  );
};

export default RateOfOperation;
