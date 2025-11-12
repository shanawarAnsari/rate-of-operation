import { useState, useCallback } from "react";
import { getModelMetricesST } from "../../../../services/rate-of-operations";

interface ModelMetricesResponse {
  [key: string]: any;
}

export const useModelMetricesST = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ModelMetricesResponse | null>(null);

  const fetchModelMetrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: ModelMetricesResponse = await getModelMetricesST();
      setResult(data);
      return data;
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching setup time model metrics:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, result, fetchModelMetrices };
};
