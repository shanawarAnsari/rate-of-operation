import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Chip,
  Popover,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  IconButton,
  Divider,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ShowChart as ShowChartIcon,
  ManageSearch as FilterListIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  FilterAlt as DatasetIcon,
} from "@mui/icons-material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { SetupTimeGroupByLevel } from "./GroupBySelector";
import { useTrendsGroupedMetrics } from "../hooks/useTrendsGroupedMetrics";

const SetupTimeTrendsGroupedChart: React.FC = () => {
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState<SetupTimeGroupByLevel>("INTERFACE");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [tempSelectedGroups, setTempSelectedGroups] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [groupByAnchorEl, setGroupByAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    groupedTrendsMetrics,
    totalGroupsCount,
    allAvailableGroups,
    isShowingTopTwo,
    loading,
    error,
  } = useTrendsGroupedMetrics({
    groupBy,
    selectedGroups: selectedGroups.length > 0 ? selectedGroups : undefined,
    modelType: "ST", // Setup Time model type
  });

  const handleGroupByChange = (newGroupBy: SetupTimeGroupByLevel) => {
    setGroupBy(newGroupBy);
    setSelectedGroups([]); // Reset selection when groupBy changes
    setTempSelectedGroups([]); // Reset temp selection
    setGroupByAnchorEl(null); // Close the menu
  };

  const handleGroupByClick = (event: React.MouseEvent<HTMLElement>) => {
    setGroupByAnchorEl(event.currentTarget);
  };

  const handleGroupByClose = () => {
    setGroupByAnchorEl(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setTempSelectedGroups(selectedGroups); // Initialize temp with current selection
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
    setSearchTerm("");
    setTempSelectedGroups([]); // Clear temp selection on close
  };

  const handleToggleGroup = (group: string) => {
    setTempSelectedGroups((prev) => {
      if (prev.includes(group)) {
        return prev.filter((g) => g !== group);
      } else if (prev.length < 6) {
        return [...prev, group];
      }
      return prev;
    });
  };

  const handleClearAll = () => {
    setTempSelectedGroups([]);
  };

  const handleApply = () => {
    setSelectedGroups(tempSelectedGroups); // Apply temp selection to actual selection
    handleFilterClose();
  };

  const filteredGroups = allAvailableGroups.filter((group) =>
    group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const open = Boolean(anchorEl);
  const groupByOpen = Boolean(groupByAnchorEl);

  // Get label for the selected groupBy
  const getGroupByLabel = (groupBy: SetupTimeGroupByLevel): string => {
    const groupByOptions = [
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
    return (
      groupByOptions.find((option) => option.value === groupBy)?.label || groupBy
    );
  };

  const groupByOptions: Array<{ value: SetupTimeGroupByLevel; label: string }> = [
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

  // Prepare categories (all unique months across all groups)
  const allMonths = new Set<string>();
  groupedTrendsMetrics.forEach((group) => {
    group.trendData.forEach((point) => {
      const monthKey = `${point.month.slice(0, 3)} ${point.year}`;
      allMonths.add(monthKey);
    });
  });
  const categories = Array.from(allMonths).sort((a, b) => {
    const [aMonth, aYear] = a.split(" ");
    const [bMonth, bYear] = b.split(" ");
    const aDate = new Date(`${aMonth} 1, ${aYear}`);
    const bDate = new Date(`${bMonth} 1, ${bYear}`);
    return aDate.getTime() - bDate.getTime();
  });

  // Color palette for groups
  const colorPalette = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ];

  // Prepare series data
  const combinedSeries: Array<{
    name: string;
    data: number[];
    color: string;
    type: string;
  }> = [];

  groupedTrendsMetrics.forEach((group, groupIndex) => {
    const aimlData: number[] = [];
    const plannedData: number[] = [];
    const baseColor = colorPalette[groupIndex % colorPalette.length];

    categories.forEach((category) => {
      const [monthName, year] = category.split(" ");
      const dataPoint = group.trendData.find(
        (point) =>
          point.month.slice(0, 3) === monthName && point.year.toString() === year
      );

      aimlData.push(dataPoint ? Number(dataPoint.aimlRoMAE.toFixed(2)) : 0);
      plannedData.push(dataPoint ? Number(dataPoint.plannedRoMAE.toFixed(2)) : 0);
    });

    // AI ML Setup Time series
    combinedSeries.push({
      name: `${group.groupName} - AI ML Setup Time`,
      data: aimlData,
      color: baseColor,
      type: "line",
    });

    // Planned Setup Time series
    combinedSeries.push({
      name: `${group.groupName} - Planned Setup Time`,
      data: plannedData,
      color: baseColor + "80", // Add transparency
      type: "line",
    });
  });

  const combinedChartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 400,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "11px",
        },
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: "Mean Absolute Error (MAE) - min/su",
        style: {
          color: theme.palette.text.secondary,
        },
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(4) + " min/su";
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: theme.palette.text.primary,
      },
      fontSize: "12px",
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    colors: combinedSeries.map((series) => series.color || "#3b82f6"),
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Loading Setup Time Trends Chart...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" color="error" gutterBottom>
              Error Loading Setup Time Trends Chart
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error.message}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Combined Trends Chart */}
        <Grid item xs={12}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
                <ShowChartIcon sx={{ color: "text.secondary" }} />
                <Typography
                  sx={{
                    fontWeight: 600,
                    flex: 1,
                    fontSize: 18,
                    color: "text.secondary",
                  }}
                >
                  Setup Time Trends by {getGroupByLabel(groupBy)}
                </Typography>
                <Chip
                  label={
                    isShowingTopTwo
                      ? `Showing 2 of ${totalGroupsCount}`
                      : `Showing ${selectedGroups.length} of ${totalGroupsCount}`
                  }
                  size="medium"
                  icon={<FilterListIcon />}
                  onClick={handleFilterClick}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(0, 0, 0, 0.08)"
                        : "rgba(255, 255, 255, 0.16)",
                    color: "text.primary",
                    fontWeight: 600,
                    px: 1,
                    fontSize: "0.85rem",
                    height: 32,
                    cursor: "pointer",
                    "& .MuiChip-icon": {
                      color: "primary.main",
                    },
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0, 0, 0, 0.12)"
                          : "rgba(255, 255, 255, 0.20)",
                    },
                  }}
                />
                <Chip
                  label={getGroupByLabel(groupBy)}
                  icon={<DatasetIcon />}
                  onClick={handleGroupByClick}
                  sx={{
                    bgcolor: (theme) =>
                      theme.palette.mode === "light"
                        ? "rgba(0, 0, 0, 0.08)"
                        : "rgba(255, 255, 255, 0.16)",
                    fontWeight: 600,
                    px: 1,
                    fontSize: "0.85rem",
                    height: 32,
                    cursor: "pointer",
                    "& .MuiChip-icon": {
                      color: "primary.main",
                    },
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "light"
                          ? "rgba(0, 0, 0, 0.12)"
                          : "rgba(255, 255, 255, 0.20)",
                    },
                  }}
                />
              </Box>

              {/* Chart */}
              {combinedSeries.length > 0 ? (
                <>
                  <Box sx={{ height: 350 }}>
                    <Chart
                      options={combinedChartOptions}
                      series={combinedSeries}
                      type="line"
                      height={350}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {isShowingTopTwo
                      ? `Showing setup time trends for top 2 ${getGroupByLabel(
                          groupBy
                        ).toLowerCase()} with highest average error values`
                      : `Setup time error trends comparison for selected ${getGroupByLabel(
                          groupBy
                        ).toLowerCase()}`}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 3,
                      mt: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <svg width="40" height="10" style={{ display: "block" }}>
                        <line
                          x1="2"
                          y1="5"
                          x2="38"
                          y2="5"
                          stroke={theme.palette.text.primary}
                          strokeWidth="3"
                          strokeDasharray="6, 4"
                          strokeLinecap="round"
                        />
                      </svg>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "text.primary",
                        }}
                      >
                        AI ML Setup Time - MAE
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <svg width="40" height="10" style={{ display: "block" }}>
                        <line
                          x1="2"
                          y1="5"
                          x2="38"
                          y2="5"
                          stroke={theme.palette.text.primary}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "text.primary",
                        }}
                      >
                        PLANNED Setup Time - MAE
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <Typography>No trends data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Group By Menu */}
      <Menu
        anchorEl={groupByAnchorEl}
        open={groupByOpen}
        onClose={handleGroupByClose}
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
            selected={groupBy === option.value}
            onClick={() => handleGroupByChange(option.value)}
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
                  fontWeight: groupBy === option.value ? 700 : 300,
                }}
              >
                {option.label}
              </Typography>
              {groupBy === option.value && (
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

      {/* Filter Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
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
            width: 380,
            maxHeight: 580,
            borderRadius: 3,
            boxShadow: theme.shadows[12],
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Filter {getGroupByLabel(groupBy)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Select up to 6 items
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleFilterClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Selected Count Badge */}
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`${tempSelectedGroups.length} of 6 selected`}
              color={"primary"}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${getGroupByLabel(groupBy).toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* List of Groups */}
          <Paper
            variant="outlined"
            sx={{
              maxHeight: 320,
              overflow: "auto",
              borderRadius: 2,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: theme.palette.mode === "light" ? "#f1f1f1" : "#2a2a2a",
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.mode === "light" ? "#888" : "#555",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: theme.palette.mode === "light" ? "#555" : "#777",
              },
            }}
          >
            <List disablePadding>
              {filteredGroups.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No matches found"
                    sx={{ textAlign: "center", color: "text.secondary" }}
                  />
                </ListItem>
              ) : (
                filteredGroups.map((group, index) => {
                  const isSelected = tempSelectedGroups.includes(group);
                  const isDisabled = !isSelected && tempSelectedGroups.length >= 6;

                  return (
                    <React.Fragment key={group}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => !isDisabled && handleToggleGroup(group)}
                          disabled={isDisabled}
                          sx={{
                            py: 1.5,
                            px: 2,
                            "&:hover": {
                              bgcolor:
                                theme.palette.mode === "light"
                                  ? "#f5f5f5"
                                  : "#2a2a2a",
                            },
                            opacity: isDisabled ? 0.5 : 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: 1,
                              border: `2px solid ${
                                isSelected
                                  ? theme.palette.primary.main
                                  : theme.palette.divider
                              }`,
                              bgcolor: isSelected
                                ? theme.palette.primary.main
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                              transition: "all 0.2s",
                            }}
                          >
                            {isSelected && (
                              <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
                            )}
                          </Box>
                          <ListItemText
                            primary={group}
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: isSelected ? 600 : 400,
                                fontSize: "0.9rem",
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {index < filteredGroups.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })
              )}
            </List>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleClearAll}
              disabled={tempSelectedGroups.length === 0}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleApply}
              disabled={tempSelectedGroups.length === 0}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default SetupTimeTrendsGroupedChart;
