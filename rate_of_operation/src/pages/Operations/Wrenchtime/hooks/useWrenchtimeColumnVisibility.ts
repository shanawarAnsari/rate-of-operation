import { useState, useMemo, useEffect, useCallback } from "react";
import { VisibilityState } from "@tanstack/react-table";

export const useWrenchtimeColumnVisibility = (data?: any) => {
  const columnConfig = useMemo(() => {
    const initialColumnOrder = [
      "SETUP_MATRIX",
      "FROM_SETUP_GROUP",
      "TO_SETUP_GROUP",
      "LOCATION",
      "FROM_MACHINE",
      "TO_MACHINE",
      "FROM_PRODUCT_SIZE",
      "TO_PRODUCT_SIZE",
      "FROM_PRODUCT_VARIANT",
      "TO_PRODUCT_VARIANT",
      "CURRENT_SETUPTIME_SECONDS",
      "CURRENT_SETUPTIME_MINUTES",
      "RULEBASED_SETUPTIME_MINUTES",
      "AIML_SETUPTIME_MINUTES",
      "RECOMMENDED_SETUPTIME_MINUTES",
      "NEW_SETUPTIME_MINUTES",
      "SETUPTIME_PCT_CHANGE",
      "NEW_SETUPTIME_SECONDS",
      "RECOMMENDED_SETUPTIME_MINUTES_SOURCE",
      "RULEBASED_SETUPTIME_MINUTES_SOURCE",
      "REVIEWED",
      "COMMENT",
      "BUSINESS_UNIT",
      "INTERFACE",
      "ASSET_SETUPGROUP_N_3MONTH",
      "ASSET_SETUPGROUP_ST_3MONTH",
      "ASSET_SETUPGROUP_N_6MONTH",
      "ASSET_SETUPGROUP_ST_6MONTH",
      "ASSET_SIZE_N_3MONTH",
      "ASSET_SIZE_ST_3MONTH",
      "ASSET_SIZE_N_6MONTH",
      "ASSET_SIZE_ST_6MONTH",
      "ASSET_VARIANT_N_3MONTH",
      "ASSET_VARIANT_ST_3MONTH",
      "ASSET_VARIANT_N_6MONTH",
      "ASSET_VARIANT_ST_6MONTH",
      "ASSET_N_3MONTH",
      "ASSET_ST_3MONTH",
      "ASSET_N_6MONTH",
      "ASSET_ST_6MONTH",
      "UPDATED_BY",
      "CREATED_ON",
      "UPDATED_ON",
    ];

    const initiallyHiddenColumns = [
      "BUSINESS_UNIT",
      "INTERFACE",
      "ASSET_SETUPGROUP_N_3MONTH",
      "ASSET_SETUPGROUP_ST_3MONTH",
      "ASSET_SETUPGROUP_N_6MONTH",
      "ASSET_SETUPGROUP_ST_6MONTH",
      "ASSET_SIZE_N_3MONTH",
      "ASSET_SIZE_ST_3MONTH",
      "ASSET_SIZE_N_6MONTH",
      "ASSET_SIZE_ST_6MONTH",
      "ASSET_VARIANT_N_3MONTH",
      "ASSET_VARIANT_ST_3MONTH",
      "ASSET_VARIANT_N_6MONTH",
      "ASSET_VARIANT_ST_6MONTH",
      "ASSET_N_3MONTH",
      "ASSET_ST_3MONTH",
      "ASSET_N_6MONTH",
      "ASSET_ST_6MONTH",
      "UPDATED_BY",
      "CREATED_ON",
      "UPDATED_ON",
    ];

    return {
      initialColumnOrder,
      initiallyHiddenColumns,
    };
  }, []);

  const displayableColumns = useMemo(() => columnConfig.initialColumnOrder, [columnConfig]);

  const getInitialVisibility = useCallback(() => {
    const { initiallyHiddenColumns } = columnConfig;
    const initialVisibility: VisibilityState = {};

    displayableColumns.forEach((col) => {
      initialVisibility[col] = !initiallyHiddenColumns.includes(col);
    });

    const savedVisibility = localStorage.getItem("columnVisibility_WT");
    if (savedVisibility) {
      try {
        const parsed = JSON.parse(savedVisibility);
        displayableColumns.forEach((col) => {
          if (col in parsed) {
            initialVisibility[col] = parsed[col];
          }
        });
      } catch (e) {
        console.warn("Failed to parse saved column visibility");
      }
    }

    return initialVisibility;
  }, [displayableColumns, columnConfig]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(getInitialVisibility);

  const debouncedSave = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return (visibility: VisibilityState) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem("columnVisibility_WT", JSON.stringify(visibility));
      }, 300);
    };
  }, [])();

  useEffect(() => {
    debouncedSave(columnVisibility);
  }, [columnVisibility, debouncedSave]);

  const visibleColumnsCount = useMemo(() => {
    return displayableColumns.filter((col) => columnVisibility[col] === true).length;
  }, [displayableColumns, columnVisibility]);

  const totalColumnsCount = useMemo(() => displayableColumns.length, [displayableColumns]);

  return {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
    availableColumns: displayableColumns,
    priorityColumns: ["SETUP_MATRIX", "FROM_SETUP_GROUP", "TO_SETUP_GROUP"]
  };
};

