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
  onSave: (user: {
    email: string;
    role: string;
    category: string[];
    interface: string[];
    updated_by: string;
  }) => void;
  loading?: boolean;
  currentUserEmail: string;
}> = ({ open, onClose, onSave, loading = false, currentUserEmail }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const availableRoles = ["User", "Admin"];
  const availableCategories = [
    "Management",
    "Operations",
    "Analytics",
    "Finance",
    "HR",
  ];
  const availableInterfaces = ["Web", "Mobile", "API", "Desktop"];

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
      role,
      category: selectedCategories,
      interface: selectedInterfaces,
      updated_by: currentUserEmail,
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
      maxWidth="md"
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
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
          fontSize: "1.25rem",
          fontWeight: 600,
        }}
      >
        Add New User
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            placeholder="user@kcc.com"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                },
              },
            }}
          />

          <TextField
            fullWidth
            select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={!!errors.role}
            helperText={errors.role}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="">Select Role</MenuItem>
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
              input={<OutlinedInput label="Categories" sx={{ borderRadius: 2 }} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
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
              <Box
                sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  mt: 0.5,
                  ml: 1.5,
                }}
              >
                {errors.category}
              </Box>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.interface}>
            <InputLabel>Interfaces</InputLabel>
            <Select
              multiple
              value={selectedInterfaces}
              onChange={handleInterfaceChange}
              input={<OutlinedInput label="Interfaces" sx={{ borderRadius: 2 }} />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
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
              <Box
                sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  mt: 0.5,
                  ml: 1.5,
                }}
              >
                {errors.interface}
              </Box>
            )}
          </FormControl>

          {Object.keys(errors).length > 0 && (
            <Alert
              severity="error"
              sx={{
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: "1.1rem",
                },
              }}
            >
              Please fix the validation errors above
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={handleClose}
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
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 4,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {loading ? "Saving..." : "Save User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
