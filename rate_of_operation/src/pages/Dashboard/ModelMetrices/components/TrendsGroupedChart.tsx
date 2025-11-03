import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  Chip,
} from "@mui/material";
import { ShowChart as ShowChartIcon } from "@mui/icons-material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MockDataItem } from "../hooks/useRateOfOperationsMetrics";
import { useTrendsGroupedMetrics } from "../hooks/useTrendsGroupedMetrics";
import GroupBySelector, { GroupByLevel } from "./GroupBySelector";

interface TrendsGroupedChartProps {
  data: MockDataItem[];
}

const TrendsGroupedChart: React.FC<TrendsGroupedChartProps> = ({ data }) => {
  const theme = useTheme();
  const [groupBy, setGroupBy] = useState<GroupByLevel>("INTERFACE");

  const { groupedTrendsMetrics, totalGroupsCount, isShowingTopTen } =
    useTrendsGroupedMetrics({
      data,
      groupBy,
    });

  const handleGroupByChange = (newGroupBy: GroupByLevel) => {
    setGroupBy(newGroupBy);
  };

  // Get label for the selected groupBy
  const getGroupByLabel = (groupBy: GroupByLevel): string => {
    const labels: Record<GroupByLevel, string> = {
      INTERFACE: "Interface",
      FACILITY_NAME: "Facility Name",
      MACHINE: "Machine",
      PACKER_RESOURCE: "Packer Resource",
      PLATFORM_NAME: "Platform Name",
      RECIPE_NUMBER: "Recipe Number",
      PROCESS_ORDER_NUMBER: "Process Order Number",
    };
    return labels[groupBy];
  };

  // Prepare categories (all unique months across all groups)
  const allMonths = new Set<string>();
  groupedTrendsMetrics.forEach((group) => {
    group.trendData.forEach((point) => {
      allMonths.add(`${point.month.slice(0, 3)} ${point.year}`);
    });
  });
  const categories = Array.from(allMonths).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
  });

  // Prepare combined series data
  const combinedSeries = [
    // AI ML RO - MAE series (dashed)
    ...groupedTrendsMetrics.map((group) => {
      const dataPoints = categories.map((category) => {
        const point = group.trendData.find(
          (p) => `${p.month.slice(0, 3)} ${p.year}` === category
        );
        // Return the value only if it exists and is valid, otherwise return null
        return point && point.aimlRoMAE > 0
          ? Number(point.aimlRoMAE.toFixed(4))
          : null;
      });

      return {
        name: `${group.groupName} (AI ML)`,
        data: dataPoints,
        type: "line" as const,
      };
    }),
    // PLANNED RO - MAE series (solid)
    ...groupedTrendsMetrics.map((group) => {
      const dataPoints = categories.map((category) => {
        const point = group.trendData.find(
          (p) => `${p.month.slice(0, 3)} ${p.year}` === category
        );
        // Return the value only if it exists and is valid, otherwise return null
        return point && point.plannedRoMAE > 0
          ? Number(point.plannedRoMAE.toFixed(4))
          : null;
      });

      return {
        name: `${group.groupName} (PLANNED)`,
        data: dataPoints,
        type: "line" as const,
      };
    }),
  ];

  // Chart options for combined chart
  const combinedChartOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 500,
      toolbar: {
        show: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      dashArray: [
        // Dashed lines for AI ML (first half of series)
        ...Array(groupedTrendsMetrics.length).fill(5),
        // Solid lines for PLANNED (second half of series)
        ...Array(groupedTrendsMetrics.length).fill(0),
      ],
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        rotate: -45,
      },
      tickPlacement: "on",
    },
    yaxis: [
      {
        title: {
          text: "AI ML RO - MAE",
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
          formatter: (val: number) => val.toFixed(2),
        },
      },
      {
        opposite: true,
        title: {
          text: "PLANNED RO - MAE",
          style: {
            color: theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: "14px",
          },
        },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
          formatter: (val: number) => val.toFixed(2),
        },
      },
    ],
    legend: {
      position: "right",
      horizontalAlign: "center",
      labels: {
        colors: theme.palette.text.primary,
      },
      markers: {
        size: 6,
        shape: "circle",
      },
    },
    tooltip: {
      theme: theme.palette.mode,
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => {
          // Only show values that are valid numbers
          if (val === null || val === undefined || isNaN(val)) {
            return undefined as any; // This will hide the series from tooltip
          }
          return val.toFixed(4);
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
    colors: [
      // Colors for AI ML series
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#6366f1",
      // Colors for PLANNED series (same colors, will be solid)
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#6366f1",
    ],
  };

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
                  Error Analysis Trends by {getGroupByLabel(groupBy)}
                </Typography>
                {isShowingTopTen && (
                  <Chip
                    label={`Top 6 of ${totalGroupsCount}`}
                    size="small"
                    color="warning"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                )}
                <GroupBySelector
                  selectedGroupBy={groupBy}
                  onGroupByChange={handleGroupByChange}
                />
              </Box>
              {groupedTrendsMetrics.length > 0 ? (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {isShowingTopTen
                      ? `Showing trends for top 6 ${getGroupByLabel(
                          groupBy
                        ).toLowerCase()} with highest average error values`
                      : `Error trends comparison across ${getGroupByLabel(
                          groupBy
                        ).toLowerCase()}`}
                  </Typography>
                  <Box sx={{ height: 500 }}>
                    <Chart
                      options={combinedChartOptions}
                      series={combinedSeries}
                      type="line"
                      height={500}
                    />
                  </Box>
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
                      <Box
                        sx={{
                          width: 30,
                          height: 3,
                          bgcolor: theme.palette.text.secondary,
                          borderRadius: 1,
                          border: "2px dashed",
                          borderColor: theme.palette.text.secondary,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        AI ML RO - MAE (Dashed)
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 3,
                          bgcolor: theme.palette.text.secondary,
                          borderRadius: 1,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        PLANNED RO - MAE (Solid)
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    height: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No trend data available for the selected grouping
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrendsGroupedChart;
