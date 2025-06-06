import { useState, useMemo, useEffect, useCallback } from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { VisibilityState } from "@tanstack/react-table";

export const useColumnVisibility = (data?: any) => {
  // Memoize data extraction to prevent unnecessary recalculations
  const sampleData = useMemo(() => {
    if (!data) return {};

    return data?.rows && data.rows.length > 0
      ? data.rows[0]
      : Array.isArray(data) && data.length > 0
        ? data[0]
        : {};
  }, [data]);

  // Get all available columns from data with optimized memoization
  const availableColumns = useMemo(() => {
    return Object.keys(sampleData);
  }, [sampleData]);

  // Define column configurations with optimized memoization
  const columnConfig = useMemo(() => {
    const priorityColumns = ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE"];
    const hiddenColumns = ["RATE_OF_OPERATION_KEY", "SNAPSHOT_DATE"];
    const reviewedIndex = availableColumns.findIndex((col) => col === "REVIEWED");

    return {
      priorityColumns,
      hiddenColumns,
      reviewedIndex,
    };
  }, [availableColumns]);

  // Memoize initial visibility calculation to prevent recalculation
  const getInitialVisibility = useCallback(() => {
    if (availableColumns.length === 0) return {};

    // Try to load from localStorage first
    // Try to load from localStorage first
    const savedVisibility = localStorage.getItem("columnVisibility_ROO");
    if (savedVisibility) {
      try {
        const parsed = JSON.parse(savedVisibility);
        // Validate that saved columns still exist in current data
        const validSavedVisibility: VisibilityState = {};
        availableColumns.forEach((col) => {
          if (col in parsed) {
            validSavedVisibility[col] = parsed[col];
          }
        });
        return validSavedVisibility;
      } catch (e) {
        console.warn("Failed to parse saved column visibility");
      }
      try {
        const parsed = JSON.parse(savedVisibility);
        // Validate that saved columns still exist in current data
        const validSavedVisibility: VisibilityState = {};
        availableColumns.forEach((col) => {
          if (col in parsed) {
            validSavedVisibility[col] = parsed[col];
          }
        });
        return validSavedVisibility;
      } catch (e) {
        console.warn("Failed to parse saved column visibility");
      }
    }

    // Create default visibility
    // Create default visibility
    const initialVisibility: VisibilityState = {};
    const { priorityColumns, hiddenColumns, reviewedIndex } = columnConfig;
    const { priorityColumns, hiddenColumns, reviewedIndex } = columnConfig;

    availableColumns.forEach((key) => {
      availableColumns.forEach((key) => {
        if (hiddenColumns.includes(key)) {
          initialVisibility[key] = false;
        } else if (priorityColumns.includes(key)) {
        } else if (priorityColumns.includes(key)) {
          initialVisibility[key] = true;
        } else {
          const keyIndex = availableColumns.indexOf(key);
          initialVisibility[key] =
            reviewedIndex !== -1 ? keyIndex <= reviewedIndex : true;
          const keyIndex = availableColumns.indexOf(key);
          initialVisibility[key] =
            reviewedIndex !== -1 ? keyIndex <= reviewedIndex : true;
        }
      });

      return initialVisibility;
    }, [availableColumns, columnConfig]);

    // Initialize column visibility state with lazy initialization
    const [columnVisibility, setColumnVisibility] =
      useState<VisibilityState>(getInitialVisibility);

    // Debounced localStorage save to prevent excessive writes
    const debouncedSave = useCallback(
      (() => {
        let timeoutId: NodeJS.Timeout;
        return (visibility: VisibilityState) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (Object.keys(visibility).length > 0) {
              localStorage.setItem("columnVisibility_ROO", JSON.stringify(visibility));
            }
          }, 300);
        };
      })(),
      []
    );

    // Optimized update column visibility when data changes
    useEffect(() => {
      if (availableColumns.length === 0) return;

      setColumnVisibility((prev) => {
        const { priorityColumns, hiddenColumns, reviewedIndex } = columnConfig;
        const updated: VisibilityState = {};
        let hasChanges = false;

        availableColumns.forEach((key) => {
          if (key in prev) {
            updated[key] = prev[key];
          } else {
            hasChanges = true;
            if (hiddenColumns.includes(key)) {
              updated[key] = false;
            } else if (priorityColumns.includes(key)) {
              updated[key] = true;
            } else {
              const keyIndex = availableColumns.indexOf(key);
              updated[key] = reviewedIndex !== -1 ? keyIndex <= reviewedIndex : true;
            }
          }
        });
      }, [availableColumns, columnConfig]);

      // Initialize column visibility state with lazy initialization
      const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>(getInitialVisibility);

      // Debounced localStorage save to prevent excessive writes
      const debouncedSave = useCallback(
        (() => {
          let timeoutId: NodeJS.Timeout;
          return (visibility: VisibilityState) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              if (Object.keys(visibility).length > 0) {
                localStorage.setItem("columnVisibility_ROO", JSON.stringify(visibility));
              }
            }, 300);
          };
        })(),
        []
      );

      // Optimized update column visibility when data changes
      useEffect(() => {
        if (availableColumns.length === 0) return;

        setColumnVisibility((prev) => {
          const { priorityColumns, hiddenColumns, reviewedIndex } = columnConfig;
          const updated: VisibilityState = {};
          let hasChanges = false;

          availableColumns.forEach((key) => {
            if (key in prev) {
              updated[key] = prev[key];
            } else {
              hasChanges = true;
              if (hiddenColumns.includes(key)) {
                updated[key] = false;
              } else if (priorityColumns.includes(key)) {
                updated[key] = true;
              } else {
                const keyIndex = availableColumns.indexOf(key);
                updated[key] = reviewedIndex !== -1 ? keyIndex <= reviewedIndex : true;
              }
            }
          });

          return hasChanges ? updated : prev;
        });
      }, [availableColumns, columnConfig]);

      // Debounced save to localStorage
      return hasChanges ? updated : prev;
    });
  }, [availableColumns, columnConfig]);

  // Debounced save to localStorage
  useEffect(() => {
    debouncedSave(columnVisibility);
  }, [columnVisibility, debouncedSave]);

  // Get displayable columns (exclude completely hidden ones) with memoization
  const displayableColumns = useMemo(() => {
    const { hiddenColumns } = columnConfig;
    return availableColumns.filter((col) => !hiddenColumns.includes(col));
  }, [availableColumns, columnConfig]);
  debouncedSave(columnVisibility);
}, [columnVisibility, debouncedSave]);

