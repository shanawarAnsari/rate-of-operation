import React from "react";
import { Card, Typography, Box, Grid, Chip, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assignment as AssignmentIcon,
  Newspaper,
  AutoAwesome,
} from "@mui/icons-material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
// Generic trends interface that works with both ROP and ST data
interface TrendData {
  month: string;
  year: number;
  numberOfPO: number;
  aimlRoMAE?: number;
  plannedRoMAE?: number;
  // Legacy field support for backward compatibility
  absoluteErrorAIML?: number;
  absoluteErrorRegression?: number;
}

interface TrendsChartProps {
  trends: TrendData[];
  loading?: boolean;
  modelType?: "ROP" | "ST"; // Add modelType prop for dynamic labeling
}

const TrendsChart: React.FC<TrendsChartProps> = ({
  trends,
  loading,
  modelType = "ROP",
}) => {
  const theme = useTheme();

  // Get dynamic labels and units based on model type
  const getLabels = () => {
    return {
      plannedLabel:
        modelType === "ST" ? "PLANNED Setup Time - MAE" : "PLANNED RO - MAE",
      aimlLabel: modelType === "ST" ? "AI ML Setup Time - MAE" : "AI ML RO - MAE",
      units: modelType === "ST" ? "min/su" : "su/h",
    };
  };

  const { plannedLabel, aimlLabel, units } = getLabels();

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
  const aimlRoData = trends.map((trend) =>
    Number((trend.aimlRoMAE || trend.absoluteErrorAIML || 0).toFixed(4))
  );
  const plannedRoData = trends.map((trend) =>
    Number((trend.plannedRoMAE || trend.absoluteErrorRegression || 0).toFixed(4))
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
      height: 90,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 200,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 400,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: theme.palette.mode === "dark" ? "dark" : "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: [
          theme.palette.mode === "dark" ? alpha(color, 0.1) : alpha(color, 0.05),
        ],
        opacityFrom: 0.85,
        opacityTo: 0.15,
        stops: [0, 85, 100],
      },
    },
    colors: [color],
    markers: {
      size: 0,
      strokeWidth: 0,
      hover: {
        size: 5,
        sizeOffset: 3,
      },
    },
    tooltip: {
      enabled: true,
      theme: theme.palette.mode,
      style: {
        fontSize: "13px",
        fontFamily: theme.typography.fontFamily,
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
        formatter: (val: number) => val.toFixed(2),
      },
      marker: {
        show: true,
      },
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
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
      crosshairs: {
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
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: 130,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ px: 2, py: 2.5, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: "0 0 50%",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AssignmentIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", mb: 0.5 }}
                    >
                      Process Orders
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "primary.main",
                        fontSize: "1.5rem",
                      }}
                    >
                      {getCurrentValue(poData)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: "0 0 50%", height: 90, minWidth: 0, p: 1 }}>
                  <Chart
                    options={getSparklineOptions("#3b82f6", "Process Orders")}
                    series={[{ name: "Process Orders", data: poData }]}
                    type="area"
                    height={90}
                  />
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
        {/* PLANNED RO - MAE Spark Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: 130,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ px: 2, py: 2.5, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: "0 0 50%",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "warning.light",
                      color: "warning.contrastText",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Newspaper sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", mb: 0.5 }}
                    >
                      {plannedLabel}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "warning.main",
                        fontSize: "1.5rem",
                      }}
                    >
                      {getCurrentValue(plannedRoData).toFixed(2)} {units}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: "0 0 50%", height: 90, minWidth: 0, p: 1 }}>
                  <Chart
                    options={getSparklineOptions("#f59e0b", plannedLabel)}
                    series={[{ name: plannedLabel, data: plannedRoData }]}
                    type="area"
                    height={90}
                  />
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* AI ML RO - MAE Spark Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: 130,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <Box sx={{ px: 1, py: 1.5, height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: "0 0 50%",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#10b981",
                      color: "info.contrastText",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", mb: 0.5 }}
                    >
                      {aimlLabel}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#10b981",
                        fontSize: "1.5rem",
                      }}
                    >
                      {getCurrentValue(aimlRoData).toFixed(2)} {units}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: "0 0 50%", height: 90, minWidth: 0, p: 1, mt: -1 }}>
                  <Chart
                    options={getSparklineOptions("#10b981", aimlLabel)}
                    series={[{ name: aimlLabel, data: aimlRoData }]}
                    type="area"
                    height={90}
                  />
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrendsChart;
