import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import { flexRender, Row } from "@tanstack/react-table";
import { useTheme } from "@mui/material";

const cellStyles = {
  maxWidth: 100,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingX: "7px",
  paddingY: "3px",
  fontSize: "0.8rem",
  textAlign: "center",
};

const isStickyColumn = (index: number) => index < 3;

const getStickyPosition = (index: number) => {
  if (index === 0) return 0; // RECIPE_NUMBER position
  if (index === 1) return 110; // MAKER_RESOURCE position
  if (index === 2) return 220; // PACKER_RESOURCE position
  if (index === 1) return 110; // MAKER_RESOURCE position
  if (index === 2) return 220; // PACKER_RESOURCE position
  return 0;
};

interface TableBodyProps {
  rows: Row<any>[];
}

const TableBodyComponent: React.FC<TableBodyProps> = ({ rows }) => {
  const theme = useTheme();
  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          sx={{
            "&:last-child td, &:last-child th": { border: 0 },
            height: "32px", // Fixed row height
            "& td": { height: "32px" }, // Ensure cells also have fixed height
          }}
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
                }), // Ensure cells with buttons have enough width
                ...(["PACKER_RESOURCE", "NEW_RO"].includes(cell.column.id) && {
                  minWidth: 120,
                }),
                // highlight updated cells
                ...(row.original.isUpdated &&
                  ["NEW_RO", "NEW_PLANNING_TIME", "RO_PCT_CHANGE"].includes(
                    cell.column.id
                  ) && {
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.grey[200]
                      : theme.palette.grey[800],
                  transition: "background-color 0.3s ease",
                }),
              }}
              style={{ minWidth: 120, maxWidth: 1000 }}
            >
              {cell.getValue() === undefined
                ? ""
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default TableBodyComponent;
