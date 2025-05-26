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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { filters } from "../../../../../services/responses"; // Import filters from responses

// Define the filter item interface to match the data structure
interface FilterItem {
  RECIPE_TYPE: string;
  MAKER_RESOURCE: string;
  PACKER_RESOURCE: string;
  PRODUCT_CODE: string;
  PROD_DESC: string;
  PRODUCT_VARIANT: string;
  PRODUCT_SIZE: string;
  SETUP_GROUP: string;
  [key: string]: string; // Allow string indexing
}

interface FilterPopperProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  data: any[];
  onApply: (filters: { [key: string]: string[] }) => void;
}

const FilterPopper: React.FC<FilterPopperProps> = ({
  anchorEl,
  open,
  onClose,
  data,
  onApply,
}) => {
  // Define the filter properties we want to use
  const filterProperties = [
    "RECIPE_TYPE",
    "MAKER_RESOURCE",
    "PACKER_RESOURCE",
    "PRODUCT_CODE",
    "PROD_DESC",
    "PRODUCT_VARIANT",
    "PRODUCT_SIZE",
    "SETUP_GROUP",
  ];

  // Create state for filter selections
  const [filterSelections, setFilterSelections] = useState<{
    [key: string]: string[];
  }>({
    RECIPE_TYPE: [],
    MAKER_RESOURCE: [],
    PACKER_RESOURCE: [],
    PRODUCT_CODE: [],
    PROD_DESC: [],
    PRODUCT_VARIANT: [],
    PRODUCT_SIZE: [],
    SETUP_GROUP: [],
    tro_change: [], // Keep the existing TRO change filter
  });
  // Store unique filter options for each property
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string[] }>(
    {}
  );

  // Extract unique values for each filter property from the filters data
  useEffect(() => {
    const options: { [key: string]: string[] } = {};

    filterProperties.forEach((prop) => {
      const uniqueValues = Array.from(
        new Set(filters.map((item: FilterItem) => item[prop]))
      );
      options[prop] = uniqueValues.filter(Boolean) as string[]; // Remove any undefined/null values
    });

    setFilterOptions(options);
  }, []);

  const handleFilterChange = (field: string) => (event: any, newValue: string[]) => {
    setFilterSelections((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleApply = () => {
    onApply(filterSelections);
    onClose();
  };

  const handleReset = () => {
    const resetSelections = Object.keys(filterSelections).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {} as { [key: string]: string[] });

    setFilterSelections(resetSelections);
    onApply(resetSelections);
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
              pr: 1, // Add padding for scrollbar
            }}
          >
            {/* Display filter autocompletes for each property */}
            {filterProperties.map((field) => (
              <Autocomplete
                key={field}
                multiple
                options={filterOptions[field] || []}
                value={filterSelections[field]}
                onChange={(event, value) => {
                  event.stopPropagation();
                  setFilterSelections((prev) => ({ ...prev, [field]: value }));
                }}
                disableCloseOnSelect // Prevent dropdown from closing after each selection
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
                  "& .MuiAutocomplete-tag": { fontSize: 12 }, // Rendered selections
                }}
              />
            ))}

            {/* Keep the existing TRO Change filter */}
            <Autocomplete
              multiple
              options={["0% to 5%", "5% to 10%", "10% to 15%", "above 15%"]}
              value={filterSelections.tro_change}
              onChange={(event, value) => {
                event.stopPropagation();
                setFilterSelections((prev) => ({ ...prev, tro_change: value }));
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
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button size="small" onClick={handleReset}>
              Reset
            </Button>
            <Button size="small" variant="contained" onClick={handleApply}>
              Apply
            </Button>
          </Box>
        </Box>
      </ClickAwayListener>
    </Popper>
  );
};

export default FilterPopper;