import { useState, useEffect, useCallback, useMemo } from "react";
import { mockData } from "../mockdata.js";

export interface MockDataItem {
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
}

export interface ROMetrics {
  numberOfPO: number;
  absoluteErrorAIML: number;
  absoluteErrorRecommended: number;
  absoluteErrorRegression: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  numberOfPO: number;
  absoluteErrorAIML: number;
  absoluteErrorRecommended: number;
  absoluteErrorRegression: number;
}

export type ViewMode = "month" | "trends";

export const useRateOfOperationsMetrics = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);

  // Cast mockData to proper type
  const typedMockData = mockData as MockDataItem[];

  // Process mock data to get available months and years
  const availableMonthsYears = useMemo(() => {
    const monthsYears = new Set<string>();

    typedMockData.forEach((item: MockDataItem) => {
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
  }, [typedMockData]);

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
        absoluteErrorAIML: 0,
        absoluteErrorRecommended: 0,
        absoluteErrorRegression: 0,
      };

    const [year, month] = selectedMonth.split("-");
    const filteredData = typedMockData.filter((item: MockDataItem) => {
      if (!item.ACTUAL_START_DATE) return false;
      const date = new Date(item.ACTUAL_START_DATE);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });

    const numberOfPO = new Set(
      filteredData.map((item: MockDataItem) => item.PROCESS_ORDER_NUMBER)
    ).size;

    // Calculate average AIML_RO_ABSOLUTE_ERROR (excluding null values)
    const aimlErrors = filteredData
      .filter(
        (item: MockDataItem) =>
          item.AIML_RO_ABSOLUTE_ERROR !== null &&
          item.AIML_RO_ABSOLUTE_ERROR !== undefined
      )
      .map((item: MockDataItem) => parseFloat(item.AIML_RO_ABSOLUTE_ERROR!))
      .filter((val: number) => !isNaN(val));
    const absoluteErrorAIML =
      aimlErrors.length > 0
        ? aimlErrors.reduce((sum: number, val: number) => sum + val, 0) /
          aimlErrors.length
        : 0;

    // Calculate average RECOMMENDED_RO_ABSOLUTE_ERROR
    const recommendedErrors = filteredData
      .filter(
        (item: MockDataItem) =>
          item.RECOMMENDED_RO_ABSOLUTE_ERROR !== null &&
          item.RECOMMENDED_RO_ABSOLUTE_ERROR !== undefined
      )
      .map((item: MockDataItem) => parseFloat(item.RECOMMENDED_RO_ABSOLUTE_ERROR!))
      .filter((val: number) => !isNaN(val));
    const absoluteErrorRecommended =
      recommendedErrors.length > 0
        ? recommendedErrors.reduce((sum: number, val: number) => sum + val, 0) /
          recommendedErrors.length
        : 0;

    // Calculate average NEW_RO_ABSOLUTE_ERROR
    const regressionErrors = filteredData
      .filter(
        (item: MockDataItem) =>
          item.NEW_RO_ABSOLUTE_ERROR !== null &&
          item.NEW_RO_ABSOLUTE_ERROR !== undefined
      )
      .map((item: MockDataItem) => parseFloat(item.NEW_RO_ABSOLUTE_ERROR!))
      .filter((val: number) => !isNaN(val));
    const absoluteErrorRegression =
      regressionErrors.length > 0
        ? regressionErrors.reduce((sum: number, val: number) => sum + val, 0) /
          regressionErrors.length
        : 0;

    return {
      numberOfPO,
      absoluteErrorAIML: Number(absoluteErrorAIML.toFixed(4)),
      absoluteErrorRecommended: Number(absoluteErrorRecommended.toFixed(4)),
      absoluteErrorRegression: Number(absoluteErrorRegression.toFixed(4)),
    };
  }, [selectedMonth, typedMockData]);

  // Calculate monthly trends
  const monthlyTrends = useMemo((): MonthlyTrend[] => {
    const trendsMap = new Map<
      string,
      {
        month: string;
        year: number;
        data: MockDataItem[];
      }
    >();

    // Group data by month-year
    typedMockData.forEach((item: MockDataItem) => {
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
          group.data.map((item: MockDataItem) => item.PROCESS_ORDER_NUMBER)
        ).size;

        // Calculate AIML_RO_ABSOLUTE_ERROR
        const aimlErrors = group.data
          .filter(
            (item: MockDataItem) =>
              item.AIML_RO_ABSOLUTE_ERROR !== null &&
              item.AIML_RO_ABSOLUTE_ERROR !== undefined
          )
          .map((item: MockDataItem) => parseFloat(item.AIML_RO_ABSOLUTE_ERROR!))
          .filter((val: number) => !isNaN(val));
        const absoluteErrorAIML =
          aimlErrors.length > 0
            ? aimlErrors.reduce((sum: number, val: number) => sum + val, 0) /
              aimlErrors.length
            : 0;

        // Calculate RECOMMENDED_RO_ABSOLUTE_ERROR
        const recommendedErrors = group.data
          .filter(
            (item: MockDataItem) =>
              item.RECOMMENDED_RO_ABSOLUTE_ERROR !== null &&
              item.RECOMMENDED_RO_ABSOLUTE_ERROR !== undefined
          )
          .map((item: MockDataItem) =>
            parseFloat(item.RECOMMENDED_RO_ABSOLUTE_ERROR!)
          )
          .filter((val: number) => !isNaN(val));
        const absoluteErrorRecommended =
          recommendedErrors.length > 0
            ? recommendedErrors.reduce((sum: number, val: number) => sum + val, 0) /
              recommendedErrors.length
            : 0;

        // Calculate NEW_RO_ABSOLUTE_ERROR
        const regressionErrors = group.data
          .filter(
            (item: MockDataItem) =>
              item.NEW_RO_ABSOLUTE_ERROR !== null &&
              item.NEW_RO_ABSOLUTE_ERROR !== undefined
          )
          .map((item: MockDataItem) => parseFloat(item.NEW_RO_ABSOLUTE_ERROR!))
          .filter((val: number) => !isNaN(val));
        const absoluteErrorRegression =
          regressionErrors.length > 0
            ? regressionErrors.reduce((sum: number, val: number) => sum + val, 0) /
              regressionErrors.length
            : 0;

        return {
          month: group.month,
          year: group.year,
          numberOfPO,
          absoluteErrorAIML: Number(absoluteErrorAIML.toFixed(4)),
          absoluteErrorRecommended: Number(absoluteErrorRecommended.toFixed(4)),
          absoluteErrorRegression: Number(absoluteErrorRegression.toFixed(4)),
        };
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return (
          new Date(`${a.month} 1, ${a.year}`).getMonth() -
          new Date(`${b.month} 1, ${b.year}`).getMonth()
        );
      });
  }, [typedMockData]);

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
    loading,
    handleViewModeChange,
    handleMonthChange,
  };
};
