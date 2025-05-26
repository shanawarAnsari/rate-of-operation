import React, { useState, useMemo, useRef, useEffect } from "react";
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
  Box,
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

const ITEMS_PER_BATCH = 20;

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
  // Add priority columns' IDs to disableColumns
  const priorityColumnIds = ["RECIPE_NUMBER", "MAKER_RESOURCE", "PACKER_RESOURCE"];
  const theme = useTheme(); // Access the theme for dynamic colors
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_BATCH);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  }; // Filter columns to exclude business and category columns
  const filteredColumns = useMemo(() => {
    try {
      // First try to get all leaf columns
      const allColumns = table.getAllLeafColumns();
      console.log("All columns length:", allColumns.length);

      // If no columns found, try getting from getAllFlatColumns
      if (!allColumns || allColumns.length === 0) {
        const flatColumns = table.getAllFlatColumns();
        console.log("Flat columns length:", flatColumns.length);

        if (!flatColumns || flatColumns.length === 0) {
          console.error("No columns found in the table!");
          return [];
        }

        return flatColumns.filter(
          (column) =>
            !column.id.toLowerCase().includes("business") &&
            !column.id.toLowerCase().includes("category")
        );
      }

      const filtered = allColumns.filter(
        (column) =>
          !column.id.toLowerCase().includes("business") &&
          !column.id.toLowerCase().includes("category")
      );

      console.log("Filtered columns length:", filtered.length);
      return filtered;
    } catch (error) {
      console.error("Error accessing table columns:", error);
      return [];
    }
  }, [table]);

  // Reset displayed items when menu is closed
  useEffect(() => {
    if (!open) {
      setDisplayedItems(ITEMS_PER_BATCH);
    }
  }, [open]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayedItems < filteredColumns.length) {
        setDisplayedItems((prev) =>
          Math.min(prev + ITEMS_PER_BATCH, filteredColumns.length)
        );
      }
    }, observerOptions);

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [displayedItems, filteredColumns.length]);

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
          setShowDropdown(false); // Close dropdown when menu closes
        }}
        MenuListProps={{
          "aria-labelledby": "column-visibility-textfield",
          sx: { maxHeight: "400px", width: "300px", padding: 0 },
        }}
      >
        <Box sx={{ overflow: "auto", maxHeight: 400 }}>
          {filteredColumns.length === 0 ? (
            <MenuItem sx={{ justifyContent: "center" }}>
              No columns available
            </MenuItem>
          ) : (
            <>
              {filteredColumns.slice(0, displayedItems).map((column, index) => (
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
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  />
                </MenuItem>
              ))}

              {/* Invisible loader element for intersection observer */}
              {displayedItems < filteredColumns.length && (
                <Box ref={loaderRef} sx={{ height: 5 }} />
              )}
            </>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default ColumnVisibilityControl;
