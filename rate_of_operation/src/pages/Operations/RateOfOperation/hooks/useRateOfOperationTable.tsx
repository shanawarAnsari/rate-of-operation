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
import { IconButton } from "@mui/material";
import { PublishedWithChanges, RemoveDone } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit"; // Import the pencil icon
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Import DoneAll icon
import DoneIcon from "@mui/icons-material/Done"; // Import Done icon
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert

const CellContent: React.FC<{
  value: any;
  index: number;
  rowData: any;
  rowIndex: number; // Add rowIndex prop
  updatedRows: Record<number, boolean>; // Add updatedRows prop
  setUpdatedRows: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}> = ({ value, index, rowData, rowIndex, updatedRows, setUpdatedRows }) => {
  const [isResolved, setIsResolved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleToggleResolve = () => {
    setIsResolved((prev) => !prev);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (/^\d*\.?\d*$/.test(editedValue)) {
      // Validate input for numbers and decimals
      setIsEditing(false);
      console.log("Saved value:", editedValue);
      // Mark the row as updated (Tro value is updated)
      setUpdatedRows((prev) => ({ ...prev, [rowIndex]: true }));
    } else {
      setSnackbarOpen(true); // Show snackbar on error
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(event.target.value);
  };

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          alignItems: "center",
          justifyContent:
            index === 4 || index === 18 ? "space-between" : "flex-start",
        }}
      >
        {isEditing && index === 18 ? (
          <input
            type="text"
            value={editedValue}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "4px",
              fontSize: "0.9rem",
              border: "1px solid lightgray",
              borderRadius: "4px",
            }}
          />
        ) : (
          String(value)
        )}
        {index === 4 && (
          <IconButton size="small" onClick={handleToggleResolve}>
            {isResolved ? (
              updatedRows[rowIndex] ? (
                <DoneAllIcon sx={{ color: "#0bdd00", transition: "color 0.3s" }} />
              ) : (
                <CheckIcon sx={{ color: "#0bdd00", transition: "color 0.3s" }} />
              )
            ) : (
              <Tooltip
                placement="top"
                title={
                  <>
                    Click to mark this recipe reviewed.
                    <br />
                    New TRO: {rowData.new_tRO || "N/A"}
                  </>
                }
                arrow
              >
                <PublishedWithChanges
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    transition: "color 0.3s",
                  }}
                />
              </Tooltip>
            )}
          </IconButton>
        )}
        {index === 18 && (
          <IconButton
            size="small"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            sx={{
              borderRadius: "50%",
              padding: "4px",
              "&:hover": { backgroundColor: (theme) => theme.palette.grey[200] },
            }}
          >
            {isEditing ? (
              <DoneIcon
                sx={{
                  fontSize: "1.25rem",
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            ) : (
              <EditIcon
                sx={{
                  fontSize: "1.25rem",
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            )}
          </IconButton>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          Please enter a valid number.
        </Alert>
      </Snackbar>
    </>
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

  // New state to track updated Tro values per row
  const [updatedRows, setUpdatedRows] = useState<Record<number, boolean>>({});

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
          rowIndex={info.row.index} // Pass row index
          updatedRows={updatedRows} // Pass updated status map
          setUpdatedRows={setUpdatedRows} // Pass updater callback
        />
      ),
      minSize: 120,
      maxSize: 1000,
      enableSorting: true,
    }));
  }, [data, updatedRows]); // Include updatedRows in dependency

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
