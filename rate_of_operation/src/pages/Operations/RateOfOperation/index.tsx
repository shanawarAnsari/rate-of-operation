import React from "react";
import { Typography, Paper, Stack, useTheme, Box } from "@mui/material";
import { Speed as SpeedIcon } from "@mui/icons-material";
import RateOfOperationTable from "./components/RateOfOperationTable";

const RateOfOperation: React.FC = () => {
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
          p: 2,
          borderRadius: 1,
          mb: 1,
        })}
      >
        <Stack direction="row" alignItems="center">
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
              p: 1.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SpeedIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>

          <Stack direction={"column"}>
            <Typography sx={{ ml: 1, fontSize: "16px", fontWeight: 525 }}>
              Rate of Operations
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.8,
                fontSize: "0.75rem",
                ml: 1,
              }}
            >
              Review recipes and their rate of operations
            </Typography>
          </Stack>
        </Stack>
        <Box textAlign="right">
          <Typography fontSize="14px" fontWeight="500">
            Planning Window
          </Typography>
          <Typography fontSize="12px">
            {currentMonthStart} - {currentMonthEnd}
          </Typography>
        </Box>
      </Stack>{" "}
      <Box sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
        <RateOfOperationTable />
      </Box>
    </Paper>
  );
};

export default RateOfOperation;
