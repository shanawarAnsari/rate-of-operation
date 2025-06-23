import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
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
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface ColumnVisibilityControlProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  visibleColumnsCount: number;
  totalColumnsCount: number;
  disableColumns?: number[];
  availableColumns: string[];
  priorityColumns: string[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const ColumnItem = memo(
  ({
    column,
    index,
    disableColumns,
    priorityColumns,
  }: {
    column: {
      id: string;
      getIsVisible: () => boolean;
      getToggleVisibilityHandler: () => () => void;
    };
    index: number;
    disableColumns: number[];
    priorityColumns: string[];
  }) => {
    return (
      <MenuItem
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
                disableColumns.includes(index) || priorityColumns.includes(column.id)
              }
            />
          }
          label={column.id
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase())}
        />
      </MenuItem>
    );
  }
);

ColumnItem.displayName = "ColumnItem";

const ColumnVisibilityControl: React.FC<ColumnVisibilityControlProps> = ({
  anchorEl,
  open,
  handleClick,
  handleClose,
  visibleColumnsCount,
  totalColumnsCount,
  disableColumns = [],
  availableColumns,
  priorityColumns,
  columnVisibility,
  setColumnVisibility,
}) => {
  const theme = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const menuListRef = useRef<HTMLUListElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleChunk, setVisibleChunk] = useState(20);
  const CHUNK_SIZE = 20;

  const toggleDropdown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  }, []);

  const columns = useMemo(() => {
    return availableColumns.map((columnId) => ({
      id: columnId,
      getIsVisible: () => columnVisibility[columnId] !== false,
      getToggleVisibilityHandler: () => () => {
        setColumnVisibility((prev) => ({
          ...prev,
          [columnId]: !prev[columnId],
        }));
      },
    }));
  }, [availableColumns, columnVisibility, setColumnVisibility]);

  const handleMenuClose = useCallback(() => {
    handleClose();
    setShowDropdown(false);
  }, [handleClose]);

  const loadMoreColumns = useCallback(() => {
    if (isLoading || visibleChunk >= columns.length) return;

    setIsLoading(true);
    setTimeout(() => {
      setVisibleChunk((prev) => Math.min(prev + CHUNK_SIZE, columns.length));
      setIsLoading(false);
    }, 100);
  }, [columns.length, visibleChunk, isLoading]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const threshold = 50;

      if (
        scrollHeight - scrollTop <= clientHeight + threshold &&
        !isLoading &&
        visibleChunk < columns.length
      ) {
        loadMoreColumns();
      }
    },
    [loadMoreColumns, isLoading, visibleChunk, columns.length]
  );

  useEffect(() => {
    if (open) {
      setVisibleChunk(20);
      setIsLoading(false);
    }
  }, [open]);

  const visibleColumns = useMemo(() => {
    return columns.slice(0, visibleChunk);
  }, [columns, visibleChunk]);

  return (
    <>
      {!showDropdown ? (
        <IconButton
          onClick={toggleDropdown}
          sx={{
            p: 0.25,
            border: "1px solid",
            borderColor: "divider",
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
        <Collapse in={showDropdown} orientation="horizontal" timeout={200}>
          <TextField
            id="column-visibility-textfield"
            variant="outlined"
            size="small"
            value={`${visibleColumnsCount} of ${totalColumnsCount} columns visible`}
            onClick={handleClick}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={(e) => {
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
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "column-visibility-textfield",
          ref: menuListRef,
          onScroll: handleScroll,
          sx: {
            maxHeight: "400px",
            width: "300px",
            padding: 0,
            overflowY: "auto",
          },
        }}
        disableAutoFocusItem
        disableEnforceFocus
        keepMounted={false}
        transitionDuration={0}
      >
        {columns.length === 0 ? (
          <MenuItem sx={{ justifyContent: "center" }}>No columns available</MenuItem>
        ) : (
          <Box>
            {visibleColumns.map((column, index) => (
              <ColumnItem
                key={column.id}
                column={column}
                index={index}
                disableColumns={disableColumns}
                priorityColumns={priorityColumns}
              />
            ))}
            {(isLoading || visibleChunk < columns.length) && (
              <MenuItem
                sx={{
                  justifyContent: "center",
                  py: 2,
                  color: "text.secondary",
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="caption">
                      Loading more columns...
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                    Scroll down to load more ({columns.length - visibleChunk}
                    remaining)
                  </Typography>
                )}
              </MenuItem>
            )}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default memo(ColumnVisibilityControl);
