import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Paper,
  Table,
  TableContainer,
  Typography,
  Pagination,
  TextField,
  Select,
  InputLabel,
  InputAdornment,
  MenuItem,
  IconButton,
  Tooltip,
  Menu,
} from "@mui/material";
import { useRateOfOperationTable } from "../hooks/useRateOfOperationTable";
import SearchInput from "./SearchInput";
import ColumnVisibilityControl from "./ColumnVisibilityControl";
import TableHeader from "./TableHeader";
import TableBodyComponent from "./TableBody";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import { FilterAltRounded, SaveRounded, DownloadRounded } from "@mui/icons-material";
import FilterPopper from "./filters/FilterPopper";

import { useRecipesData } from "../hooks/useRecipesData";
import { useReviewedStatusData } from "../hooks/useReviewedStatusData";
import { CircularProgress } from "@mui/material";
import { useColumnVisibility } from "../hooks/useColumnVisibility";

interface RateOfOperationTableProps {}

const RateOfOperationTable: React.FC<RateOfOperationTableProps> = () => {
  const {
    data,
    loading,
    error,
    totalRows,
    pageNumber,
    rowsPerPage,
    reviewedStatus,
    updateData,
    refresh,
    updateReviewedStatus,
    updateRowsPerPage,
    updatePageNumber,
  } = useRecipesData();
  const { reviewedStatusOptions } = useReviewedStatusData();
  const {
    columnVisibility,
    setColumnVisibility,
    visibleColumnsCount,
    totalColumnsCount,
    availableColumns,
    priorityColumns,
  } = useColumnVisibility(data);
  const [tableData, setTableData] = useState<any[]>([]);
  const handleRowUpdate = (rowIndex: number, newValue: number) => {
    setTableData((prev) => {
      const updated = [...prev];
      const oldRow = updated[rowIndex];
      const originalTRO =
        typeof oldRow.NEW_RO === "number"
          ? oldRow.NEW_RO
          : parseFloat(oldRow.NEW_RO);
      const newPlanningTime =
        oldRow.CURRENT_PLANNING_TIME * (newValue / originalTRO);
      updated[rowIndex] = {
        ...oldRow,
        NEW_RO: newValue,
        NEW_PLANNING_TIME: newPlanningTime?.toFixed(2),
        RO_PCT_CHANGE:
          (((newValue - originalTRO) / originalTRO) * 100).toFixed(2) + "%",
        isUpdated: true,
      };

      updateData(updated);
      return updated;
    });
  };

  const handleReview = (rowIndex: number) => {
    setTableData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = {
        ...updated[rowIndex],
        REVIEWED: "Y - Reviewed from Web App",
      };

      updateData(updated);
      return updated;
    });
  };
  const {
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
  } = useRateOfOperationTable(
    tableData,
    handleRowUpdate,
    handleReview,
    totalRows,
    columnVisibility,
    setColumnVisibility
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("Personal Care");
  const [selectedReviewedStatus, setSelectedReviewedStatus] = useState<string>("N");

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  const [downloadAnchorEl, setDownloadAnchorEl] = useState<HTMLElement | null>(null);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleReviewedStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedReviewedStatus(event.target.value);
  };
  const handleRefresh = () => {
    refresh();
  };

  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilters = (appliedFilters: { [key: string]: string[] }) => {
    setFilters(appliedFilters);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };
  const handleDownload = (format: "excel" | "csv") => {
    setDownloadAnchorEl(null);
  };

  // Update table data whenever new data is received from getRecipes
  useEffect(() => {
    console.log("Data received from getRecipes:", data);

    if (Array.isArray(data) && data.length > 0) {
      console.log("Setting table data from array:", data);
      setTableData(data);
    } else if (
      data &&
      typeof data === "object" &&
      "rows" in data &&
      Array.isArray(data.rows)
    ) {
      console.log("Setting table data from data.rows:", data.rows);
      setTableData(data.rows);
    } else if (data === null || data === undefined) {
      console.log("Data is null/undefined, keeping existing table data");
      // Don't clear table data if data is null/undefined
    } else {
      console.log("No valid data found, clearing table data");
      setTableData([]);
    }
  }, [data]);

  // Also update table data when data changes and ensure the table reflects the new data
  useEffect(() => {
    if (tableData.length > 0) {
      console.log("Table data updated, rows count:", tableData.length);
    }
  }, [tableData]);

  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        paddingBottom: 2,
        m: 1,
        mx: 2,
      }}
    >
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <SearchInput
          searchText={searchText}
          handleSearchChange={handleSearchChange}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          <Tooltip title="Download" placement="top">
            <IconButton
              onClick={handleDownloadClick}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {
                  borderColor: (theme) => theme.palette.text.primary,
                },
              }}
              aria-label="download"
            >
              <DownloadRounded style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={downloadAnchorEl}
            open={Boolean(downloadAnchorEl)}
            onClose={handleDownloadClose}
          >
            <MenuItem onClick={() => handleDownload("excel")}>
              Download as Excel
            </MenuItem>
            <MenuItem onClick={() => handleDownload("csv")}>
              Download as CSV
            </MenuItem>
          </Menu>
          <TextField
            size="small"
            select
            label="Category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            sx={{
              minWidth: 150,
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputBase-root": {
                height: 30,
                borderRadius: 0,
              },
            }}
          >
            <MenuItem value="Personal Care" sx={{ fontSize: "0.75rem" }}>
              Personal Care
            </MenuItem>
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>{" "}
          <TextField
            size="small"
            select
            label="Reviewed Status"
            value={reviewedStatus}
            onChange={(e) => {
              updateReviewedStatus(e.target.value);
              handleReviewedStatusChange(e as React.ChangeEvent<HTMLInputElement>);
            }}
            sx={{
              minWidth: 150,
              "& .MuiInputBase-input": { fontSize: "0.75rem" },
              "& .MuiInputBase-root": {
                height: 30,
                borderRadius: 0,
                mr: 1,
              },
            }}
          >
            {Array.isArray(reviewedStatusOptions) && reviewedStatusOptions.length > 0
              ? reviewedStatusOptions.map((option: any) => (
                  <MenuItem
                    key={option.REVIEWED}
                    value={option.REVIEWED}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {option.REVIEWED}
                  </MenuItem>
                ))
              : null}
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>
          <Tooltip title="Filters" placement="top">
            <IconButton
              onClick={handleFilterIconClick}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {
                  borderColor: (theme) => theme.palette.text.primary,
                },
              }}
              aria-label="filter"
            >
              <FilterAltRounded style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save" placement="top">
            <IconButton
              onClick={handleRefresh}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {
                  borderColor: (theme) => theme.palette.text.primary,
                },
              }}
              aria-label="save"
            >
              <SaveRounded style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reload" placement="top">
            <IconButton
              onClick={handleRefresh}
              color="primary"
              sx={{
                marginRight: 1,
                p: 0.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "0px",
                "&:hover": {},
              }}
              aria-label="refresh"
            >
              <ReplayCircleFilledIcon style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>{" "}
          <ColumnVisibilityControl
            table={table}
            anchorEl={anchorEl}
            open={open}
            handleClick={handleClick}
            handleClose={handleClose}
            visibleColumnsCount={visibleColumnsCount}
            totalColumnsCount={totalColumnsCount}
            disableColumns={[]}
            availableColumns={availableColumns}
            priorityColumns={priorityColumns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </Box>
      </Box>
      <FilterPopper
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        data={tableData}
        onApply={handleApplyFilters}
      />{" "}
      <TableContainer
        component={Paper}
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          overflowY: "auto",
          width: "100%",
          position: "relative",
          margin: 0,
          maxHeight: "65vh",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Typography color="error">{error}</Typography>
          </Box>
        ) : tableData.length === 0 && loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <Typography>No data available</Typography>
          </Box>
        ) : (
          <Table
            stickyHeader
            size="small"
            sx={{
              tableLayout: "auto",
              width: "100%",
            }}
            aria-label="rate of operations table"
          >
            <TableHeader headerGroups={table.getHeaderGroups()} />
            <TableBodyComponent rows={table.getRowModel().rows} />
          </Table>
        )}
      </TableContainer>{" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {" "}
        <Typography
          variant="body2"
          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
        >
          Total Records: {totalRows || tableData.length || 0}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-label" sx={{ fontSize: "0.85rem" }}>
              Rows per page
            </InputLabel>{" "}
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              onChange={(e) => {
                const newRowsPerPage = Number(e.target.value);
                updateRowsPerPage(newRowsPerPage);
                handleRowsPerPageChange(e);
              }}
              label="Rows per page"
              sx={{ fontSize: "0.75rem", borderRadius: 0, mr: -2 }}
            >
              {[5, 10, 20, 35, 50, 100].map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Page"
            variant="outlined"
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputSubmit}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handlePageInputSubmit();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">of {totalPages}</InputAdornment>
              ),
              inputProps: { style: { width: "40px" }, "aria-label": "page number" },
            }}
            sx={{
              width: "120px",
              "& .MuiOutlinedInput-root": {
                fontSize: "0.75rem",
                borderRadius: 0,
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.85rem",
              },
            }}
          />{" "}
          <Pagination
            count={totalPages}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(_, page) => {
              table.setPageIndex(page - 1);
              updatePageNumber(page);
              handlePageInputChange({
                target: { value: page.toString() } as EventTarget & HTMLInputElement,
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            color="primary"
            size="small"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RateOfOperationTable;
