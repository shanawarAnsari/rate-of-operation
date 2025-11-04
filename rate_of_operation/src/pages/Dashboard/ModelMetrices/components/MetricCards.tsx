import React from "react";
import { Card, Box, Typography, Grid, useTheme } from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Psychology as PsychologyIcon,
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
      format: (val: number) => val.toFixed(2),
    },
    {
      title: "AI ML RO - MAE",
      subtitle: "AI ML Process Error",
      value: metrics.aimlRoMAE,
      icon: <AutoAwesome sx={{ fontSize: 32 }} />,
      color: "#10b981",
      bgcolor: "#10b981",
      contrastText: "info.contrastText",
      description: "Average AIML RO Mean Absolute Error",
      format: (val: number) => val.toFixed(2),
    },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={4} key={index}>
            <Card
              sx={{
                height: 130,
                borderRadius: 3,
                boxShadow: theme.shadows[4],
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: card.bgcolor,
                      color: card.contrastText,
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(card.icon, { sx: { fontSize: 22 } })}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem", mb: 0.5 }}
                    >
                      {card.subtitle}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: card.color,
                        fontSize: "1.5rem",
                      }}
                    >
                      {loading
                        ? "Loading..."
                        : card?.title === "Number of PO"
                        ? `${card.format(card.value)}`
                        : `${card.format(card.value)} su/h`}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MetricCards;
