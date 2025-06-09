import { useState, useEffect } from "react";
import { getFilters } from "../../../../../../services/rate-of-operations";

interface FilterItem {
  RECIPE_TYPE: string;
  MAKER_RESOURCE: string;
  PACKER_RESOURCE: string;
  PRODUCT_CODE: string;
  PROD_DESC: string;
  PRODUCT_VARIANT: string;
  PRODUCT_SIZE: string;
  SETUP_GROUP: string;
  INTERFACE: string;
  [key: string]: string;
}

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localFilterSelections, setLocalFilterSelections] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const response = await getFilters();
        if (response && !response.error) {
          setFilters(response);
        } else {
          setError(response.error || "Failed to fetch filters");
        }
      } catch (err) {
        setError("An error occurred while fetching filters");
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
