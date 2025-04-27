import React, { useState } from "react";
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

interface RateOfOperationTableProps {
  data: any[];
  onDataChange: (updatedData: any[]) => void;
}

const RateOfOperationTable: React.FC<RateOfOperationTableProps> = ({
  data,
  onDataChange,
}) => {
  const [tableData, setTableData] = useState(data);
  const handleRowUpdate = (rowIndex: number, newValue: number) => {
    setTableData((prev) => {
      const updated = [...prev];
      const oldRow = updated[rowIndex];
      const originalTRO =
        typeof oldRow.tRO === "number" ? oldRow.new_tRO : parseFloat(oldRow.new_tRO);
      const newPlanningTime = oldRow.planning_time * (newValue / originalTRO);
      updated[rowIndex] = {
        ...oldRow,
        new_tRO: newValue,
        new_planning_time: newPlanningTime?.toFixed(2),
        reviewed: "Y-Reviewed from Web App",
        tRO_Change:
          (((newValue - originalTRO) / originalTRO) * 100).toFixed(2) + "%",
        isUpdated: true,
      };
      // notify parent of updated records
      onDataChange(updated);
      return updated;
    });
  };

  const {
    table,
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
  } = useRateOfOperationTable(tableData, handleRowUpdate);

  const [selectedCategory, setSelectedCategory] = useState<string>("Personal Care");
  const [selectedReviewedStatus, setSelectedReviewedStatus] = useState<string>("N");

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  const [downloadAnchorEl, setDownloadAnchorEl] = useState<HTMLElement | null>(null);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
    // Add logic to filter table data based on category
  };

  const handleReviewedStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedReviewedStatus(event.target.value);
    // Add logic to filter table data based on reviewed status
  };

  const handleRefresh = () => {
    // Add logic to reload the data into the table
    console.log("Data reloaded");
  };

  const handleFilterIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilters = (appliedFilters: { [key: string]: string[] }) => {
    setFilters(appliedFilters);
    // Add logic to filter table data based on applied filters
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleDownload = (format: "excel" | "csv") => {
    console.log(`Downloading as ${format}`);
    // Add logic to download data as Excel or CSV
    setDownloadAnchorEl(null);
  };

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
            <MenuItem value="Family care" sx={{ fontSize: "0.75rem" }}>
              Family care
            </MenuItem>
            <MenuItem value="All" sx={{ fontSize: "0.75rem" }}>
              All
            </MenuItem>
          </TextField>
          <TextField
            size="small"
            select
            label="Reviewed Status"
            value={selectedReviewedStatus}
            onChange={handleReviewedStatusChange}
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
            <MenuItem value="Y" sx={{ fontSize: "0.75rem" }}>
              Y - Production Rate Web App
            </MenuItem>
            <MenuItem value="N" sx={{ fontSize: "0.75rem" }}>
              N
            </MenuItem>
            <MenuItem value="Pending" sx={{ fontSize: "0.75rem" }}>
              Pending
            </MenuItem>
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
                borderColor: "divider", // Matches the TextField's default border color
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
                borderColor: "divider", // Matches the TextField's default border color
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
                borderColor: "divider", // Matches the TextField's default border color
                borderRadius: "0px",
                "&:hover": {},
              }}
              aria-label="refresh"
            >
              <ReplayCircleFilledIcon style={{ fontSize: "26px" }} />
            </IconButton>
          </Tooltip>

          <ColumnVisibilityControl
            table={table}
            anchorEl={anchorEl}
            open={open}
            handleClick={handleClick}
            handleClose={handleClose}
            visibleColumnsCount={visibleColumnsCount}
            totalColumnsCount={totalColumnsCount - 2}
            disableColumns={[0, 1, 2, 3, 4]} // Disable visibility control for the first 3 columns and 2 are already hidden
          />
        </Box>
      </Box>
      <FilterPopper
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        data={tableData}
        onApply={handleApplyFilters}
      />
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
      </TableContainer>
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
        <Typography variant="body2"></Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-label" sx={{ fontSize: "0.85rem" }}>
              Rows per page
            </InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={table.getState().pagination.pageSize}
              onChange={handleRowsPerPageChange}
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
                <InputAdornment position="end">
                  of {table.getPageCount()}
                </InputAdornment>
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
          />
          <Pagination
            count={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(_, page) => {
              table.setPageIndex(page - 1);
              handlePageInputChange({
                target: { value: page.toString() } as EventTarget & HTMLInputElement,
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            color="primary"
            size="small"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RateOfOperationTable;
