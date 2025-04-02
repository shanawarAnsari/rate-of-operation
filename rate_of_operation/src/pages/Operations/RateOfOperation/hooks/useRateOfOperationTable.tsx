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
import { IconButton, Typography, useTheme } from "@mui/material";
import { PublishedWithChanges } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit"; // Import the pencil icon
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Import DoneAll icon
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip
import { EditTROValueDialog } from "../components/EditTROValueDialog"; // Import the dialog component

const CellContent: React.FC<{
  value: any;
  index: number;
  rowData: any;
  rowIndex: number;
  updatedRows: Record<number, boolean>;
  setUpdatedRows: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}> = ({ value, index, rowData, rowIndex, updatedRows, setUpdatedRows }) => {
  const [isResolved, setIsResolved] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const theme = useTheme();

  const handleToggleResolve = () => {
    setIsResolved((prev) => !prev);
  };

  const handleEditClick = () => {
    setDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleDialogUpdate = (newValue: any) => {
    console.log("Updated value:", newValue);
    setUpdatedRows((prev) => ({ ...prev, [rowIndex]: true })); // Mark the row as updated
    setDialogOpen(false); // Close the dialog
  };

  // Extract dropdown options from column index 22 onwards
  const dropdownOptions = Object.keys(rowData)
    .slice(24)
    .map((key) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: rowData[key] || "N/A",
    }));

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
        {String(value)}
        {index === 4 && (
          <IconButton size="small" onClick={handleToggleResolve}>
            {isResolved ? (
              updatedRows[rowIndex] ? (
                <Tooltip
                  placement="top"
                  title={
                    <>
                      Recipe has been marked Reviewed.
                      <br />
                      <Typography
                        color={"#0bdd00"}
                        sx={{ fontSize: "12px", fontWeight: 600 }}
                      >
                        New TRO Override
                      </Typography>
                      : {rowData.new_tRO || "N/A"}
                    </>
                  }
                  arrow
                >
                  <DoneAllIcon sx={{ color: "#0bdd00", transition: "color 0.3s" }} />
                </Tooltip>
              ) : (
                <Tooltip
                  placement="top"
                  title={
                    <>
                      Recipe has been marked Reviewed.
                      <br />
                      <Typography
                        color={theme.palette.primary.main}
                        sx={{ fontSize: "12px", fontWeight: 600 }}
                      >
                        New TRO
                      </Typography>
                      : {rowData.new_tRO || "N/A"}
                    </>
                  }
                  arrow
                >
                  <CheckIcon sx={{ color: "#0bdd00", transition: "color 0.3s" }} />
                </Tooltip>
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
            onClick={handleEditClick} // Open dialog on click
            sx={{
              borderRadius: "50%",
              padding: "4px",
              "&:hover": { backgroundColor: (theme) => theme.palette.grey[200] },
            }}
          >
            <EditIcon
              sx={{
                fontSize: "1.25rem",
                color: (theme) => theme.palette.primary.main,
              }}
            />
          </IconButton>
        )}
      </div>
      <EditTROValueDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onUpdate={handleDialogUpdate}
        dropdownOptions={dropdownOptions} // Pass dynamic dropdown options
        originalValue={value}
      />
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
