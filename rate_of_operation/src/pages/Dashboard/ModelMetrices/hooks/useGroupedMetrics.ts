import { useMemo } from "react";
import { GroupByLevel } from "../components/GroupBySelector";
import { MockDataItem } from "./useRateOfOperationsMetrics";

export interface GroupedMetric {
  groupName: string;
  aimlRoMAE: number;
  plannedRoMAE: number;
  count: number;
  processOrderCount: number;
}

interface UseGroupedMetricsProps {
  data: MockDataItem[];
  groupBy: GroupByLevel;
  selectedMonth?: string;
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

export const useGroupedMetrics = ({
  data,
  groupBy,
  selectedMonth,
}: UseGroupedMetricsProps) => {
  const groupedMetrics = useMemo((): GroupedMetric[] => {
    if (!data || data.length === 0) return [];

    // Filter by selected month if provided
    let filteredData = data;
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      filteredData = data.filter((item: MockDataItem) => {
        if (!item.ACTUAL_START_DATE) return false;
        const date = new Date(item.ACTUAL_START_DATE);
        return (
          date.getFullYear() === parseInt(year) &&
          date.getMonth() + 1 === parseInt(month)
        );
      });
    }

    // Group data by the selected groupBy level
    const groupMap = new Map<
      string,
      {
        aimlErrors: number[];
        plannedErrors: number[];
        count: number;
        processOrders: Set<string>;
      }
    >();

    filteredData.forEach((item) => {
      const groupKey = getGroupKey(item, groupBy);

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          aimlErrors: [],
          plannedErrors: [],
          count: 0,
          processOrders: new Set(),
        });
      }

      const groupData = groupMap.get(groupKey)!;
      groupData.count++;
      groupData.processOrders.add(item.PROCESS_ORDER_NUMBER);

      // Add AIML_RO_ABSOLUTE_ERROR if available
      if (item.AIML_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.AIML_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) {
          groupData.aimlErrors.push(val);
        }
      }

      // Add NEW_RO_ABSOLUTE_ERROR if available
      if (item.NEW_RO_ABSOLUTE_ERROR) {
        const val = parseFloat(item.NEW_RO_ABSOLUTE_ERROR);
        if (!isNaN(val)) {
          groupData.plannedErrors.push(val);
        }
      }
    });

    // Calculate aggregated metrics
    const metrics = Array.from(groupMap.entries()).map(([groupName, groupData]) => ({
      groupName,
      aimlRoMAE:
        groupData.aimlErrors.length > 0
          ? groupData.aimlErrors.reduce((sum, val) => sum + val, 0) /
            groupData.aimlErrors.length
          : 0,
      plannedRoMAE:
        groupData.plannedErrors.length > 0
          ? groupData.plannedErrors.reduce((sum, val) => sum + val, 0) /
            groupData.plannedErrors.length
          : 0,
      count: groupData.count,
      processOrderCount: groupData.processOrders.size,
    }));

    // If more than 10 groups, show only top 10 with highest combined error values
    if (metrics.length > 10) {
      return metrics
        .sort((a, b) => {
          // Sort by combined error (average of both MAE values) in descending order
          const combinedErrorA = (a.aimlRoMAE + a.plannedRoMAE) / 2;
          const combinedErrorB = (b.aimlRoMAE + b.plannedRoMAE) / 2;
          return combinedErrorB - combinedErrorA;
        })
        .slice(0, 10)
        .sort((a, b) => {
          // After taking top 10, sort alphabetically by group name
          return a.groupName.localeCompare(b.groupName, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });
    }

    // If 10 or fewer groups, sort alphabetically by group name
    return metrics.sort((a, b) => {
      return a.groupName.localeCompare(b.groupName, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [data, groupBy, selectedMonth]);

  const totalGroupsCount = useMemo((): number => {
    if (!data || data.length === 0) return 0;

    // Filter by selected month if provided
    let filteredData = data;
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      filteredData = data.filter((item: MockDataItem) => {
        if (!item.ACTUAL_START_DATE) return false;
        const date = new Date(item.ACTUAL_START_DATE);
        return (
          date.getFullYear() === parseInt(year) &&
          date.getMonth() + 1 === parseInt(month)
        );
      });
    }

    // Count unique groups
    const uniqueGroups = new Set<string>();
    filteredData.forEach((item) => {
      const groupKey = getGroupKey(item, groupBy);
      uniqueGroups.add(groupKey);
    });

    return uniqueGroups.size;
  }, [data, groupBy, selectedMonth]);

  return {
    groupedMetrics,
    totalGroupsCount,
    isShowingTopTen: totalGroupsCount > 10,
  };
};
