import React, { useState, useMemo } from "react";
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
import { useColumnVisibility } from "../hooks/useColumnVisibility";

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
  const priorityColumnIds = ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE"];
  const { columnVisibility, setColumnVisibility } = useColumnVisibility();
  const theme = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };
  // Get columns from columnVisibility state (simplified approach)
  const columns = useMemo(() => {
    const hiddenFromDropdown = ["RATE_OF_OPERATION_KEY", "SNAPSHOT_DATE"];
    const columnIds = Object.keys(columnVisibility).filter(
      (id) => !hiddenFromDropdown.includes(id)
    );
    return columnIds.map((id) => ({
      id,
      getIsVisible: () => columnVisibility[id] !== false,
      getToggleVisibilityHandler: () => () => {
        setColumnVisibility((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      },
    }));
  }, [columnVisibility, setColumnVisibility]);

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
      )}{" "}
      <Menu
        id="column-visibility-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          handleClose();
          setShowDropdown(false);
        }}
        MenuListProps={{
          "aria-labelledby": "column-visibility-textfield",
          sx: { maxHeight: "400px", width: "300px", padding: 0 },
        }}
      >
        {columns.length === 0 ? (
          <MenuItem sx={{ justifyContent: "center" }}>No columns available</MenuItem>
        ) : (
          columns.map((column, index) => (
            <MenuItem
              key={column.id}
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.75rem",
                  padding: 0,
                },
                p: 0,
                ml: 2,
                height: "36px",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    disabled={
                      disableColumns.includes(index) ||
                      priorityColumnIds.includes(column.id)
                    }
                  />
                }
                label={column.id
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c: string) => c.toUpperCase())}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default ColumnVisibilityControl;
