import { useState, useMemo, useEffect, useCallback } from "react";
import { VisibilityState } from "@tanstack/react-table";

export const useColumnVisibility = (data?: any) => {
  const columnConfig = useMemo(() => {
    const selectedColumns = [
      "SAP_PRODUCT", "RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE", "PROD_DESC",
      "PRODUCT_CODE", "TRADE_CODE", "PRODUCT_VARIANT", "PRODUCT_SIZE", "CURRENT_PLANNING_TIME",
      "PLANNING_UOM", "SETUP_GROUP", "CURRENT_RO", "RULEBASED_RO", "AIML_RO", "RECOMMENDED_RO",
      "NEW_RO", "RO_PCT_CHANGE", "NEW_PLANNING_TIME", "RECOMMENDED_RO_SOURCE",
      "RULEBASED_RO_SOURCE", "REVIEWED", "ERROR_CODE", "ERROR_REPORT", "COMMENT"
    ];

    const initiallyHiddenColumns = [
      "BUSINESS_UNIT", "INTERFACE", "RECIPE_TYPE", "PROD_PER_PACKAGE", "PROD_PER_CASE", "PROD_PER_SU", "MAKER_PHASE_CHARGE_QTY_020",
      "MAKER_PHASE_OPS_QTY_020", "RECIPE_BASE_QTY", "BASE_QTY_UOM", "ASSET_SKU_N_1MONTH",
      "ASSET_SKU_RO_1MONTH", "ASSET_SKU_N_2MONTH", "ASSET_SKU_RO_2MONTH", "ASSET_SKU_N_3MONTH",
      "ASSET_SKU_RO_3MONTH", "ASSET_SKU_N_4MONTH", "ASSET_SKU_RO_4MONTH", "ASSET_SKU_N_5MONTH",
      "ASSET_SKU_RO_5MONTH", "ASSET_SKU_N_6MONTH", "ASSET_SKU_RO_6MONTH",
      "ASSET_TRADECODE_N_1MONTH", "ASSET_TRADECODE_RO_1MONTH", "ASSET_TRADECODE_N_2MONTH",
      "ASSET_TRADECODE_RO_2MONTH", "ASSET_TRADECODE_N_3MONTH", "ASSET_TRADECODE_RO_3MONTH",
      "ASSET_TRADECODE_N_4MONTH", "ASSET_TRADECODE_RO_4MONTH", "ASSET_TRADECODE_N_5MONTH",
      "ASSET_TRADECODE_RO_5MONTH", "ASSET_TRADECODE_N_6MONTH", "ASSET_TRADECODE_RO_6MONTH",
      "ASSET_PGPKCS_N_3MONTH", "ASSET_PGPKCS_RO_3MONTH", "ASSET_PGPKCS_N_6MONTH",
      "ASSET_PGPKCS_RO_6MONTH", "ASSET_PGPK_N_3MONTH", "ASSET_PGPK_RO_3MONTH",
      "ASSET_PGPK_N_6MONTH", "ASSET_PGPK_RO_6MONTH", "ASSET_PG_N_3MONTH", "ASSET_PG_RO_3MONTH",
      "ASSET_PG_N_6MONTH", "ASSET_PG_RO_6MONTH", "ASSET_N_3MONTH", "ASSET_RO_3MONTH",
      "ASSET_N_6MONTH", "ASSET_RO_6MONTH", "CONSTRAINING_RESOURCE", "CONSTRAINING_RESOURCE_2",
      "CONSTRAINING_RESOURCE_3", "CONSTRAINING_RESOURCE_COUNT", "UPDATED_BY", "CREATED_ON",
      "UPDATED_ON",
    ];

    const initialColumnOrder = [...selectedColumns, ...initiallyHiddenColumns];

    return {
      initialColumnOrder,
      initiallyHiddenColumns,
      priorityColumns: ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE", "SAP_PRODUCT"]
    };
  }, []);

  const displayableColumns = useMemo(() => columnConfig.initialColumnOrder, [columnConfig]);

  const getInitialVisibility = useCallback(() => {
    const { initiallyHiddenColumns } = columnConfig;
    const initialVisibility: VisibilityState = {};

    displayableColumns.forEach((col) => {
      initialVisibility[col] = !initiallyHiddenColumns.includes(col);
    });

    const savedVisibility = localStorage.getItem("columnVisibility_ROO");
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
    } else {
      localStorage.setItem("columnVisibility_ROO", JSON.stringify(initialVisibility));
    }

    return initialVisibility;
  }, [displayableColumns, columnConfig]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(getInitialVisibility);

  const debouncedSave = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return (visibility: VisibilityState) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem("columnVisibility_ROO", JSON.stringify(visibility));
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
    priorityColumns: columnConfig.priorityColumns
  };
};