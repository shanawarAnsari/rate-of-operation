import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Card, Divider, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SpeedIcon from "@mui/icons-material/Speed";
import TimerIcon from "@mui/icons-material/Timer";
import RateOfOperations from "./RateOfOperations";
import WrenchTime from "./WrenchTime";

const ReviewStatus: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"rateOfOperations" | "wrenchTime">(
    "rateOfOperations"
  );

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: "rateOfOperations" | "wrenchTime"
  ) => {
    setActiveTab(newValue);
  };
  const theme = useTheme();

  return (
    <Card
      sx={{
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
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
        <AssignmentIcon sx={{ mr: 1 }} />
        <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
          Review Status
        </Typography>
      </Stack>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ minHeight: 36 }} // Reduce the height of the Tabs container
      >
        <Tab
          icon={<SpeedIcon />}
          iconPosition="start"
          label={
            <Typography fontWeight="500" fontSize={14}>
              Rate of Operations
            </Typography>
          }
          value="rateOfOperations"
          sx={{ minHeight: 36, py: 0.5, px: 1.5 }} // Compact Tab styling
        />
        <Tab
          icon={<TimerIcon />}
          iconPosition="start"
          label={
            <Typography fontWeight="500" fontSize={14}>
              Wrench Time
            </Typography>
          }
          value="wrenchTime"
          sx={{ minHeight: 36, py: 0.5, px: 1.5 }} // Compact Tab styling
        />
      </Tabs>
      <Box mt={2}>
        {activeTab === "rateOfOperations" && <RateOfOperations />}
        {activeTab === "wrenchTime" && <WrenchTime />}
      </Box>
    </Card>
  );
};

export default ReviewStatus;
