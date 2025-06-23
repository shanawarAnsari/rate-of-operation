// This file should be deleted as it's deprecated and uses mockData
// All functionality has been moved to useWrenchtimeColumnVisibility.ts
import React, { useState, useEffect, useMemo } from "react";
import { VisibilityState } from "@tanstack/react-table";

export const useColumnVisibility = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const savedVisibility = localStorage.getItem("columnVisibility_WT");
    if (savedVisibility) {
      return JSON.parse(savedVisibility);
    }

    // Default columns if no saved state exists
    return {};
  });

  // Track available columns (passed from component)
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("columnVisibility_WT", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const visibleColumnsCount = useMemo(() => {
    return Object.values(columnVisibility).filter(Boolean).length;
  }, [columnVisibility]);

  const totalColumnsCount = useMemo(() => {
    return availableColumns.length;
  }, [availableColumns]);

  return {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
    setAvailableColumns,
  };
};
