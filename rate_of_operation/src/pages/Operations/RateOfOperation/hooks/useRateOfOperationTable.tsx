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
import { Tooltip, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

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
    return keys.map((key, index) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: (info: any) => {
        const value = info.getValue();
        return (
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
            }}
          >
            {String(value)}
            {index === 4 && (
              <>
                <Tooltip title="Edit Recipe Status" arrow>
                  <IconButton size="small">
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Update New TRO Value" arrow>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
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
