import React from "react";
import Chart from "react-apexcharts";
import { Button, Box } from "@mui/material";

const WrenchTime: React.FC = () => {
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
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
      <Box mt={2} textAlign="center">
        <Button variant="contained" color="primary">
          Generate Prediction
        </Button>
      </Box>
    </Box>
  );
};

export default WrenchTime;
