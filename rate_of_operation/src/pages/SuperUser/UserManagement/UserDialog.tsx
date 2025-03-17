import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemIcon,
} from "@mui/material";

interface UserDialogProps {
  open: boolean;
  email: string;
  role: "admin" | "user";
  categories: string[];
  selectedUser: { email: string } | null;
  onClose: () => void;
  onSave: () => void;
  onCategoryChange: (category: string) => void;
}

const dummyCategories = ["Family Care", "Personal Care", "Health", "Fitness"];

const UserDialog: React.FC<UserDialogProps> = ({
  open,
  email,
  role,
  categories,
  selectedUser,
  onClose,
  onSave,
  onCategoryChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => onCategoryChange(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                select
                label="Categories"
                value={categories}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (selected as string[]).join(", "),
                }}
              >
                {dummyCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <ListItemIcon>
                      <Checkbox
                        checked={categories.includes(category)}
                        onChange={() => onCategoryChange(category)}
                      />
                    </ListItemIcon>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" variant="contained">
          Cancel
        </Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {selectedUser ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;
