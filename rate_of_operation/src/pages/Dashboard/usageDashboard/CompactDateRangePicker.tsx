import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  Paper,
  Popper,
  Stack,
  Typography,
  Grow,
  useTheme
} from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

interface CompactDateRangePickerProps {
  /** Emits YYYY-MM-DD (native date format) only when the range is valid */
  onChange?: (start: string, end: string) => void;
}

/* ---------------- Helpers (LOCAL) ---------------- */
const pad2 = (n: number) => String(n).padStart(2, '0');
const ymdFromDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Local “today” */
const todayYmdLocal = () => ymdFromDate(new Date());

const addDays = (ymd: string, delta: number): string => {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return ymdFromDate(dt);
};

const startOfMonthYmd = (ymd: string) => {
  const [y, m] = ymd.split('-').map(Number);
  return `${y}-${pad2(m)}-01`;
};
const startOfYearYmd = (ymd: string) => `${ymd.split('-')[0]}-01-01`;

const isYmd = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const clamp = (v: string, min: string, max: string) => (v < min ? min : v > max ? max : v);
//---------------------------------------------------------------------------//
const MIN_DATE = '2025-09-01';

const CompactDateRangePicker: React.FC<CompactDateRangePickerProps> = ({ onChange }) => {
  const theme = useTheme()
  const todayLocal = useMemo(todayYmdLocal, []);
  const [startYmd, setStartYmd] = useState<string>(addDays(todayLocal, -6));
  const [endYmd, setEndYmd] = useState<string>(todayLocal);

  const [error, setError] = useState<string | null>(null);

  // Popper state
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  // ✅ LOCAL “today” as max (your request)
  const MAX_DATE = todayYmdLocal();

  /** Validate & normalize strictly using LOCAL bounds; return clamped pair or null */
  const validateAndNormalize = (rawStart: string, rawEnd: string): { s: string; e: string } | null => {
    if (!isYmd(rawStart) || !isYmd(rawEnd)) {
      setError('Invalid date format.');
      return null;
    }

    let s = clamp(rawStart, MIN_DATE, MAX_DATE);
    let e = clamp(rawEnd, MIN_DATE, MAX_DATE);

    // Strict inequality
    if (s >= e) {
      setError('Start date must be before end date.');
      return null;
    }

    setError(null);
    return { s, e };
  };

  const applyRange = (rawStart: string, rawEnd: string) => {
    const valid = validateAndNormalize(rawStart, rawEnd);
    if (!valid) return;
    setStartYmd(valid.s);
    setEndYmd(valid.e);
    onChange?.(valid.s, valid.e); // ✅ only emit when valid
  };

  // If day rolls over while the app is open, keep within new local MAX_DATE
  useEffect(() => {
    const valid = validateAndNormalize(startYmd, endYmd);
    if (valid && (valid.s !== startYmd || valid.e !== endYmd)) {
      setStartYmd(valid.s);
      setEndYmd(valid.e);
      onChange?.(valid.s, valid.e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MAX_DATE]);

  /* ---------------- Presets (LOCAL) ---------------- */
  const setLastNDays = (n: number) => {
    const end = MAX_DATE;
    const start = addDays(end, -(n - 1));
    applyRange(start, end);
  };

  const setLast7 = () => setLastNDays(7);
  const setLast30 = () => setLastNDays(30);
  const setLast60 = () => setLastNDays(60);
  const setLast90 = () => setLastNDays(90);

  const setMTD = () => {
    const end = MAX_DATE;
    const start = startOfMonthYmd(end);
    applyRange(start, end);
  };

  const setYTD = () => {
    const end = MAX_DATE;
    const start = startOfYearYmd(end);
    applyRange(start, end);
  };

  /* -------------- Native date input handlers -------------- */
  const handleStartInput = (v: string) => {
    if (!isYmd(v)) return;
    applyRange(v, endYmd);
  };

  const handleEndInput = (v: string) => {
    if (!isYmd(v)) return;
    applyRange(startYmd, v);
  };

  /* -------------- UI controls -------------- */
  const handleToggle = () => setOpen((p) => !p);
  const handleClose = () => setOpen(false);
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    }
  };

  /* Enforce strict inequality in UI as well */
  const maxStartForInput = clamp(addDays(endYmd, -1), MIN_DATE, MAX_DATE); // start < end
  const minEndForInput = clamp(addDays(startYmd, 1), MIN_DATE, MAX_DATE); // end > start

  /* Preset selection highlight */
  const isLastNDays = (n: number) => {
    const end = MAX_DATE;
    const start = addDays(end, -(n - 1));
    return startYmd === start && endYmd === end;
  };
  const isMTD = () => {
    const end = MAX_DATE;
    const start = startOfMonthYmd(end);
    return startYmd === start && endYmd === end;
  };
  const isYTD = () => {
    const end = MAX_DATE;
    const start = startOfYearYmd(end);
    return startYmd === start && endYmd === end;
  };
  useEffect(() => {
    // Emit initial range on mount
    const end = todayYmdLocal();
    const start = startOfMonthYmd(end); // MTD
    applyRange(start, end); // this will call onChange if valid
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {/* Anchor button shows current range (native YYYY-MM-DD) */}
      <Button
        ref={anchorRef}
        variant="contained"
        size="small"
        startIcon={<CalendarMonthOutlinedIcon fontSize="small" />}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={open ? 'true' : 'false'}
        aria-controls="cdrp-popper"
        sx={{ textTransform: 'none', borderRadius: 1.5, px: 1.5, py: 0.5 }}
      >
        {startYmd} → {endYmd}
      </Button>

      <Popper
        id="cdrp-popper"
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        role="dialog"
        aria-labelledby="cdrp-title"
        sx={{ zIndex: (t) => t.zIndex.modal + 1 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'right top' }}>
            <Paper
              elevation={10}
              sx={{
                mt: 1,
                borderRadius: 2,
                overflow: 'hidden',
                minWidth: 360,
                maxWidth: 520,
                boxShadow: (t) => `${t.shadows[8]}`,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box onKeyDown={handleKeyDown}>
                  {/* Header */}
                  <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
                    <Typography id="cdrp-title" variant="subtitle2" color="text.secondary">
                      Selected date range
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {startYmd} → {endYmd}
                    </Typography>
                    {error && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                        {error}
                      </Typography>
                    )}
                  </Box>

                  <Divider />

                  {/* Content */}
                  <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {/* Quick ranges */}
                      <Grid item xs={12}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.75, display: 'block' }}
                        >
                          Quick ranges
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                          <Chip
                            size="small"
                            label="Last 7 days"
                            color={isLastNDays(7) ? 'primary' : 'default'}
                            variant={isLastNDays(7) ? 'filled' : 'outlined'}
                            onClick={setLast7}
                          />
                          <Chip
                            size="small"
                            label="Last 30 days"
                            color={isLastNDays(30) ? 'primary' : 'default'}
                            variant={isLastNDays(30) ? 'filled' : 'outlined'}
                            onClick={setLast30}
                          />
                          <Chip
                            size="small"
                            label="Last 60 days"
                            color={isLastNDays(60) ? 'primary' : 'default'}
                            variant={isLastNDays(60) ? 'filled' : 'outlined'}
                            onClick={setLast60}
                          />
                          <Chip
                            size="small"
                            label="Last 90 days"
                            color={isLastNDays(90) ? 'primary' : 'default'}
                            variant={isLastNDays(90) ? 'filled' : 'outlined'}
                            onClick={setLast90}
                          />
                          <Chip
                            size="small"
                            label="MTD"
                            color={isMTD() ? 'primary' : 'default'}
                            variant={isMTD() ? 'filled' : 'outlined'}
                            onClick={setMTD}
                          />
                          <Chip
                            size="small"
                            label="YTD"
                            color={isYTD() ? 'primary' : 'default'}
                            variant={isYTD() ? 'filled' : 'outlined'}
                            onClick={setYTD}
                          />
                        </Stack>
                      </Grid>

                      {/* Custom range (native date inputs) */}
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.75, display: 'block' }}
                        >
                          Custom range
                        </Typography>
                        <Grid container spacing={1.5}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'grid', gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Start
                              </Typography>
                              <input
                                type="date"
                                value={startYmd}
                                min={MIN_DATE}
                                max={maxStartForInput} // start must be < end (LOCAL)
                                onChange={(e) => handleStartInput(e.target.value)}
                                aria-label="Start date"
                                style={{
                                  width: '100%',
                                  padding: '8.5px 12px',
                                  borderRadius: 6,
                                  border: '1px solid rgba(0,0,0,0.23)',
                                  fontSize: 14,
                                  color: theme.palette.text.primary,
                                  backgroundColor: theme.palette.background.default
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'grid', gap: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                End
                              </Typography>
                              <input
                                type="date"
                                value={endYmd}
                                min={minEndForInput} // end must be > start (LOCAL)
                                max={MAX_DATE}       // prevent “after today” (LOCAL)
                                onChange={(e) => handleEndInput(e.target.value)}
                                aria-label="End date"
                                style={{
                                  width: '100%',
                                  padding: '8.5px 12px',
                                  borderRadius: 6,
                                  border: '1px solid rgba(0,0,0,0.23)',
                                  fontSize: 14,
                                  color: theme.palette.text.primary,
                                  backgroundColor: theme.palette.background.default
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default CompactDateRangePicker;