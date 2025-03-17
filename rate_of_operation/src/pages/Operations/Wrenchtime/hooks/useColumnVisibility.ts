import { useState, useMemo } from "react";
import { VisibilityState } from "@tanstack/react-table";
import { mockData } from "../mockData";

export const useColumnVisibility = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const keys = Object.keys(mockData[0] || {});
    const statisticalSourceIndex = keys.findIndex((key) => key === "setup_change");
    const initialVisibility: VisibilityState = {};

    keys.forEach((key, index) => {
      if (
        key.toLowerCase().includes("business") ||
        key.toLowerCase().includes("category")
      ) {
        // Remove the dropdown options for "business" and "category"
        initialVisibility[key] = false;
      } else {
        initialVisibility[key] = index <= statisticalSourceIndex;
      }
    });

    return initialVisibility;
  });

  const visibleColumnsCount = useMemo(() => {
    return Object.values(columnVisibility).filter(Boolean).length;
  }, [columnVisibility]);

  const totalColumnsCount = useMemo(() => {
    return Object.keys(mockData[0] || {}).length;
  }, []);

  return {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
  };
};
