import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  useTheme,
  Box,
  Stack,
  Skeleton,
} from "@mui/material";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type TrendPoint = {
  day: string; // ISO date string
  total_sessions: number;
  avg_session_duration: number; // seconds (number)
};

interface Props {
  trend?: TrendPoint[];
  loading?: boolean;
  title?: string;
}

const numberFmt = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});
const dateFmt = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function formatNumber(n: number) {
  if (!isFinite(n)) return "0";
  return numberFmt.format(n);
}

function formatDuration(totalSeconds: number) {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) return "0s";
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return hrs > 0 ? `${hrs}:${mm}:${ss}` : `${mins}:${ss} min`;
}

const DailySessionsChart: React.FC<Props> = ({
  trend = [],
  loading = false,
  title = "Daily Sessions Trend",
}) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const sessionsColor = theme.palette.primary.main;
  const durationColor =
    theme.palette.secondary?.main ?? theme.palette.success.main;
  const gridColor = theme.palette.divider;
  const textColor = theme.palette.text.secondary;

  // Convert to [timestamp, value] so we can use xaxis.type = 'datetime'
  const series = useMemo(
    () => [
      {
        name: "Sessions",
        type: "line" as const,
        data: trend.map((d) => [new Date(d.day).getTime(), d.total_sessions]),
      },
      {
        name: "Avg Duration (s)",
        type: "line" as const,
        data: trend.map((d) => [
          new Date(d.day).getTime(),
          d.avg_session_duration,
        ]),
      },
    ],
    [trend]
  );

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      background: "transparent",
      toolbar: { show: false },
      foreColor: textColor,
      fontFamily: theme.typography.fontFamily,
      animations: { enabled: true, speed: 500 },
    },
    theme: { mode },
    colors: [sessionsColor, durationColor],
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 2, hover: { size: 5 } },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      title: { text: "Date", style: { color: theme.palette.text.primary } },
      axisBorder: { color: gridColor },
      axisTicks: { color: gridColor },
      labels: { datetimeUTC: false },
    },
    yaxis: [
      {
        title: { text: "Sessions", style: { color: theme.palette.text.primary } },
        labels: { formatter: (val) => formatNumber(val as number) },
      },
      {
        opposite: true,
        title: { text: "Avg Duration", style: { color: theme.palette.text.primary } },
        labels: { formatter: (val) => formatDuration(val as number) },
      },
    ],
    grid: { borderColor: gridColor, strokeDashArray: 3, padding: { left: 10, right: 10 } },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: theme.palette.text.secondary },
      itemMargin: { horizontal: 12 },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: mode === "dark" ? "dark" : "light",
        shadeIntensity: 0.15,
        opacityFrom: 1,
        opacityTo: 0.95,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: mode,
      x: { formatter: (val) => dateFmt.format(new Date(val as number)) },
      y: {
        formatter: (val, { seriesIndex }) =>
          seriesIndex === 0
            ? `${formatNumber(val as number)} sessions`
            : `${formatDuration(val as number)}`,
      },
    },
    responsive: [
      { breakpoint: 600, options: { legend: { position: "bottom" }, chart: { height: 320 }, stroke: { width: 2 } } },
    ],
    noData: {
      text: "No data",
      align: "center",
      verticalAlign: "middle",
      style: { color: theme.palette.text.secondary, fontSize: "0.95rem", fontFamily: theme.typography.fontFamily },
    },
  };


  const hasData = trend.length > 0;

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: theme.palette.mode === "light" ? "#fff" : "background.paper",
      }}
      elevation={0}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1.25 }}
      >
        <Typography sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Stack>

      {loading ? (
        <Box>
          <Skeleton variant="text" width={160} />
          <Skeleton
            variant="rectangular"
            height={220}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      ) : hasData ? (
        <Chart options={options} series={series as any} type="line" height={250} />
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
          <Typography variant="body2">
            No data available for the selected period
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DailySessionsChart;
