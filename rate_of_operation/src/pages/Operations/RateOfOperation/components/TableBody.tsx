import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import { flexRender, Row } from "@tanstack/react-table";

const cellStyles = {
  maxWidth: 100,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  paddingX: "7px",
  paddingY: "7px",
  fontSize: "0.9rem",
};

const isStickyColumn = (index: number) => index < 3;

const getStickyPosition = (index: number) => {
  if (index === 0) return 0;
  if (index === 1) return 85;
  if (index === 2) return 180;
  return 0;
};

interface TableBodyProps {
  rows: Row<any>[];
}

const TableBodyComponent: React.FC<TableBodyProps> = ({ rows }) => (
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
                boxShadow: index === 2 ? "2px 0px 3px -1px rgba(0,0,0,0.2)" : "none",
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
);

export default TableBodyComponent;
