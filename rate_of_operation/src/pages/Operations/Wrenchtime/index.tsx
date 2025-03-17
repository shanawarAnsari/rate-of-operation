import React from "react";
import { Typography, Paper, Container, Stack, Divider } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import WrenchtimeTable from "./components/WrenchTimeTable";
import { mockData } from "./mockData";

const Wrenchtime: React.FC = () => {
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "light" ? "#0F059E" : theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          p: 1,
          borderRadius: 1,
          mb: 1,
        })}
      >
        <TimerIcon sx={{ fontSize: "28px" }} />
        <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
          Wrenchtime
        </Typography>
      </Stack>
      <Container maxWidth="xl" sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
        <WrenchtimeTable data={mockData} />
      </Container>
    </Paper>
  );
};

export default Wrenchtime;
