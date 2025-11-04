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
  BarChart as BarChartIcon,
  ManageSearch as FilterListIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  FilterAlt as DatasetIcon,
} from "@mui/icons-material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MockDataItem } from "../hooks/useRateOfOperationsMetrics";
import { useGroupedMetrics } from "../hooks/useGroupedMetrics";
import GroupBySelector, { GroupByLevel } from "./GroupBySelector";

interface MonthlyViewChartsProps {
  data: MockDataItem[];
  selectedMonth?: string;
}

const MonthlyViewCharts: React.FC<MonthlyViewChartsProps> = ({
  data,
  selectedMonth,
}) => {
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState<GroupByLevel>("INTERFACE");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [tempSelectedGroups, setTempSelectedGroups] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [groupByAnchorEl, setGroupByAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { groupedMetrics, totalGroupsCount, allAvailableGroups, isShowingTopTen } =
    useGroupedMetrics({
      data,
      groupBy,
      selectedMonth,
      selectedGroups: selectedGroups.length > 0 ? selectedGroups : undefined,
    });

  const handleGroupByChange = (newGroupBy: GroupByLevel) => {
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
      } else if (prev.length < 10) {
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
  const getGroupByLabel = (groupBy: GroupByLevel): string => {
    const labels: Record<GroupByLevel, string> = {
      INTERFACE: "Interface",
      FACILITY_NAME: "Facility Name",
      MACHINE: "Machine",
      PACKER_RESOURCE: "Packer Resource",
      PLATFORM_NAME: "Platform Name",
      BUSINESS_UNIT: "Business Unit",
      CATEGORY: "Category",
    };
    return labels[groupBy];
  };

  const groupByOptions: Array<{ value: GroupByLevel; label: string }> = [
    { value: "BUSINESS_UNIT", label: "Business Unit" },
    { value: "CATEGORY", label: "Category" },
    { value: "FACILITY_NAME", label: "Facility Name" },
    { value: "INTERFACE", label: "Interface" },
    { value: "MACHINE", label: "Machine" },
    { value: "PACKER_RESOURCE", label: "Packer Resource" },
    { value: "PLATFORM_NAME", label: "Platform Name" },
  ];

  // Chart Options
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toFixed(2),
      offsetY: -20,
      style: {
        fontSize: "13px",
        colors: [theme.palette.text.primary],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: groupedMetrics.map((m) => m.groupName),
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        rotate: -45,
        trim: true,
        hideOverlappingLabels: true,
      },
      tickPlacement: "on",
    },
    yaxis: {
      title: {
        text: "Mean Absolute Error (MAE)",
        style: {
          color: theme.palette.text.secondary,
          fontWeight: 600,
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: "14px",
        },
        formatter: (val: number) => val.toFixed(2),
      },
    },
    fill: {
      opacity: 0.9,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: theme.palette.text.primary,
      },
    },
    colors: ["#092ACD", "#f59e0b"],
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => val.toFixed(4),
      },
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const metric = groupedMetrics[dataPointIndex];
        const series = w.config.series;
        const aimlValue = series[0].data[dataPointIndex];
        const plannedValue = series[1].data[dataPointIndex];

        return `
          <div style="padding: 10px; background: ${
            theme.palette.background.paper
          }; border: 1px solid ${theme.palette.divider};">
            <div style="font-weight: 600; margin-bottom: 5px; color: ${
              theme.palette.text.primary
            };">
              ${metric.groupName}
            </div>
            <div style="color: ${theme.palette.text.secondary}; font-size: 12px;">
              <div>AI ML RO - MAE: <strong style="color: #092ACD;">${aimlValue.toFixed(
                4
              )}</strong></div>
              <div>PLANNED RO - MAE: <strong style="color: #f59e0b;">${plannedValue.toFixed(
                4
              )}</strong></div>
              <div>Process Orders: <strong>${metric.processOrderCount}</strong></div>
            </div>
          </div>
        `;
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
  };

  const chartSeries = [
    {
      name: "AI ML RO - MAE",
      data: groupedMetrics.map((m) => Number(m.aimlRoMAE.toFixed(4))),
    },
    {
      name: "PLANNED RO - MAE",
      data: groupedMetrics.map((m) => Number(m.plannedRoMAE.toFixed(4))),
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Grouped Bar Chart */}
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
                <BarChartIcon sx={{ color: "text.secondary" }} />
                <Typography
                  sx={{
                    fontWeight: 600,
                    flex: 1,
                    fontSize: 18,
                    color: "text.secondary",
                  }}
                >
                  Error Analysis by {getGroupByLabel(groupBy)}
                </Typography>
                <Chip
                  label={
                    isShowingTopTen
                      ? `Showing 10 of ${totalGroupsCount}`
                      : `Showing ${groupedMetrics.length} of ${totalGroupsCount}`
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
              {groupedMetrics.length > 0 ? (
                <>
                  <Box sx={{ height: 350 }}>
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      height={350}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    {isShowingTopTen ? (
                      <>
                        Showing <strong>Top 10</strong>{" "}
                        {getGroupByLabel(groupBy).toLowerCase()} with highest error
                        values (out of {totalGroupsCount} total groups)
                      </>
                    ) : (
                      <>
                        Comparing AI ML RO and PLANNED RO Mean Absolute Error across{" "}
                        {getGroupByLabel(groupBy).toLowerCase()}
                      </>
                    )}
                  </Typography>
                </>
              ) : (
                <Box
                  sx={{
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No data available for the selected month and grouping
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                Select up to 10 items
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleFilterClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Selected Count Badge */}
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`${tempSelectedGroups.length} of 10 selected`}
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
                  const isDisabled = !isSelected && tempSelectedGroups.length >= 10;

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
    </Box>
  );
};

export default MonthlyViewCharts;
