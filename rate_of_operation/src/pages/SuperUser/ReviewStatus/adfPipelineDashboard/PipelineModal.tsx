import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAdfPipeManager } from "../hooks/useAdfPipeManager";
import PipelineActions from "./PipelineActions";
import PipelineHistory from "./PipelineHistory";

interface PipelineModalProps {
  open: boolean;
  onClose: () => void;
}

const PipelineModal: React.FC<PipelineModalProps> = ({ open, onClose }) => {
  const {
    getHistory,
    historyLoading,
    historyError,
    historyResult,
    generatePredictions,
    archiveRatesCall,
  } = useAdfPipeManager();

  const [runHistory, setRunHistory] = useState<any[]>([]);
  const [historyRangeSelected, setHistoryRangeSelected] = useState("30days");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" } | null | any>(null);
  const [isPolling, setIsPolling] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const hasInProgressPipelines = (runs: any[]): boolean =>
    runs.some((run) => ["InProgress", "Queued", "Running"].includes(run.status));

  const fetchAndUpdateHistory = useCallback(
    async (silent = false) => {
      if (silent) setIsPolling(true);
      await getHistory(historyRangeSelected);
      setLastUpdated(new Date());
      if (silent) setIsPolling(false);
    },
    [getHistory, historyRangeSelected]
  );

  const historyRangeChange = (range: string) => {
    setHistoryRangeSelected(range);
  };

  useEffect(() => {
    if (open) {
      fetchAndUpdateHistory();
    }
  }, [open, fetchAndUpdateHistory]);

  useEffect(() => {
    if (Array.isArray(historyResult)) {
      setRunHistory(historyResult);

      const shouldPoll = hasInProgressPipelines(historyResult);
      if (shouldPoll && !pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchAndUpdateHistory(true); // silent polling
        }, 30000);
      } else if (!shouldPoll && pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
  }, [historyResult, fetchAndUpdateHistory]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  const handleAction = async (action: "generate" | "archive") => {
    try {
      if (action === "generate") await generatePredictions();
      else await archiveRatesCall();
      await fetchAndUpdateHistory();
      setSnackbar({
        message: `${action === "generate" ? "Prediction" : "Archive"} pipeline triggered successfully`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        message: `Failed to trigger ${action} pipeline`,
        severity: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ fontWeight: 600, fontSize: 18, py: 1, m: 0 }}>
          Pipeline Dashboard
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500], mr: 1 }}>
          <Close />
        </IconButton>
      </Stack>

      <Divider />
      <DialogContent sx={{ p: 2, py: 1 }}>
        <Stack spacing={1}>
          <PipelineActions
            onGenerate={() => handleAction("generate")}
            onArchive={() => handleAction("archive")}
            runHistory={runHistory}
          />
          <PipelineHistory
            historyRange={historyRangeSelected}
            loading={!isPolling && historyLoading}
            error={historyError}
            data={runHistory}
            historyRangeChange={historyRangeChange}
            hasInProgressPipelines={hasInProgressPipelines(runHistory)}
            lastUpdated={lastUpdated}
          />
        </Stack>
      </DialogContent>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {snackbar && (
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </Dialog>
  );
};

export default PipelineModal;
