import { useState, useEffect, useCallback } from "react";
import {
  getAvailableMonths,
  getMetricCards,
  getMonthlyTrends,
} from "../../../../services/rate-of-operations";

/**
 * Setup Time Metrics Hook
 *
 * This hook manages Setup Time (ST) data by interfacing with:
 * - /api/wrenchtime/available-months
 * - /api/wrenchtime/metric-cards
 * - /api/wrenchtime/monthly-trends
 *
 * All API calls use modelType="ST" which maps to Setup Time data fields in the backend
 */

export interface STMetrics {
  numberOfPO: number;
  aimlRoMAE: number; // AI ML Setup Time - MAE (maps to AIML_ST_ABSOLUTE_ERROR)
  plannedRoMAE: number; // PLANNED Setup Time - MAE (maps to NEW_ST_ABSOLUTE_ERROR)
}

export interface STMonthlyTrend {
  month: string;
  year: number;
  numberOfPO: number;
  aimlRoMAE: number; // Maps to AIML_ST_ABSOLUTE_ERROR in API
  plannedRoMAE: number; // Maps to NEW_ST_ABSOLUTE_ERROR in API
}

export type ViewMode = "month" | "trends";

export const useSetupTimeMetrics = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Start with loading = true
  const [error, setError] = useState<Error | null>(null);

  // Separate loading states for better UX
  const [monthsLoading, setMonthsLoading] = useState<boolean>(false);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [trendsLoading, setTrendsLoading] = useState<boolean>(false);

  // State for API data
  const [availableMonthsYears, setAvailableMonthsYears] = useState<
    Array<{
      value: string;
      label: string;
      month: number;
      year: number;
    }>
  >([]);
  const [monthMetrics, setMonthMetrics] = useState<STMetrics>({
    numberOfPO: 0,
    aimlRoMAE: 0,
    plannedRoMAE: 0,
  });
  const [monthlyTrends, setMonthlyTrends] = useState<STMonthlyTrend[]>([]);

  // Fetch available months
  const fetchAvailableMonths = useCallback(async () => {
    setMonthsLoading(true);
    try {
      console.log("Fetching Setup Time available months...");
      const data = await getAvailableMonths("ST");
      console.log("Setup Time available months data received:", data);

      if (Array.isArray(data) && data.length > 0) {
        setAvailableMonthsYears(data);
        // Set default selected month to the latest available (first in array as API returns latest first)
        if (!selectedMonth) {
          console.log("Setting default selected month:", data[0].value);
          setSelectedMonth(data[0].value);
        }
      } else if (Array.isArray(data) && data.length === 0) {
        setAvailableMonthsYears([]);
        console.warn("No available months found for Setup Time data");
      } else {
        throw new Error("Invalid data format received for available months");
      }
    } catch (err) {
      console.error("Error fetching Setup Time available months:", err);
      setError(err as Error);
    } finally {
      setMonthsLoading(false);
    }
  }, [selectedMonth]);

  // Fetch metric cards data
  const fetchMetricCards = useCallback(async () => {
    if (!selectedMonth) {
      console.log("fetchMetricCards: No selectedMonth, skipping");
      return;
    }

    setMetricsLoading(true);
    try {
      console.log(`Fetching Setup Time metric cards for month: ${selectedMonth}`);
      const data = await getMetricCards("ST", selectedMonth);
      console.log("Setup Time metric cards data received:", data);

      if (data && typeof data === "object") {
        const metrics = {
          numberOfPO: data.numberOfPO || 0,
          aimlRoMAE: data.aimlRoMAE || 0,
          plannedRoMAE: data.plannedRoMAE || 0,
        };
        console.log("Setting Setup Time metrics:", metrics);
        setMonthMetrics(metrics);
      } else {
        throw new Error("Invalid data format received for metric cards");
      }
    } catch (err) {
      console.error("Error fetching Setup Time metric cards:", err);
      setError(err as Error);
    } finally {
      setMetricsLoading(false);
    }
  }, [selectedMonth]);

  // Fetch monthly trends data
  const fetchMonthlyTrends = useCallback(async () => {
    setTrendsLoading(true);
    try {
      console.log("Fetching Setup Time monthly trends...");
      const data = await getMonthlyTrends("ST");
      console.log("Setup Time monthly trends data received:", data);

      if (Array.isArray(data)) {
        // Ensure data structure matches our interface
        const formattedTrends = data.map((item) => ({
          month: item.month || "",
          year: item.year || 0,
          numberOfPO: item.numberOfPO || 0,
          aimlRoMAE: item.aimlRoMAE || 0,
          plannedRoMAE: item.plannedRoMAE || 0,
        }));
        console.log("Setting Setup Time monthly trends:", formattedTrends);
        setMonthlyTrends(formattedTrends);
      } else {
        throw new Error("Invalid data format received for monthly trends");
      }
    } catch (err) {
      console.error("Error fetching Setup Time monthly trends:", err);
      setError(err as Error);
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Starting Setup Time data fetch...");
      // First, fetch available months and trends in parallel
      await Promise.all([fetchAvailableMonths(), fetchMonthlyTrends()]);
      console.log("Initial Setup Time data fetch completed");
    } catch (err) {
      console.error("Error fetching Setup Time data from /wrenchtime API:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchAvailableMonths, fetchMonthlyTrends]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fetch metric cards when selected month changes (this will be triggered after available months are loaded)
  useEffect(() => {
    if (selectedMonth) {
      fetchMetricCards();
    }
  }, [selectedMonth, fetchMetricCards]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  const retryFetch = useCallback(() => {
    console.log("Retrying Setup Time data fetch...");
    setError(null);
    fetchAllData();
  }, [fetchAllData]);

  return {
    viewMode,
    selectedMonth,
    availableMonthsYears,
    monthMetrics,
    monthlyTrends,
    loading: loading || monthsLoading || metricsLoading || trendsLoading, // Combined loading state
    error,
    handleViewModeChange,
    handleMonthChange,
    retryFetch,
    // Granular loading states for advanced usage
    monthsLoading,
    metricsLoading,
    trendsLoading,
  };
};
