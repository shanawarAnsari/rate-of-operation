import React from "react";
import { TableHead, TableRow, TableCell, Tooltip, Box } from "@mui/material";
import { flexRender, HeaderGroup } from "@tanstack/react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const headerCellStyles = {
  maxWidth: 120,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingX: "7px",
  paddingY: "4px",
  fontSize: "0.8rem",
  fontWeight: "bold",
  backgroundColor: (theme: any) =>
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
};

const isStickyColumn = (index: number) => index < 2;

const getStickyPosition = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return 85;
  return 0;
};

interface TableHeaderProps {
  headerGroups: HeaderGroup<any>[];
}

const TableHeader: React.FC<TableHeaderProps> = ({ headerGroups }) => (
  <TableHead>
    {headerGroups.map((headerGroup) => (
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
                boxShadow: index === 2 ? "2px 0px 3px -1px rgba(0,0,0,0.2)" : "none",
              }),
            }}
            style={{ minWidth: 120, maxWidth: 1000 }}
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
                  : flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getIsSorted() === "asc" && (
                  <ArrowDropDownIcon sx={{ color: "darkgray", fontSize: 28 }} />
                )}
                {header.column.getIsSorted() === "desc" && (
                  <ArrowDropUpIcon sx={{ color: "darkgray", fontSize: 28 }} />
                )}
              </Box>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableHead>
);

export default TableHeader;
