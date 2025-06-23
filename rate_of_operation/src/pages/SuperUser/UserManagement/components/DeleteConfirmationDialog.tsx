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
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.100",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
          pt: 2,
          px: 2,
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning sx={{ color: "error.main", fontSize: "1.2rem" }} />
          Delete User
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 2, pb: 1, mt: 2 }}>
        <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
          Delete user <strong style={{ color: "text.primary" }}>{userEmail}</strong>?
        </Typography>
        <Typography variant="caption" sx={{ color: "error.main" }}>
          This action cannot be undone
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{
            textTransform: "none",
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            minWidth: 80,
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
