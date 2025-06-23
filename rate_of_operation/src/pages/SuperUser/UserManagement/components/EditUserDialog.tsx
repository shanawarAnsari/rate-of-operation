import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Box,
  Alert,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { useUserStore } from "../../../../store/userStore";
interface User {
  email: string;
  role: string;
  category: string[];
  interface: string[];
  updated_by: string;
  updated_on: string;
}

const EditUserDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
  loading?: boolean;
}> = ({ open, onClose, user, onSave, loading = false }) => {
  const [role, setRole] = useState(user.role);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    user.category || []
  );
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>(
    user.interface || []
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const availableRoles = ["User", "Admin"];
  const availableCategories = [
    "Personal Care"
  ];
  const availableInterfaces = ["CC PANTS"];
  const currentUser = useUserStore((state) => state.user);
  useEffect(() => {
    setRole(user.role);
    setSelectedCategories(user.category || []);
    setSelectedInterfaces(user.category || []);
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Role validation
    if (!role) {
      newErrors.role = "Role is required";
    }

    // Category validation
    if (selectedCategories.length === 0) {
      newErrors.category = "At least one category is required";
    }

    // Interface validation
    if (selectedInterfaces.length === 0) {
      newErrors.interface = "At least one interface is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave({
      email: user.email,
      role,
      category: selectedCategories,
      interface: selectedInterfaces,
      updated_on: (new Date()).toLocaleDateString(),
      updated_by: currentUser?.email || "Web App User",
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleInterfaceChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedInterfaces(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2,
          fontSize: "1.1rem",
          fontWeight: 600,
        }}
      >
        Edit User
      </DialogTitle>
      <DialogContent sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            value={user.email}
            InputProps={{
              readOnly: true,
            }}
            helperText="Email cannot be changed"
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
          >
            {availableRoles.map((roleOption) => (
              <MenuItem key={roleOption} value={roleOption}>
                {roleOption}
              </MenuItem>
            ))}
          </TextField>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Alert severity="error" sx={{ mt: 0.5, fontSize: "0.75rem" }}>
                {errors.category}
              </Alert>
            )}
          </FormControl>
          <FormControl fullWidth error={!!errors.interface}>
            <InputLabel>Interfaces</InputLabel>
            <Select
              multiple
              value={selectedInterfaces}
              onChange={handleInterfaceChange}
              input={<OutlinedInput label="Interfaces" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableInterfaces.map((interfaceOption) => (
                <MenuItem key={interfaceOption} value={interfaceOption}>
                  {interfaceOption}
                </MenuItem>
              ))}
            </Select>
            {errors.interface && (
              <Alert severity="error" sx={{ mt: 0.5, fontSize: "0.75rem" }}>
                {errors.interface}
              </Alert>
            )}
          </FormControl>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mt: 1 }}>
              Please fix the validation errors above
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {loading ? "Saving..." : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;