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
  onRowUpdate: (rowIndex: number, newValue: any, originalValue: number) => void;
  onRowReview: (rowIndex: number) => void;
}> = ({
  value,
  index,
  rowData,
  rowIndex,
  updatedRows,
  setUpdatedRows,
  onRowUpdate,
  onRowReview,
}) => {
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
    setDialogOpen(false);
  };

  const handleDialogUpdate = (newValue: any) => {
    const originalVal = parseFloat(value);
    onRowUpdate(rowIndex, newValue, originalVal);
    setUpdatedRows((prev) => ({ ...prev, [rowIndex]: true }));
    setDialogOpen(false);
  };

  const handlePublish = () => onRowReview(rowIndex);

  const dropdownOptions = [
    { label: "AI/ML TRO", value: rowData.aiml_RO || "N/A" },

    {
      label: "Asset SKU TRO (6mo)",
      value: rowData.AssetSKU_tRO_6mo || "N/A",
      subtext: `(N: ${rowData.AssetSKU_6mo_N || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (5mo)",
      value: rowData.AssetSKU_tRO_5mo || "N/A",
      subtext: `(N: ${rowData.AssetSKU_5mo_N || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (4mo)",
      value: rowData.AssetSKU_tRO_4mo || "N/A",
      subtext: `(N: ${rowData.AssetSKU_4mo_N || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (3mo)",
      value: rowData.AssetSKU_tRO_3mo || "N/A",
      subtext: `(N: ${rowData.AssetSKU_3mo_N || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (2mo)",
      value: rowData.AssetSKU_tRO_2mo || "N/A",
      subtext: `(N: ${rowData.AssetSKU_2mo_N || "N/A"})`,
    },
    {
      label: "Asset SKU TRO (1mo)",
      value: rowData.AssetSKU_tRO_1mo || "N/A",
      subtext: `(N: ${rowData.AssetSKU_1mo_N || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (6mo)",
      value: rowData.AssetTrade_tRO_6mo || "N/A",
      subtext: `(N: ${rowData.AssetTrade_6mo_N || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (5mo)",
      value: rowData.AssetTrade_tRO_5mo || "N/A",
      subtext: `(N: ${rowData.AssetTrade_5mo_N || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (4mo)",
      value: rowData.AssetTrade_tRO_4mo || "N/A",
      subtext: `(N: ${rowData.AssetTrade_4mo_N || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (3mo)",
      value: rowData.AssetTrade_tRO_3mo || "N/A",
      subtext: `(N: ${rowData.AssetTrade_3mo_N || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (2mo)",
      value: rowData.AssetTrade_tRO_2mo || "N/A",
      subtext: `(N: ${rowData.AssetTrade_2mo_N || "N/A"})`,
    },
    {
      label: "Asset Trade TRO (1mo)",
      value: rowData.AssetTrade_tRO_1mo || "N/A",
      subtext: `(N: ${rowData.AssetTrade_1mo_N || "N/A"})`,
    },
    {
      label: "Asset PGPkCs TRO (6mo)",
      value: rowData.AssetPGPkCs_tRO_6mo || "N/A",
      subtext: `(N: ${rowData.AssetPGPKCs_6mo_N || "N/A"})`,
    },
    {
      label: "Asset PGPkCs TRO (3mo)",
      value: rowData.AssetPGPkCs_tRO_3mo || "N/A",
      subtext: `(N: ${rowData.AssetPGPKCs_3mo_N || "N/A"})`,
    },
    {
      label: "Asset PGPk TRO (6mo)",
      value: rowData.AssetPGPk_tRO_6mo || "N/A",
      subtext: `(N: ${rowData.AssetPGPK_6mo_N || "N/A"})`,
    },
    {
      label: "Asset PGPk TRO (3mo)",
      value: rowData.AssetPGPk_tRO_3mo || "N/A",
      subtext: `(N: ${rowData.AssetPGPK_3mo_N || "N/A"})`,
    },
    {
      label: "Asset PG TRO (6mo)",
      value: rowData.AssetPG_tRO_6mo || "N/A",
      subtext: `(N: ${rowData.AssetPG_6mo_N || "N/A"})`,
    },
    {
      label: "Asset PG TRO (3mo)",
      value: rowData.AssetPG_tRO_3mo || "N/A",
      subtext: `(N: ${rowData.AssetPG_3mo_N || "N/A"})`,
    },
    {
      label: "Asset TRO (6mo)",
      value: rowData.Asset_tRO_6mo || "N/A",
      subtext: `(N: ${rowData.Asset_6mo_N || "N/A"})`,
    },
    {
      label: "Asset TRO (3mo)",
      value: rowData.Asset_tRO_3mo || "N/A",
      subtext: `(N: ${rowData.Asset_3mo_N || "N/A"})`,
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
          justifyContent:
            index === 4 || index === 18 ? "space-between" : "flex-start",
        }}
      >
        {String(value)}
        {index === 4 && (
          <IconButton size="small" onClick={handlePublish}>
            {rowData.isUpdated &&
            rowData.reviewed === "Y - Reviewed from Web App" ? (
              <DoneAllIcon sx={{ color: "#0bdd00" }} />
            ) : !rowData.isUpdated &&
              rowData.reviewed === "Y - Reviewed from Web App" ? (
              <CheckIcon sx={{ color: "#0bdd00" }} />
            ) : (
              <Tooltip
                placement="top"
                title={
                  <>
                    Click to mark reviewed.
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
    const keys = Object.keys(data[0] || {}).filter((k) => k !== "isUpdated");
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
          onRowUpdate={onRowUpdate} // Pass onRowUpdate callback
          onRowReview={onRowReview} // Pass onRowReview callback
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
