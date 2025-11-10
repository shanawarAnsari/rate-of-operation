import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  LinearProgress,
  Stack,
  Tooltip,
  Box,
  alpha,
  useTheme,
} from "@mui/material";

type FeatureRow = {
  page: string;          // e.g., "/super-user/review-status"
  total_visits: number;  // e.g., 1203
  avg_duration: number;  // seconds
};

type TopFeaturesTableProps = {
  features: FeatureRow[];
  title?: string;
  maxHeight?: number | string;
  dense?: boolean;
  showPathHint?: boolean;
};

function getLastSegment(path?: string): string {
  if (!path) return "dashboard";
  let pathname = path;
  try {
    const u = new URL(path, "http://local");
    pathname = u.pathname || "";
  } catch {
    /* ignore */
  }

  const trimmed = pathname.replace(/[?#].*$/, "").replace(/\/+$/, "");
  const seg = trimmed
    .split("/")
    .filter(Boolean)
    .pop();
  return seg && seg.length ? seg : "dashboard";
}

function humanizeSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function displayNameFromPath(path?: string): string {
  return humanizeSlug(getLastSegment(path));
}

function formatDuration(totalSeconds?: number) {
  const s = Number.isFinite(totalSeconds as number)
    ? Math.max(0, Number(totalSeconds))
    : 0;
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}m`;
}

const numberFmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

const TopFeaturesTable: React.FC<TopFeaturesTableProps> = ({
  features = [],
  title = "Most Visited",
  maxHeight = 380,
  dense = true,
  showPathHint = false,
}) => {
  const theme = useTheme();
  const size = dense ? "small" : "medium";
  const hasData = features && features.length > 0;

  // NEW: Total visits across all pages
  const totalVisits = React.useMemo(
    () =>
      (features || []).reduce(
        (sum, f) => sum + Number(f?.total_visits || 0),
        0
      ),
    [features]
  );

  // Ultra-light column header background
  const headerBg =
    theme.palette.mode === "light"
      ? alpha(theme.palette.primary.main, 0.03)
      : alpha(theme.palette.primary.light, 0.06);

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: theme.palette.mode === "light" ? "#fff" : "background.paper",
      }}
      elevation={0}
    >
      {/* Simple, clean title bar */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
        }}
      >
        <Stack spacing={0.25} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
          {/* NEW: total visits summary (remove if not needed) */}
          {hasData && (
            <Typography variant="caption" color="text.secondary">
              Total: {numberFmt.format(totalVisits)} visits
            </Typography>
          )}
        </Stack>
      </Box>

      <TableContainer sx={{ maxHeight }}>
        <Table
          size={size}
          aria-label="Top features"
          sx={{
            "& thead th": {
              fontSize: 12.5,
              color: "text.secondary",
              backgroundColor: headerBg,
              fontWeight: 600,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "50%" }}>Page</TableCell>
              <TableCell
                align="right"
                sx={{ whiteSpace: "nowrap", width: 260 }}
              >
                Visits (share)
              </TableCell>
              <TableCell
                align="right"
                sx={{ whiteSpace: "nowrap", width: 160 }}
              >
                Avg. Duration
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {hasData ? (
              features.map((f, idx) => {
                const visits = Number(f?.total_visits || 0);
                // NEW: percent of total (not vs. max row)
                const pctOfTotal =
                  totalVisits > 0 ? (visits / totalVisits) * 100 : 0;

                const label = displayNameFromPath(f?.page);
                const fullPath = f?.page || "";

                return (
                  <TableRow key={`${fullPath}-${idx}`}>
                    {/* Page */}
                    <TableCell sx={{ py: dense ? 1 : 1.5 }}>
                      <Stack direction="column" spacing={0.25}>
                        <Tooltip title={fullPath || label} placement="top" arrow>
                          <Chip
                            size="small"
                            label={label}
                            sx={{
                              width: "fit-content",
                              fontWeight: 600,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color:
                                theme.palette.mode === "light"
                                  ? theme.palette.primary.dark
                                  : theme.palette.primary.light,
                              borderColor: "transparent",
                            }}
                          />
                        </Tooltip>

                        {showPathHint && fullPath && fullPath !== label && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ opacity: 0.85 }}
                          >
                            {fullPath}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>

                    {/* Visits (share of total) */}
                    <TableCell
                      align="right"
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                        py: dense ? 1 : 1.5,
                      }}
                    >
                      {/* Count + % */}
                      <Box sx={{ fontWeight: 700 }}>
                        {numberFmt.format(visits)}{" "}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5, fontWeight: 500 }}
                        >
                          ({pctOfTotal.toFixed(1)}%)
                        </Typography>
                      </Box>

                      {/* Progress reflects % of total */}
                      <LinearProgress
                        variant="determinate"
                        value={pctOfTotal}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                          },
                        }}
                      />
                    </TableCell>

                    {/* Avg. Duration */}
                    <TableCell
                      align="right"
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                        whiteSpace: "nowrap",
                        py: dense ? 1 : 1.5,
                      }}
                    >
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        {formatDuration(f?.avg_duration)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={1.25}>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      No feature data
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When events arrive, your top pages and engagement will
                      appear here.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TopFeaturesTable;
