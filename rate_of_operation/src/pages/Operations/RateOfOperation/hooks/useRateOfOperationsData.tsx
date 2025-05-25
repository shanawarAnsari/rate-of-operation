import { useState, useEffect, useCallback } from "react";
import {
  getRecipies,
  getReviewedStatus,
} from "../../../../services/rate-of-operations";
import {
  recipies,
  reviewedStatus as mockReviewedStatus,
} from "../../../../services/responses";

export const useRateOfOperationsData = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [reviewedStatus, setReviewedStatus] = useState<string>("N");
  const [totalRows, setTotalRows] = useState<number>(0);
  const [reviewedStatusOptions, setReviewedStatusOptions] = useState<any[]>([]);

  const fetchReviewedStatusOptions = useCallback(async () => {
    try {
      // In a real environment, this would call the actual API
      // const response = await getReviewedStatus();

      // For development, use our mock data from responses.js
      const response = mockReviewedStatus;
      setReviewedStatusOptions(response);
    } catch (err) {
      console.error("Failed to fetch reviewed status options:", err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // In a real environment, this would call the actual API
      // const response = await getRecipies({
      //   pageNumber,
      //   rowsPerPage,
      //   reviewedStatus
      // });

      // For development, use our mock data from responses.js
      // In a real implementation, we would slice the data based on pagination params
      const response = recipies;

      // Mock pagination (in real implementation, this would come from the API)
      const startIndex = (pageNumber - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedRows = response.rows.slice(startIndex, endIndex);

      setData(paginatedRows);
      setTotalRows(response.rowsCount);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, rowsPerPage, reviewedStatus]);

  useEffect(() => {
    fetchData();
    fetchReviewedStatusOptions();
  }, [fetchData, fetchReviewedStatusOptions]);

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
    setPageNumber(1); // Reset to first page when changing rows per page
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
    reviewedStatusOptions,
    updateData,
    refresh,
    updateReviewedStatus,
    updateRowsPerPage,
    updatePageNumber,
  };
};
