import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface SaveConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewedSetupTimes: any[];
  originalData: any[];
  isSaving?: boolean;
}

const SaveConfirmationDialog: React.FC<SaveConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  reviewedSetupTimes,
  originalData,
  isSaving = false,
}) => {
  // Get original values for comparison
  const getOriginalValues = (setupTimeKey: string) => {
    return originalData.find((item) => item.SETUP_TIME_KEY === setupTimeKey);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box>
          <Typography variant="h6">Confirm Setup Time Updates</Typography>
          <Typography variant="body2" color="text.secondary">
            {`You are about to update ${reviewedSetupTimes.length} setup time${
              reviewedSetupTimes.length > 1 ? "s" : ""
            }. Please
            review the changes below:`}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 1.5 }}>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 600,
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "hidden",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1.5 } }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-head": {
                    backgroundColor: (theme) => theme.palette.background.paper,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "30%",
                  }}
                >
                  Setup Time Key
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "25%",
                  }}
                >
                  New Setup Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "15%",
                  }}
                >
                  Change %
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    width: "30%",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewedSetupTimes.map((setupTime, index) => {
                const originalValues = getOriginalValues(setupTime.SETUP_TIME_KEY);

                // Calculate percentage change for display
                const changePercent =
                  originalValues?.NEW_SETUPTIME_MINUTES &&
                  setupTime.NEW_SETUPTIME_MINUTES
                    ? (
                        ((setupTime.NEW_SETUPTIME_MINUTES -
                          originalValues.NEW_SETUPTIME_MINUTES) /
                          originalValues.NEW_SETUPTIME_MINUTES) *
                        100
                      ).toFixed(1)
                    : null;

                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(even)": { backgroundColor: "grey.25" },
                      "&:hover": { backgroundColor: "action.hover" },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "text.primary",
                        fontFamily: "monospace",
                      }}
                    >
                      {setupTime.SETUP_TIME_KEY}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {originalValues?.NEW_SETUPTIME_MINUTES &&
                            setupTime.NEW_SETUPTIME_MINUTES && (
                              <>
                                {parseFloat(setupTime.NEW_SETUPTIME_MINUTES) >
                                  parseFloat(
                                    originalValues.NEW_SETUPTIME_MINUTES
                                  ) && (
                                  <ArrowUpwardIcon
                                    fontSize="small"
                                    sx={{
                                      color: "success.600",
                                      mr: 0.5,
                                      fontSize: "0.9rem",
                                    }}
                                  />
                                )}
                                {parseFloat(setupTime.NEW_SETUPTIME_MINUTES) <
                                  parseFloat(
                                    originalValues.NEW_SETUPTIME_MINUTES
                                  ) && (
                                  <ArrowDownwardIcon
                                    fontSize="small"
                                    sx={{
                                      color: "error.600",
                                      mr: 0.5,
                                      fontSize: "0.9rem",
                                    }}
                                  />
                                )}
                              </>
                            )}
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {setupTime.NEW_SETUPTIME_MINUTES}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ fontSize: "0.85rem", color: "text.secondary" }}
                        >
                          (was {originalValues?.NEW_SETUPTIME_MINUTES || "-"})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {changePercent ? (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            backgroundColor: (theme) =>
                              theme.palette.mode === "light"
                                ? theme.palette.grey[200]
                                : theme.palette.grey[800],
                          }}
                        >
                          {parseFloat(changePercent) > 0 ? (
                            <>
                              <ArrowUpwardIcon
                                sx={{ fontSize: "0.85rem", mr: 0.5 }}
                              />
                              +{changePercent}%
                            </>
                          ) : parseFloat(changePercent) < 0 ? (
                            <>
                              <ArrowDownwardIcon
                                sx={{ fontSize: "0.85rem", mr: 0.5 }}
                              />
                              {changePercent}%
                            </>
                          ) : (
                            <>{changePercent}%</>
                          )}
                        </Box>
                      ) : (
                        <Typography
                          sx={{ fontSize: "0.7rem", color: "text.disabled" }}
                        >
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "start",
                            backgroundColor: "success.100",
                            color: "success.800",
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 2,
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            letterSpacing: "0.02em",
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              backgroundColor: "success.600",
                              mr: 0.5,
                            }}
                          />
                          REVIEWED
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                          }}
                        >
                          (was N)
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving
            ? "Saving..."
            : `Confirm & Save (${reviewedSetupTimes.length} setup times)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveConfirmationDialog;
