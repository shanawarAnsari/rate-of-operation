import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Popper,
  Select,
  Typography,
  TextField,
  Autocomplete,
  Divider,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFilters } from "./hooks/useFilters";
import { useFilterStore } from "../../../../../store/filterStore";

interface FilterItem {
  RECIPE_TYPE: string;
  MAKER_RESOURCE: string;
  PACKER_RESOURCE: string;
  PRODUCT_CODE: string;
  PROD_DESC: string;
  PRODUCT_VARIANT: string;
  PRODUCT_SIZE: string;
  SETUP_GROUP: string;
  INTERFACE: string;
  [key: string]: string;
}

interface FilterPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  data: any[];
  onApply: (filters: { [key: string]: string[] }) => void;
  interfaces: string[];
}

const FilterPopper: React.FC<FilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  data,
  onApply,
  interfaces
}) => {
  const filterProperties = [
    "INTERFACE",
    "RECIPE_TYPE",
    "MAKER_RESOURCE",
    "PACKER_RESOURCE",
    "PRODUCT_CODE",
    "PROD_DESC",
    "PRODUCT_VARIANT",
    "PRODUCT_SIZE",
    "SETUP_GROUP",
  ];

  const {
    filterSelections,
    updateFilterSelection,
    resetFilters,
    setFilterSelections,
  } = useFilterStore();

  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string[] }>(
    {}
  );
  const {
    filters,
    loading,
    error,
    localFilterSelections,
    updateLocalFilterSelection,
    resetLocalFilters,
  } = useFilters();

  // Initialize local filter selections with current store values when popper opens
  useEffect(() => {
    if (open && filterSelections) {
      // Initialize local selections with current store values
      Object.keys(filterSelections).forEach((key) => {
        if (filterSelections[key] && filterSelections[key].length > 0) {
          updateLocalFilterSelection(key, filterSelections[key]);
        }
      });
    }
  }, [open]);
  // Memoize filter options to avoid recalculating on every render
  useEffect(() => {
    if (filters && filters.length > 0 && Object.keys(filterOptions).length === 0) {
      const options: { [key: string]: string[] } = {};

      filterProperties.forEach((prop) => {
        const uniqueValues = Array.from(
          new Set(filters.map((item: FilterItem) => item[prop]))
        );
        options[prop] = uniqueValues.filter(Boolean) as string[];
      });

      setFilterOptions(options);
      // Auto-select first INTERFACE option if not already selected
      if (options.INTERFACE && options.INTERFACE.length > 0) {
        const currentInterfaceSelection = localFilterSelections.INTERFACE || [];
        if (currentInterfaceSelection.length === 0) {
          updateLocalFilterSelection("INTERFACE", [interfaces[0]]);
        }
      }
    }
  }, [filters]);

  const handleFilterChange = (field: string) => (event: any, newValue: string[]) => {
    updateLocalFilterSelection(field, newValue);
  };

  const handleApply = () => {
    // Update the store with local selections
    setFilterSelections(localFilterSelections);

    // Close the filter popup instantly
    onClose();

    // Pass the filter selections to parent component
    onApply(localFilterSelections);
  };
  const handleReset = () => {
    // Reset local selections
    resetLocalFilters();

    // Reset the store
    const resetSelections = Object.keys(filterSelections).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as { [key: string]: string[] });

    setFilterSelections(resetSelections);
    // Auto-select first INTERFACE option after reset
    if (filterOptions.INTERFACE && filterOptions.INTERFACE.length > 0) {
      updateLocalFilterSelection("INTERFACE", [interfaces[0]]);
    }
  };

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
        <>
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
              <CloseIcon
                onClick={onClose}
                sx={{ fontSize: 18, cursor: "pointer" }}
              />
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
                          label={field.replace("_", " ")}
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
                    options={["0% to 5%", "5% to 10%", "10% to 15%", "above 15%"]}
                    value={localFilterSelections.TRO_CHANGE || []}
                    onChange={(event, value) => {
                      updateLocalFilterSelection("TRO_CHANGE", value);
                    }}
                    disableCloseOnSelect
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="TRO CHANGE (abs)"
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
        </>
      </ClickAwayListener>
    </Popper>
  );
};

export default FilterPopper;
