import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { FilterAlt as DatasetIcon, Check as CheckIcon } from "@mui/icons-material";

// Rate of Operations group by options
export type ROPGroupByLevel =
  | "INTERFACE"
  | "PLATFORM"
  | "FACILITY_NAME"
  | "MACHINE"
  | "MAKER_RESOURCE"
  | "PACKER_RESOURCE"
  | "CATEGORY"
  | "BUSINESS_UNIT";

// Setup Time group by options
export type SetupTimeGroupByLevel =
  | "SETUP_MATRIX"
  | "FROM_SETUP_GROUP"
  | "TO_SETUP_GROUP"
  | "SEGEMENT"
  | "BUSINESS_UNIT"
  | "INTERFACE"
  | "PLATFORM"
  | "FACILITY_NAME"
  | "MACHINE";

// Union type for backward compatibility
export type GroupByLevel = ROPGroupByLevel | SetupTimeGroupByLevel;

interface GroupByOption {
  value: GroupByLevel;
  label: string;
}

interface GroupBySelectorProps {
  selectedGroupBy: GroupByLevel;
  onGroupByChange: (groupBy: GroupByLevel) => void;
  onOpen?: (event: React.MouseEvent<HTMLElement>) => void;
  modelType?: "ROP" | "ST"; // Add modelType prop
}

// Rate of Operations group by options
const ropGroupByOptions: Array<{ value: ROPGroupByLevel; label: string }> = [
  { value: "BUSINESS_UNIT", label: "Business Unit" },
  { value: "CATEGORY", label: "Category" },
  { value: "FACILITY_NAME", label: "Facility Name" },
  { value: "INTERFACE", label: "Interface" },
  { value: "MACHINE", label: "Machine" },
  { value: "MAKER_RESOURCE", label: "Maker Resource" },
  { value: "PACKER_RESOURCE", label: "Packer Resource" },
  { value: "PLATFORM", label: "Platform" },
];

// Setup Time group by options
const setupTimeGroupByOptions: Array<{
  value: SetupTimeGroupByLevel;
  label: string;
}> = [
  { value: "SETUP_MATRIX", label: "Setup Matrix" },
  { value: "FROM_SETUP_GROUP", label: "From Setup Group" },
  { value: "TO_SETUP_GROUP", label: "To Setup Group" },
  { value: "SEGEMENT", label: "Segment" },
  { value: "BUSINESS_UNIT", label: "Business Unit" },
  { value: "INTERFACE", label: "Interface" },
  { value: "PLATFORM", label: "Platform" },
  { value: "FACILITY_NAME", label: "Facility Name" },
  { value: "MACHINE", label: "Machine" },
];

const GroupBySelector: React.FC<GroupBySelectorProps> = ({
  selectedGroupBy,
  onGroupByChange,
  onOpen,
  modelType = "ROP", // Default to ROP for backward compatibility
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Get the appropriate options based on model type
  const groupByOptions =
    modelType === "ST" ? setupTimeGroupByOptions : ropGroupByOptions;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (onOpen) {
      onOpen(event);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (groupBy: GroupByLevel) => {
    onGroupByChange(groupBy);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: "primary.main",
          "&:hover": {
            backgroundColor: theme.palette.mode === "light" ? "#f0f0f0" : "#2a2a2a",
          },
        }}
      >
        <DatasetIcon />
      </IconButton>
      {!onOpen && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 0,
              minWidth: 280,
              maxWidth: 320,
              borderRadius: 2,
              boxShadow: theme.shadows[10],
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
              }}
            >
              Group By
            </Typography>
          </Box>
          <Divider />
          {groupByOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={selectedGroupBy === option.value}
              onClick={() => handleSelect(option.value as GroupByLevel)}
              sx={{
                py: 1.5,
                px: 2,
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode === "light" ? "#f0f0f0" : "#2a2a2a",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "light" ? "#e8e8e8" : "#333333",
                  },
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: "0.875rem",
                    fontWeight: selectedGroupBy === option.value ? 700 : 300,
                  }}
                >
                  {option.label}
                </Typography>
                {selectedGroupBy === option.value && (
                  <CheckIcon
                    sx={{
                      fontSize: 18,
                      color: "primary.main",
                      ml: 1,
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default GroupBySelector;
