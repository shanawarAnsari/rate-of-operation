import React from "react";
import { Grid, Paper, Typography, Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Palette, PaletteColor } from "@mui/material/styles";

// Icons
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

type SummaryData = {
    totalUsers?: number;
    totalSessions?: number;
    averageSessionTime?: number; // seconds
    bounceRate?: number; // 0–100 or 0–1
};

type ColorKey = "primary" | "info" | "success" | "warning";

// Formatters
const numberFmt = new Intl.NumberFormat("en-US", { notation: "compact" });

const formatSeconds = (secs?: number) => {
    if (secs == null || isNaN(secs)) return "—";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatPercent = (val?: number) => {
    if (val == null || isNaN(val)) return "—";
    const pct = val <= 1 ? val * 100 : val;
    return `${pct.toFixed(2)}%`;
};

const formatNumber = (val?: number) => {
    if (val == null || isNaN(val)) return "—";
    return numberFmt.format(val);
};

// Helper to get a strongly-typed PaletteColor
const getPaletteColor = (palette: Palette, key: ColorKey): PaletteColor => {
    switch (key) {
        case "primary":
            return palette.primary;
        case "info":
            return palette.info;
        case "success":
            return palette.success;
        case "warning":
            return palette.warning;
    }
};

const SummaryCards: React.FC<{ data: SummaryData }> = ({ data }) => {
    const theme = useTheme();

    const cards: Array<{
        label: string;
        value: React.ReactNode;
        Icon: React.ElementType;
        color: ColorKey;
    }> = [
            {
                label: "Total Users",
                value: formatNumber(data?.totalUsers),
                Icon: GroupRoundedIcon,
                color: "primary",
            },
            {
                label: "Total Sessions",
                value: formatNumber(data?.totalSessions),
                Icon: QueryStatsRoundedIcon,
                color: "info",
            },
            {
                label: "Avg. Session Time",
                value: `${formatSeconds(data?.averageSessionTime)} mins`,
                Icon: AccessTimeRoundedIcon,
                color: "success",
            },
            {
                label: "Bounce Rate",
                value: formatPercent(data?.bounceRate),
                Icon: TrendingDownRoundedIcon,
                color: "warning",
            },
        ];

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards?.map(({ label, value, Icon, color }) => {
                const paletteColor = getPaletteColor(theme.palette, color);
                const tone = paletteColor.main;
                const subtleBg = alpha(tone, 0.08);
                const subtleBorder = alpha(tone, 0.22);

                return (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                        <Paper
                            elevation={0}
                            sx={{
                                position: "relative",
                                p: 2.5,
                                borderRadius: 2,
                                border: `1px solid ${subtleBorder}`,
                                background: `linear-gradient(135deg, ${subtleBg} 0%, ${alpha(
                                    tone,
                                    0.02
                                )} 100%)`,
                                transition: "transform 180ms ease, box-shadow 180ms ease",
                                "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                        theme.palette.mode === "light"
                                            ? "0 6px 18px rgba(0,0,0,0.08)"
                                            : "0 10px 24px rgba(0,0,0,0.32)",
                                },
                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: 8,
                                    bottom: 8,
                                    width: 4,
                                    borderRadius: "4px",
                                    backgroundColor: tone,
                                },
                            }}
                        >
                            {/* Small icon badge */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    bgcolor: alpha(tone, 0.14),
                                    color: tone,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Icon fontSize="small" />
                            </Box>

                            <Typography
                                variant="subtitle2"
                                sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
                            >
                                {label}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: 0.2,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {value}
                            </Typography>
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default SummaryCards;