import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import {
  Box, useTheme, Typography, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack, Tooltip
} from "@mui/material";
import { ApexOptions } from "apexcharts";

type Props = {
  type: "operations" | "wrenchtime";
  groupBy: string;
  result: any[];
  loading: boolean;
  error: any;
};

const ReviewChartTable: React.FC<Props> = ({ type, groupBy, result, loading, error }) => {
  const theme = useTheme();

  const { categories, series, tableData, colors } = useMemo(() => {
    if (!result || result.length === 0) {
      return { categories: [], series: [], tableData: [], colors: [] };
    }

    const grouped = new Map<string, Record<string, number>>();
    result.forEach((item: any) => {
      const key = item[groupBy] || item.interface || "Unknown";
      if (!grouped.has(key)) grouped.set(key, {});
      grouped.get(key)![item.status] = (grouped.get(key)![item.status] || 0) + item.count;
    });

    const allStatuses = Array.from(new Set(result.map((d) => d.status)));
    const categories = Array.from(grouped.keys());

    const colorPalette = ["#2196f3", "#ff9800", "#9c27b0", "#4caf50", "#3f51b5", "#00bcd4", "#ffc107", "#8bc34a"];
    const colors = allStatuses.map((status, index) =>
      status === "N" ? "#f44336" : colorPalette[index % colorPalette.length]
    );

    const series = allStatuses.map((status) => ({
      name: status,
      data: categories.map((cat) => grouped.get(cat)?.[status] || 0),
    }));

    const tableData = categories.map((cat) => {
      const row: Record<string, any> = { group: cat };
      let total = 0;
      allStatuses.forEach((status) => {
        const count = grouped.get(cat)?.[status] || 0;
        row[status] = count;
        total += count;
      });
      row.total = total;
      return row;
    });

    return { categories, series, tableData, colors };
  }, [result, groupBy]);

  const chartOptions: ApexOptions = {
    chart: { type: "bar", stacked: true },
    xaxis: { categories },
    plotOptions: { bar: { horizontal: false } },
    legend: { position: "bottom" },
    theme: { mode: theme.palette.mode },
    tooltip: { theme: theme.palette.mode },
    colors,
  };

  return (
    <Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : result.length === 0 ? (
        <Typography textAlign="center" mt={4}>No data available for the selected group.</Typography>
      ) : (
        <>
          <Box sx={{ mx: 2 }}>
            <Chart options={chartOptions} series={series} type="bar" height={400} />
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: 3, mb: 1, pl: 2, pr: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
                  <TableCell>{groupBy.toUpperCase()}</TableCell>
                  <TableCell>TOTAL</TableCell>
                  {series.map((s) => (
                    <TableCell key={s.name}>
                      <Tooltip title={s.name} arrow>
                        <span>{s.name}</span>
                      </Tooltip>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.group}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    {series.map((s) => {
                      const value = row[s.name];
                      const percent = row.total ? ((value / row.total) * 100).toFixed(1) : "0.0";
                      return (
                        <TableCell key={s.name}>
                          <Stack direction="row" alignItems="center" gap={1}>
                            <Typography>{value}</Typography>
                            <Typography variant="body2" sx={{ color: 'gray' }}>({percent}%)</Typography>
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ReviewChartTable;
