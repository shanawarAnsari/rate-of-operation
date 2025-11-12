import React from "react";
import { Box } from "@mui/material";
import { useRateOfOperationsMetrics } from "../hooks/useRateOfOperationsMetrics";
import ViewSelector from "./ViewSelector";
import MetricCards from "./MetricCards";
import TrendsChart from "./TrendsChart";
import TrendsGroupedChart from "./TrendsGroupedChart";
import MonthlyViewCharts from "./MonthlyViewCharts";
import { FullPageLoading } from "./LoadingStates";
import { ErrorState } from "./ErrorStates";

const RateOfOperationsContent: React.FC = () => {
  const {
    viewMode,
    selectedMonth,
    availableMonthsYears,
    monthMetrics,
    monthlyTrends,
    loading,
    error,
    handleViewModeChange,
    handleMonthChange,
    retryFetch,
  } = useRateOfOperationsMetrics();

  if (loading) {
    return <FullPageLoading />;
  }

  if (error) {
    return (
      <Box sx={{ p: 1.5 }}>
        <ErrorState
          message={`Error loading Rate of Operations data: ${error.message}`}
          onRetry={retryFetch}
        />
      </Box>
    );
  }

  if (availableMonthsYears.length === 0) {
    return (
      <Box sx={{ p: 1.5 }}>
        <ErrorState
          message="No data available for Rate of Operations metrics."
          showRetry={false}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1.5 }}>
      <ViewSelector
        viewMode={viewMode}
        selectedMonth={selectedMonth}
        availableMonths={availableMonthsYears}
        onViewModeChange={handleViewModeChange}
        onMonthChange={handleMonthChange}
        title="Rate of Operations Metrics"
      />

      {viewMode === "month" ? (
        <Box>
          <MetricCards
            metrics={monthMetrics}
            selectedMonth={selectedMonth}
            loading={loading}
            modelType="ROP"
          />
          <Box sx={{ mt: 2 }}>
            <MonthlyViewChartsWithAPI selectedMonth={selectedMonth} />
          </Box>
        </Box>
      ) : (
        <Box>
          <TrendsChart trends={monthlyTrends} loading={loading} modelType="ROP" />
          <Box sx={{ mt: 2 }}>
            <TrendsGroupedChartWithAPI />
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Wrapper component for MonthlyViewCharts with API integration
const MonthlyViewChartsWithAPI: React.FC<{ selectedMonth?: string }> = ({
  selectedMonth,
}) => {
  return <MonthlyViewCharts selectedMonth={selectedMonth} />;
};

// Wrapper component for TrendsGroupedChart with API integration
const TrendsGroupedChartWithAPI: React.FC = () => {
  return <TrendsGroupedChart />;
};

export default RateOfOperationsContent;
