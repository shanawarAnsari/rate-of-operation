import { useState, useEffect, useCallback, useRef } from "react";
import { getRecipies } from "../../../../services/rate-of-operations";
import { useFilterStore } from "../../../../store/filterStore";

export const useRecipesData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [reviewedStatus, setReviewedStatus] = useState<string>("N");
  const [totalRows, setTotalRows] = useState<number>(0);

  const { filterSelections } = useFilterStore();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRecipies({
        pageNumber,
        rowsPerPage,
        reviewedStatus,
        filters: filterSelections,
      });

      if (response && response.rows) {
        setData(response.rows);
        setTotalRows(response.rowsCount || 0);
      } else {
        setData(Array.isArray(response) ? response : []);
        setTotalRows(Array.isArray(response) ? response.length : 0);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, rowsPerPage, reviewedStatus]);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchData();
    } else {
      fetchData();
    }
  }, [fetchData, pageNumber, rowsPerPage, reviewedStatus]);

  const updateData = useCallback((updatedData: any[]) => {
    setData(updatedData);
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateReviewedStatus = useCallback((status: string) => {
    setReviewedStatus(status);
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
    pageNumber,
    rowsPerPage,
    reviewedStatus,
    updateData,
    refresh,
    updateReviewedStatus,
    updateRowsPerPage,
    updatePageNumber,
  };
};
