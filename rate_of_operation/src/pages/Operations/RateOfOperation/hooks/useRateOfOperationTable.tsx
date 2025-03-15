import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { useColumnVisibility } from "./useColumnVisibility";
import { usePagination } from "./usePagination";
import { useSearch } from "./useSearch";
import { Tooltip } from "@mui/material";

export const useRateOfOperationTable = (data: any[]) => {
  const {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
  } = useColumnVisibility();
  const { searchText, handleSearchChange } = useSearch();

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const keys = Object.keys(data[0] || {});
    return keys.map((key) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Tooltip
            title={value !== null && value !== undefined ? String(value) : ""}
            arrow
          >
            <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {String(value)}
            </div>
          </Tooltip>
        );
      },
      minSize: key.includes("Asset") ? 90 : 110,
      enableSorting: true,
    }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
  } = usePagination(table);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    table,
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
    searchText,
    handleSearchChange,
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
    anchorEl,
    open,
    handleClick,
    handleClose,
  };
};
