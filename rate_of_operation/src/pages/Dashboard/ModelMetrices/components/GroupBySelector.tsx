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
import { Settings as DatasetIcon, Check as CheckIcon } from "@mui/icons-material";

export type GroupByLevel =
  | "INTERFACE"
  | "FACILITY_NAME"
  | "PLATFORM_NAME"
  | "MACHINE"
  | "PACKER_RESOURCE"
  | "RECIPE_NUMBER"
  | "PROCESS_ORDER_NUMBER";

interface GroupByOption {
  value: GroupByLevel;
  label: string;
}

interface GroupBySelectorProps {
  selectedGroupBy: GroupByLevel;
  onGroupByChange: (groupBy: GroupByLevel) => void;
}

const groupByOptions: GroupByOption[] = [
  {
    value: "INTERFACE",
    label: "Interface",
  },
  {
    value: "FACILITY_NAME",
    label: "Facility Name",
  },
  {
    value: "PLATFORM_NAME",
    label: "Platform Name",
  },
  {
    value: "MACHINE",
    label: "Machine",
  },
  {
    value: "PACKER_RESOURCE",
    label: "Packer Resource",
  },
  {
    value: "RECIPE_NUMBER",
    label: "Recipe Number",
  },
  {
    value: "PROCESS_ORDER_NUMBER",
    label: "Process Order Number",
  },
];

const GroupBySelector: React.FC<GroupBySelectorProps> = ({
  selectedGroupBy,
  onGroupByChange,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
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
        {groupByOptions.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={selectedGroupBy === option.value}
            onClick={() => handleSelect(option.value)}
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
    </>
  );
};

export default GroupBySelector;
