import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EditSetupTimeDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (newValue: any) => void;
  dropdownOptions: { label: string; value: any }[];
  originalValue: any;
}

export const EditSetupTimeDialog: React.FC<EditSetupTimeDialogProps> = ({
  open,
  onClose,
  onUpdate,
  dropdownOptions,
  originalValue,
}) => {
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState("");

  const handleOptionSelect = (value: any) => {
    onUpdate(value);
  };

  const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue);
    const originalNumericValue = parseFloat(originalValue);

    if (
      isNaN(numericValue) ||
      numericValue < originalNumericValue * 0.8 ||
      numericValue > originalNumericValue * 1.2
    ) {
      setError("New Setup Time must be within ±20% of the original value.");
    } else {
      setError("");
    }

    setCustomValue(inputValue);
  };

  const handleCustomInputSubmit = () => {
    if (!error) {
      onUpdate(customValue);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontSize: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Select New Setup Time
        <IconButton onClick={onClose} sx={{ ml: 2 }}>
          <CloseIcon style={{ fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <Divider variant="fullWidth" sx={{ mb: 1 }} />
      <DialogContent>
        <Grid container spacing={1}>
          {dropdownOptions.map((option, idx) => (
            <Grid item xs={12} key={idx}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                border={1}
                borderColor="grey.300"
                borderRadius={1}
                padding={1}
                onClick={() =>
                  !isNaN(option.value) && handleOptionSelect(option.value)
                }
                sx={{
                  cursor: isNaN(option.value) ? "not-allowed" : "pointer",
                  backgroundColor: isNaN(option.value)
                    ? (theme) => theme.palette.action.disabledBackground
                    : "inherit",
                  transition: !isNaN(option.value)
                    ? "background-color 0.4s ease, transform 0.2s ease"
                    : "none",
                  "&:hover": !isNaN(option.value)
                    ? {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    }
                    : undefined,
                  "&:active": !isNaN(option.value)
                    ? {
                      backgroundColor: (theme) => theme.palette.action.selected,
                      transform: "scale(1.03)",
                    }
                    : undefined,
                }}
              >
                <Typography variant="body2" style={{ flex: 1 }}>
                  {option.label}:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    !isNaN(option.value) && handleOptionSelect(option.value)
                  }
                  style={{ marginLeft: "8px" }}
                  disabled={isNaN(option.value)}
                >
                  {option.value}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            my: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            sx={{ maxWidth: "100%" }}
            label="New Setup Time Manual Override"
            variant="outlined"
            fullWidth
            value={customValue}
            onChange={handleCustomInputChange}
            error={!!error}
            size="small"
            helperText={
              error ||
              "Enter a custom new setup time within ±20% of the original value."
            }
          />
        </Box>
      </DialogContent>
      <Divider variant="fullWidth" sx={{ mb: 2 }} />
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined" size="small">
          Cancel
        </Button>
        <Button
          size="small"
          onClick={handleCustomInputSubmit}
          color="primary"
          disabled={!!error || !customValue}
          variant="outlined"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
