import { useState, useEffect, useCallback, useMemo } from "react";
import { useModelMetricesROP } from "./useModelMetricesROP";

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
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const { loading: modelDataLoading, error, result, fetchModelMetrices } = useModelMetricesROP();

  useEffect(() => {
    fetchModelMetrices()
  }, [])

  debugger;
  const data = result as DataItem[];

  // Process mock data to get available months and years
  const availableMonthsYears = useMemo(() => {
    const monthsYears = new Set<string>();

    data?.forEach((item: DataItem) => {
      if (item.ACTUAL_START_DATE) {
        const date = new Date(item.ACTUAL_START_DATE);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        monthsYears.add(monthYear);
      }
    });

    return Array.from(monthsYears)
      .sort()
      .map((monthYear) => {
        const [year, month] = monthYear.split("-");
        const monthName = new Date(
          parseInt(year),
          parseInt(month) - 1
        ).toLocaleDateString("en-US", { month: "long" });
        return {
          value: monthYear,
          label: `${monthName} ${year}`,
          month: parseInt(month),
          year: parseInt(year),
        };
      });
  }, [data]);

  // Set default selected month to the latest available
  useEffect(() => {
    if (availableMonthsYears.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonthsYears[availableMonthsYears.length - 1].value);
    }
  }, [availableMonthsYears, selectedMonth]);

  // Calculate metrics for selected month
  const monthMetrics = useMemo((): ROMetrics => {
    if (!selectedMonth)
      return {
        numberOfPO: 0,
        aimlRoMAE: 0,
        plannedRoMAE: 0,
        absoluteErrorAIML: 0,
        absoluteErrorRecommended: 0,
        absoluteErrorRegression: 0,
      };

    const [year, month] = selectedMonth.split("-");
    const filteredData = data.filter((item: DataItem) => {
      if (!item.ACTUAL_START_DATE) return false;
      const date = new Date(item.ACTUAL_START_DATE);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });

    const numberOfPO = new Set(
      filteredData.map((item: DataItem) => item.PROCESS_ORDER_NUMBER)
    ).size;

    // Calculate average AIML_RO_ABSOLUTE_ERROR (AI ML RO - MAE)
    const aimlErrors = filteredData
      .filter(
        (item: DataItem) =>
          item.AIML_RO_ABSOLUTE_ERROR !== null &&
          item.AIML_RO_ABSOLUTE_ERROR !== undefined
      )
      .map((item: DataItem) => parseFloat(item.AIML_RO_ABSOLUTE_ERROR!))
      .filter((val: number) => !isNaN(val));
    const aimlRoMAE =
      aimlErrors.length > 0
        ? aimlErrors.reduce((sum: number, val: number) => sum + val, 0) /
        aimlErrors.length
        : 0;

    // Calculate average NEW_RO_ABSOLUTE_ERROR (PLANNED RO - MAE)
    const plannedErrors = filteredData
      .filter(
        (item: DataItem) =>
          item.NEW_RO_ABSOLUTE_ERROR !== null &&
          item.NEW_RO_ABSOLUTE_ERROR !== undefined
      )
      .map((item: DataItem) => parseFloat(item.NEW_RO_ABSOLUTE_ERROR!))
      .filter((val: number) => !isNaN(val));
    const plannedRoMAE =
      plannedErrors.length > 0
        ? plannedErrors.reduce((sum: number, val: number) => sum + val, 0) /
        plannedErrors.length
        : 0;

    return {
      numberOfPO,
      aimlRoMAE: Number(aimlRoMAE.toFixed(4)),
      plannedRoMAE: Number(plannedRoMAE.toFixed(4)),
      // Legacy fields for backwards compatibility
      absoluteErrorAIML: Number(aimlRoMAE.toFixed(4)),
      absoluteErrorRecommended: 0, // No longer used
      absoluteErrorRegression: Number(plannedRoMAE.toFixed(4)),
    };
  }, [selectedMonth, data]);

  // Calculate monthly trends
  const monthlyTrends = useMemo((): MonthlyTrend[] => {
    const trendsMap = new Map<
      string,
      {
        month: string;
        year: number;
        data: DataItem[];
      }
    >();

    // Group data by month-year
    data?.forEach((item: DataItem) => {
      if (!item.ACTUAL_START_DATE) return;

      const date = new Date(item.ACTUAL_START_DATE);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "long" });

      if (!trendsMap.has(monthYear)) {
        trendsMap.set(monthYear, {
          month: monthName,
          year: date.getFullYear(),
          data: [],
        });
      }

      trendsMap.get(monthYear)!.data.push(item);
    });

    // Calculate metrics for each month
    return Array.from(trendsMap.entries())
      .map(([monthYear, group]) => {
        const numberOfPO = new Set(
          group.data.map((item: DataItem) => item.PROCESS_ORDER_NUMBER)
        ).size;

        // Calculate AIML_RO_ABSOLUTE_ERROR (AI ML RO - MAE)
        const aimlErrors = group.data
          .filter(
            (item: DataItem) =>
              item.AIML_RO_ABSOLUTE_ERROR !== null &&
              item.AIML_RO_ABSOLUTE_ERROR !== undefined
          )
          .map((item: DataItem) => parseFloat(item.AIML_RO_ABSOLUTE_ERROR!))
          .filter((val: number) => !isNaN(val));
        const aimlRoMAE =
          aimlErrors.length > 0
            ? aimlErrors.reduce((sum: number, val: number) => sum + val, 0) /
            aimlErrors.length
            : 0;

        // Calculate NEW_RO_ABSOLUTE_ERROR (PLANNED RO - MAE)
        const plannedErrors = group.data
          .filter(
            (item: DataItem) =>
              item.NEW_RO_ABSOLUTE_ERROR !== null &&
              item.NEW_RO_ABSOLUTE_ERROR !== undefined
          )
          .map((item: DataItem) => parseFloat(item.NEW_RO_ABSOLUTE_ERROR!))
          .filter((val: number) => !isNaN(val));
        const plannedRoMAE =
          plannedErrors.length > 0
            ? plannedErrors.reduce((sum: number, val: number) => sum + val, 0) /
            plannedErrors.length
            : 0;

        return {
          month: group.month,
          year: group.year,
          numberOfPO,
          aimlRoMAE: Number(aimlRoMAE.toFixed(4)),
          plannedRoMAE: Number(plannedRoMAE.toFixed(4)),
          // Legacy fields for backwards compatibility
          absoluteErrorAIML: Number(aimlRoMAE.toFixed(4)),
          absoluteErrorRecommended: 0,
          absoluteErrorRegression: Number(plannedRoMAE.toFixed(4)),
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return (
          new Date(`${a.month} 1, ${a.year}`).getMonth() -
          new Date(`${b.month} 1, ${b.year}`).getMonth()
        );
      });
  }, [data]);

  // Calculate platform metrics for selected month
  const platformMetrics = useMemo((): PlatformMetric[] => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split("-");
    const filteredData = data.filter((item: DataItem) => {
      if (!item.ACTUAL_START_DATE) return false;
      const date = new Date(item.ACTUAL_START_DATE);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });

    const platformMap = new Map<
      string,
      { aimlErrors: number[]; plannedErrors: number[]; count: number }
    >();

    filteredData.forEach((item) => {
      const platform = item.PLATFORM || "Unknown";
      if (!platformMap.has(platform)) {
        platformMap.set(platform, { aimlErrors: [], plannedErrors: [], count: 0 });
      }

      const data = platformMap.get(platform)!;
      data.count++;

      if (item.AIML_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.AIML_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.aimlErrors.push(val);
      }

      if (item.NEW_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.NEW_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.plannedErrors.push(val);
      }
    });

    return Array.from(platformMap.entries())
      .map(([platform, data]) => ({
        platform,
        aimlRoMAE:
          data.aimlErrors.length > 0
            ? data.aimlErrors.reduce((sum, val) => sum + val, 0) /
            data.aimlErrors.length
            : 0,
        plannedRoMAE:
          data.plannedErrors.length > 0
            ? data.plannedErrors.reduce((sum, val) => sum + val, 0) /
            data.plannedErrors.length
            : 0,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedMonth, data]);

  // Calculate machine metrics for selected month
  const machineMetrics = useMemo((): MachineMetric[] => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split("-");
    const filteredData = data.filter((item: DataItem) => {
      if (!item.ACTUAL_START_DATE) return false;
      const date = new Date(item.ACTUAL_START_DATE);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });

    const machineMap = new Map<
      string,
      { aimlErrors: number[]; plannedErrors: number[]; count: number }
    >();

    filteredData.forEach((item) => {
      const machine = item.MACHINE || "Unknown";
      if (!machineMap.has(machine)) {
        machineMap.set(machine, { aimlErrors: [], plannedErrors: [], count: 0 });
      }

      const data = machineMap.get(machine)!;
      data.count++;

      if (item.AIML_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.AIML_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.aimlErrors.push(val);
      }

      if (item.NEW_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.NEW_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.plannedErrors.push(val);
      }
    });

    return Array.from(machineMap.entries())
      .map(([machine, data]) => ({
        machine,
        aimlRoMAE:
          data.aimlErrors.length > 0
            ? data.aimlErrors.reduce((sum, val) => sum + val, 0) /
            data.aimlErrors.length
            : 0,
        plannedRoMAE:
          data.plannedErrors.length > 0
            ? data.plannedErrors.reduce((sum, val) => sum + val, 0) /
            data.plannedErrors.length
            : 0,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [selectedMonth, data]);

  // Calculate top recipes with highest errors for selected month
  const topRecipesAIML = useMemo((): RecipeError[] => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split("-");
    const filteredData = data.filter((item: DataItem) => {
      if (!item.ACTUAL_START_DATE) return false;
      const date = new Date(item.ACTUAL_START_DATE);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });

    const recipeMap = new Map<
      string,
      {
        productDesc: string;
        aimlErrors: number[];
        plannedErrors: number[];
        processOrders: Set<string>;
      }
    >();

    filteredData.forEach((item) => {
      const recipe = item.RECIPE_NUMBER || "Unknown";
      if (!recipeMap.has(recipe)) {
        recipeMap.set(recipe, {
          productDesc: item.PROD_DESC || "Unknown",
          aimlErrors: [],
          plannedErrors: [],
          processOrders: new Set(),
        });
      }

      const data = recipeMap.get(recipe)!;
      data.processOrders.add(item.PROCESS_ORDER_NUMBER);

      if (item.AIML_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.AIML_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.aimlErrors.push(val);
      }

      if (item.NEW_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.NEW_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.plannedErrors.push(val);
      }
    });

    return Array.from(recipeMap.entries())
      .map(([recipeNumber, data]) => ({
        recipeNumber,
        productDesc: data.productDesc,
        aimlRoMAE:
          data.aimlErrors.length > 0
            ? data.aimlErrors.reduce((sum, val) => sum + val, 0) /
            data.aimlErrors.length
            : 0,
        plannedRoMAE:
          data.plannedErrors.length > 0
            ? data.plannedErrors.reduce((sum, val) => sum + val, 0) /
            data.plannedErrors.length
            : 0,
        processOrderCount: data.processOrders.size,
      }))
      .sort((a, b) => b.aimlRoMAE - a.aimlRoMAE)
      .slice(0, 10);
  }, [selectedMonth, data]);

  const topRecipesPlanned = useMemo((): RecipeError[] => {
    if (!selectedMonth) return [];

    const [year, month] = selectedMonth.split("-");
    const filteredData = data.filter((item: DataItem) => {
      if (!item.ACTUAL_START_DATE) return false;
      const date = new Date(item.ACTUAL_START_DATE);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });

    const recipeMap = new Map<
      string,
      {
        productDesc: string;
        aimlErrors: number[];
        plannedErrors: number[];
        processOrders: Set<string>;
      }
    >();

    filteredData.forEach((item) => {
      const recipe = item.RECIPE_NUMBER || "Unknown";
      if (!recipeMap.has(recipe)) {
        recipeMap.set(recipe, {
          productDesc: item.PROD_DESC || "Unknown",
          aimlErrors: [],
          plannedErrors: [],
          processOrders: new Set(),
        });
      }

      const data = recipeMap.get(recipe)!;
      data.processOrders.add(item.PROCESS_ORDER_NUMBER);

      if (item.AIML_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.AIML_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.aimlErrors.push(val);
      }

      if (item.NEW_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.NEW_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) data.plannedErrors.push(val);
      }
    });

    return Array.from(recipeMap.entries())
      .map(([recipeNumber, data]) => ({
        recipeNumber,
        productDesc: data.productDesc,
        aimlRoMAE:
          data.aimlErrors.length > 0
            ? data.aimlErrors.reduce((sum, val) => sum + val, 0) /
            data.aimlErrors.length
            : 0,
        plannedRoMAE:
          data.plannedErrors.length > 0
            ? data.plannedErrors.reduce((sum, val) => sum + val, 0) /
            data.plannedErrors.length
            : 0,
        processOrderCount: data.processOrders.size,
      }))
      .sort((a, b) => b.plannedRoMAE - a.plannedRoMAE)
      .slice(0, 10);
  }, [selectedMonth, data]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  return {
    viewMode,
    selectedMonth,
    availableMonthsYears,
    monthMetrics,
    monthlyTrends,
    platformMetrics,
    machineMetrics,
    topRecipesAIML,
    topRecipesPlanned,
    loading,
    data,
    handleViewModeChange,
    handleMonthChange,
  };
};