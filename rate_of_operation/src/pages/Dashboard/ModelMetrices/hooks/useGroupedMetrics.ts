import { useState, useEffect, useCallback } from "react";
import { GroupByLevel } from "../components/GroupBySelector";
import { getGroupedMetrics } from "../../../../services/rate-of-operations";

export interface GroupedMetric {
  groupName: string;
  aimlRoMAE: number;
  plannedRoMAE: number;
  count: number;
  processOrderCount: number;
}

interface UseGroupedMetricsProps {
  groupBy: GroupByLevel;
  selectedMonth?: string;
  selectedGroups?: string[];
  modelType?: "ROP" | "ST";
}

export const useGroupedMetrics = ({
  groupBy,
  selectedMonth,
  selectedGroups,
  modelType = "ROP",
}: UseGroupedMetricsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [groupedMetrics, setGroupedMetrics] = useState<GroupedMetric[]>([]);
  const [allAvailableGroups, setAllAvailableGroups] = useState<string[]>([]);
  const [totalGroupsCount, setTotalGroupsCount] = useState<number>(0);

  const fetchGroupedMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getGroupedMetrics({
        modelType,
        groupBy,
        selectedMonth,
        selectedGroups,
      });

      if (response && response.groupedMetrics) {
        setGroupedMetrics(response.groupedMetrics);
        setAllAvailableGroups(response.allAvailableGroups || []);
        setTotalGroupsCount(response.totalGroupsCount || 0);
      }
    } catch (err) {
      console.error("Error fetching grouped metrics:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [groupBy, selectedMonth, selectedGroups, modelType]);

  useEffect(() => {
    fetchGroupedMetrics();
  }, [fetchGroupedMetrics]);

  const retryFetch = useCallback(() => {
    fetchGroupedMetrics();
  }, [fetchGroupedMetrics]);

  return {
    groupedMetrics,
    totalGroupsCount,
    allAvailableGroups,
    isShowingTopTen: totalGroupsCount > 10,
    loading,
    error,
    retryFetch,
  };
};
