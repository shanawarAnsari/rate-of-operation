import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table";

import { usePagination } from "./usePagination";
import { useSearch } from "./useSearch";
import { Box, IconButton, useTheme } from "@mui/material";
import { InfoOutlined, PublishedWithChanges } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Tooltip from "@mui/material/Tooltip";
import { EditTROValueDialog } from "../components/EditTROValueDialog";

const CellRenderer = ({
  value,
  columnId,
  rowData,
  rowIndex,
  onRowUpdate,
  onRowReview,
  updatedRows,
  setUpdatedRows,
}: {
  value: any;
  columnId: string;
  rowData: any;
  rowIndex: number;
  onRowUpdate: (rowIndex: number, newValue: any, originalValue: number) => void;
  onRowReview: (rowIndex: number) => void;
  updatedRows: Record<number, boolean>;
  setUpdatedRows: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();

  const handleEditClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogUpdate = (newValue: any) => {
    const originalVal = parseFloat(value);
    onRowUpdate(rowIndex, newValue, originalVal);
    setUpdatedRows((prev) => ({ ...prev, [rowIndex]: true }));
    setDialogOpen(false);
  };

  const handlePublish = () => {
    // If already reviewed, reset to original values
    if (rowData.REVIEWED === "Y - Reviewed from Web App") {
      // Reset the row to original state
      onRowReview(rowIndex); // This will trigger the reset logic in parent component
    } else {
      // Mark as reviewed
      onRowReview(rowIndex);
    }
  };

  const dropdownOptions = [
    { label: "AI/ML TRO", value: rowData.AIML_RO || "N/A" },
    {
      label: "Asset SKU TRO (6mo)",
      value: rowData.ASSET_SKU_RO_6MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_6MONTH || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (5mo)",
      value: rowData.ASSET_SKU_RO_5MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_5MONTH || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (4mo)",
      value: rowData.ASSET_SKU_RO_4MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_4MONTH || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (3mo)",
      value: rowData.ASSET_SKU_RO_3MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_3MONTH || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (3mo)",
      value: rowData.ASSET_TRADECODE_RO_3MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_TRADECODE_N_3MONTH || "N/A"})`,
    },
    {
      label: "Asset PG TRO (6mo)",
      value: rowData.ASSET_PG_RO_6MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_PG_N_6MONTH || "N/A"})`,
    },
    {
      label: "Asset TRO (3mo)",
      value: rowData.ASSET_RO_3MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_N_3MONTH || "N/A"})`,
    },
  ];
  return (
    <>
      {" "}
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          alignItems: "center",
          justifyContent:
            columnId === "PACKER_RESOURCE" ||
            (columnId === "NEW_RO" &&
              rowData.REVIEWED === "N" &&
              !(rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1"))
              ? "space-between"
              : "center",
        }}
      >
        {value === null ? "-" : String(value)}

        {/* Show error info icon in PACKER_RESOURCE column for rows with error code 1 */}
        {columnId === "PACKER_RESOURCE" &&
          (rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1") && (
            <Box sx={{ mr: 0.7 }}>
              <Tooltip
                placement="top"
                title={rowData.ERROR_REPORT || "Error occurred"}
                arrow
              >
                <InfoOutlined
                  sx={{
                    color: "rgba(182, 0, 0, 0.8)", // Deep bloody red with transparency
                    fontSize: "1.5rem",
                  }}
                />
              </Tooltip>
            </Box>
          )}

        {/* Review button for PACKER_RESOURCE column - show for REVIEWED = "N" with no errors, or already reviewed */}
        {columnId === "PACKER_RESOURCE" &&
          !(rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1") &&
          ((rowData.REVIEWED === "N" &&
            (rowData.ERROR_CODE === 0 || rowData.ERROR_CODE === "0")) ||
            rowData.REVIEWED === "Y - Reviewed from Web App") && (
            <IconButton size="small" onClick={handlePublish}>
              {rowData.REVIEWED === "Y - Reviewed from Web App" ? (
                rowData.isUpdated ? (
                  <DoneAllIcon sx={{ color: "#0bdd00" }} />
                ) : (
                  <CheckIcon sx={{ color: "#0bdd00" }} />
                )
              ) : (
                <Tooltip
                  placement="top"
                  title={
                    <>
                      Click to mark reviewed.
                      <br />
                      New TRO: {rowData.NEW_RO || "N/A"}
                    </>
                  }
                  arrow
                >
                  <PublishedWithChanges
                    sx={{
                      color: rowData.isUpdated
                        ? "rgb(205, 181, 0)" // Dark yellow for updated TRO
                        : (theme) => theme.palette.primary.main,
                      transition: "color 0.3s",
                    }}
                  />
                </Tooltip>
              )}
            </IconButton>
          )}
        {/* Edit button for NEW_RO column - only show for REVIEWED = "N" and no error */}
        {columnId === "NEW_RO" &&
          rowData.REVIEWED === "N" &&
          !(rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1") && (
            <IconButton
              size="small"
              onClick={handleEditClick}
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
      {/* Edit dialog for NEW_RO column - only for REVIEWED = "N" */}
      {columnId === "NEW_RO" && rowData.REVIEWED === "N" && (
        <EditTROValueDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleDialogUpdate}
          dropdownOptions={dropdownOptions}
          originalValue={value}
        />
      )}
    </>
  );
};

export const useRateOfOperationTable = (
  data: any[],
  onRowUpdate: (rowIndex: number, newValue: any, originalValue: number) => void,
  onRowReview: (rowIndex: number) => void,
  totalRows: number,
  columnVisibility: Record<string, boolean>,
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  currentPageNumber: number,
  currentRowsPerPage: number,
  onPageChange: (page: number) => void,
  onRowsPerPageChange: (rows: number) => void
) => {
  const { searchText, handleSearchChange } = useSearch();

  const [updatedRows, setUpdatedRows] = useState<Record<number, boolean>>({});
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!data || data.length === 0) {
      return [
        {
          accessorKey: "empty",
          header: "No Data",
          cell: () => null,
        },
      ];
    }

    const priorityColumns = ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE"];

    const hiddenColumns = ["RATE_OF_OPERATION_KEY", "SNAPSHOT_DATE"];

    const keys = Object.keys(data[0] || {}).filter(
      (k) => k !== "isUpdated" && !hiddenColumns.includes(k)
    );

    const orderedKeys = [
      ...priorityColumns,
      ...keys.filter((k) => !priorityColumns.includes(k)),
    ];

    return orderedKeys.map((key, index) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: (info: any) => (
        <CellRenderer
          value={info.getValue()}
          columnId={info.column.id}
          rowData={info.row.original}
          rowIndex={info.row.index}
          onRowUpdate={onRowUpdate}
          onRowReview={onRowReview}
          updatedRows={updatedRows}
          setUpdatedRows={setUpdatedRows}
        />
      ),
      minSize: 120,
      maxSize: 1000,
      enableSorting: true,
    }));
  }, [data, updatedRows, onRowUpdate, onRowReview]);
  const table = useReactTable({
    data: data || [], // Ensure we always have an array
    columns,
    state: {
      columnVisibility,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    defaultColumn: {
      minSize: 100,
      size: 150,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Since we're handling pagination with API
    pageCount: -1, // Let the table calculate page count dynamically
  });
  const {
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
    totalPages,
  } = usePagination(
    table,
    totalRows,
    currentPageNumber,
    currentRowsPerPage,
    onPageChange,
    onRowsPerPageChange
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  return {
    table,
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
    totalPages,
  };
};
