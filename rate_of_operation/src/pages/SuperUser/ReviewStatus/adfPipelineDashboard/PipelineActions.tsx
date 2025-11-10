import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ArchiveIcon from "@mui/icons-material/Archive";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import { useReviewStatus } from "../hooks/useReviewStatus";
import { InsertDriveFile } from "@mui/icons-material";
import { downloadWindShuttle } from "../../../../services/review-status";

interface PipelineActionsProps {
  onGenerate: () => Promise<void>;
  onArchive: () => Promise<void>;
  runHistory: any[];
}
const PipelineActions: React.FC<PipelineActionsProps> = ({
  onGenerate,
  onArchive,
  runHistory,
}) => {
  const [loadingType, setLoadingType] = useState<"generate" | "archive" | null>(null);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(false);
  const [isArchiveDisabled, setIsArchiveDisabled] = useState(false);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(false);
  const [lastPipelineRun, setLastPipelineRun] = useState<Date | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [downloadConfirmOpen, setDownloadConfirmOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const { getTotalCountForStatusAcrossTypes } = useReviewStatus();

  const isPipelineRunning = (pipelineName: string) =>
    runHistory.some(
      (run) =>
        run.pipelineName === pipelineName &&
        ["InProgress", "Queued", "Running"].includes(run.status)
    );

  useEffect(() => {
    setIsGenerateDisabled(
      isPipelineRunning("Pipeline_ProductionRate_MasterGeneratePrediction_UI")
    );
    setIsArchiveDisabled(
      isPipelineRunning("Pipeline_ProductionRate_SQL_to_Snowflake")
    );

    const pipelineRuns = runHistory
      .filter(run => run.pipelineName === "Pipeline_ProductionRate_SQL_to_Snowflake" && run.runEnd)
      .sort((a, b) => new Date(b.runEnd).getTime() - new Date(a.runEnd).getTime());

    if (pipelineRuns.length > 0) {
      const latestRunDate = new Date(pipelineRuns[0].runEnd);
      const daysSinceLastRun = (Date.now() - latestRunDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceLastRun <= 30) {
        setLastPipelineRun(latestRunDate);
        setIsDownloadDisabled(false);
      } else {
        setIsDownloadDisabled(true);
      }
    } else {
      setIsDownloadDisabled(true);
    }
  }, [runHistory]);

  const fetchTotalNCount = async () => {
    try {
      const totalN = await getTotalCountForStatusAcrossTypes(
        ["operations", "wrenchtime"],
        "category",
        "N"
      );
      return totalN;
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to fetch review status.",
        severity: "error",
      });
      return -1;
    }
  };

  const handleClick = async (type: "generate" | "archive"): Promise<void> => {
    setLoadingType(type);
    try {
      if (type === "generate") {
        setConfirmOpen(true);
      } else {
        const total = await fetchTotalNCount();
        if (total <= 0) {
          await onArchive();
        } else {
          setSnackbar({
            open: true,
            message: `Cannot archive: ${total} recipes still in status 'N'.`,
            severity: "error",
          });
        }
      }
    } finally {
      setLoadingType(null);
    }
  };

  const handleConfirmGenerate = async () => {
    setConfirmOpen(false);
    setLoadingType("generate");
    try {
      await onGenerate();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to run generate pipeline.",
        severity: "error",
      });
    } finally {
      setLoadingType(null);
    }
  };

  const handleDownload = () => {
    if (!lastPipelineRun) return;
    setDownloadConfirmOpen(true);
  };

  const handleConfirmDownload = async () => {
    setDownloadConfirmOpen(false);
    setDownloading(true);
    try {
      await downloadWindShuttle();
      setSnackbar({
        open: true,
        message: "WindShuttle Script Zip file downloaded successfully.",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error?.message || "Failed to download WindShuttle Script zip file.",
        severity: "error",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Card sx={{ flex: 1 }} elevation={3}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <AutoGraphIcon color="primary" fontSize="large" />
              <Box>
                <Typography fontWeight="bold">Generate Rate Predictions</Typography>
                <Typography sx={{ fontSize: "12px" }} color="text.secondary">
                  Trigger the pipeline to generate new rate predictions.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={
                loadingType === "generate" ? <CircularProgress size={16} /> : <PlayArrowIcon />
              }
              disabled={loadingType === "generate" || isGenerateDisabled}
              onClick={() => handleClick("generate")}
              sx={{ textTransform: "none" }}
            >
              Run Generate Predictions Pipeline
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ flex: 1 }} elevation={3}>
          <CardContent>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ArchiveIcon color="secondary" fontSize="large" />
                <Box>
                  <Typography fontWeight="bold">Archive Rates</Typography>
                  <Typography sx={{ fontSize: "12px" }} color="text.secondary">
                    Archive user inputs and reviewed rates.
                  </Typography>
                </Box>
              </Box>
              <Tooltip title="Download Windshuttle files" arrow placement="top">
                <span>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    disabled={downloading || isDownloadDisabled}
                    onClick={handleDownload}
                    startIcon={<InsertDriveFile color="success" />}
                  >
                    Download
                  </Button>
                </span>
              </Tooltip>

            </Stack>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              startIcon={
                loadingType === "archive" ? <CircularProgress size={16} /> : <PlayArrowIcon />
              }
              disabled={loadingType === "archive" || isArchiveDisabled}
              onClick={() => handleClick("archive")}
              sx={{ textTransform: "none" }}
            >
              Run Archive Rates Pipeline
            </Button>
          </CardActions>
        </Card>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "error" })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: "", severity: "error" })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Pipeline Execution</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to run the Generate Predictions pipeline? This action will update all recipes and review statuses with new generated rates for the current planning window.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmGenerate} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={downloadConfirmOpen}
        onClose={() => setDownloadConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirm Data Download
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body1">
              You are about to download  WindShuttle Script Excel files:
            </Typography>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Pipeline Name:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pipeline_ProductionRate_SQL_to_Snowflake
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="bold">
                Last Run Date:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {lastPipelineRun?.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2">
              The data you download will reflect the state as of the last pipeline run. Do you want to proceed?
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDownloadConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDownload} color="primary" variant="contained">
            Confirm & Download
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default PipelineActions;

