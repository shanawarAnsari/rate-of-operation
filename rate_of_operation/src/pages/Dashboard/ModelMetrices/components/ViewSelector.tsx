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
  Chip
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
              fontSize: "0.85rem", // slightly smaller for compactness
              color: "text.primary",
              letterSpacing: "0",
            }}
          >
            Rate of Operations Metrices
          </Typography>
        }
        sx={{
          bgcolor: "primary", // subtle background
          p: 0,
          borderRadius: "8px",
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
              px: 1.5,
              fontSize: "0.7rem",
              maxHeight: 25,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
              },
            },
          }}
        >
          <ToggleButton value="month">
            <CalendarIcon sx={{ mr: 0.3, fontSize: 12 }} />
            Month
          </ToggleButton>
          <ToggleButton value="trends">
            <TrendingUpIcon sx={{ mr: 0.3, fontSize: 12 }} />
            Trends
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default ViewSelector;