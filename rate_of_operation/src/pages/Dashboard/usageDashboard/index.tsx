import React, { useEffect, useState } from "react";
import { Box, useTheme, Alert, Grid, Stack, Typography, Card, Paper, Divider } from "@mui/material";
import CompactDateRangePicker from "./CompactDateRangePicker";
import SummaryCards from "./summaryCard";
import TopFeaturesTable from "./topFeatuesTable";
import RateOverridesTable from "./rateOverrideTables";
import DailySessionsChart from "./DailySessionsChart";
import { getAppTelemtry } from "../../../services/telemetry";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

type DateRange = { start: string; end: string };
const MIN_DATE = "2025-09-01";
const startOfUTC = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
const parseToUTCDate = (value: string) => {
  if (!value || typeof value !== "string") return null;
  const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (dateOnlyMatch) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  }
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return null;
  return startOfUTC(parsed);
};
const now = new Date();
const currentMonthStart = new Date(
  now.getFullYear(),
  now.getMonth(),
  1
).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const currentMonthEnd = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  0
).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
type ValidationResult =
  | { ok: true; value: DateRange }
  | { ok: false; message: string };

function validateAndNormalizeRange(
  input: DateRange,
  opts?: { minDate?: string; maxDate?: string }
): ValidationResult {
  if (!input || !input.start || !input.end) {
    return { ok: false, message: "Please select both start and end dates." };
  }

  const start = parseToUTCDate(input.start);
  const end = parseToUTCDate(input.end);
  if (!start || !end) {
    return { ok: false, message: "Invalid date format. Please use a valid date range." };
  }
  const normalizedStartISO = startOfUTC(start).toISOString();
  const endOfUTC = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  const normalizedEndISO = endOfUTC(end).toISOString();
  const min = opts?.minDate ? parseToUTCDate(opts.minDate) : null;
  const todayUTC = startOfUTC(new Date());
  const max = opts?.maxDate ? parseToUTCDate(opts.maxDate) ?? todayUTC : todayUTC;
  if (min && start < min) {
    return {
      ok: false,
      message: `Start date cannot be before ${opts?.minDate}.`,
    };
  }

  if (end < start) {
    return { ok: false, message: "End date cannot be earlier than start date." };
  }

  return {
    ok: true,
    value: { start: normalizedStartISO, end: normalizedEndISO },
  };
}

const UsageMetrices: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>();
  const theme = useTheme();

  const [range, setRange] = useState<DateRange | null>(null); // initially null

  useEffect(() => {
    if (!range) return;

    let cancelled = false;

    const fetchData = async () => {
      setError(null);

      const validation = validateAndNormalizeRange(range, {
        minDate: MIN_DATE,
      });

      if (!validation.ok) {
        if (!cancelled) {
          setData(undefined);
          setLoading(false);
          setError(validation.message);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await getAppTelemtry(validation.value);
        if (!cancelled) setData(response);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to load telemetry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <Box sx={{ mt: -3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 1,
        }}
      >
        <CompactDateRangePicker
          onChange={(start: string, end: string) => {
            setRange({ start, end });
          }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
          <TailChase
            size="38"
            speed="1.5"
            color={theme.palette.primary.main}
          />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            textAlign: "center",
            px: 3,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Unable to load telemetry data at the moment!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We encountered an error while fetching usage metrics. Please try again later or contact support if the issue persists.
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Error: {error}
          </Typography>
          {error}
        </Box>
      ) : data ? (
        <>
          <SummaryCards data={data?.summary} />
          <Grid
            container
            spacing={2}
            columns={{ xs: 1, md: 10 }}
            sx={{ alignItems: "stretch", mb: 2 }}
          >
            <Grid item xs={1} md={6} sx={{ minWidth: 0, display: "flex" }}>
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <DailySessionsChart trend={data?.summary?.dailySessionsTrend} />
              </Box>
            </Grid>

            <Grid item xs={1} md={4} sx={{ minWidth: 0, display: "flex" }}>
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <TopFeaturesTable features={data?.summary?.topFeatures} />
              </Box>
            </Grid>
          </Grid>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: theme.palette.mode === "light" ? "#fff" : "background.paper",
            }}
          >
            <Stack direction={'row'} justifyContent="space-between">
              <Typography sx={{ fontWeight: 600 }}>Rate Selections</Typography>
              <Box textAlign="right">
                <Typography fontSize="14px" fontWeight="500">
                  Planning Window
                </Typography>
                <Typography fontSize="12px">
                  {currentMonthStart} - {currentMonthEnd}
                </Typography>
              </Box>
            </Stack>
            <Divider orientation="horizontal" />
            <RateOverridesTable overrides={data?.summary?.rateOverrides} />
          </Paper>
        </>
      ) : null}
    </Box>
  );
};


export default UsageMetrices;