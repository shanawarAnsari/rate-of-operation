import React from "react";
import Chart from "react-apexcharts";
import { Button, Box, useTheme } from "@mui/material";

const WrenchTime: React.FC = () => {
  const theme = useTheme(); // Access the current theme

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
    },
    xaxis: {
      categories: Array.from({ length: 13 }, (_, i) => `Category ${i + 1}`),
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    legend: {
      position: "top",
    },
    colors: ["#2196f3", "#ff9800"], // Colors for total and pending reviews
    theme: {
      mode: theme.palette.mode, // Use theme mode (light/dark)
    },
    dataLabels: {
      style: {
        colors: [theme.palette.text.primary], // Set text color based on theme
      },
    },
    tooltip: {
      theme: theme.palette.mode, // Match tooltip theme with the current mode
    },
  };

  const chartSeries = [
    {
      name: "Completed Reviews",
      data: [100, 140, 160, 180, 150, 170, 200, 190, 210, 230, 220, 240, 250],
    },
    {
      name: "Pending Reviews",
      data: [20, 30, 40, 50, 40, 60, 70, 50, 60, 80, 70, 90, 100],
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" m={1}>
        <Button variant="contained" color="primary">
          Generate PredictionS
        </Button>
      </Box>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </Box>
  );
};

export default WrenchTime;
