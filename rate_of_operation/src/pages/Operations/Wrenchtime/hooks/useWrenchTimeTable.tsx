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
import { IconButton, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check"; // Import Check icon
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Import DoneAll icon
import EditIcon from "@mui/icons-material/Edit";
import { PublishedWithChanges } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip
import Snackbar from "@mui/material/Snackbar"; // Import Snackbar
import Alert from "@mui/material/Alert"; // Import Alert
import { EditSetupTimeDialog } from "../components/EditSetupTimeDialog"; // Import the dialog component

const CellContent: React.FC<{
  value: any;
  index: number;
  rowData: any;
  rowIndex: number; // Add rowIndex prop
  updatedRows: Record<number, boolean>; // Add updatedRows prop
  reviewedRows: Record<number, boolean>; // Add reviewedRows prop
  setUpdatedRows: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  editingRowIndex: number | null; // Add editingRowIndex prop
  setEditingRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onRowUpdate: (rowIndex: number, newValue: any) => void; // Add onRowUpdate prop
  onRowReview: (rowIndex: number) => void; // Add onRowReview prop
  handleResetRow: (rowIndex: number) => void; // Add handleResetRow prop
}> = ({
  value,
  index,
  rowData,
  rowIndex,
  updatedRows,
  reviewedRows,
  setUpdatedRows,
  editingRowIndex,
  setEditingRowIndex,
  onRowUpdate,
  onRowReview,
  handleResetRow,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [isResolved, setIsResolved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const dropdownOptions = [
      {
        label: "AI/ML Setup Min",
        value: rowData.aiml_setup_min || "N/A",
      },
      {
        label: "Asset Group (6mo)",
        value: rowData.AssetGroup_setup_min_6mo || "N/A",
        subtext: `(N: ${rowData.AssetGroup_6mo_N || "N/A"})`,
      },
      {
        label: "Asset Group (3mo)",
        value: rowData.AssetGroup_setup_min_3mo || "N/A",
        subtext: `(N: ${rowData.AssetGroup_3mo_N || "N/A"})`,
      },
      {
        label: "Asset Size (6mo)",
        value: rowData.AssetSize_setup_min_6mo || "N/A",
        subtext: `(N: ${rowData.AssetSize_6mo_N || "N/A"})`,
      },
      {
        label: "Asset Size (3mo)",
        value: rowData.AssetSize_setup_min_3mo || "N/A",
        subtext: `(N: ${rowData.AssetSize_3mo_N || "N/A"})`,
      },
      {
        label: "Asset Variant (6mo)",
        value: rowData.AssetVar_setup_min_6mo || "N/A",
        subtext: `(N: ${rowData.AssetVar_6mo_N || "N/A"})`,
      },
      {
        label: "Asset Variant (3mo)",
        value: rowData.AssetVar_setup_min_3mo || "N/A",
        subtext: `(N: ${rowData.AssetVar_3mo_N || "N/A"})`,
      },
      {
        label: "Asset (6mo)",
        value: rowData.Asset_setup_min_6mo || "N/A",
        subtext: `(N: ${rowData.Asset_6mo_N || "N/A"})`,
      },
      {
        label: "Asset (3mo)",
        value: rowData.Asset_setup_min_3mo || "N/A",
        subtext: `(N: ${rowData.Asset_3mo_N || "N/A"})`,
      },
    ].filter((option) => option.value !== undefined && option.value !== "");

    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleToggleResolve = () => {
      setIsResolved((prev) => !prev);
    };

    const handleEditClick = () => {
      setIsEditing(true);
      setEditingRowIndex(rowIndex); // Set editing row index
    };

    const handleSaveClick = () => {
      if (/^\d*\.?\d*$/.test(editedValue)) {
        // Validate input for numbers and decimals
        setIsEditing(false);
        setEditingRowIndex(null); // Clear editing row index
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

    const handleDialogOpen = () => {
      setDialogOpen(true);
    };

    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleValueUpdate = (newValue: any) => {
      setEditedValue(newValue);
      onRowUpdate(rowIndex, newValue);
      setUpdatedRows((prev) => ({ ...prev, [rowIndex]: true }));
      handleDialogClose();
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
              index === 3 || index === 17 ? "space-between" : "flex-start",
          }}
        >
          {index === 17 ? (
            <>
              <Typography variant="body2" style={{ marginRight: "8px" }}>
                {editedValue || "N/A"}
              </Typography>
              <IconButton
                size="small"
                onClick={handleDialogOpen}
                disabled={editingRowIndex !== null && editingRowIndex !== rowIndex}
              >
                <EditIcon
                  fontSize="small"
                  sx={{ color: (theme) => theme.palette.primary.main }}
                />
              </IconButton>
            </>
          ) : (
            String(value)
          )}
          {index === 3 && (
            <IconButton
              size="small"
              onClick={() =>
                reviewedRows[rowIndex]
                  ? handleResetRow(rowIndex)
                  : onRowReview(rowIndex)
              }
            >
              {updatedRows[rowIndex] && reviewedRows[rowIndex] ? (
                <DoneAllIcon sx={{ color: "#0bdd00" }} />
              ) : !updatedRows[rowIndex] && reviewedRows[rowIndex] ? (
                <CheckIcon sx={{ color: "#0bdd00" }} />
              ) : (
                <Tooltip
                  placement="top"
                  title={
                    <>
                      Click to mark reviewed.
                      <br />
                      New Setup Min: {rowData.new_setup_min || "N/A"}
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
        </div>
        <EditSetupTimeDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleValueUpdate}
          originalValue={value}
          dropdownOptions={dropdownOptions} // Pass dropdown options
        />
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

export const useWrenchTimeTable = (
  data: any[],
  onRowUpdate: (rowIndex: number, newValue: any) => void,
  onRowReview: (rowIndex: number) => void,
  onRowReset: (rowIndex: number) => void
) => {
  const {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
  } = useColumnVisibility();
  const { searchText, handleSearchChange } = useSearch();

  // New state to track updated Tro values per row
  const [updatedRows, setUpdatedRows] = useState<Record<number, boolean>>({});
  const [reviewedRows, setReviewedRows] = useState<Record<number, boolean>>({});
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const handleResetRow = (rowIndex: number) => {
    onRowReset(rowIndex);
    setUpdatedRows((prev) => {
      const copy = { ...prev };
      delete copy[rowIndex];
      return copy;
    });
    setReviewedRows((prev) => {
      const copy = { ...prev };
      delete copy[rowIndex];
      return copy;
    });
  };

  const handleReviewRow = (rowIndex: number) => {
    onRowReview(rowIndex);
    setReviewedRows((prev) => ({ ...prev, [rowIndex]: true }));
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const keys = Object.keys(data[0] || {}).filter((k) => k !== "isUpdated");
    return keys.map((key, index) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: (info: any) => (
        <CellContent
          value={info.getValue()}
          index={index}
          rowData={info.row.original}
          rowIndex={info.row.index}
          updatedRows={updatedRows}
          reviewedRows={reviewedRows}
          setUpdatedRows={setUpdatedRows}
          editingRowIndex={editingRowIndex}
          setEditingRowIndex={setEditingRowIndex}
          onRowUpdate={onRowUpdate}
          onRowReview={handleReviewRow}
          handleResetRow={handleResetRow}
        />
      ),
      minSize: 120,
      maxSize: 1000,
      enableSorting: true,
    }));
  }, [
    data,
    updatedRows,
    reviewedRows,
    editingRowIndex,
    onRowUpdate,
    handleResetRow,
    handleReviewRow,
  ]);

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
