import { useState, useEffect, useCallback } from "react";
import { GroupByLevel } from "../components/GroupBySelector";
import { getTrendsGroupedMetrics } from "../../../../services/rate-of-operations";

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
  groupBy: GroupByLevel;
  selectedGroups?: string[];
  modelType?: "ROP" | "ST";
}

export const useTrendsGroupedMetrics = ({
  groupBy,
  selectedGroups,
  modelType = "ROP",
}: UseTrendsGroupedMetricsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [groupedTrendsMetrics, setGroupedTrendsMetrics] = useState<
    GroupedTrendMetric[]
  >([]);
  const [allAvailableGroups, setAllAvailableGroups] = useState<string[]>([]);
  const [totalGroupsCount, setTotalGroupsCount] = useState<number>(0);

  const fetchTrendsGroupedMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getTrendsGroupedMetrics({
        modelType,
        groupBy,
        selectedGroups,
      });

      if (response && response.groupedTrendsMetrics) {
        setGroupedTrendsMetrics(response.groupedTrendsMetrics);
        setAllAvailableGroups(response.allAvailableGroups || []);
        setTotalGroupsCount(response.totalGroupsCount || 0);
      }
    } catch (err) {
      console.error("Error fetching trends grouped metrics:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [groupBy, selectedGroups, modelType]);

  useEffect(() => {
    fetchTrendsGroupedMetrics();
  }, [fetchTrendsGroupedMetrics]);

  const retryFetch = useCallback(() => {
    fetchTrendsGroupedMetrics();
  }, [fetchTrendsGroupedMetrics]);

  return {
    groupedTrendsMetrics,
    totalGroupsCount,
    allAvailableGroups,
    isShowingTopTwo: !selectedGroups || selectedGroups.length === 0,
    loading,
    error,
    retryFetch,
  };
};
