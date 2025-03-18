import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const AddUserDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (user: { email: string; role: string; categories: string[] }) => void;
}> = ({ open, onClose, onSave }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [categories, setCategories] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSave = () => {
    if (!email.endsWith("@kcc.com")) {
      setSnackbar({
        open: true,
        message: "Email should be a kcc email id!",
        severity: "error",
      });
      return;
    }
    onSave({
      email,
      role,
      categories: categories.split(",").map((cat) => cat.trim()),
    });
    setSnackbar({
      open: true,
      message: "User added successfully!",
      severity: "success",
    });
    setEmail("");
    setRole("User");
    setCategories("");
    onClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            margin="dense"
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Categories (comma-separated)"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddUserDialog;
