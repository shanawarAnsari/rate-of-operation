import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  useTheme,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tabs,
  Tab,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  Warning as WarningIcon,
  Psychology as PsychologyIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MonthlyTrend } from "../hooks/useRateOfOperationsMetrics";
import { mockData } from "../mockdata.js";

const GROUP_LABELS: Record<string, string> = {
  overall: "Overall",
  interface: "Interface",
  facility: "Facility",
  machine: "Machine",
  packer: "Packer Resource",
};

const TAB_OPTIONS = [
  "overall",
  "interface",
  "facility",
  "machine",
  "packer",
] as const;

interface TrendsChartProps {
  trends: MonthlyTrend[];
  loading?: boolean;
}

const TrendsChart: React.FC<TrendsChartProps> = ({ trends, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <Typography variant="h6">Loading trends...</Typography>
      </Box>
    );
  }

  // Prepare data for charts
  const categories = trends.map(
    (trend) => `${trend.month.slice(0, 3)} ${trend.year}`
  );
  const poData = trends.map((trend) => trend.numberOfPO);
  const aimlErrorData = trends.map((trend) =>
    Number(trend.absoluteErrorAIML.toFixed(4))
  );
  const recommendedErrorData = trends.map((trend) =>
    Number(trend.absoluteErrorRecommended.toFixed(4))
  );
  const regressionErrorData = trends.map((trend) =>
    Number(trend.absoluteErrorRegression.toFixed(4))
  );

  // Calculate trend direction
  const getTrendDirection = (data: number[]) => {
    if (data.length < 2) return "flat";
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first) return "up";
    if (last < first) return "down";
    return "flat";
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUpIcon sx={{ fontSize: 20 }} />;
      case "down":
        return <TrendingDownIcon sx={{ fontSize: 20 }} />;
      default:
        return <TrendingFlatIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "success.main";
      case "down":
        return "error.main";
      default:
        return "grey.500";
    }
  };

  // Chart options for different metrics
  const getSparklineOptions = (color: string, title: string): ApexOptions => ({
    chart: {
      type: "area",
      height: 120,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: [color],
    tooltip: {
      enabled: true,
      theme: theme.palette.mode,
      style: {
        fontSize: "12px",
      },
      x: {
        show: true,
        formatter: (value: number, { dataPointIndex }: any) =>
          categories[dataPointIndex],
      },
      y: {
        title: {
          formatter: () => `${title}: `,
        },
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: categories,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  });

  const getCurrentValue = (data: number[]) => data[data.length - 1] || 0;
  const getPreviousValue = (data: number[]) => data[data.length - 2] || 0;
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Process Orders Spark Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    mr: 2,
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Process Orders
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      {getCurrentValue(poData)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(getTrendDirection(poData))}
                      label={`${getPercentageChange(
                        getCurrentValue(poData),
                        getPreviousValue(poData)
                      ).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: getTrendColor(getTrendDirection(poData)),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: 120, mt: 2 }}>
                <Chart
                  options={getSparklineOptions(
                    theme.palette.primary.main,
                    "Process Orders"
                  )}
                  series={[{ name: "Process Orders", data: poData }]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AIML Error Spark Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "info.light",
                    color: "info.contrastText",
                    mr: 2,
                  }}
                >
                  <PsychologyIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    AIML Process Error
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "info.main" }}
                    >
                      {getCurrentValue(aimlErrorData).toFixed(2)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(getTrendDirection(aimlErrorData))}
                      label={`${getPercentageChange(
                        getCurrentValue(aimlErrorData),
                        getPreviousValue(aimlErrorData)
                      ).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: getTrendColor(getTrendDirection(aimlErrorData)),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: 120, mt: 2 }}>
                <Chart
                  options={getSparklineOptions(
                    theme.palette.info.main,
                    "AIML Error"
                  )}
                  series={[{ name: "AIML Error", data: aimlErrorData }]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommended Error Spark Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                    mr: 2,
                  }}
                >
                  <WarningIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Recommended Process Error
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "warning.main" }}
                    >
                      {getCurrentValue(recommendedErrorData).toFixed(2)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(getTrendDirection(recommendedErrorData))}
                      label={`${getPercentageChange(
                        getCurrentValue(recommendedErrorData),
                        getPreviousValue(recommendedErrorData)
                      ).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: getTrendColor(
                          getTrendDirection(recommendedErrorData)
                        ),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: 120, mt: 2 }}>
                <Chart
                  options={getSparklineOptions(
                    theme.palette.warning.main,
                    "Recommended Error"
                  )}
                  series={[
                    { name: "Recommended Error", data: recommendedErrorData },
                  ]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Regression Error Spark Card */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "error.light",
                    color: "error.contrastText",
                    mr: 2,
                  }}
                >
                  <AnalyticsIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Regression Model Error
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "error.main" }}
                    >
                      {getCurrentValue(regressionErrorData).toFixed(2)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(getTrendDirection(regressionErrorData))}
                      label={`${getPercentageChange(
                        getCurrentValue(regressionErrorData),
                        getPreviousValue(regressionErrorData)
                      ).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: getTrendColor(
                          getTrendDirection(regressionErrorData)
                        ),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: 120, mt: 2 }}>
                <Chart
                  options={getSparklineOptions(
                    theme.palette.error.main,
                    "Regression Error"
                  )}
                  series={[{ name: "Regression Error", data: regressionErrorData }]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Enhanced Combined Trends Chart with Grouping */}
        <Grid item xs={12}>
          <CombinedTrendsOverview trends={trends} loading={loading} />
        </Grid>

        {/* Summary Statistics */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                📋 Monthly Summary Statistics
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Paper variant="outlined" sx={{ minWidth: 600, borderRadius: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      fontWeight: 700,
                      bgcolor:
                        theme.palette.mode === "light" ? "grey.100" : "grey.800",
                      borderRadius: "8px 8px 0 0",
                    }}
                  >
                    <Box
                      sx={{ p: 2, flex: 1, borderRight: 1, borderColor: "divider" }}
                    >
                      📅 Month
                    </Box>
                    <Box
                      sx={{ p: 2, flex: 1, borderRight: 1, borderColor: "divider" }}
                    >
                      📋 PO Count
                    </Box>
                    <Box
                      sx={{ p: 2, flex: 1, borderRight: 1, borderColor: "divider" }}
                    >
                      🤖 AIML Error
                    </Box>
                    <Box
                      sx={{ p: 2, flex: 1, borderRight: 1, borderColor: "divider" }}
                    >
                      ⚠️ Recommended Error
                    </Box>
                    <Box sx={{ p: 2, flex: 1 }}>📊 Regression Error</Box>
                  </Box>
                  {trends.map((trend, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        "&:nth-of-type(even)": {
                          bgcolor:
                            theme.palette.mode === "light" ? "grey.50" : "grey.900",
                        },
                        "&:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          flex: 1,
                          borderRight: 1,
                          borderColor: "divider",
                          fontWeight: 500,
                        }}
                      >
                        {trend.month} {trend.year}
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          flex: 1,
                          borderRight: 1,
                          borderColor: "divider",
                          fontWeight: 600,
                          color: "primary.main",
                        }}
                      >
                        {trend.numberOfPO.toLocaleString()}
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          flex: 1,
                          borderRight: 1,
                          borderColor: "divider",
                          fontWeight: 600,
                          color: "info.main",
                        }}
                      >
                        {trend.absoluteErrorAIML.toFixed(4)}
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          flex: 1,
                          borderRight: 1,
                          borderColor: "divider",
                          fontWeight: 600,
                          color: "warning.main",
                        }}
                      >
                        {trend.absoluteErrorRecommended.toFixed(4)}
                      </Box>
                      <Box
                        sx={{ p: 2, flex: 1, fontWeight: 600, color: "error.main" }}
                      >
                        {trend.absoluteErrorRegression.toFixed(4)}
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Enhanced Combined Trends Overview Component
interface CombinedTrendsOverviewProps {
  trends: MonthlyTrend[];
  loading?: boolean;
}

