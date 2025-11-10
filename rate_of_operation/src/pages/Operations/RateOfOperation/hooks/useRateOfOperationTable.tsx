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

/** Common row shape */
export type RateOfOperationRow = Record<string, any>;
type RowKey = string | number;

function getRowKey(row: RateOfOperationRow): RowKey {
  return row?.RATE_OF_OPERATION_KEY ?? row?.RECIPE_NUMBER ?? row?.id ?? "";
}

type UpdateHandler = (
  rowKey: RowKey,
  newValue: number,
  originalValue: number,
  comments: string
) => void;

type ReviewHandler = (rowKey: RowKey) => void;

type CellRendererProps = {
  value: any;
  columnId: string;
  rowData: RateOfOperationRow;
  onRowUpdate: UpdateHandler;
  onRowReview: ReviewHandler;
};

const CellRenderer = ({
  value,
  columnId,
  rowData,
  onRowUpdate,
  onRowReview,
}: CellRendererProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const rowKey = getRowKey(rowData);

  const handleEditClick = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleDialogUpdate = (newValue: any, comments: string) => {
    // IMPORTANT: original should be CURRENT_RO (baseline), not the NEW_RO cell's value
    const originalVal = Number(rowData?.CURRENT_RO);
    onRowUpdate(rowKey, Number(newValue), originalVal, comments);
    setDialogOpen(false);
  };

  const handlePublish = () => {
    onRowReview(rowKey);
  };

  const dropdownOptions = [
    { label: "CURRENT TRO", value: rowData.CURRENT_RO ?? "N/A" },
    { label: "AI/ML TRO", value: rowData.AIML_RO ?? "N/A" },
    {
      label: "Asset SKU TRO (6mo)",
      value: rowData.ASSET_SKU_RO_6MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_6MONTH ?? "N/A"})`,
    },
    {
      label: "Asset SKU TRO (5mo)",
      value: rowData.ASSET_SKU_RO_5MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_5MONTH ?? "N/A"})`,
    },
    {
      label: "Asset SKU TRO (4mo)",
      value: rowData.ASSET_SKU_RO_4MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_4MONTH ?? "N/A"})`,
    },
    {
      label: "Asset SKU TRO (3mo)",
      value: rowData.ASSET_SKU_RO_3MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_SKU_N_3MONTH ?? "N/A"})`,
    },
    {
      label: "Asset Trade TRO (3mo)",
      value: rowData.ASSET_TRADECODE_RO_3MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_TRADECODE_N_3MONTH ?? "N/A"})`,
    },
    {
      label: "Asset PG TRO (6mo)",
      value: rowData.ASSET_PG_RO_6MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_PG_N_6MONTH ?? "N/A"})`,
    },
    {
      label: "Asset TRO (3mo)",
      value: rowData.ASSET_RO_3MONTH ?? "N/A",
      subtext: `(N: ${rowData.ASSET_N_3MONTH ?? "N/A"})`,
    },
  ];

  const showErrorIcon =
    (columnId === "RECIPE_NUMBER" &&
      (rowData.ERROR_CODE === 1 ||
        rowData.ERROR_CODE === "1" ||
        rowData.ERROR_CODE === 0 ||
        rowData.ERROR_CODE === "0") &&
      rowData.ERROR_REPORT &&
      rowData.ERROR_REPORT !== "None" &&
      String(rowData.ERROR_REPORT).trim() !== "") ??
    false;

  const canEdit =
    columnId === "NEW_RO" &&
    rowData.REVIEWED === "N" &&
    !(rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1");

  const showReviewBtn =
    columnId === "SAP_PRODUCT" &&
    !(rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1") &&
    ((rowData.REVIEWED === "N" &&
      (rowData.ERROR_CODE === 0 || rowData.ERROR_CODE === "0")) ||
      rowData.REVIEWED === "Y - Reviewed from Web App");

  const justifyContent =
    columnId === "RECIPE_NUMBER" || columnId === "PACKER_RESOURCE"
      ? "flex-start"
      : columnId === "NEW_RO" && rowData.REVIEWED === "N" && !(rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1")
        ? "flex-start"
        : "center";

  return (
    <>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          alignItems: "center",
          justifyContent,
          minHeight: "32px",
          gap: "0px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          {value === null || typeof value === "undefined" ? "-" : String(value)}
        </div>

        {/* Error info */}
        {columnId === "RECIPE_NUMBER" && showErrorIcon && (
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Tooltip placement="top" title={rowData.ERROR_REPORT ?? "Error occurred"} arrow>
              <InfoOutlined
                sx={{
                  color:
                    rowData.ERROR_CODE === 1 || rowData.ERROR_CODE === "1"
                      ? "rgba(182, 0, 0, 0.8)" // hard errors
                      : "rgba(255, 165, 0, 0.8)", // soft errors
                  fontSize: "1.5rem",
                }}
              />
            </Tooltip>
          </Box>
        )}

        {/* Review button (publish / reset) */}
        {showReviewBtn && (
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
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
                      New TRO: {rowData.NEW_RO ?? "N/A"}
                    </>
                  }
                  arrow
                >
                  <PublishedWithChanges
                    sx={{
                      color: rowData.isUpdated ? "rgb(205, 181, 0)" : (theme) => theme.palette.primary.main,
                      transition: "color 0.3s",
                    }}
                  />
                </Tooltip>
              )}
            </IconButton>
          </Box>
        )}

        {/* Edit button (NEW_RO) */}
        {canEdit && (
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
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
          </Box>
        )}
      </div>

      {/* Edit dialog (NEW_RO) */}
      {columnId === "NEW_RO" && rowData.REVIEWED === "N" && (
        <EditTROValueDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleDialogUpdate}
          dropdownOptions={dropdownOptions}
          originalValue={rowData.CURRENT_RO}
        />
      )}
    </>
  );
};

