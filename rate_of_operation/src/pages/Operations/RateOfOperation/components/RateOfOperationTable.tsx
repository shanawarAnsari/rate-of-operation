import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  VisibilityState,
} from "@tanstack/react-table";
import { mockData } from "../mockData";
import {
  Box,
  Button,
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
  SelectChangeEvent,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Style constants for table cells
const cellStyles = {
  maxWidth: 150, // Limit max width
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const headerCellStyles = {
  ...cellStyles,
  paddingY: 1,
  fontWeight: "bold",
  backgroundColor: (theme: any) =>
    theme.palette.mode === "light"
      ? theme.palette.grey[300] // Darker background for light mode
      : theme.palette.grey[800], // Darker background for dark mode
};

// Check if column should be sticky (first 3 columns)
const isStickyColumn = (index: number) => index < 3;

// Get left position for sticky column
const getStickyPosition = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return 100;
  if (index === 2) return 220;
  return 0;
};

const RateOfOperationTable: React.FC = () => {
  // Initialize column visibility state with columns after statistical_RO_Source hidden
  // Also hide business and category columns initially
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    // Get all keys from the first item in mockData
    const keys = Object.keys(mockData[0] || {});

    // Find the index of statistical_RO_Source
    const statisticalSourceIndex = keys.findIndex(
      (key) => key === "statistical_RO_Source"
    );

    // Create visibility object - columns up to statistical_RO_Source are visible
    const initialVisibility: VisibilityState = {};

    keys.forEach((key, index) => {
      // Hide business and category columns regardless of position
      if (
        key.toLowerCase().includes("business") ||
        key.toLowerCase().includes("category")
      ) {
        initialVisibility[key] = false;
      } else {
        // Otherwise, use the original logic
        initialVisibility[key] = index <= statisticalSourceIndex;
      }
    });

    return initialVisibility;
  });

  // Column selector menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Page number input state
  const [pageInput, setPageInput] = useState<string>("1");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Calculate visible columns count
  const visibleColumnsCount = useMemo(() => {
    return Object.values(columnVisibility).filter(Boolean).length;
  }, [columnVisibility]);

  // Get total columns count
  const totalColumnsCount = useMemo(() => {
    return Object.keys(mockData[0] || {}).length;
  }, []);

  // Define columns
  const columns = useMemo<ColumnDef<any>[]>(() => {
    // Get all keys from the first item in mockData to create columns
    const keys = Object.keys(mockData[0] || {});

    return keys.map((key) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      cell: (info) => {
        const value = info.getValue();
        return (
          <Tooltip
            title={value !== null && value !== undefined ? String(value) : ""}
            arrow
          >
            <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {String(value)}
            </div>
          </Tooltip>
        );
      },
      // Set a minimum width instead of a fixed size
      minSize: key.includes("Asset") ? 120 : 150,
    }));
  }, []);

  // Initialize table
  const table = useReactTable({
    data: mockData,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Set default pagination
  React.useEffect(() => {
    table.setPageSize(10);
    setPageInput("1");
  }, [table]);

  // Handle page input change
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  // Handle page input submit
  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= table.getPageCount()) {
      table.setPageIndex(pageNumber - 1);
    } else {
      // Reset to current page if invalid
      setPageInput((table.getState().pagination.pageIndex + 1).toString());
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newSize = event.target.value as number;
    table.setPageSize(newSize);
    // Reset to first page when changing page size
    table.setPageIndex(0);
    setPageInput("1");
  };

  // Update page input when pagination changes
  React.useEffect(() => {
    setPageInput((table.getState().pagination.pageIndex + 1).toString());
  }, [table.getState().pagination.pageIndex]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Column visibility dropdown */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          id="column-visibility-textfield"
          variant="outlined"
          size="small"
          value={`${visibleColumnsCount} of ${totalColumnsCount} columns visible`}
          onClick={(event) => setAnchorEl(event.currentTarget)}
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
            "& .MuiInputBase-input": {
              cursor: "pointer",
            },
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

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "100vh",
          overflowX: "auto",
          width: "100%",
          maxWidth: "100%",
          margin: 0,
          position: "relative", // Required for sticky positioning context
        }}
      >
        <Table
          stickyHeader
          sx={{ tableLayout: "auto", width: "100%" }}
          aria-label="rate of operation table"
        >
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      ...headerCellStyles,
                      ...(isStickyColumn(index) && {
                        position: "sticky",
                        left: getStickyPosition(index),
                        zIndex: 4, // Higher z-index for header cells
                        backgroundColor: (theme: any) =>
                          theme.palette.mode === "light"
                            ? theme.palette.grey[300] // Darker background for light mode
                            : theme.palette.grey[900], // Darker background for dark mode
                        boxShadow:
                          index === 2 ? "2px 0px 3px -1px rgba(0,0,0,0.2)" : "none",
                      }),
                    }}
                    style={{ minWidth: header.getSize() }}
                  >
                    <Tooltip title={String(header.column.columnDef.header)} arrow>
                      <div>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
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
                        zIndex: 3, // Lower than header cells but higher than regular cells
                        backgroundColor: (theme: any) =>
                          theme.palette.mode === "light"
                            ? theme.palette.grey[100] // Darker background for light mode
                            : theme.palette.grey[900], // Darker background for dark mode
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

      {/* Pagination */}
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
        <Typography variant="body2">
          Showing{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getPrePaginationRowModel().rows.length
          )}{" "}
          of {table.getPrePaginationRowModel().rows.length} entries
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Rows per page dropdown */}
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

          {/* Page number input */}
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
              inputProps: {
                style: { width: "40px" },
                "aria-label": "page number",
              },
            }}
            sx={{ width: "120px" }}
          />

          {/* Standard pagination controls */}
          <Pagination
            count={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(_, page) => {
              table.setPageIndex(page - 1);
              setPageInput(page.toString());
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
