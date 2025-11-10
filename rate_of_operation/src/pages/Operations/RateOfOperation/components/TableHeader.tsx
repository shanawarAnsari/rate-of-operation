import React from "react";
import { TableHead, TableRow, TableCell, Tooltip, Box } from "@mui/material";
import { flexRender, HeaderGroup } from "@tanstack/react-table";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const headerCellStyles = {
  maxWidth: 100,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingX: "7px",
  paddingY: "4px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: (theme: any) =>
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
};

const isStickyColumn = (index: number) => index < 4;

const getStickyPosition = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return 110;
  if (index === 2) return 220;
  if (index === 3) return 330;
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