export const useRateOfOperationTable = (
  data: RateOfOperationRow[],
  onRowUpdate: UpdateHandler,
  onRowReview: ReviewHandler,
  totalRows: number,
  columnVisibility: Record<string, boolean>,
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  currentPageNumber: number,
  currentRowsPerPage: number,
  onPageChange: (page: number) => void,
  onRowsPerPageChange: (rows: number) => void,
  onSearch?: (searchText: string) => void
) => {
  const { searchText, handleSearchChange } = useSearch(onSearch);

  const columns = useMemo<ColumnDef<RateOfOperationRow>[]>(
    () => {
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

      // Use index 0 to infer columns; be defensive if fields are missing
      const keys = Object.keys(data[0] ?? {}).filter(
        (k) => k !== "isUpdated" && !hiddenColumns.includes(k)
      );

      const orderedKeys = [
        ...priorityColumns,
        ...keys.filter((k) => !priorityColumns.includes(k)),
      ];

      return orderedKeys.map((key) => ({
        accessorKey: key,
        header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        cell: (info: any) => (
          <CellRenderer
            value={info.getValue()}
            columnId={info.column.id}
            rowData={info.row.original}
            onRowUpdate={onRowUpdate}
            onRowReview={onRowReview}
          />
        ),
        minSize: 120,
        maxSize: 1000,
        enableSorting: true,
      }));
    },
    [data, onRowUpdate, onRowReview]
  );

  const table = useReactTable({
    data: data ?? [], // always an array
    columns,
    state: {
      columnVisibility,
      // We keep TanStack's pagination neutral; app handles external pagination.
      pagination: {
        pageIndex: Math.max(0, currentPageNumber - 1),
        pageSize: currentRowsPerPage,
      },
    },
    getRowId: (row) => String(getRowKey(row)),
    defaultColumn: {
      minSize: 100,
      size: 150,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil((totalRows ?? 0) / Math.max(1, currentRowsPerPage))),
  });

  const {
    pageInput,
    handlePageInputChange,
    handlePageInputSubmit,
    handleRowsPerPageChange,
    totalPages,
  } = usePagination(
    table as any,
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
