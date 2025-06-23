import { useState, useEffect } from "react";
import { getWrenchtimeFilters } from "../../../../../../services/wrenchtime";

interface WrenchtimeFilterItem {
  INTERFACE: string;
  SETUP_MATRIX: string;
  LOCATION: string;
  FROM_SETUP_GROUP: string;
  TO_SETUP_GROUP: string;
  FROM_MACHINE: string;
  FROM_PRODUCT_SIZE: string;
  FROM_PRODUCT_VARIANT: string;
  TO_MACHINE: string;
  TO_PRODUCT_SIZE: string;
  TO_PRODUCT_VARIANT: string;
  [key: string]: string;
}

export const useWrenchtimeFilters = () => {
  const [filters, setFilters] = useState<WrenchtimeFilterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localFilterSelections, setLocalFilterSelections] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const response = await getWrenchtimeFilters();
        if (response && !response.error) {
          setFilters(response);
        } else {
          setError(response.error || "Failed to fetch wrenchtime filters");
        }
      } catch (err) {
        setError("An error occurred while fetching wrenchtime filters");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const updateLocalFilterSelection = (field: string, values: string[]) => {
    setLocalFilterSelections((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const resetLocalFilters = () => {
    setLocalFilterSelections({});
  };

  return {
    filters,
    loading,
    error,
    localFilterSelections,
    updateLocalFilterSelection,
    resetLocalFilters,
  };
};
