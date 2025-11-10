import React from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { useRateOfOperationsMetrics } from "../hooks/useRateOfOperationsMetrics";
import ViewSelector from "./ViewSelector";
import MetricCards from "./MetricCards";
import TrendsChart from "./TrendsChart";
import TrendsGroupedChart from "./TrendsGroupedChart";
import MonthlyViewCharts from "./MonthlyViewCharts";

const RateOfOperationsContent: React.FC = () => {
  const {
    viewMode,
    selectedMonth,
    availableMonthsYears,
    monthMetrics,
    monthlyTrends,
    data: typedMockData,
    loading,
    handleViewModeChange,
    handleMonthChange,
  } = useRateOfOperationsMetrics();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
          p: 3,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (availableMonthsYears.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No data available for Rate of Operations metrics.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <ViewSelector
        viewMode={viewMode}
        selectedMonth={selectedMonth}
        availableMonths={availableMonthsYears}
        onViewModeChange={handleViewModeChange}
        onMonthChange={handleMonthChange}
      />

      {viewMode === "month" ? (
        <Box>
          <MetricCards
            metrics={monthMetrics}
            selectedMonth={selectedMonth}
            loading={loading}
          />
          <Box sx={{ mt: 3 }}>
            <MonthlyViewCharts data={typedMockData} selectedMonth={selectedMonth} />
          </Box>
        </Box>
      ) : (
        <Box>
          <TrendsChart trends={monthlyTrends} loading={loading} />
          <Box sx={{ mt: 3 }}>
            <TrendsGroupedChart data={typedMockData} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RateOfOperationsContent;
