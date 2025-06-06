import React, { useState } from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

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
  totalSkipped?: number;
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
  autoHideDuration = 15000,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!updateResponse) return null;

  const {
    success,
    results = [],
    totalUpdated = 0,
    totalSkipped = 0,
    totalFailed = 0,
    message,
  } = updateResponse;

  const severity = success
    ? "success"
    : totalUpdated > 0
      ? "warning"
      : "error";

  const successResults = results.filter((r) => r.success);
  const failedResults = results.filter((r) => !r.success);

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ mt: 8, maxWidth: 420 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          maxWidth: 420,
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "0.875rem", mb: 1 }}>
          {message}
        </Typography>

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
              }}
              onClick={() => setExpanded((prev) => !prev)}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontSize: "0.75rem" }}>
                {expanded ? "Hide details" : "Show details"}
              </Typography>
              <IconButton size="small">
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                {successResults.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "success.main", fontWeight: 600, mb: 0.5 }}
                    >
                      Successfully Updated
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      {successResults.map((result, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 1 }}>
                          <ListItemText
                            primary={result.key}
                            secondary={`${result.rowsAffected ?? 0} row(s) affected`}
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
                      variant="subtitle2"
                      sx={{ color: "error.main", fontWeight: 600, mb: 0.5 }}
                    >
                      Failed to Update
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      {failedResults.map((result, index) => (
                        <ListItem key={index} sx={{ py: 0.5, px: 1 }}>
                          <ListItemText
                            primary={result.key}
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
