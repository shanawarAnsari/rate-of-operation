import {
  Card,
  CardContent,
  Typography,
  Stack,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  ArrowDropUp,
  ArrowDropDown,
  History,
  CheckCircle,
  ReportProblemRounded,
  SmsFailedOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { convertToLocalDateTime, convertToMinSeconds } from "./utils";

interface PipelineRun {
  pipelineName: string;
  runId: string;
  status: string;
  runStart: string;
  runEnd: string;
  durationInMs: number;
  message?: string;
}

interface PipelineHistoryProps {
  loading: boolean;
  error: any;
  data: PipelineRun[];
  historyRangeChange: (range: string) => void;
  hasInProgressPipelines: boolean;
  lastUpdated: Date | null;
  historyRange: string;
}

const PipelineHistory: React.FC<PipelineHistoryProps> = ({
  loading,
  error,
  data,
  historyRangeChange,
  hasInProgressPipelines,
  lastUpdated,
  historyRange
}) => {

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const handleRangeChange = (event: SelectChangeEvent) => {
    historyRangeChange(event.target.value);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const getSortIcons = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <Stack direction="column" spacing={-1.65} ml={0.5}>
          <ArrowDropUp sx={{ fontSize: '18px' }} />
          <ArrowDropDown sx={{ fontSize: '18px' }} />
        </Stack>
      );
    }
    return sortConfig.direction === "asc" ? (
      <ArrowDropUp fontSize="small" />
    ) : (
      <ArrowDropDown fontSize="small" />
    );
  };

  const sortedData = [...data]?.sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aVal = a[key as keyof PipelineRun];
    const bVal = b[key as keyof PipelineRun];

    if (aVal === undefined || bVal === undefined) return 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  return (
    <Card elevation={3}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <History color="action" />
            <Typography fontWeight={600}>Run History</Typography>
          </Stack>
          <FormControl size="small">
            <Select
              size="small"
              value={historyRange}
              onChange={handleRangeChange}
              displayEmpty
              inputProps={{ "aria-label": "History Range" }}
              sx={{
                width: 120,
                '& .MuiInputBase-input': {
                  fontSize: '12px',
                  padding: '6px 8px',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '16px',
                },
              }}
            >
              <MenuItem value="24hrs">Last 24 Hours</MenuItem>
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="90days">Last 90 Days</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Paper elevation={0} sx={{ mt: 1, maxHeight: "45vh", overflowY: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  { label: "Pipeline", key: "pipelineName" },
                  { label: "Status", key: "status" },
                  { label: "Start Time", key: "runStart" },
                  { label: "End Time", key: "runEnd" },
                  { label: "Duration", key: "durationInMs" },
                ].map(({ label, key }) => (
                  <TableCell key={key} onClick={() => handleSort(key)} sx={{ cursor: "pointer" }}>
                    <Stack direction="row" alignItems="center">
                      {label}
                      {getSortIcons(key)}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box display="flex" justifyContent="center" py={3}>
                      <CircularProgress size={24} />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="error">Error fetching history: {error.message}</Typography>
                  </TableCell>
                </TableRow>
              ) : sortedData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography align="center" color="text.secondary">
                      No pipeline runs found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData?.map((run, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography sx={{ fontSize: "12px" }}>{run.pipelineName}</Typography>
                      <Typography variant="body2" sx={{ fontSize: "9px" }}>
                        Run Id: {run.runId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {run.status === "Succeeded" && (
                          <>
                            <CheckCircle color="success" fontSize="small" />
                            <Typography color="green" sx={{ fontSize: "12px" }}>Succeeded</Typography>
                          </>
                        )}
                        {run.status === "Failed" && (
                          <>
                            <ReportProblemRounded sx={{ color: "rgba(244, 67, 54, 0.85)" }} fontSize="small" />
                            <Typography color="error" sx={{ fontSize: "12px" }}>Failed</Typography>
                            <Tooltip title={run?.message} arrow placement="top">
                              <SmsFailedOutlined sx={{ color: "rgba(244, 67, 54, 0.85)" }} fontSize="small" />
                            </Tooltip>
                          </>
                        )}
                        {run.status === "InProgress" && (
                          <>
                            <CircularProgress size={16} thickness={5} sx={{ color: "#d99e08" }} />
                            <Typography sx={{ color: "#d99e08", fontSize: "12px" }}>In Progress</Typography>
                          </>
                        )}
                        {run.status === "Queued" && (
                          <>
                            <CircularProgress size={16} thickness={5} sx={{ color: "#E4d28a" }} />
                            <Typography sx={{ color: "#d99e08", fontSize: "12px" }}>Queued</Typography>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "12px" }}>{convertToLocalDateTime(run.runStart)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "12px" }}>{convertToLocalDateTime(run.runEnd)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "12px" }}>{convertToMinSeconds(run.durationInMs)}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
        <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
          {lastUpdated && !loading && (
            <Typography variant="caption" sx={{ mt: 1, mb: -1, textAlign: "end", display: "block" }}>
              Last updated: Today, {lastUpdated.toLocaleTimeString()}
            </Typography>
          )}
          {hasInProgressPipelines && (
            <Typography sx={{ fontSize: "12px", mt: 1, mb: -1, textAlign: "end" }}>
              Pipeline status is auto updated every 30 seconds
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PipelineHistory;
