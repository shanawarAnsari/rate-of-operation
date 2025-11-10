import { useState, useEffect, useCallback } from "react";
import { getWrenchtimeData } from "../../../../services/wrenchtime";
import { useUserStore } from "../../../../store/userStore";
import { useWrenchtimeFilterStore } from "../../../../store/wrenchtimeFilterStore";

export const useWrenchtimeData = (searchString: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

  const { filterSelections, selectedCategory, selectedReviewedStatus } = useWrenchtimeFilterStore();
  const { isUserSynced } = useUserStore();
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getWrenchtimeData({
        pageNumber,
        rowsPerPage,
        reviewedStatus: selectedReviewedStatus,
        category: selectedCategory,
        filters: filterSelections,
      });

      if (response?.rows) {
        setData(response.rows);
        setTotalRows(
          response.totalCount || response.rowsCount || response.rows.length || 0
        );
      } else {
        const fallbackData = Array.isArray(response) ? response : [];
        setData(fallbackData);
        setTotalRows(fallbackData.length);
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch wrenchtime data");
      console.error("Failed to fetch wrenchtime data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserSynced && !searchString?.trim()) {
      fetchData();
    }
  }, [
    isUserSynced,
    pageNumber,
    rowsPerPage,
    selectedReviewedStatus,
    selectedCategory,
    filterSelections,
  ]);

  const updateData = (updatedData: any[]) => {
    setData(updatedData);
  };

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
    setPageNumber(1); // Reset to first page
  };

  const updatePageNumber = (page: number) => {
    setPageNumber(page);
  };

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