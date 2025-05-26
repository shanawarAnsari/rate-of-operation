import { useState, useEffect, useCallback } from "react";
import {
    getRecipies,
    getReviewedStatus,
} from "../../../../services/rate-of-operations";

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

            const response = await getReviewedStatus();
            setReviewedStatusOptions(response);
        } catch (err) {
            console.error("Failed to fetch reviewed status options:", err);
        }
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {

            const response = await getRecipies({
                pageNumber,
                rowsPerPage,
                reviewedStatus
            });
            setData(response?.rows);
            setTotalRows(response?.rowsCount);
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