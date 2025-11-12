import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Chip,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { ViewMode } from "../hooks/useRateOfOperationsMetrics";

interface ViewSelectorProps {
  viewMode: ViewMode;
  selectedMonth: string;
  availableMonths: Array<{
    value: string;
    label: string;
    month: number;
    year: number;
  }>;
  onViewModeChange: (mode: ViewMode) => void;
  onMonthChange: (month: string) => void;
  title?: string;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  selectedMonth,
  availableMonths,
  onViewModeChange,
  onMonthChange,
  title = "Rate of Operations Metrics",
}) => {
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => {
    if (newMode !== null) {
      onViewModeChange(newMode);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        pb: 1.5,
      }}
    >
      <Chip
        label={
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem", // reduced from 0.85rem
              color: "text.primary",
              letterSpacing: "0",
            }}
          >
            {title}
          </Typography>
        }
        sx={{
          bgcolor: "primary",
          p: 0,
          borderRadius: "6px", // reduced from 8px
          height: 28, // explicit height control
        }}
      />

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
          alignItems: "center",
        }}
      >
        {viewMode === "month" && (
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="month-select-label" sx={{ fontSize: "0.75rem" }}>
              Month
            </InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Month"
              onChange={(e) => onMonthChange(e.target.value)}
              sx={{
                fontSize: "0.75rem",
                "& .MuiSelect-select": { py: 0.5 },
              }}
            >
              {availableMonths.map((month) => (
                <MenuItem
                  key={month.value}
                  value={month.value}
                  sx={{ fontSize: "0.75rem" }}
                >
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              px: 1,
              fontSize: "0.65rem", // reduced from 0.7rem
              height: 28, // reduced from 25
              minWidth: "auto",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
              },
            },
          }}
        >
          <ToggleButton value="month">
            <CalendarIcon sx={{ mr: 0.25, fontSize: 11 }} />
            Month
          </ToggleButton>
          <ToggleButton value="trends">
            <TrendingUpIcon sx={{ mr: 0.25, fontSize: 11 }} />
            Trends
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default ViewSelector;
