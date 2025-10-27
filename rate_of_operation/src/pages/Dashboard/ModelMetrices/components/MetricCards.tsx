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
import {
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
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
      icon: <AssignmentIcon sx={{ fontSize: 24 }} />,
      color: "primary.main",
      bgcolor: "primary.light",
      contrastText: "primary.contrastText",
      description: "Total Process Orders",
      format: (val: number) => val.toLocaleString(),
    },
    {
      title: "AIML Absolute Error",
      subtitle: "AIML Process Error",
      value: metrics.absoluteErrorAIML,
      icon: <PsychologyIcon sx={{ fontSize: 24 }} />,
      color: "info.main",
      bgcolor: "info.light",
      contrastText: "info.contrastText",
      description: "Average AIML RO Absolute Error",
      format: (val: number) => val.toFixed(4),
    },
    {
      title: "Recommended Absolute Error",
      subtitle: "Recommended Process Error",
      value: metrics.absoluteErrorRecommended,
      icon: <WarningIcon sx={{ fontSize: 24 }} />,
      color: "warning.main",
      bgcolor: "warning.light",
      contrastText: "warning.contrastText",
      description: "Average Recommended RO Absolute Error",
      format: (val: number) => val.toFixed(4),
    },
    {
      title: "Regression Absolute Error",
      subtitle: "Regression Model Error",
      value: metrics.absoluteErrorRegression,
      icon: <AnalyticsIcon sx={{ fontSize: 24 }} />,
      color: "error.main",
      bgcolor: "error.light",
      contrastText: "error.contrastText",
      description: "Average New RO Absolute Error",
      format: (val: number) => val.toFixed(4),
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
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
                      sx={{ fontSize: "0.85rem" }}
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
