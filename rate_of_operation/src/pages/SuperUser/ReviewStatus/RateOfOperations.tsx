import React from "react";
import Chart from "react-apexcharts";
import { Button, Box, useTheme, Stack, Tooltip, Typography } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const RateOfOperations: React.FC = () => {
  const theme = useTheme();
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
      data: [120, 150, 180, 200, 170, 190, 220, 210, 230, 250, 240, 260, 270],
    },
    {
      name: "Pending Reviews",
      data: [30, 40, 50, 60, 50, 70, 80, 60, 70, 90, 80, 100, 110],
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end">
        <Stack direction="row" spacing={1} mr={2}>
          <Tooltip title="Download WinSchuttle File" arrow>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              size="small"
            >
              Download
            </Button>
          </Tooltip>
          <Tooltip title="Upload WinSchuttle File" arrow>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CloudUploadIcon />}
              size="small"
            >
              Upload
            </Button>
          </Tooltip>
        </Stack>
      </Box>
      <Typography variant="h6" textAlign="center">
        Rate of Operations Review Status
      </Typography>
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </Box>
  );
};

export default RateOfOperations;
