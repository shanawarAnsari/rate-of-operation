import React from "react";
import Chart from "react-apexcharts";
import { Button, Box } from "@mui/material";

const RateOfOperations: React.FC = () => {
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
    colors: ["#4caf50", "#f44336"], // Colors for total and pending reviews
  };

  const chartSeries = [
    {
      name: "Completed Reviews",
      data: [120, 150, 180, 200, 170, 190, 220, 210, 230, 250, 240, 260, 270],
    },
    {
      name: "Pending Reviews",
      data: [30, 40, 50, 60, 50, 70, 80, 60, 70, 90, 80, 100, 110],
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

export default RateOfOperations;
