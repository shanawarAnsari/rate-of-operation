import * as React from "react";
import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Collapse,
  Link,
  alpha,
  useTheme,
} from "@mui/material";
import DonutChart from "./DonutChart";

export type OverrideItem = {
  feature: string;
  count: number;
};

export type RateOverridesTableProps = {
  overrides: {
    operationsOverridePercentages: OverrideItem[];
    wrenchTimeOverridePercentages: OverrideItem[];
  };
};

const numberFmt = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

const sumCountsExceptTotal = (data: OverrideItem[]): number =>
  (data || []).reduce((acc, { feature, count }) => {
    if (/total/i.test(feature || "")) return acc;
    const c = Number(count) || 0;
    return acc + (c < 0 ? 0 : c);
  }, 0);

const categorizeOverrides = (data: OverrideItem[]) => {
  const categories: Record<string, number> = {
    "AI/ML": 0,
    Manual: 0,
    Current: 0,
    Others: 0,
  };

  const othersDetails: { feature: string; count: number }[] = [];

  (data || []).forEach(({ feature, count }) => {
    if (/total/i.test(feature || "")) return;

    const c = Number(count) || 0;

    if (/AI\/ML/i.test(feature)) {
      categories["AI/ML"] += c;
    } else if (/Manual/i.test(feature)) {
      categories["Manual"] += c;
    } else if (/Current/i.test(feature)) {
      categories["Current"] += c;
    } else {
      categories["Others"] += c;
      othersDetails.push({ feature, count: c });
    }
  });

  return { categories, othersDetails };
};

const getAIMLSelectionCount = (data: OverrideItem[]): number => {
  const totalItem = data.find(({ feature }) => /total/i.test(feature));
  const total = Number(totalItem?.count) || 0;

  const { categories } = categorizeOverrides(data);
  const nonAIMLTotal = categories["Manual"] + categories["Current"] + categories["Others"];

  return total - nonAIMLTotal;
};

const RateOverridesTable: React.FC<RateOverridesTableProps> = ({ overrides }) => {
  const theme = useTheme();

  const [showOthersOps, setShowOthersOps] = React.useState(false);
  const [showOthersWrench, setShowOthersWrench] = React.useState(false);

  const headerBg =
    theme.palette.mode === "light"
      ? alpha(theme.palette.primary.main, 0.03)
      : alpha(theme.palette.primary.light, 0.06);

  const renderSection = (
    title: string,
    data: OverrideItem[],
    showOthers: boolean,
    toggleOthers: () => void
  ) => {
    const { categories, othersDetails } = categorizeOverrides(data);
    const totalExcludingTotal = sumCountsExceptTotal(data);
    const aimlCount = Math.max(0, getAIMLSelectionCount(data));

    // Override AI/ML for display (table + chart)
    const adjustedCategories: Record<string, number> = {
      ...categories,
      ["AI/ML"]: aimlCount,
    };

    const chartLabels = Object.keys(adjustedCategories);
    const chartSeries = chartLabels.map((label) => adjustedCategories[label]);
    // Keep the donut consistent with what we show in the table
    const donutTotal = chartSeries.reduce((sum, v) => sum + (Number(v) || 0), 0);

    return (
      <Grid item xs={12} md={6}>
        <Box sx={{ px: 2, py: 1.25, ml: 2 }}>
          <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>{title}</Typography>
        </Box>

        <Grid container spacing={2} sx={{ px: 2, pb: 2 }}>
          <Grid item xs={7}>
            <Table
              size="small"
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
                  <TableCell>Rate Type Used</TableCell>
                  <TableCell align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(adjustedCategories).map(([feature, count], idx) => (
                  <React.Fragment key={`${feature}-${idx}`}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {feature}
                        {feature === "Others" && othersDetails.length > 0 && (
                          <Link
                            component="button"
                            variant="body2"
                            sx={{ ml: 1 }}
                            onClick={toggleOthers}
                          >
                            {showOthers ? "Hide" : "View"}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell align="right">{numberFmt.format(count)}</TableCell>
                    </TableRow>

                    {feature === "Others" && showOthers && (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ py: 1, pl: 3 }}>
                          <Collapse in={showOthers}>
                            <Box>
                              {othersDetails.map((item, i) => (
                                <Typography
                                  key={i}
                                  variant="body2"
                                  sx={{ color: "text.secondary", mb: 0.5 }}
                                >
                                  • {item.feature} ({numberFmt.format(item.count)})
                                </Typography>
                              ))}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={5}>
            <DonutChart
              labels={chartLabels}
              series={chartSeries}
              centerTotal={donutTotal} // or use totalExcludingTotal to keep your original total
            />
            {/* No extra Typography below the chart, as requested */}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {renderSection(
        "Rate Of Operation",
        overrides?.operationsOverridePercentages || [],
        showOthersOps,
        () => setShowOthersOps((prev) => !prev)
      )}

      {renderSection(
        "Setup Time",
        overrides?.wrenchTimeOverridePercentages || [],
        showOthersWrench,
        () => setShowOthersWrench((prev) => !prev)
      )}
    </Grid>
  );
};

export default RateOverridesTable;
