import React from "react";
import { TableBody, TableRow, TableCell, useTheme } from "@mui/material";
import { flexRender, Row } from "@tanstack/react-table";

const cellStyles = {
  maxWidth: 100,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingX: "7px",
  paddingY: "3px",
  fontSize: "0.8rem",
};

// Update to make 3 columns sticky
const isStickyColumn = (index: number) => index < 3;

// Update sticky positions for 3 columns
const getStickyPosition = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return 100; // Adjust based on first column width
  if (index === 2) return 200; // Adjust based on first and second column widths
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
                ...(row.original.isUpdated &&
                  ["NEW_SETUPTIME_MINUTES", "SETUPTIME_PCT_CHANGE"].includes(
                    cell.column.id
                  ) && {
                    backgroundColor: (theme: any) =>
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
