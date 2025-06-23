import { useState, useMemo, useEffect, useCallback } from "react";
import { VisibilityState } from "@tanstack/react-table";

export const useWrenchtimeColumnVisibility = (data?: any) => {
  const sampleData = useMemo(() => {
    if (!data) return {};

    return data?.rows && data.rows.length > 0
      ? data.rows[0]
      : Array.isArray(data) && data.length > 0
      ? data[0]
      : {};
  }, [data]);

  const availableColumns = useMemo(() => {
    return Object.keys(sampleData);
  }, [sampleData]);

  const columnConfig = useMemo(() => {
    // Updated priority columns with new order
    const priorityColumns = ["FROM_SETUP_GROUP", "TO_SETUP_GROUP", "SETUP_MATRIX"];
    // Add SETUP_TIME_KEY to hidden columns
    const hiddenColumns = ["SNAPSHOT_DATE", "CREATED_ON", "SETUP_TIME_KEY"];
    const reviewedIndex = availableColumns.findIndex((col) => col === "REVIEWED");

    return {
      priorityColumns,
      hiddenColumns,
      reviewedIndex,
    };
  }, [availableColumns]);

  const getInitialVisibility = useCallback(() => {
    if (availableColumns.length === 0) return {};

    const savedVisibility = localStorage.getItem("columnVisibility_WT");
    if (savedVisibility) {
      try {
        const parsed = JSON.parse(savedVisibility);
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

    const initialVisibility: VisibilityState = {};
    const { priorityColumns, hiddenColumns, reviewedIndex } = columnConfig;

    availableColumns.forEach((key) => {
      if (hiddenColumns.includes(key)) {
        initialVisibility[key] = false;
      } else if (priorityColumns.includes(key)) {
        initialVisibility[key] = true;
      } else {
        const keyIndex = availableColumns.indexOf(key);
        initialVisibility[key] =
          reviewedIndex !== -1 ? keyIndex <= reviewedIndex : true;
      }
    });

    return initialVisibility;
  }, [availableColumns, columnConfig]);

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(getInitialVisibility);

  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (visibility: VisibilityState) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (Object.keys(visibility).length > 0) {
            localStorage.setItem("columnVisibility_WT", JSON.stringify(visibility));
          }
        }, 300);
      };
    })(),
    []
  );

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

  useEffect(() => {
    debouncedSave(columnVisibility);
  }, [columnVisibility, debouncedSave]);

  const displayableColumns = useMemo(() => {
    const { hiddenColumns } = columnConfig;
    return availableColumns.filter((col) => !hiddenColumns.includes(col));
  }, [availableColumns, columnConfig]);

  const visibleColumnsCount = useMemo(() => {
    return displayableColumns.filter((col) => columnVisibility[col] !== false)
      .length;
  }, [displayableColumns, columnVisibility]);

  const totalColumnsCount = useMemo(() => {
    return displayableColumns.length;
  }, [displayableColumns]);

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
  };
};
