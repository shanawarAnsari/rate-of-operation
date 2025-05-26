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

// Cell component for column-specific rendering
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

  const handlePublish = () => onRowReview(rowIndex);

  // Create dropdown options for TRO dialog
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
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {value === null ? "-" : String(value)}

        {/* Add "Mark Reviewed" button to PACKER_RESOURCE column */}
        {columnId === "PACKER_RESOURCE" && (
          <IconButton size="small" onClick={handlePublish}>
            {rowData.isUpdated &&
              rowData.REVIEWED === "Y - Reviewed from Web App" ? (
              <DoneAllIcon sx={{ color: "#0bdd00" }} />
            ) : !rowData.isUpdated &&
              rowData.REVIEWED === "Y - Reviewed from Web App" ? (
              <CheckIcon sx={{ color: "#0bdd00" }} />
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
                    color: (theme) => theme.palette.primary.main,
                    transition: "color 0.3s",
                  }}
                />
              </Tooltip>
            )}
          </IconButton>
        )}

        {/* Add Edit button to NEW_RO column */}
        {columnId === "NEW_RO" && (
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

      {/* Dialog for editing TRO value */}
      {columnId === "NEW_RO" && (
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
  onRowReview: (rowIndex: number) => void
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
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!data || data.length === 0) return [];

    // Define our priority columns that should appear first
    const priorityColumns = ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE"];
    // Define columns that should be hidden
    const hiddenColumns = ["RATE_OF_OPERATION_KEY", "SNAPSHOT_DATE"];

    // Get all keys except for the ones we want to hide and isUpdated flag
    const keys = Object.keys(data[0] || {}).filter(
      (k) => k !== "isUpdated" && !hiddenColumns.includes(k)
    );

    // Reorder keys to ensure priority columns come first
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
  }, [data, updatedRows, onRowUpdate, onRowReview]); // Include updatedRows and onRowReview in dependency
  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    defaultColumn: {
      minSize: 100,
      size: 150,
    },
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