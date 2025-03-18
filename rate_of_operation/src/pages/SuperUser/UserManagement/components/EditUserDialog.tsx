import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const EditUserDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  user: { email: string; role: string; categories: string[] };
  onSave: (updatedUser: {
    email: string;
    role: string;
    categories: string[];
  }) => void;
}> = ({ open, onClose, user, onSave }) => {
  const [role, setRole] = useState(user.role);
  const [categories, setCategories] = useState(user.categories.join(", "));

  const handleSave = () => {
    onSave({
      email: user.email,
      role,
      categories: categories.split(",").map((cat) => cat.trim()),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Email"
          value={user.email}
          margin="dense"
          InputProps={{
            readOnly: true,
          }}
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
  );
};

export default EditUserDialog;
