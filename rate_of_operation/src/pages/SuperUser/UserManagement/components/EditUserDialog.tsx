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
import { useGetCategories } from "../hooks/useUserManegement";
const EditUserDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  user: any; // Replace with appropriate user type
  onSave: (updatedUser: any) => void; // Replace with appropriate user type
  loading?: boolean;
}> = ({ open, onClose, user, onSave, loading = false }) => {
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user.category ||
    []);
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>(user.interface ||
    []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { data: categoryInterfaceMap, loading: categoryLoading, error: categoryError } = useGetCategories();
  const availableRoles = ["User", "Admin"];
  const availableCategories = Array.from(new Set(categoryInterfaceMap.map((item: any) => item.CATEGORY)));
  const availableInterfaces = Array.from(
    new Set(
      categoryInterfaceMap
        .filter((item: any) => selectedCategories.includes(item.CATEGORY))
        .map((item: any) => item.INTERFACE)
    )
  );
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.endsWith("@kcc.com")) newErrors.email = "Email must be a valid @kcc.com address";
    if (!role) newErrors.role = "Role is required";
    if (selectedCategories.length === 0) newErrors.category = "At least one category is required";
    if (selectedInterfaces.length === 0) newErrors.interface = "At least one interface is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = () => {
    if (!validateForm()) return;
    onSave({
      email: email.trim(),
      role,
      category: selectedCategories,
      interface: selectedInterfaces,
      updated_by: user.updated_by, // Assuming you want to keep the same updater
      updated_on: new Date().toLocaleDateString(),
    });
    handleClose();
  };
  const handleClose = () => {
    setEmail(user.email);
    setRole(user.role);
    setSelectedCategories(user.category ||
      []);
    setSelectedInterfaces(user.interface ||
      []);
    setErrors({});
    onClose();
  };
  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedCategories(value);
    setSelectedInterfaces([]); // Reset interfaces when category changes
  };
  const handleInterfaceChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setSelectedInterfaces(value);
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
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
            {availableRoles.map(roleOption => (
              <MenuItem key={roleOption} value={roleOption}>{roleOption}</MenuItem>
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
                  {selected.map(value => <Chip key={value} label={value} size="small" />)}
                </Box>
              )}
            >
              {availableCategories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
            {errors.category && <Alert severity="error">{errors.category}</Alert>}
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
                  {selected.map(value => <Chip key={value} label={value} size="small" />)}
                </Box>
              )}
            >
              {availableInterfaces.map(interfaceOption => (
                <MenuItem key={interfaceOption} value={interfaceOption}>{interfaceOption}</MenuItem>
              ))}
            </Select>
            {errors.interface && <Alert severity="error">{errors.interface}</Alert>}
          </FormControl>
          {categoryError && <Alert severity="error">{categoryError}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading ||
          categoryLoading}>
          {loading ? "Saving..." : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default EditUserDialog;