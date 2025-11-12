import React from "react";
import { Box } from "@mui/material";
import { useSetupTimeMetrics } from "../hooks/useSetupTimeMetrics";
import ViewSelector from "./ViewSelector";
import MetricCards from "./MetricCards";
import TrendsChart from "./TrendsChart";
import SetupTimeMonthlyViewCharts from "./SetupTimeMonthlyViewCharts";
import SetupTimeTrendsGroupedChart from "./SetupTimeTrendsGroupedChart";
import { FullPageLoading } from "./LoadingStates";
import { ErrorState } from "./ErrorStates";

/**
 * Setup Time Content Component
 *
 * This component integrates with the Node.js API endpoints:
 * - /api/wrenchtime/available-months - Get available months for Setup Time data
 * - /api/wrenchtime/metric-cards - Get aggregated Setup Time metrics for selected month
 * - /api/wrenchtime/monthly-trends - Get Setup Time trends across all months
 * - /api/wrenchtime/grouped-metrics - Get Setup Time metrics grouped by various dimensions
 * - /api/wrenchtime/trends-grouped-metrics - Get Setup Time trends grouped by various dimensions
 *
 * Backend data source: Uses ST (Setup Time) model type which maps to:
 * - AIML_ST_ABSOLUTE_ERROR field for AI ML Setup Time errors
 * - NEW_ST_ABSOLUTE_ERROR field for Planned Setup Time errors
 * - Units displayed as "min/su" (minutes per setup unit)
 */

const SetupTimeContent: React.FC = () => {
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
    metricsLoading,
  } = useSetupTimeMetrics();

  if (loading) {
    return <FullPageLoading />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <ErrorState
          message={`Error loading Setup Time data from /wrenchtime API: ${error.message}`}
          onRetry={retryFetch}
        />
      </Box>
    );
  }

  if (availableMonthsYears.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <ErrorState
          message="No data available for Setup Time metrics."
          showRetry={false}
        />
      </Box>
    );
  }

  // Debug information (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    const debugInfo = {
      availableMonthsCount: availableMonthsYears.length,
      selectedMonth,
      monthMetrics,
      monthlyTrendsCount: monthlyTrends.length,
      loading,
      metricsLoading,
    };
    console.log("Setup Time Content Debug Info:", debugInfo);
  }

  return (
    <Box sx={{ p: 1.5 }}>
      <ViewSelector
        viewMode={viewMode}
        selectedMonth={selectedMonth}
        availableMonths={availableMonthsYears}
        onViewModeChange={handleViewModeChange}
        onMonthChange={handleMonthChange}
        title="Setup Time Metrics"
      />

      {viewMode === "month" ? (
        <Box>
          <MetricCards
            metrics={monthMetrics}
            selectedMonth={selectedMonth}
            loading={metricsLoading}
            modelType="ST"
          />
          <Box sx={{ mt: 2 }}>
            <MonthlyViewChartsWithAPI selectedMonth={selectedMonth} />
          </Box>
        </Box>
      ) : (
        <Box>
          <TrendsChart trends={monthlyTrends} loading={loading} modelType="ST" />
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
  return <SetupTimeMonthlyViewCharts selectedMonth={selectedMonth} />;
};

// Wrapper component for TrendsGroupedChart with API integration
const TrendsGroupedChartWithAPI: React.FC = () => {
  return <SetupTimeTrendsGroupedChart />;
};

export default SetupTimeContent;
