import React, { useState } from "react";
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
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    resource: [],
    material: [],
    material_desc: [],
    product_code: [],
    trade_code: [],
    prod_variant: [],
    prod_size: [],
    tro_change: [], // Add TRO Change to filters state
  });

  const handleFilterChange = (field: string) => (event: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      resource: [],
      material: [],
      material_desc: [],
      product_code: [],
      trade_code: [],
      prod_variant: [],
      prod_size: [],
      tro_change: [],
    });
    onApply({
      resource: [],
      material: [],
      material_desc: [],
      product_code: [],
      trade_code: [],
      prod_variant: [],
      prod_size: [],
      tro_change: [],
    });
  };

  const getDistinctValues = (field: string) =>
    Array.from(new Set(data.map((item) => item[field])));

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
            {[
              "resource",
              "material",
              "material_desc",
              "product_code",
              "trade_code",
              "prod_variant",
              "prod_size",
            ].map((field) => (
              <Autocomplete
                key={field}
                multiple
                options={getDistinctValues(field)}
                value={filters[field]}
                onChange={(event, value) => {
                  event.stopPropagation();
                  setFilters((prev) => ({ ...prev, [field]: value }));
                }}
                disableCloseOnSelect // Prevent dropdown from closing after each selection
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={field.replace("_", " ").toUpperCase()}
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
            <Autocomplete
              multiple
              options={[
                "less than 0%",
                "0% to 5%",
                "5% to 10%",
                "10% to 15%",
                "above 15%",
              ]} // TRO Change options
              value={filters.tro_change}
              onChange={(event, value) => {
                event.stopPropagation();
                setFilters((prev) => ({ ...prev, tro_change: value }));
              }}
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="TRO CHANGE"
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
