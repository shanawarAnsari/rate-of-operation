import { useState, useEffect, useCallback, useRef } from "react";
import { getWrenchtimeData } from "../../../../services/wrenchtime";
import { useWrenchtimeFilterStore } from "../../../../store/wrenchtimeFilterStore";

export const useWrenchtimeData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);
  const { filterSelections, selectedCategory, selectedReviewedStatus } =
    useWrenchtimeFilterStore();

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const response = await getWrenchtimeData({
          pageNumber,
          rowsPerPage,
          reviewedStatus: selectedReviewedStatus,
          category: selectedCategory,
          filters: filterSelections,
          signal,
        });
        if (response && response.rows) {
          setData(response.rows);
          setTotalRows(
            response.totalCount || response.rowsCount || response.rows.length || 0
          );
        } else {
          setData(Array.isArray(response) ? response : []);
          setTotalRows(Array.isArray(response) ? response.length : 0);
        }

        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Failed to fetch wrenchtime data");
          console.error("Failed to fetch wrenchtime data:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      pageNumber,
      rowsPerPage,
      selectedReviewedStatus,
      selectedCategory,
      filterSelections,
    ]
  );

  const isInitialMount = useRef(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchData(signal);
    } else {
      fetchData(signal);
    }

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  const updateData = useCallback((updatedData: any[]) => {
    setData(updatedData);
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
    updateRowsPerPage,
    updatePageNumber,
  };
};
