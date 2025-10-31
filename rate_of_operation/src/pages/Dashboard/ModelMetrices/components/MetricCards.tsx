import React from "react";
import { Card, CardContent, Typography, Box, Grid, useTheme } from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Psychology as PsychologyIcon,
  BookOnline,
  Newspaper,
  AutoAwesome,
} from "@mui/icons-material";
import { ROMetrics } from "../hooks/useRateOfOperationsMetrics";

interface MetricCardsProps {
  metrics: ROMetrics;
  selectedMonth?: string;
  loading?: boolean;
}

const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  selectedMonth,
  loading,
}) => {
  const theme = useTheme();

  const formatMonth = (monthValue: string) => {
    if (!monthValue) return "";
    const [year, month] = monthValue.split("-");
    const monthName = new Date(
      parseInt(year),
      parseInt(month) - 1
    ).toLocaleDateString("en-US", { month: "long" });
    return `${monthName} ${year}`;
  };

  const metricCards = [
    {
      title: "Number of PO",
      subtitle: "Process Orders",
      value: metrics.numberOfPO,
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      color: "primary.main",
      bgcolor: "primary.light",
      contrastText: "primary.contrastText",
      description: "Total Distinct Process Orders",
      format: (val: number) => val.toLocaleString(),
    },
    {
      title: "PLANNED RO - MAE",
      subtitle: "Planned Process Error",
      value: metrics.plannedRoMAE,
      icon: <Newspaper sx={{ fontSize: 32 }} />,
      color: "warning.main",
      bgcolor: "warning.light",
      contrastText: "warning.contrastText",
      description: "Average NEW RO Mean Absolute Error",
      format: (val: number) => val.toFixed(4),
    },
    {
      title: "AI ML RO - MAE",
      subtitle: "AI ML Process Error",
      value: metrics.aimlRoMAE,
      icon: <AutoAwesome sx={{ fontSize: 32 }} />,
      color: "info.main",
      bgcolor: "info.light",
      contrastText: "info.contrastText",
      description: "Average AIML RO Mean Absolute Error",
      format: (val: number) => val.toFixed(4),
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
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
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: card.bgcolor,
                      color: card.contrastText,
                      mr: 2,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.90rem" }}
                    >
                      {card.subtitle}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: card.color }}
                      >
                        {loading ? "Loading..." : card.format(card.value)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricCards;
