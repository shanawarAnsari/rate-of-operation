import React from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Tooltip,
  TextField,
  Select,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { flexRender } from "@tanstack/react-table";
import { useRateOfOperationTable } from "../hooks/useRateOfOperationTable"; // Add this import

const cellStyles = {
  maxWidth: 100,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingX: "7px",
  paddingY: "7px",
  fontSize: "0.9rem",
};

const headerCellStyles = {
  ...cellStyles,
  paddingY: 0.5,
  fontWeight: "bold",
  backgroundColor: (theme: any) =>
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
};

const isStickyColumn = (index: number) => index < 3;

const getStickyPosition = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return 85;
  if (index === 2) return 180;
  return 0;
};

interface RateOfOperationTableProps {
  data: any[];
}

const RateOfOperationTable: React.FC<RateOfOperationTableProps> = ({ data }) => {
  const {
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
  } = useRateOfOperationTable(data);

  return (
    <Box
      sx={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <TextField
          id="search-input"
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: "300px" }}
        />
        <TextField
          id="column-visibility-textfield"
          variant="outlined"
          size="small"
          value={`${visibleColumnsCount} of ${totalColumnsCount} columns visible`}
          onClick={(event: any) => handleClick(event)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <KeyboardArrowDownIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "220px",
            cursor: "pointer",
            "& .MuiInputBase-input": { cursor: "pointer" },
          }}
        />
        <Menu
          id="column-visibility-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "column-visibility-textfield",
            sx: { maxHeight: "400px", overflow: "auto", width: "250px" },
          }}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                />
              }
              label="Toggle All"
            />
          </MenuItem>
          {table.getAllLeafColumns().map((column) => (
            <MenuItem key={column.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                }
                label={column.id
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          overflowY: "auto",
          width: "100%",
          position: "relative",
          margin: 0,
          maxHeight: "60vh",
        }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            tableLayout: "auto",
            width: "100%",
            "& .MuiTableCell-root": { ...cellStyles },
          }}
          aria-label="rate of operations table"
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      ...headerCellStyles,
                      cursor: "pointer",
                      ...(isStickyColumn(index) && {
                        position: "sticky",
                        left: getStickyPosition(index),
                        zIndex: 4,
                        backgroundColor: (theme: any) =>
                          theme.palette.mode === "light"
                            ? theme.palette.grey[300]
                            : theme.palette.grey[900],
                        boxShadow:
                          index === 2 ? "2px 0px 3px -1px rgba(0,0,0,0.2)" : "none",
                      }),
                    }}
                    style={{ minWidth: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Tooltip title={String(header.column.columnDef.header)} arrow>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getIsSorted() === "asc" && (
                          <ArrowDropDownIcon
                            sx={{ color: "darkgray", fontSize: 28 }}
                          />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowDropUpIcon
                            sx={{ color: "darkgray", fontSize: 28 }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      ...cellStyles,
                      ...(isStickyColumn(index) && {
                        position: "sticky",
                        left: getStickyPosition(index),
                        zIndex: 3,
                        backgroundColor: (theme: any) =>
                          theme.palette.mode === "light"
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                        boxShadow:
                          index === 2 ? "2px 0px 3px -1px rgba(0,0,0,0.2)" : "none",
                      }),
                    }}
                    style={{ minWidth: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
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
            <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={table.getState().pagination.pageSize}
              onChange={handleRowsPerPageChange}
              label="Rows per page"
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
            sx={{ width: "120px" }}
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
