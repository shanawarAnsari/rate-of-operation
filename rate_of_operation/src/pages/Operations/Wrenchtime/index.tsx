import React from "react";
import {
  Typography,
  Paper,
  Container,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import WrenchtimeTable from "./components/WrenchTimeTable";
import { mockData } from "./mockData";

const Wrenchtime: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "light"
              ? theme.palette.grey[200] // Lighter background for better contrast
              : "black", // Primary color for dark mode
          color:
            theme.palette.mode === "light"
              ? theme.palette.grey[800] // Dark gray text for light mode
              : theme.palette.common.white, // White text for dark mode
          p: 1,
          borderRadius: 1,
          mb: 1,
        })}
      >
        <TimerIcon
          sx={{
            fontSize: "28px",
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[800] // Dark gray icon for light mode
                : theme.palette.common.white, // White icon for dark mode
          }}
        />
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
