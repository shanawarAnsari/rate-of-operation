import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Assignment as AssignmentIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MonthlyTrend } from "../hooks/useRateOfOperationsMetrics";

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
        <Grid item xs={12} md={4}>
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
                  options={getSparklineOptions("#3b82f6", "Process Orders")}
                  series={[{ name: "Process Orders", data: poData }]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI ML RO - MAE Spark Card */}
        <Grid item xs={12} md={4}>
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
                    bgcolor: alpha("#10b981", 0.15),
                    color: "#10b981",
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
                    AI ML RO - MAE
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#10b981" }}
                    >
                      {getCurrentValue(aimlRoData).toFixed(2)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(getTrendDirection(aimlRoData))}
                      label={`${getPercentageChange(
                        getCurrentValue(aimlRoData),
                        getPreviousValue(aimlRoData)
                      ).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: getTrendColor(getTrendDirection(aimlRoData)),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: 120, mt: 2 }}>
                <Chart
                  options={getSparklineOptions("#10b981", "AI ML RO - MAE")}
                  series={[{ name: "AI ML RO - MAE", data: aimlRoData }]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* PLANNED RO - MAE Spark Card */}
        <Grid item xs={12} md={4}>
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
                    bgcolor: alpha("#f59e0b", 0.15),
                    color: "#f59e0b",
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
                    PLANNED RO - MAE
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#f59e0b" }}
                    >
                      {getCurrentValue(plannedRoData).toFixed(2)}
                    </Typography>
                    <Chip
                      icon={getTrendIcon(getTrendDirection(plannedRoData))}
                      label={`${getPercentageChange(
                        getCurrentValue(plannedRoData),
                        getPreviousValue(plannedRoData)
                      ).toFixed(1)}%`}
                      size="small"
                      sx={{
                        bgcolor: getTrendColor(getTrendDirection(plannedRoData)),
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ height: 120, mt: 2 }}>
                <Chart
                  options={getSparklineOptions("#f59e0b", "PLANNED RO - MAE")}
                  series={[{ name: "PLANNED RO - MAE", data: plannedRoData }]}
                  type="area"
                  height={120}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrendsChart;
