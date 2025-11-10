import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Autocomplete,
  Divider,
  Popper,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useWrenchtimeFilters } from "./hooks/useWrenchtimeFilters";
import { useWrenchtimeFilterStore } from "../../../../../store/wrenchtimeFilterStore";
import { useUserStore } from "../../../../../store/userStore";

interface FilterPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  data: any[];
  onApply: (filters: { [key: string]: string[] }) => void;
  interfaces?: string[];
}

const FilterPopper: React.FC<FilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  data,
  onApply,
  interfaces = [],
}) => {
  const filterProperties = [
    "INTERFACE",
    "SETUP_MATRIX",
    "LOCATION",
    "FROM_SETUP_GROUP",
    "TO_SETUP_GROUP",
    "FROM_MACHINE",
    "FROM_PRODUCT_SIZE",
    "FROM_PRODUCT_VARIANT",
    "TO_MACHINE",
    "TO_PRODUCT_SIZE",
    "TO_PRODUCT_VARIANT",
  ];

  const {
    filterSelections,
    updateFilterSelection,
    resetFilters,
    setFilterSelections,
  } = useWrenchtimeFilterStore();

  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string[] }>({});
  const userAssignedInterfaces = useUserStore((state) => state.userAssignedInterfaces);

  const {
    filters,
    loading,
    error,
    localFilterSelections,
    updateLocalFilterSelection,
    resetLocalFilters,
  } = useWrenchtimeFilters();

  // Initialize local filter selections with current store values when popper opens
  useEffect(() => {
    if (open && filterSelections) {
      Object.keys(filterSelections).forEach((key) => {
        if (filterSelections[key] && filterSelections[key].length > 0) {
          updateLocalFilterSelection(key, filterSelections[key]);
        }
      });
    }
  }, [open]);

  // Generate filter options from data or filters
  useEffect(() => {
    const sourceData = filters.length > 0 ? filters : data;
    if (sourceData && sourceData.length > 0) {
      const options: { [key: string]: string[] } = {};

      filterProperties.forEach((prop) => {
        const uniqueValues = Array.from(
          new Set(sourceData.map((item: any) => item[prop]))
        );
        options[prop] = uniqueValues.filter(Boolean) as string[];
      });

      setFilterOptions({ ...options, "INTERFACE": userAssignedInterfaces });

      // Auto-select first INTERFACE option if available and not already selected
      if (interfaces.length > 0) {
        const currentInterfaceSelection = localFilterSelections.INTERFACE || [];
        if (currentInterfaceSelection.length === 0) {
          updateLocalFilterSelection("INTERFACE", [interfaces[0]]);
        }
      }
    }
  }, [filters, data]);

  const handleFilterChange = (field: string) => (event: any, newValue: string[]) => {
    updateLocalFilterSelection(field, newValue);
  };

  const handleApply = () => {
    setFilterSelections(localFilterSelections);
    onClose();
    onApply(localFilterSelections);
  };

  const handleReset = () => {
    resetLocalFilters();
    const resetSelections = Object.keys(filterSelections).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as { [key: string]: string[] });

    setFilterSelections(resetSelections);

    if (interfaces.length > 0) {
      updateLocalFilterSelection("INTERFACE", [interfaces[0]]);
    }
  };

  const setupTimeChangeOptions = [
    "0% to 5%",
    "5% to 10%",
    "10% to 15%",
    "above 15%",
  ];

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      sx={{
        zIndex: 2,
        maxWidth: "100vw",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <ClickAwayListener onClickAway={onClose}>
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            boxShadow: 3,
            borderRadius: 1,
            minWidth: 200,
            maxWidth: 400,
            maxHeight: 500,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontSize={14}>
              Filters
            </Typography>
            <CloseIcon onClick={onClose} sx={{ fontSize: 18, cursor: "pointer" }} />
          </Box>
          <Divider sx={{ mb: 1.5 }} />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              pr: 1,
            }}
          >
            {loading && Object.keys(filterOptions).length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error && Object.keys(filterOptions).length === 0 ? (
              <Typography
                color="error"
                variant="body2"
                sx={{ textAlign: "center", p: 2 }}
              >
                Error loading filters. Please try again.
              </Typography>
            ) : (
              <>
                {filterProperties.map((field) => (
                  <Autocomplete
                    key={field}
                    multiple
                    options={filterOptions[field] || []}
                    value={localFilterSelections[field] || []}
                    onChange={handleFilterChange(field)}
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={field.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          mt: 1,
                          mb: 0.5,
                          width: 300,
                          "& .MuiInputBase-input": { fontSize: 12 },
                          "& .MuiInputLabel-root": { fontSize: 12 },
                        }}
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li
                        {...props}
                        style={{
                          fontSize: 12,
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        <Checkbox style={{ marginRight: 1 }} checked={selected} />
                        {option}
                      </li>
                    )}
                    sx={{
                      "& .MuiAutocomplete-tag": { fontSize: 12 },
                    }}
                  />
                ))}
                <Autocomplete
                  multiple
                  options={setupTimeChangeOptions}
                  value={localFilterSelections.SETUPTIME_PCT_CHANGE || []}
                  onChange={(event, value) => {
                    updateLocalFilterSelection("SETUPTIME_PCT_CHANGE", value);
                  }}
                  disableCloseOnSelect
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="SETUP TIME CHANGE (abs)"
                      size="small"
                      sx={{
                        mt: 1,
                        mb: 0.5,
                        width: 300,
                        "& .MuiInputBase-input": { fontSize: 12 },
                        "& .MuiInputLabel-root": { fontSize: 12 },
                      }}
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li
                      {...props}
                      style={{
                        fontSize: 12,
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <Checkbox style={{ marginRight: 1 }} checked={selected} />
                      {option}
                    </li>
                  )}
                  sx={{
                    "& .MuiAutocomplete-tag": { fontSize: 12 },
                  }}
                />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button size="small" onClick={handleReset}>
              Reset
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleApply}
              disabled={
                !localFilterSelections.INTERFACE ||
                localFilterSelections.INTERFACE.length === 0
              }
            >
              Apply
            </Button>
          </Box>
        </Box>
      </ClickAwayListener>
    </Popper>
  );
};

export default FilterPopper;
