import { useState, useEffect, useCallback, useRef } from "react";
import { getWrenchtimeReviewedStatus } from "../../../../services/wrenchtime";

export const useReviewedStatusData = () => {
  const [reviewedStatusOptionsWrenchTime, setReviewedStatusOptionsWrenchTime] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasCalledAPI = useRef(false);
  useEffect(() => {
    if (!hasCalledAPI.current) {
      hasCalledAPI.current = true;
      const fetchWrenchTimeReviewedStatusOptions = async () => {
        setLoading(true);
        try {
          const response = await getWrenchtimeReviewedStatus();
          setReviewedStatusOptionsWrenchTime(response);
          setError(null);
        } catch (err) {
          setError("Failed to fetch reviewed status options");

        } finally {
          setLoading(false);
        }
      };
      fetchWrenchTimeReviewedStatusOptions();
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getWrenchtimeReviewedStatus();
      setReviewedStatusOptionsWrenchTime(response);
      setError(null);
    } catch (err) {
      setError("Failed to fetch reviewed status options");

    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reviewedStatusOptionsWrenchTime,
    loading,
    error,
    refetch
  };
};
