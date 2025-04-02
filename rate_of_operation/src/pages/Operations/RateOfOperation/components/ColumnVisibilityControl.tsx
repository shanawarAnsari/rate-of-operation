import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Table } from "@tanstack/react-table";

interface ColumnVisibilityControlProps {
  table: Table<any>;
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  visibleColumnsCount: number;
  totalColumnsCount: number;
  disableColumns?: number[];
}

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
  table,
  anchorEl,
  open,
  handleClick,
  handleClose,
  visibleColumnsCount,
  totalColumnsCount,
  disableColumns = [],
}) => {
  const theme = useTheme(); // Access the theme for dynamic colors
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  return (
    <>
      {!showDropdown ? (
        <IconButton
          onClick={(e) => toggleDropdown(e)}
          sx={{
            p: 0.25,
            border: "1px solid",
            borderColor: "divider", // Matches the TextField's default border color
            borderRadius: "0px",
            "&:hover": {
              borderColor: (theme) => theme.palette.text.primary,
            },
          }}
        >
          <Tooltip title="Column Visibility" placement="top">
            <VisibilityIcon
              sx={{
                fontSize: "26px",
                color: theme.palette.primary.main,
              }}
            />
          </Tooltip>
        </IconButton>
      ) : (
        <Collapse in={showDropdown} orientation="horizontal" timeout={500}>
          <TextField
            id="column-visibility-textfield"
            variant="outlined"
            size="small"
            value={`${visibleColumnsCount} of ${totalColumnsCount} columns visible`}
            onClick={(event: any) => handleClick(event)}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={(e: any) => {
                      toggleDropdown(e);
                      handleClose();
                    }}
                    sx={{ padding: 0 }}
                  >
                    <VisibilityOffIcon
                      sx={{
                        fontSize: "26px",
                        ml: -1,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDownIcon
                    sx={{ color: theme.palette.text.primary }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              width: "220px",
              cursor: "pointer",
              "& .MuiInputBase-input": {
                cursor: "pointer",
                fontSize: "0.75rem",
              },
              "& .MuiInputBase-root": {
                height: 30,
                borderRadius: 0,
              },
            }}
          />
        </Collapse>
      )}
      <Menu
        id="column-visibility-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          handleClose();
          setShowDropdown(false); // Close dropdown when menu closes
        }}
        MenuListProps={{
          "aria-labelledby": "column-visibility-textfield",
          sx: { maxHeight: "400px", overflow: "auto", width: "300px" },
        }}
      >
        {table.getAllLeafColumns().map(
          (column, index) =>
            !column.id.toLowerCase().includes("business") &&
            !column.id.toLowerCase().includes("category") && (
              <MenuItem
                key={column.id}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.75rem",
                    padding: 0,
                  },
                  p: 0,
                  ml: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      disabled={disableColumns.includes(index)}
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
};

export default ColumnVisibilityControl;
