import { useState, useEffect, useCallback } from "react";
import {
  getAvailableMonths,
  getMetricCards,
  getMonthlyTrends,
} from "../../../../services/rate-of-operations";

export interface DataItem {
  RECIPE_NUMBER: string;
  PROCESS_ORDER_NUMBER: string;
  INTERFACE: string;
  PLATFORM: string;
  FACILITY: string;
  FACILITY_NAME: string;
  MACHINE: string;
  MAKER_RESOURCE: string;
  PACKER_RESOURCE: string;
  SAP_PRODUCT: string;
  PROD_DESC: string;
  ACTUAL_START_DT: string;
  ACTUAL_START_DATE: string;
  ACTUAL_TACTICAL_RO: string;
  SNAPSHOT_DATE: string;
  AIML_RO: string | null;
  RECOMMENDED_RO: string;
  NEW_RO: string;
  AIML_RO_ERROR: string | null;
  RECOMMENDED_RO_ERROR: string;
  NEW_RO_ERROR: string;
  AIML_RO_ABSOLUTE_ERROR: string | null;
  RECOMMENDED_RO_ABSOLUTE_ERROR: string;
  NEW_RO_ABSOLUTE_ERROR: string;
  BUSINESS_UNIT: string;
}

export interface ROMetrics {
  numberOfPO: number;
  aimlRoMAE: number; // AI ML RO - MAE (AIML_RO_ABSOLUTE_ERROR)
  plannedRoMAE: number; // PLANNED RO - MAE (NEW_RO_ABSOLUTE_ERROR)
  // Legacy fields for backwards compatibility
  absoluteErrorAIML?: number;
  absoluteErrorRecommended?: number;
  absoluteErrorRegression?: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  numberOfPO: number;
  aimlRoMAE: number; // AI ML RO - MAE (AIML_RO_ABSOLUTE_ERROR)
  plannedRoMAE: number; // PLANNED RO - MAE (NEW_RO_ABSOLUTE_ERROR)
  // Legacy fields for backwards compatibility
  absoluteErrorAIML?: number;
  absoluteErrorRecommended?: number;
  absoluteErrorRegression?: number;
}

export interface PlatformMetric {
  platform: string;
  aimlRoMAE: number;
  plannedRoMAE: number;
  count: number;
}

export interface MachineMetric {
  machine: string;
  aimlRoMAE: number;
  plannedRoMAE: number;
  count: number;
}

export interface RecipeError {
  recipeNumber: string;
  productDesc: string;
  aimlRoMAE: number;
  plannedRoMAE: number;
  processOrderCount: number;
}

export type ViewMode = "month" | "trends";

export const useRateOfOperationsMetrics = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // State for API data
  const [availableMonthsYears, setAvailableMonthsYears] = useState<
    Array<{
      value: string;
      label: string;
      month: number;
      year: number;
    }>
  >([]);
  const [monthMetrics, setMonthMetrics] = useState<ROMetrics>({
    numberOfPO: 0,
    aimlRoMAE: 0,
    plannedRoMAE: 0,
  });
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);

  // Fetch available months
  const fetchAvailableMonths = useCallback(async () => {
    try {
      const data = await getAvailableMonths("ROP");
      if (Array.isArray(data)) {
        setAvailableMonthsYears(data);
        // Set default selected month to the latest available
        if (data.length > 0 && !selectedMonth) {
          setSelectedMonth(data[data.length - 1].value);
        }
      }
    } catch (err) {
      console.error("Error fetching available months:", err);
      setError(err as Error);
    }
  }, [selectedMonth]);

  // Fetch metric cards data
  const fetchMetricCards = useCallback(async () => {
    if (!selectedMonth) return;

    try {
      const data = await getMetricCards("ROP", selectedMonth);
      if (data) {
        setMonthMetrics(data);
      }
    } catch (err) {
      console.error("Error fetching metric cards:", err);
      setError(err as Error);
    }
  }, [selectedMonth]);

  // Fetch monthly trends data
  const fetchMonthlyTrends = useCallback(async () => {
    try {
      const data = await getMonthlyTrends("ROP");
      if (Array.isArray(data)) {
        setMonthlyTrends(data);
      }
    } catch (err) {
      console.error("Error fetching monthly trends:", err);
      setError(err as Error);
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([fetchAvailableMonths(), fetchMonthlyTrends()]);

      // Fetch metric cards after months are loaded
      if (selectedMonth) {
        await fetchMetricCards();
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchAvailableMonths, fetchMonthlyTrends, fetchMetricCards, selectedMonth]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch metric cards when selected month changes
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
    fetchAllData();
  }, [fetchAllData]);

  return {
    viewMode,
    selectedMonth,
    availableMonthsYears,
    monthMetrics,
    monthlyTrends,
    loading,
    error,
    data: [], // Empty for now, will be removed as components are updated
    handleViewModeChange,
    handleMonthChange,
    retryFetch,
  };
};
