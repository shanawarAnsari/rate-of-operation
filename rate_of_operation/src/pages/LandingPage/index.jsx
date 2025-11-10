import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Grow,
  Button,
  Chip
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SpeedIcon from "@mui/icons-material/Speed";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InsightsIcon from "@mui/icons-material/Insights";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Timer } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(-6px); }
  50% { transform: translateY(6px); }
`;

const LandingPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const featureCards = [
    {
      key: "predictive-planning",
      title: "Predictive Planning",
      description:
        "AI/ML-powered predictions for Rate of Operation and Setup Time, helping optimize efficiency and cost.",
      icon: SpeedIcon,
      role: "Planner",
      navigateTo: "/operations/rate-of-operation"
    },
    {
      key: "planner-workspace",
      title: "Planner Workspace",
      description:
        "Review and sign off rates and setup times, apply manual overrides or AI suggestions, and perform bulk actions easily.",
      icon: DashboardIcon,
      role: "Planner",
      navigateTo: "/operations/rate-of-operation"
    },
    {
      key: "model-metrics",
      title: "Model Metrics",
      description:
        "Monitor AI/ML model accuracy with monthly and historical trends, including error analysis and different filters.",
      icon: BarChartIcon,
      role: "Planner",
      navigateTo: "/dashboard"
    },
    {
      key: "usage-analytics",
      title: "Usage Analytics",
      description:
        "Track sessions, most visited pages and other application usage with detailed performance insights and trends.",
      icon: InsightsIcon,
      role: "Admin",
      navigateTo: "/dashboard"
    },
    {
      key: "admin-dashboard",
      title: "Super User Dashboard",
      description:
        "Manage users, monitor review status, trigger prediction pipelines, and download outputs for SAP upload.",
      icon: AdminPanelSettingsIcon,
      role: "Admin",
      navigateTo: "/super-user/review-status"
    }
  ];
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "relative",
        maxHeight: "91vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 10,
        background: `
          radial-gradient(1200px circle at 10% 10%, ${alpha(theme.palette.primary.main, 0.01)} 0%, transparent 60%),
          radial-gradient(1000px circle at 90% 20%, ${alpha(theme.palette.secondary.main, 0.01)} 0%, transparent 60%),
          linear-gradient(180deg, ${isDark ? "#0b1020" : "#f7f9ff"} 0%, ${isDark ? "#080b16" : "#f3f6ff"} 100%)
        `
      }}
    >
      {/* Aurora Layer */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: -200,
          filter: "blur(80px)",
          opacity: isDark ? 0.45 : 0.5,
          pointerEvents: "none",
          background: `conic-gradient(from 0deg at 50% 50%,
            ${alpha(theme.palette.primary.main, 0.088)},
            ${alpha(theme.palette.secondary.main, 0.088)},
            ${alpha(theme.palette.success.main, 0.072)},
            ${alpha(theme.palette.primary.main, 0.088)}
          )`,
          animation: `${rotate} 60s linear infinite`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" }
        }}
      />
      {/* Dotted Grid Overlay */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse at center, black 55%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 85%)"
        }}
      />
      {/* Floating glow orbs */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: 260,
          height: 260,
          borderRadius: "50%",
          top: "12%",
          left: "4%",
          background: `radial-gradient(circle at 30% 30%, ${alpha(theme.palette.primary.main, 0.26)}, transparent 60%)`,
          filter: "blur(20px)",
          opacity: 0.15,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          bottom: "8%",
          right: "8%",
          background: `radial-gradient(circle at 70% 70%, ${alpha(theme.palette.secondary.main, 0.25)}, transparent 60%)`,
          filter: "blur(24px)",
          opacity: 0.35,
          animation: `${float} 10s ease-in-out infinite 1s`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none" }
        }}
      />
      {/* Content */}
      <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", position: "relative" }}>
        {/* Hero */}
        <Box sx={{ textAlign: "center", mb: 3, mt: -2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: -0.5,
              lineHeight: 1.1,
              mx: "auto",
              background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            Illuminate Your Operations
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              mx: "auto",
              maxWidth: 800,
              color: isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.68)",
              fontSize: { xs: "1rem", sm: "1.15rem" }
            }}
          >
            Lumina empowers planners and admins with predictive insights for Rate of Operation and Setup Time, driving efficiency and cost optimization.
          </Typography>
          <Box
            sx={{
              mt: 3,
              mx: "auto",
              height: 4,
              width: 180,
              borderRadius: 4,
              background: `linear-gradient(90deg,
                ${alpha(theme.palette.primary.main, 0.0)},
                ${alpha(theme.palette.primary.main, 0.32)},
                ${alpha(theme.palette.secondary.main, 0.0)}
              )`,
              filter: "blur(1px)"
            }}
          />
        </Box>
        {/* Feature Cards – 2 rows, compact height, fixed chip width */}
        <Grid
          container
          spacing={2}
          justifyContent="flex-start"
          wrap="wrap"
          sx={{ overflowX: 'hidden', overflowY: 'hidden', alignItems: 'stretch' }}
        >
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            const desc = card.description;
            return (
              <Grid
                item
                key={card.key}
                xs={12}          // 1 per row on xs
                sm={6}           // 2 per row on sm
                md={4}           // 3 per row on md (=> 5 cards → 3 + 2 rows)
                lg={4}           // keep two rows on large screens as well
                sx={{ minWidth: 0 }} // allow inner truncation
              >
                <Grow in timeout={700 + index * 120}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 2.5,
                      p: 0.5,
                      background: `linear-gradient(135deg,
                ${alpha(theme.palette.primary.main, 0.14)},
                ${alpha(theme.palette.secondary.main, 0.14)}
              )`,
                      transition: 'transform 160ms ease, box-shadow 160ms ease',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 22px rgba(0,0,0,0.18)',
                      },
                      '& > .inner': {
                        height: '100%',
                        borderRadius: 2,
                        p: 1.25, // tighter padding for shorter height
                        background: isDark
                          ? 'rgba(8, 12, 24, 0.72)'
                          : 'rgba(255, 255, 255, 0.72)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${alpha(isDark ? '#ffffff' : '#000000', 0.4)}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.75,
                        minWidth: 0,              // for text truncation
                        minHeight: 168,           // keeps cards uniformly short; tweak 160–180
                      },
                    }}
                  >
                    <Box className="inner">
                      {/* Icon - compact */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600, color: theme.palette.primary.main }}>
                          {card.title}
                        </Typography>
                        <Box>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 0.5,
                              borderRadius: 1.5,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `linear-gradient(135deg,
                    ${alpha(theme.palette.primary.main, 0.048)},
                    ${alpha(theme.palette.secondary.main, 0.048)}
                  )`,
                              border: `1px solid ${alpha(isDark ? '#fff' : '#000', 0.048)}`,
                              flex: '0 0 auto',
                            }}
                          >
                            <Icon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                          </Box>
                          {card.title === 'Predictive Planning' && <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1.5,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `linear-gradient(135deg,
                    ${alpha(theme.palette.primary.main, 0.048)},
                    ${alpha(theme.palette.secondary.main, 0.048)}
                  )`,
                              border: `1px solid ${alpha(isDark ? '#fff' : '#000', 0.048)}`,
                              flex: '0 0 auto',
                            }}
                          >
                            <Timer sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                          </Box>
                          }
                        </Box>
                      </Box>

                      <Chip
                        label={card.role.replace(/\s*&amp;\s*/g, '&')}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          backgroundColor: alpha(theme.palette.primary.main, 0.032),
                          color: theme.palette.text.secondary,
                          fontWeight: 600,
                          '& .MuiChip-label': {
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        }}
                      />

                      {/* Description - 2-line clamp; stretches width explicitly */}
                      <Typography
                        variant="caption"
                        sx={{
                          alignSelf: 'stretch',
                          opacity: 0.9,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {desc}
                      </Typography>
                      <Box />
                      {/* Compact CTA */}
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          borderRadius: 1.25,
                          px: 1.25,
                          py: 0.35,
                          maxWidth: 28,
                          fontSize: 12,
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                        onClick={() => { navigate(card.navigateTo) }}
                      >
                        Explore
                      </Button>
                    </Box>
                  </Card>
                </Grow>
              </Grid>
            );
          })}
        </Grid>

      </Box>
    </Box>
  );
};

export default LandingPage;