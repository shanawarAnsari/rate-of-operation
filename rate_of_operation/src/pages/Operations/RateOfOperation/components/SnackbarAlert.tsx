import React from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";

interface UpdateResult {
  success: boolean;
  key?: string;
  error?: string;
  rowsAffected?: number;
}

interface UpdateResponse {
  success: boolean;
  results?: UpdateResult[];
  totalUpdated?: number;
  totalFailed?: number;
  message?: string;
  isWarning?: boolean;
}

interface SnackbarAlertProps {
  open: boolean;
  onClose: () => void;
  updateResponse: UpdateResponse | null;
  autoHideDuration?: number;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  onClose,
  updateResponse,
  autoHideDuration = 15000, // Changed to 15 seconds
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!updateResponse) return null;

  const {
    success,
    results = [],
    totalUpdated = 0,
    totalFailed = 0,
    message,
    isWarning,
  } = updateResponse;

  // Handle special warning case (no reviewed recipes)
  if (isWarning && message) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          mt: 8,
          maxWidth: 400,
        }}
      >
        <Alert
          onClose={onClose}
          severity="info"
          sx={{
            width: "100%",
            maxWidth: 400,
            "& .MuiAlert-message": {
              width: "100%",
            },
          }}
        >
          <AlertTitle sx={{ mb: 1 }}>{message}</AlertTitle>
          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
            Please review at least one recipe before attempting to save.
          </Typography>
        </Alert>
      </Snackbar>
    );
  }

  const severity = success ? "success" : totalUpdated > 0 ? "warning" : "error";

  const successResults = results.filter((result) => result.success);
  const failedResults = results.filter((result) => !result.success);

  const getAlertTitle = () => {
    if (success && totalFailed === 0) {
      return `All ${totalUpdated} recipes updated successfully!`;
    } else if (totalUpdated > 0 && totalFailed > 0) {
      return `Partial success: ${totalUpdated} updated, ${totalFailed} failed`;
    } else {
      return `Recipes update failed!`;
    }
  };

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{
        mt: 8, // Offset from top to avoid header
        maxWidth: 400,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          maxWidth: 400,
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <AlertTitle sx={{ mb: 1 }}>{getAlertTitle()}</AlertTitle>

        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          {totalUpdated > 0 && (
            <Chip
              label={`${totalUpdated} Updated`}
              color="success"
              size="small"
              variant="outlined"
            />
          )}
          {totalFailed > 0 && (
            <Chip
              label={`${totalFailed} Failed`}
              color="error"
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {results.length > 0 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                borderRadius: 1,
                p: 0.5,
                mt: 1,
              }}
              onClick={handleToggleExpanded}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontSize: "0.75rem" }}>
                {expanded ? "Hide details" : "Show details"}
              </Typography>
              <IconButton size="small">
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                {successResults.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "medium", color: "success.main", mb: 0.5 }}
                    >
                      ✅ Successfully Updated:
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      {successResults.map((result, index) => (
                        <ListItem key={index} sx={{ py: 0.25, px: 1 }}>
                          <ListItemText
                            primary={result.key || `Recipe ${index + 1}`}
                            secondary={
                              result.rowsAffected
                                ? `${result.rowsAffected} row(s) affected`
                                : undefined
                            }
                            primaryTypographyProps={{ fontSize: "0.75rem" }}
                            secondaryTypographyProps={{ fontSize: "0.65rem" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {failedResults.length > 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "medium", color: "error.main", mb: 0.5 }}
                    >
                      ❌ Failed to Update:
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      {failedResults.map((result, index) => (
                        <ListItem key={index} sx={{ py: 0.25, px: 1 }}>
                          <ListItemText
                            primary={result.key || `Recipe ${index + 1}`}
                            secondary={result.error || "Unknown error"}
                            primaryTypographyProps={{ fontSize: "0.75rem" }}
                            secondaryTypographyProps={{
                              fontSize: "0.65rem",
                              color: "error.main",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
