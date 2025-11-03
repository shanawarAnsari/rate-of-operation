import { useMemo } from "react";
import { GroupByLevel } from "../components/GroupBySelector";
import { MockDataItem } from "./useRateOfOperationsMetrics";

export interface TrendDataPoint {
  month: string;
  year: number;
  aimlRoMAE: number;
  plannedRoMAE: number;
  processOrderCount: number;
  count: number;
}

export interface GroupedTrendMetric {
  groupName: string;
  trendData: TrendDataPoint[];
}

interface UseTrendsGroupedMetricsProps {
  data: MockDataItem[];
  groupBy: GroupByLevel;
}

const getGroupKey = (item: MockDataItem, groupBy: GroupByLevel): string => {
  switch (groupBy) {
    case "INTERFACE":
      return item.INTERFACE || "Unknown";
    case "FACILITY_NAME":
      return item.FACILITY_NAME || "Unknown";
    case "MACHINE":
      return item.MACHINE || "Unknown";
    case "PACKER_RESOURCE":
      return item.PACKER_RESOURCE || "Unknown";
    case "PLATFORM_NAME":
      return item.PLATFORM || "Unknown";
    case "RECIPE_NUMBER":
      return item.RECIPE_NUMBER || "Unknown";
    case "PROCESS_ORDER_NUMBER":
      return item.PROCESS_ORDER_NUMBER || "Unknown";
    default:
      return "Unknown";
  }
};

export const useTrendsGroupedMetrics = ({
  data,
  groupBy,
}: UseTrendsGroupedMetricsProps) => {
  const groupedTrendsMetrics = useMemo((): GroupedTrendMetric[] => {
    if (!data || data.length === 0) return [];

    // First, group by group key, then by month
    const groupMap = new Map<
      string,
      Map<
        string,
        {
          month: string;
          year: number;
          aimlErrors: number[];
          plannedErrors: number[];
          count: number;
          processOrders: Set<string>;
        }
      >
    >();

    data.forEach((item) => {
      if (!item.ACTUAL_START_DATE) return;

      const groupKey = getGroupKey(item, groupBy);
      const date = new Date(item.ACTUAL_START_DATE);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "long" });
      const year = date.getFullYear();

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, new Map());
      }

      const monthsMap = groupMap.get(groupKey)!;
      if (!monthsMap.has(monthYear)) {
        monthsMap.set(monthYear, {
          month: monthName,
          year: year,
          aimlErrors: [],
          plannedErrors: [],
          count: 0,
          processOrders: new Set(),
        });
      }

      const monthData = monthsMap.get(monthYear)!;
      monthData.count++;
      monthData.processOrders.add(item.PROCESS_ORDER_NUMBER);

      if (item.AIML_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.AIML_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) {
          monthData.aimlErrors.push(val);
        }
      }

      if (item.NEW_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.NEW_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) {
          monthData.plannedErrors.push(val);
        }
      }
    });

    // Convert to GroupedTrendMetric array
    const groupedTrends = Array.from(groupMap.entries()).map(
      ([groupName, monthsMap]) => {
        const trendData = Array.from(monthsMap.entries())
          .map(([monthYear, data]) => ({
            month: data.month,
            year: data.year,
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
            count: data.count,
          }))
          .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return (
              new Date(`${a.month} 1, ${a.year}`).getMonth() -
              new Date(`${b.month} 1, ${b.year}`).getMonth()
            );
          });

        return {
          groupName,
          trendData,
        };
      }
    );

    // Calculate average combined error for each group to determine top performers
    const groupsWithAvgError = groupedTrends.map((group) => {
      const avgCombinedError =
        group.trendData.reduce(
          (sum, point) => sum + (point.aimlRoMAE + point.plannedRoMAE) / 2,
          0
        ) / group.trendData.length;

      return {
        ...group,
        avgCombinedError,
      };
    });

    // If more than 6 groups, show only top 6 with highest average errors
    if (groupsWithAvgError.length > 6) {
      return groupsWithAvgError
        .sort((a, b) => b.avgCombinedError - a.avgCombinedError)
        .slice(0, 6)
        .sort((a, b) =>
          a.groupName.localeCompare(b.groupName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        )
        .map(({ groupName, trendData }) => ({ groupName, trendData }));
    }

    // Sort alphabetically by group name
    return groupsWithAvgError
      .sort((a, b) =>
        a.groupName.localeCompare(b.groupName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      )
      .map(({ groupName, trendData }) => ({ groupName, trendData }));
  }, [data, groupBy]);

  const totalGroupsCount = useMemo((): number => {
    if (!data || data.length === 0) return 0;

    const uniqueGroups = new Set<string>();
    data.forEach((item) => {
      const groupKey = getGroupKey(item, groupBy);
      uniqueGroups.add(groupKey);
    });

    return uniqueGroups.size;
  }, [data, groupBy]);

  return {
    groupedTrendsMetrics,
    totalGroupsCount,
    isShowingTopTen: totalGroupsCount > 6,
  };
};