// Get displayable columns (exclude completely hidden ones) with memoization
const displayableColumns = useMemo(() => {
  const { hiddenColumns } = columnConfig;
  return availableColumns.filter((col) => !hiddenColumns.includes(col));
}, [availableColumns, columnConfig]);

// Calculate counts with optimized memoization
// Calculate counts with optimized memoization
const visibleColumnsCount = useMemo(() => {
  return displayableColumns.filter((col) => columnVisibility[col] !== false)
    .length;
}, [displayableColumns, columnVisibility]);

return displayableColumns.filter((col) => columnVisibility[col] !== false)
  .length;
  }, [displayableColumns, columnVisibility]);

const totalColumnsCount = useMemo(() => {
  return displayableColumns.length;
}, [displayableColumns]);

// Get priority columns that cannot be hidden
const priorityColumns = useMemo(() => {
  return columnConfig.priorityColumns;
}, [columnConfig]);
return displayableColumns.length;
  }, [displayableColumns]);

// Get priority columns that cannot be hidden
const priorityColumns = useMemo(() => {
  return columnConfig.priorityColumns;
}, [columnConfig]);

return {
  columnVisibility,
  setColumnVisibility,
  visibleColumnsCount,
  totalColumnsCount,
  availableColumns: displayableColumns,
  priorityColumns,
  availableColumns: displayableColumns,
  priorityColumns,
};
};
