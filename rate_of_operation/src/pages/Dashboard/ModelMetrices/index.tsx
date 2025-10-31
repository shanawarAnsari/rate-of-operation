import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import Sidebar from "./components/Sidebar";
import RateOfOperationsContent from "./components/RateOfOperationsContent";
import SetupTimeContent from "./components/SetupTimeContent";

const ModelMetrics: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("rate-of-operations");

  const renderContent = () => {
    switch (selectedItem) {
      case "rate-of-operations":
        return <RateOfOperationsContent />;
      case "setup-time":
        return <SetupTimeContent />;
      default:
        return <RateOfOperationsContent />;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 500,
        display: "flex",
        gap: 0.5,
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Sidebar selectedItem={selectedItem} onItemSelect={setSelectedItem} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <Paper sx={{ height: "100%", minHeight: 400 }}>{renderContent()}</Paper>
      </Box>
    </Box>
  );
};

export default ModelMetrics;
