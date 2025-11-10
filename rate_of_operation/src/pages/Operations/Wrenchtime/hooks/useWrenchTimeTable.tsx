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
import { EditSetupTimeDialog } from "../components/EditSetupTimeDialog";

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
  onRowUpdate: (rowIndex: number, newValue: any, originalValue: number, comments: string) => void;
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

  const handleDialogUpdate = (newValue: any, comments: string) => {
    const originalVal = parseFloat(value);
    onRowUpdate(rowIndex, newValue, originalVal, comments);
    setUpdatedRows((prev) => ({ ...prev, [rowIndex]: true }));
    setDialogOpen(false);
  };

  const handlePublish = () => {
    if (rowData.REVIEWED === "Y - Reviewed from Web App") {
      onRowReview(rowIndex);
    } else {
      onRowReview(rowIndex);
    }
  };

  const dropdownOptions = [
    { label: "Current Setup Min", value: rowData.CURRENT_SETUPTIME_MINUTES || "N/A" },
    { label: "AI/ML Setup Min", value: rowData.AIML_SETUPTIME_MINUTES || "N/A" },
    {
      label: "Asset Group (6mo)",
      value: rowData.ASSET_SETUPGROUP_ST_6MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SETUPGROUP_N_6MONTH || "N/A"})`,
    },
    {
      label: "Asset Group (3mo)",
      value: rowData.ASSET_SETUPGROUP_ST_3MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SETUPGROUP_N_3MONTH || "N/A"})`,
    },
    {
      label: "Asset Size (6mo)",
      value: rowData.ASSET_SIZE_ST_6MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SIZE_N_6MONTH || "N/A"})`,
    },
    {
      label: "Asset Size (3mo)",
      value: rowData.ASSET_SIZE_ST_3MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_SIZE_N_3MONTH || "N/A"})`,
    },
    {
      label: "Asset Variant (6mo)",
      value: rowData.ASSET_VARIANT_ST_6MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_VARIANT_N_6MONTH || "N/A"})`,
    },
    {
      label: "Asset Variant (3mo)",
      value: rowData.ASSET_VARIANT_ST_3MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_VARIANT_N_3MONTH || "N/A"})`,
    },
    {
      label: "Asset (6mo)",
      value: rowData.ASSET_ST_6MONTH || "N/A",
      subtext: `(N: ${rowData.ASSET_N_6MONTH || "N/A"})`,
    },
    {
      label: "Asset (3mo)",
      value: rowData.ASSET_ST_3MONTH || "N/A",
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
          justifyContent:
            columnId === "FROM_SETUP_GROUP" ||
              columnId === "TO_SETUP_GROUP" ||
              columnId === "SETUP_MATRIX" ||
              (columnId === "NEW_SETUPTIME_MINUTES" && rowData.REVIEWED === "N")
              ? "flex-start"
              : "center",
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
          {value === null ? "-" : String(value)}
        </div>

        {/* Review button moved to SETUP_MATRIX column */}
        {columnId === "SETUP_MATRIX" && rowData.REVIEWED === "N" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <IconButton size="small" onClick={handlePublish}>
              <Tooltip
                placement="top"
                title={
                  <>
                    Click to mark reviewed.
                    <br />
                    New Setup Time: {rowData.NEW_SETUPTIME_MINUTES || "N/A"}
                  </>
                }
                arrow
              >
                <PublishedWithChanges
                  sx={{
                    color: rowData.isUpdated
                      ? "rgb(205, 181, 0)"
                      : (theme) => theme.palette.primary.main,
                    transition: "color 0.3s",
                  }}
                />
              </Tooltip>
            </IconButton>
          </Box>
        )}

        {/* Display check icons in SETUP_MATRIX column when REVIEWED is "Y" */}
        {columnId === "SETUP_MATRIX" &&
          rowData.REVIEWED === "Y - Reviewed from Web App" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <IconButton size="small" onClick={handlePublish}>
                {rowData.isUpdated ? (
                  <DoneAllIcon sx={{ color: "#0bdd00" }} />
                ) : (
                  <CheckIcon sx={{ color: "#0bdd00" }} />
                )}
              </IconButton>
            </Box>
          )}

        {/* Edit button for NEW_SETUPTIME_MINUTES column */}
        {columnId === "NEW_SETUPTIME_MINUTES" && rowData.REVIEWED === "N" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
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

      {/* Edit dialog for NEW_SETUPTIME_MINUTES column */}
      {columnId === "NEW_SETUPTIME_MINUTES" && rowData.REVIEWED === "N" && (
        <EditSetupTimeDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleDialogUpdate}
          dropdownOptions={dropdownOptions}
          originalValue={rowData?.CURRENT_SETUPTIME_MINUTES}
        />
      )}
    </>
  );
};

export const useWrenchTimeTable = (
  data: any[],
  onRowUpdate: (rowIndex: number, newValue: any, originalValue: number, comments: string) => void,
  onRowReview: (rowIndex: number) => void,
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

    // Update priority columns with new order
    const priorityColumns = ["FROM_SETUP_GROUP", "TO_SETUP_GROUP", "SETUP_MATRIX"];
    const hiddenColumns = ["SNAPSHOT_DATE", "CREATED_ON", "SETUP_TIME_KEY"];

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
    data: data || [],
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
    manualPagination: true,
    pageCount: -1,
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
