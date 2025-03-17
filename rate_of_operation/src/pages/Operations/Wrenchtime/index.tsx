import React from "react";
import { Typography, Paper, Container, Stack, Divider } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import WrenchtimeTable from "./components/WrenchTimeTable";
import { mockData } from "./mockData";

const Wrenchtime: React.FC = () => {
  return (
    <Paper sx={{ p: 2, overflow: "hidden" }}>
      <Stack direction="row" alignItems={"center"} sx={{ ml: 3 }}>
        <TimerIcon sx={{ fontSize: "28px" }} />
        <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
          Wrenchtime
        </Typography>
      </Stack>
      <Divider sx={{ mb: 2, mt: 1 }} />
      <Container maxWidth="xl" sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
        <WrenchtimeTable data={mockData} />
      </Container>
    </Paper>
  );
};

export default Wrenchtime;
