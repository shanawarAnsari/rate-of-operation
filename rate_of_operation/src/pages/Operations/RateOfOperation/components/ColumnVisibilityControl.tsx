import React from "react";
import {
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Table } from "@tanstack/react-table";

interface ColumnVisibilityControlProps {
  table: Table<any>;
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  visibleColumnsCount: number;
  totalColumnsCount: number;
  disableColumns?: number[]; // Add disableColumns prop
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
  table,
  anchorEl,
  open,
  handleClick,
  handleClose,
  visibleColumnsCount,
  totalColumnsCount,
  disableColumns = [], // Default to an empty array
}) => (
  <>
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
        "& .MuiInputBase-input": { cursor: "pointer", fontSize: "0.75rem" },
        "& .MuiInputBase-root": {
          height: 30,
          borderRadius: 0,
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
        sx: { maxHeight: "400px", overflow: "auto", width: "300px" },
      }}
    >
      {table.getAllLeafColumns().map(
        (column, index) =>
          !column.id.toLowerCase().includes("business") &&
          !column.id.toLowerCase().includes("category") && (
            <MenuItem key={column.id} sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: '0.75rem',
                padding: 0
              },
              p: 0,
              ml: 2
            }} >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    disabled={disableColumns.includes(index)} // Disable checkbox if column index is in disableColumns
                  />
                }
                label={column.id
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              />
            </MenuItem>
          )
      )}
    </Menu>
  </>
);

export default ColumnVisibilityControl;
