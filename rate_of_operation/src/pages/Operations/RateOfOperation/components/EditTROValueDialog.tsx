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

interface EditTROValueDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (newValue: any) => void;
  dropdownOptions: { label: string; value: any; subtext?: string }[];
  originalValue: any;
}

export const EditTROValueDialog: React.FC<EditTROValueDialogProps> = ({
  open,
  onClose,
  onUpdate,
  dropdownOptions,
  originalValue,
}) => {
  const [customValue, setCustomValue] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const handleCommentChange = (e: any) => {
    setComments(e.target.value);
  };

  const handleOptionSelect = (value: any, index: number) => {
    setSelectedValue(value);
    setSelectedIndex(index);
    setCustomValue(""); // Clear custom input when selecting from options
    setError(""); // Clear any errors
  };

  const handleCustomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue);
    const originalNumericValue = parseFloat(originalValue);

    if (inputValue) {
      // Clear selected card when typing custom value
      setSelectedValue(null);
      setSelectedIndex(null);
    }

    if (
      isNaN(numericValue) ||
      numericValue < originalNumericValue * 0.9 ||
      numericValue > originalNumericValue * 1.1
    ) {
      setError("New TRO Value must be within ±10% of the original value.");
    } else {
      setError("");
    }

    setCustomValue(inputValue);
  };

  const handleCustomInputSubmit = () => {
    if (!error) {
      const valueToUpdate = customValue || selectedValue;
      onUpdate(valueToUpdate);
      onClose();
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
        Select New TRO Value
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
                onClick={
                  !isNaN(option?.value)
                    ? () => handleOptionSelect(option.value, idx)
                    : undefined
                }
                sx={{
                  cursor: !isNaN(option?.value) ? "pointer" : "not-allowed",
                  opacity: !isNaN(option?.value) ? 1 : 0.5,
                  backgroundColor:
                    selectedIndex === idx
                      ? (theme) => theme.palette.action.hover
                      : "inherit",
                  borderColor:
                    selectedIndex === idx
                      ? (theme) => theme.palette.primary.main
                      : "grey.300",
                  borderWidth: selectedIndex === idx ? 2 : 1,
                  transition: "all 0.3s ease",
                  boxShadow:
                    selectedIndex === idx ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                  "&:hover": !isNaN(option?.value)
                    ? {
                        backgroundColor:
                          selectedIndex === idx
                            ? (theme) => theme.palette.grey[100]
                            : (theme) => theme.palette.action.hover,
                        borderColor:
                          selectedIndex === idx
                            ? (theme) => theme.palette.primary.main
                            : "grey.400",
                      }
                    : {},
                  "&:active": !isNaN(option?.value)
                    ? {
                        transform: "scale(1.02)",
                      }
                    : {},
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: -1 }}>
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option?.subtext}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={isNaN(option?.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOptionSelect(option.value, idx);
                  }}
                  style={{ marginLeft: "8px" }}
                >
                  {option.value}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider variant="fullWidth" sx={{ my: 2 }} />
        <Box
          sx={{
            mt: 3,
            mb: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            sx={{ maxWidth: "100%" }}
            label="New TRO Manual Override"
            variant="outlined"
            fullWidth
            value={customValue}
            onChange={handleCustomInputChange}
            error={!!error && customValue !== ""}
            size="small"
            helperText={
              error ||
              "Enter a custom new TRO value within ±10% of the original value."
            }
          />
        </Box>
        <TextField
          sx={{ maxWidth: "100%" }}
          label="Comments"
          variant="outlined"
          fullWidth
          value={comments}
          onChange={handleCommentChange}
          size="small"
        />
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
          disabled={!!error || (!customValue && !selectedValue)}
          variant="outlined"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
