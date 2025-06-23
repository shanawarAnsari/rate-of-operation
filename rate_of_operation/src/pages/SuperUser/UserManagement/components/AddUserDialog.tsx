import React, { useState } from "react";
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

const AddUserDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSave: (user: any) => void;
  loading?: boolean;
  currentUserEmail: string;
}> = ({ open, onClose, onSave, loading = false, currentUserEmail }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const availableRoles = ["User", "Admin"];
  const availableCategories = ["Personal Care"];
  const availableInterfaces = ["CC PANT"];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!email.endsWith("@kcc.com")) {
      newErrors.email = "Email must be a valid @kcc.com address";
    }

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
      email: email.trim(),
      role: role,
      category: selectedCategories,
      interface: selectedInterfaces,
      updated_by: currentUserEmail,
      Updated_on: (new Date()).toLocaleDateString(),
    });

    // Reset form
    setEmail("");
    setRole("");
    setSelectedCategories([]);
    setSelectedInterfaces([]);
    setErrors({});
  };

  const handleClose = () => {
    setEmail("");
    setRole("");
    setSelectedCategories([]);
    setSelectedInterfaces([]);
    setErrors({});
    onClose();
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
      onClose={handleClose}
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
        Add New User
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="user@kcc.com"
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
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {loading ? "Saving..." : "Save User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;