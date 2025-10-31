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
import { BarChart as BarChartIcon } from "@mui/icons-material";
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

  const { groupedMetrics, totalGroupsCount, isShowingTopTen } = useGroupedMetrics({
    data,
    groupBy,
    selectedMonth,
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
                {isShowingTopTen && (
                  <Chip
                    label={`Top 10 of ${totalGroupsCount}`}
                    size="medium"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      height: 24,
                    }}
                  />
                )}
                <GroupBySelector
                  selectedGroupBy={groupBy}
                  onGroupByChange={handleGroupByChange}
                />
              </Box>
              {groupedMetrics.length > 0 ? (
                <>
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
                  <Box sx={{ height: 350 }}>
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      height={350}
                    />
                  </Box>
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
    </Box>
  );
};

export default MonthlyViewCharts;
