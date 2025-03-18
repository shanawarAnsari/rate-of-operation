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
import { IconButton, Divider } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import UpdateIcon from "@mui/icons-material/Update";
import ReviewStatusDialog from "../components/ReviewStatusDialog";
import NewTROOverrideDialog from "../components/NewTROOverrideDialog";

const CellContent: React.FC<{ value: any; index: number; rowData: any }> = ({
  value,
  index,
  rowData,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTRODialogOpen, setNewTRODialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNewTRODialogOpen = () => {
    setNewTRODialogOpen(true);
    handleClose();
  };

  const handleNewTRODialogClose = () => {
    setNewTRODialogOpen(false);
  };

  return (
    <div
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center",
        justifyContent: index === 4 ? "space-between" : "flex-start",
      }}
    >
      {String(value)}
      {index === 4 && (
        <>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleDialogOpen}>
              <ChangeCircleIcon fontSize="small" sx={{ mr: 1 }} />
              TRO Sign-Off
            </MenuItem>
            <Divider sx={{ p: 0, m: 0 }} />
            <MenuItem onClick={handleNewTRODialogOpen}>
              <UpdateIcon fontSize="small" sx={{ mr: 1 }} />
              TRO Override
            </MenuItem>
          </Menu>
          <ReviewStatusDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            rowData={rowData}
          />
          <NewTROOverrideDialog
            open={newTRODialogOpen}
            onClose={handleNewTRODialogClose}
            rowData={rowData}
          />
        </>
      )}
    </div>
  );
};

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
      cell: (info: any) => (
        <CellContent
          value={info.getValue()}
          index={index}
          rowData={info.row.original}
        />
      ),
      minSize: 120,
      maxSize: 1000,
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
