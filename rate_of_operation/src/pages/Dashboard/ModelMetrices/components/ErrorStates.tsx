import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { Refresh as RefreshIcon, Error as ErrorIcon } from "@mui/icons-material";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong",
  onRetry,
  showRetry = true,
}) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2, textAlign: "center" }}>
        <Stack spacing={2} alignItems="center">
          <ErrorIcon sx={{ fontSize: 48, color: "error.main" }} />
          <Typography variant="h6" color="error">
            Error Loading Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          {showRetry && onRetry && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              size="small"
            >
              Retry
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const InlineErrorState: React.FC<ErrorStateProps> = ({
  message = "Error loading data",
  onRetry,
  showRetry = true,
}) => {
  return (
    <Alert
      severity="error"
      sx={{ borderRadius: 2 }}
      action={
        showRetry && onRetry ? (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        ) : undefined
      }
    >
      <Typography variant="body2">{message}</Typography>
    </Alert>
  );
};

export const EmptyState: React.FC<{ message?: string }> = ({
  message = "No data available",
}) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3, textAlign: "center" }}>
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "grey.100",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" color="text.disabled">
              📊
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            No Data Available
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {message}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const NetworkErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  showRetry = true,
}) => {
  return (
    <ErrorState
      message="Unable to connect to server. Please check your internet connection."
      onRetry={onRetry}
      showRetry={showRetry}
    />
  );
};

export const NotFoundErrorState: React.FC<ErrorStateProps> = ({
  message = "The requested data was not found",
  onRetry,
  showRetry = false,
}) => {
  return <ErrorState message={message} onRetry={onRetry} showRetry={showRetry} />;
};
