import * as React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTheme, alpha, lighten, darken } from "@mui/material/styles";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map(c => c + c).join("")
    : clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function colorDistance(a: string, b: string) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const dr = A.r - B.r;
  const dg = A.g - B.g;
  const db = A.b - B.b;
  return Math.sqrt(dr * dr + dg * dg + db * db); // 0..~441
}

function separateSimilarColors(
  list: string[],
  minDistance = 80, // tweak if needed
  theme?: any
) {
  const out: string[] = [];
  for (let i = 0; i < list.length; i++) {
    let c = list[i];
    let tries = 0;

    // move the color away if it's too close to any chosen value
    while (out.some((x) => colorDistance(x, c) < minDistance) && tries < 6) {
      // alternate lighten & darken to find separation
      c = tries % 2 === 0 ? lighten(c, 0.12) : darken(c, 0.12);
      tries++;
    }
    out.push(c);
  }
  return out;
}

type DonutChartProps = {
  labels: string[];
  series: number[];
  centerTotal: number;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  formatTotal?: (n: number) => string;
};

const DonutChart: React.FC<DonutChartProps> = ({
  labels,
  series,
  centerTotal,
  height = 220,
  showLegend = true,
  colors,
  formatTotal,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const numberFmt = React.useMemo(
    () => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }),
    []
  );

  // Candidate colors (include more than you need, we'll dedupe)
  const candidateColors = React.useMemo(
    () =>
      colors ?? [
        theme.palette.primary.main,
        theme.palette.info.main,
        theme.palette.success.main,
        theme.palette.secondary?.main ?? "#6C5CE7",
        theme.palette.warning.main,
        theme.palette.error.main,
      ],
    [colors, theme.palette]
  );

  // Ensure adjacent colors aren't too similar
  const fallbackColors = React.useMemo(
    () => separateSimilarColors(candidateColors, 90, theme).slice(0, Math.max(1, series.length)),
    [candidateColors, series.length, theme]
  );

  const chartText = theme.palette.text.primary;
  const legendText = theme.palette.text.secondary;
  const gridBorder = alpha(theme.palette.divider, 0.24);
  const strokeColor = theme.palette.background.paper;

  const options: ApexOptions = React.useMemo(
    () => ({
      chart: {
        background: "transparent",
        foreColor: chartText,
        fontFamily: theme.typography.fontFamily,
        toolbar: { show: false },
        animations: { enabled: true },
      },
      theme: { mode: isDark ? "dark" : "light" },
      labels,
      colors: fallbackColors,
      legend: {
        show: showLegend,
        position: "bottom",
        fontSize: "13px",
        labels: { colors: legendText },
        markers: {
          width: 10,
          height: 10,
          radius: theme.shape.borderRadius,
          fillColors: fallbackColors,
        },
        itemMargin: { vertical: 4, horizontal: 8 },
      },
      tooltip: {
        enabled: false,
        theme: isDark ? "dark" : "light",
        style: { fontFamily: theme.typography.fontFamily },
      },
      dataLabels: { enabled: false },
      stroke: { colors: [strokeColor], width: 2 },
      grid: { borderColor: gridBorder },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: "65%",
            labels: {
              show: true,
              name: {
                show: true,
                color: chartText,
                fontSize: (theme.typography.caption as any)?.fontSize ?? "0.75rem",
              },
              value: {
                show: true,
                color: chartText,
                fontSize: (theme.typography.subtitle2 as any)?.fontSize ?? "0.875rem",
                formatter: (val: string) => numberFmt.format(Number(val)),
              },
              total: {
                show: true,
                label: "Total",
                color: chartText,
                fontSize: (theme.typography.subtitle1 as any)?.fontSize ?? "1rem",
                formatter: () =>
                  formatTotal ? formatTotal(centerTotal) : numberFmt.format(centerTotal),
              },
            },
          },
        },
      },
      states: {
        hover: { filter: { type: "lighten", value: isDark ? 0.05 : 0.15 } },
        active: { filter: { type: "none" } },
      },
      noData: {
        text: "No data",
        align: "center",
        verticalAlign: "middle",
        style: {
          color: legendText,
          fontFamily: theme.typography.fontFamily,
          fontSize: (theme.typography.body2 as any)?.fontSize ?? "0.875rem",
        },
      },
    }),
    [
      chartText,
      legendText,
      gridBorder,
      strokeColor,
      isDark,
      labels,
      fallbackColors,
      showLegend,
      theme.typography.fontFamily,
      theme.typography.caption,
      theme.typography.subtitle1,
      theme.typography.subtitle2,
      centerTotal,
      formatTotal,
      numberFmt,
      theme.shape.borderRadius,
    ]
  );

  return <Chart type="donut" width="100%" height={height} series={series} options={options} />;
};



export default DonutChart;