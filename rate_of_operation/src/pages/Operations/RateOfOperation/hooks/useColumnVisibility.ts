import { useState, useMemo, useEffect } from "react";
import { VisibilityState } from "@tanstack/react-table";
import { recipies } from "../../../../services/responses";

export const useColumnVisibility = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const savedVisibility = localStorage.getItem("columnVisibility_ROO");
    if (savedVisibility) {
      return JSON.parse(savedVisibility);
    } // Use first row from recipies as example to build initial visibility
    const sampleData =
      recipies.rows && recipies.rows.length > 0 ? recipies.rows[0] : {};
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
    return Object.keys(recipies.rows[0] || {}).length;
  }, []);

  return {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
  };
};
