import { useState, useEffect, useCallback } from "react";
import { getRecipies } from "../../../../services/rate-of-operations";
import { useFilterStore } from "../../../../store/rateOfOperationsFilterStore";
import { useUserStore } from "../../../../store/userStore";


export const useRecipesData = (options: { enabled?: boolean } = {}) => {
  const { enabled = true } = options;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

  const { filterSelections, selectedReviewedStatus } = useFilterStore();
  const { isUserSynced } = useUserStore();

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const response = await getRecipies({
        pageNumber,
        rowsPerPage,
        reviewedStatus: selectedReviewedStatus,
        filters: filterSelections,
      });
      if (response && (response as any).rows) {
        const r = response as any;
        setData(r.rows);
        setTotalRows(r.totalCount || r.rowsCount || r.rows.length || 0);
      } else {
        const arr = Array.isArray(response) ? (response as any[]) : [];
        setData(arr);
        setTotalRows(arr.length);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    enabled,
    pageNumber,
    rowsPerPage,
    selectedReviewedStatus,
    filterSelections,
  ]);

  useEffect(() => {
    if (!isUserSynced) return;
    fetchData();
  }, [fetchData, isUserSynced, enabled]);

  const updateData = (updatedData: any[]) => {
    setData(updatedData);
  };

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData, enabled]);

  const updateReviewedStatus = useCallback((status: string) => {
  }, []);

  const updateRowsPerPage = useCallback((rows: number) => {
    setRowsPerPage(rows);
    setPageNumber(1);
  }, []);

  const updatePageNumber = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  return {
    data,
    loading,
    error,
    totalRows,
    setTotalRows,
    pageNumber,
    rowsPerPage,
    reviewedStatus: selectedReviewedStatus,
    updateData,
    refresh,
    updateReviewedStatus,
    updateRowsPerPage,
    updatePageNumber,
    fetchData
  };
};