import { useState, useEffect, useCallback, useRef } from "react";
import { getReviewedStatus } from "../../../../services/rate-of-operations";

export const useReviewedStatusData = () => {
  const [reviewedStatusOptions, setReviewedStatusOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track if the API has been called
  const hasCalledAPI = useRef(false);

  // Directly define the fetch function in the useEffect to avoid unnecessary re-renders
  useEffect(() => {
    // Only fetch if we haven't already called the API
    if (!hasCalledAPI.current) {
      hasCalledAPI.current = true;
      
      const fetchReviewedStatusOptions = async () => {
        setLoading(true);
        try {
          const response = await getReviewedStatus();
          setReviewedStatusOptions(response);
          setError(null);
        } catch (err) {
          setError("Failed to fetch reviewed status options");
          // Silent fail in UI
        } finally {
          setLoading(false);
        }
      };

      fetchReviewedStatusOptions();
    }
  }, []); // Empty dependency array ensures it only runs once on mount

  // For refetching if needed
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReviewedStatus();
      setReviewedStatusOptions(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch reviewed status options");
      // Silent fail in UI
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reviewedStatusOptions,
    loading,
    error,
    refetch
  };
};
