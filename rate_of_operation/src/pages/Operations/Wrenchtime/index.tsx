import React from "react";
import { Typography, Paper, Container, Stack, useTheme, Box } from "@mui/material";
import { Timer as TimerIcon } from "@mui/icons-material";
import WrenchtimeTable from "./components/WrenchTimeTable";
import { mockData } from "./mockData";

const Wrenchtime: React.FC = () => {
  const theme = useTheme();

  const now = new Date();
  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between" // Ensure content is spaced out
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
        <Stack direction="row" alignItems="center">
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
        <Box textAlign="right">
          <Typography fontSize="14px" fontWeight="500">
            Planning Window
          </Typography>
          <Typography fontSize="12px">
            {currentMonthStart} - {currentMonthEnd}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
        <WrenchtimeTable data={mockData} />
      </Box>
    </Paper>
  );
};

export default Wrenchtime;
