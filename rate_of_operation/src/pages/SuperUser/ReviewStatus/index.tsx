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
        p: 2,
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        width: "100%",
      }}
    >
      <Stack direction="row" alignItems="center">
        <AssignmentIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Review Status</Typography>
      </Stack>
      <Divider sx={{ mb: 2, mt: 1 }} />
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
          label={<Typography fontWeight="500">Rate of Operations</Typography>}
          value="rateOfOperations"
          sx={{ minHeight: 36, py: 0.5, px: 1.5 }} // Compact Tab styling
        />
        <Tab
          icon={<TimerIcon />}
          iconPosition="start"
          label={<Typography fontWeight="500">Wrench Time</Typography>}
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