const CombinedTrendsOverview: React.FC<CombinedTrendsOverviewProps> = ({
  trends,
  loading,
}) => {
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState<string>("overall");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Cast mockData to proper type for analysis
  const typedMockData = mockData as any[];

  // Extract unique values for grouping options
  const groupingOptions = useMemo(() => {
    const interfaces = Array.from(
      new Set(typedMockData.map((item: any) => item.INTERFACE))
    ).filter(Boolean);
    const facilities = Array.from(
      new Set(typedMockData.map((item: any) => item.FACILITY_NAME))
    ).filter(Boolean);
    const machines = Array.from(
      new Set(typedMockData.map((item: any) => item.MACHINE))
    ).filter(Boolean);
    const packers = Array.from(
      new Set(typedMockData.map((item: any) => item.PACKER_RESOURCE))
    ).filter(Boolean);

    return {
      overall: "Overall View",
      interface: interfaces.slice(0, 8), // Show more options for multi-select
      facility: facilities.slice(0, 8),
      machine: machines.slice(0, 12),
      packer: packers.slice(0, 12),
    };
  }, [typedMockData]);

  // Reset selected filters when tab changes
  useEffect(() => {
    setSelectedFilters([]);
  }, [selectedTab, groupBy]);

  // Process data based on grouping selection
  const processedData = useMemo(() => {
    if (groupBy === "overall") {
      // Return overall trends data
      const categories = trends.map(
        (trend) => `${trend.month.slice(0, 3)} ${trend.year}`
      );
      return {
        categories,
        series: [
          {
            name: "Process Orders",
            data: trends.map((trend) => trend.numberOfPO),
            yAxisIndex: 0,
          },
          {
            name: "AIML Error",
            data: trends.map((trend) => Number(trend.absoluteErrorAIML.toFixed(4))),
            yAxisIndex: 1,
          },
          {
            name: "Recommended Error",
            data: trends.map((trend) =>
              Number(trend.absoluteErrorRecommended.toFixed(4))
            ),
            yAxisIndex: 1,
          },
          {
            name: "Regression Error",
            data: trends.map((trend) =>
              Number(trend.absoluteErrorRegression.toFixed(4))
            ),
            yAxisIndex: 1,
          },
        ],
      };
    }

    // Process grouped data
    const groupType = groupBy;
    const fieldMap: Record<string, string> = {
      interface: "INTERFACE",
      facility: "FACILITY_NAME",
      machine: "MACHINE",
      packer: "PACKER_RESOURCE",
    };

    const field = fieldMap[groupType];
    if (!field) {
      console.warn(`Unknown group type: ${groupType}`);
      return { categories: [], series: [] };
    }

    // Get selected filters or all options if none selected
    const currentGroupOptions = groupingOptions[
      groupType as keyof typeof groupingOptions
    ] as string[];

    if (!currentGroupOptions || currentGroupOptions.length === 0) {
      console.warn(`No options available for group type: ${groupType}`);
      return { categories: [], series: [] };
    }

    const filtersToUse =
      selectedFilters.length > 0 ? selectedFilters : currentGroupOptions;

    // Filter data by selected group values (multi-select)
    const filteredData = typedMockData.filter((item: any) =>
      filtersToUse.includes(item[field])
    );

    if (filteredData.length === 0) {
      console.warn(`No data found for filters:`, filtersToUse);
      return { categories: [], series: [] };
    }

    // Group by month-year
    const monthlyData = new Map();
    filteredData.forEach((item: any) => {
      if (!item.ACTUAL_START_DATE) return;

      const date = new Date(item.ACTUAL_START_DATE);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const monthLabel = `${date.toLocaleDateString("en-US", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          label: monthLabel,
          items: [],
        });
      }
      monthlyData.get(monthKey).items.push(item);
    });

    // Calculate metrics for each month
    const sortedMonths = Array.from(monthlyData.entries()).sort();
    const categories = sortedMonths.map(([_, data]: any) => data.label);

    const poData = sortedMonths.map(
      ([_, data]: any) =>
        new Set(data.items.map((item: any) => item.PROCESS_ORDER_NUMBER)).size
    );

    const aimlErrors = sortedMonths.map(([_, data]: any) => {
      const errors = data.items
        .filter((item: any) => item.AIML_RO_ABSOLUTE_ERROR !== null)
        .map((item: any) => parseFloat(item.AIML_RO_ABSOLUTE_ERROR))
        .filter((val: number) => !isNaN(val));
      return errors.length > 0
        ? errors.reduce((sum: number, val: number) => sum + val, 0) / errors.length
        : 0;
    });

    const recommendedErrors = sortedMonths.map(([_, data]: any) => {
      const errors = data.items
        .filter((item: any) => item.RECOMMENDED_RO_ABSOLUTE_ERROR !== null)
        .map((item: any) => parseFloat(item.RECOMMENDED_RO_ABSOLUTE_ERROR))
        .filter((val: number) => !isNaN(val));
      return errors.length > 0
        ? errors.reduce((sum: number, val: number) => sum + val, 0) / errors.length
        : 0;
    });

    const regressionErrors = sortedMonths.map(([_, data]: any) => {
      const errors = data.items
        .filter((item: any) => item.NEW_RO_ABSOLUTE_ERROR !== null)
        .map((item: any) => parseFloat(item.NEW_RO_ABSOLUTE_ERROR))
        .filter((val: number) => !isNaN(val));
      return errors.length > 0
        ? errors.reduce((sum: number, val: number) => sum + val, 0) / errors.length
        : 0;
    });

    const groupLabel = GROUP_LABELS[groupType] || groupType;

    return {
      categories,
      series: [
        {
          name: `Process Orders (${filtersToUse.length} ${groupLabel}${
            filtersToUse.length > 1 ? "s" : ""
          })`,
          data: poData,
          yAxisIndex: 0,
        },
        {
          name: `AIML Error (Avg)`,
          data: aimlErrors.map((val) => Number(val.toFixed(4))),
          yAxisIndex: 1,
        },
        {
          name: `Recommended Error (Avg)`,
          data: recommendedErrors.map((val) => Number(val.toFixed(4))),
          yAxisIndex: 1,
        },
        {
          name: `Regression Error (Avg)`,
          data: regressionErrors.map((val) => Number(val.toFixed(4))),
          yAxisIndex: 1,
        },
      ],
    };
  }, [groupBy, trends, typedMockData, selectedFilters, groupingOptions]);

  const handleFilterChange = (event: SelectChangeEvent<typeof selectedFilters>) => {
    const value = event.target.value;
    setSelectedFilters(typeof value === "string" ? value.split(",") : value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    const tabOptions = ["overall", "interface", "facility", "machine", "packer"];
    setGroupBy(tabOptions[newValue]);
    setSelectedFilters([]); // Reset filters when tab changes
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[4] }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6">Loading combined trends...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Chart options for the combined view
  const chartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: [4, 3, 3, 3],
      dashArray: [0, 0, 5, 8], // Different line styles
    },
    colors: [
      theme.palette.primary.main, // Process Orders - Blue/Orange
      "#10b981", // AIML Error - Green
      "#f59e0b", // Recommended Error - Amber
      "#ef4444", // Regression Error - Red
    ],
    xaxis: {
      categories: processedData.categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        rotate: -45,
      },
      title: {
        text: "Time Period",
        style: {
          color: theme.palette.text.primary,
          fontWeight: 600,
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Process Orders Count",
          style: {
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
        min: 0,
      },
      {
        opposite: true,
        title: {
          text: "Error Values",
          style: {
            color: "#10b981",
            fontWeight: 600,
          },
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
          formatter: (value: number) => value.toFixed(2),
        },
        min: 0,
      },
    ],
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: {
        colors: theme.palette.text.primary,
      },
      markers: {
        strokeWidth: 2,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      shared: true,
      intersect: false,
      x: {
        show: true,
      },
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          if (seriesIndex === 0) {
            return `${value} orders`;
          }
          return `${value.toFixed(4)}`;
        },
      },
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[4] }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <FilterListIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            📊 Combined Trends Overview
          </Typography>
        </Box>

        {/* Grouping Controls */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Overall" />
            <Tab label="Interface" />
            <Tab label="Facility" />
            <Tab label="Machine" />
            <Tab label="Packer Resource" />
          </Tabs>

          {selectedTab > 0 && (
            <FormControl size="small" sx={{ minWidth: 300, maxWidth: 500 }}>
              <InputLabel id="group-select-label">
                Filter{" "}
                {
                  ["", "Interface", "Facility", "Machine", "Packer Resource"][
                    selectedTab
                  ]
                }
                s (All selected by default)
              </InputLabel>
              <Select
                labelId="group-select-label"
                multiple
                value={selectedFilters}
                onChange={handleFilterChange}
                input={
                  <OutlinedInput
                    label={`Filter ${
                      ["", "Interface", "Facility", "Machine", "Packer Resource"][
                        selectedTab
                      ]
                    }s (All selected by default)`}
                  />
                }
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    const currentOptions = groupingOptions[
                      ["", "interface", "facility", "machine", "packer"][
                        selectedTab
                      ] as keyof typeof groupingOptions
                    ] as string[];
                    return `All ${currentOptions.length} items`;
                  }
                  return `${selected.length} selected`;
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      width: 350,
                    },
                  },
                }}
              >
                {selectedTab === 1 &&
                  groupingOptions.interface.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={selectedFilters.indexOf(option) > -1} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                {selectedTab === 2 &&
                  groupingOptions.facility.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={selectedFilters.indexOf(option) > -1} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                {selectedTab === 3 &&
                  groupingOptions.machine.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={selectedFilters.indexOf(option) > -1} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                {selectedTab === 4 &&
                  groupingOptions.packer.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox checked={selectedFilters.indexOf(option) > -1} />
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Chart */}
        <Box sx={{ height: 400, mb: 2 }}>
          {processedData.categories.length === 0 ? (
            <Box
              sx={{
                height: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`,
              }}
            >
              <FilterListIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Data Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTab > 0
                  ? "Try selecting different filters or switch to another grouping option."
                  : "No data found for the selected view."}
              </Typography>
            </Box>
          ) : (
            <Chart
              options={chartOptions}
              series={processedData.series.map((series) => ({
                ...series,
                yAxis: series.yAxisIndex,
              }))}
              type="line"
              height={400}
            />
          )}
        </Box>

        {/* Summary Info */}
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: theme.palette.mode === "light" ? "grey.50" : "grey.900",
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Current View:</strong>{" "}
            {groupBy === "overall"
              ? "Overall trends across all data"
              : `${GROUP_LABELS[groupBy] || groupBy} - ${
                  selectedFilters.length > 0
                    ? `${selectedFilters.length} selected`
                    : "All items"
                }`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Data Points:</strong> {processedData.categories.length} time
            periods
            {processedData.series.length > 0 &&
              processedData.series[0].data.length > 0 && (
                <>
                  {" "}
                  • <strong>Total Orders:</strong>{" "}
                  {processedData.series[0].data
                    .reduce((a: number, b: number) => a + b, 0)
                    .toLocaleString()}
                </>
              )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
