import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

const DeleteConfirmationDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail: string;
  loading?: boolean;
}> = ({ open, onClose, onConfirm, userEmail, loading = false }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)",
          borderBottom: "1px solid",
          borderColor: "error.light",
          pb: 2,
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "error.main",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning sx={{ color: "error.main" }} />
          Delete User
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: "1.1rem",
            },
          }}
        >
          This action cannot be undone
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete the user:
        </Typography>
        <Box
          sx={{
            bgcolor: "grey.100",
            p: 2,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.300",
          }}
        >
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: "text.primary" }}
          >
            {userEmail}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 4,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(244,67,54,0.3)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(244,67,54,0.4)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {loading ? "Deleting..." : "Delete User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
