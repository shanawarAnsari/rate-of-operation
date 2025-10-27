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
  Paper,
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
}

const ViewSelector: React.FC<ViewSelectorProps> = ({
  viewMode,
  selectedMonth,
  availableMonths,
  onViewModeChange,
  onMonthChange,
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
        gap: 2,
        pb: 3,
        alignItems: { sm: "center" },
        justifyContent: "space-between",
      }}
    >
      {/* View Mode Toggle - Always on the left */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewModeChange}
        aria-label="view mode"
        size="small"
        sx={{
          height: "fit-content",
        }}
      >
        <ToggleButton
          value="month"
          aria-label="month view"
          sx={{
            px: 3,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            },
          }}
        >
          <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
          Month View
        </ToggleButton>
        <ToggleButton
          value="trends"
          aria-label="trends view"
          sx={{
            px: 3,
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            },
          }}
        >
          <TrendingUpIcon sx={{ mr: 1, fontSize: 18 }} />
          Trends
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Month Selector Container - Always reserves space on the right */}
      <Box sx={{ minWidth: 200, display: "flex", justifyContent: "flex-end" }}>
        {viewMode === "month" && (
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="month-select-label">Select Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Select Month"
              onChange={(e) => onMonthChange(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            >
              {availableMonths.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </Box>
  );
};

export default ViewSelector;
