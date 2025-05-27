import { useState, useMemo, useEffect } from "react";
import { VisibilityState } from "@tanstack/react-table";

export const useColumnVisibility = (data?: any) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const savedVisibility = localStorage.getItem("columnVisibility_ROO");
    if (savedVisibility) {
      return JSON.parse(savedVisibility);
    } // Use first row from data as example to build initial visibility
    const sampleData =
      data?.rows && data.rows.length > 0
        ? data.rows[0]
        : Array.isArray(data) && data.length > 0
        ? data[0]
        : {};
    const keys = Object.keys(sampleData || {});
    const reviewedIndex = keys.findIndex((key) => key === "REVIEWED");
    const initialVisibility: VisibilityState = {};

    // Define the priority columns that must be visible
    const priorityColumns = ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE"];
    // Define columns that should be hidden completely
    const hiddenColumns = ["RATE_OF_OPERATION_KEY", "SNAPSHOT_DATE"];

    keys.forEach((key) => {
      // Hide RATE_OF_OPERATION_KEY and SNAPSHOT_DATE completely
      if (hiddenColumns.includes(key)) {
        initialVisibility[key] = false;
      }
      // Show the priority columns and don't allow them to be hidden
      else if (priorityColumns.includes(key)) {
        initialVisibility[key] = true;
      }
      // Show all columns up to and including REVIEWED, hide the rest
      else {
        const keyIndex = keys.indexOf(key);
        initialVisibility[key] =
          reviewedIndex !== -1 ? keyIndex <= reviewedIndex : true;
      }
    });

    return initialVisibility;
  });

  useEffect(() => {
    localStorage.setItem("columnVisibility_ROO", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const visibleColumnsCount = useMemo(() => {
    return Object.values(columnVisibility).filter(Boolean).length;
  }, [columnVisibility]);
  const totalColumnsCount = useMemo(() => {
    const sampleData =
      data?.rows && data.rows.length > 0
        ? data.rows[0]
        : Array.isArray(data) && data.length > 0
        ? data[0]
        : {};
    return Object.keys(sampleData || {}).length;
  }, [data]);

  return {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
  };
};
