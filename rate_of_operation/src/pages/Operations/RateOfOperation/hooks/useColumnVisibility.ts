import { useState, useMemo, useEffect } from "react";
import { VisibilityState } from "@tanstack/react-table";
import { mockData } from "../mockData";

export const useColumnVisibility = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const savedVisibility = localStorage.getItem("columnVisibility_ROO");
    if (savedVisibility) {
      return JSON.parse(savedVisibility);
    }

    const keys = Object.keys(mockData[0] || {});
    const statisticalSourceIndex = keys.findIndex((key) => key === "tRO_Change");
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

  useEffect(() => {
    localStorage.setItem("columnVisibility_ROO", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

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
