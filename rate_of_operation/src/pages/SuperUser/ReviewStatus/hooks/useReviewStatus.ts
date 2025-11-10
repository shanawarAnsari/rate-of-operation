import { useState, useCallback } from "react";
import { getReviewStatus } from "../../../../services/review-status";

// Define the shape of each review item
export interface ReviewItem {
  interface: string;
  category?: string;
  business_unit?: string;
  status: string;
  count: number;
}


export const useReviewStatus = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ReviewItem[]>([]);

  const getReviewedStatus = useCallback(async (type: string, groupBy: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: ReviewItem[] = await getReviewStatus(type, groupBy);
      setResult(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get count of recipes in a specific status across all results
  const getCountByStatus = useCallback((status: string): number => {
    return result
      .filter(item => item.status === status)
      .reduce((acc, item) => acc + item.count, 0);
  }, [result]);

  // Get total count of status "N" across multiple types
  const getTotalCountForStatusAcrossTypes = useCallback(
    async (types: string[], groupBy: string, status: string): Promise<number> => {
      let total = 0;
      setLoading(true);
      setError(null);
      try {
        for (const type of types) {
          const data: ReviewItem[] = await getReviewStatus(type, groupBy);
          const count = data
            .filter(item => item.status === status)
            .reduce((acc, item) => acc + item.count, 0);
          total += count;
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
      return total;
    },
    []
  );

  return {
    loading,
    error,
    result,
    getReviewedStatus,
    getCountByStatus,
    getTotalCountForStatusAcrossTypes,
  };
};
