import React, { useState, useEffect } from "react";
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
  Slide,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TimerIcon from "@mui/icons-material/Timer";
import PercentIcon from "@mui/icons-material/Percent";
import useTelemetryEvent from "../../../../components/appInsights/usetelementryEvent";
import { useUserStore } from "../../../../store/userStore";

interface EditSetupTimeDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (newValue: any, comments: string) => void;
  dropdownOptions: { label: string; value: any; subtext?: string }[];
  originalValue: any;
}

export const EditSetupTimeDialog: React.FC<EditSetupTimeDialogProps> = ({
  open,
  onClose,
  onUpdate,
  dropdownOptions,
  originalValue,
}) => {
  const [comments, setComments] = useState("None");
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [overrideMode, setOverrideMode] = useState<"percent" | "minutes">("minutes");
  const [percentValue, setPercentValue] = useState("");
  const [minutesValue, setMinutesValue] = useState("");
  const [error, setError] = useState("");

  const { user } = useUserStore();
  const { trackEvent } = useTelemetryEvent(user);

  const originalNumericValue = parseFloat(originalValue);


  useEffect(() => {
    const minAllowed = originalNumericValue - 30;
    const maxAllowed = originalNumericValue + 30;

    if (overrideMode === "percent") {
      const percent = parseFloat(percentValue);
      if (percentValue === "") {
        setError("");
      } else if (isNaN(percent)) {
        setError("Enter a valid percentage.");
      } else {
        const newValue = originalNumericValue * (1 + percent / 100);
        if (newValue < minAllowed || newValue > maxAllowed) {
          setError(`Resulting value must be within ±30 mins of current value (${originalNumericValue}).`);
        } else {
          setError("");
          setMinutesValue(newValue.toFixed(2)); // sync minutes
        }
      }
    } else {
      const minutes = parseFloat(minutesValue);
      if (minutesValue === "") {
        setError("");
      } else if (isNaN(minutes)) {
        setError("Enter a valid number.");
      } else {
        if (minutes < 1 || minutes < minAllowed || minutes > maxAllowed) {
          setError(`Minutes must be between 1 and ±30 mins of current value (${originalNumericValue}).`);
        } else {
          setError("");
          const percent = ((minutes - originalNumericValue) / originalNumericValue) * 100;
          setPercentValue(percent.toFixed(2)); // sync percent
        }
      }
    }
  }, [percentValue, minutesValue, overrideMode, originalNumericValue]);

  const handleCommentChange = (e: any) => {
    setComments(e.target.value);
  };

  const handleOptionSelect = (value: any, idx: number) => {
    setSelectedOption(value);
    setSelectedIndex(idx);
    setPercentValue("");
    setMinutesValue("");
    setError("");
  };

  const handleUpdate = () => {
    const method = selectedOption
      ? dropdownOptions[selectedIndex]?.label || "Unknown"
      : overrideMode === "percent"
        ? "Manual Override - Percent"
        : "Manual Override - Minutes";

    trackEvent("RecipeSetupTimeUpdate", {
      featureName: method,
      page: "/operations/wrenchtime",
    });

    if (selectedOption) {
      onUpdate(selectedOption, comments);
      onClose();
    } else {
      const newValue =
        overrideMode === "percent"
          ? originalNumericValue * (1 + parseFloat(percentValue) / 100)
          : parseFloat(minutesValue);
      onUpdate(newValue, comments);
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
                onClick={() => handleOptionSelect(option.value, idx)}
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
                  {option.subtext && (
                    <Typography variant="caption" color="textSecondary">
                      {option.subtext}
                    </Typography>
                  )}
                </Box>
                <Button variant="outlined" size="small" style={{ marginLeft: "8px" }}>
                  {option.value}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>


        <Divider variant="fullWidth" sx={{ my: 1 }} />
        <Box display="flex" flexDirection="row" alignItems="flex-start" gap={1} sx={{ overflow: "hidden", pt: 1 }}>
          {/* Mode Selector */}
          <ToggleButtonGroup
            value={overrideMode}
            exclusive
            onChange={(e, mode) => mode && setOverrideMode(mode)}
            aria-label="Override Mode"
            sx={{ mt: 0 }}
            size="small"
          >
            <Tooltip title="Override by Minutes">
              <ToggleButton value="minutes" aria-label="Minutes Override">
                <TimerIcon />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Override by Percent">
              <ToggleButton value="percent" aria-label="Percent Override">
                <PercentIcon />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>

          {/* Input Fields */}
          <Box flex={1} sx={{ position: "relative", minHeight: 60 }}>
            {/* Minutes Input */}
            <Slide direction="right" in={overrideMode === "minutes"} mountOnEnter unmountOnExit>
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                <TextField
                  label="Minutes Override"
                  variant="outlined"
                  fullWidth
                  type="number"
                  inputProps={{ min: -30, max: 30 }}
                  value={minutesValue}
                  onChange={(e) => setMinutesValue(e.target.value)}
                  error={!!error && overrideMode === "minutes"}
                  helperText={
                    overrideMode === "minutes"
                      ? error || "Enter minutes (±30 mins of current value)"
                      : ""
                  }
                  size="small"
                />
              </Box>
            </Slide>

            {/* Percent Input */}
            <Slide direction="left" in={overrideMode === "percent"} mountOnEnter unmountOnExit>
              <Box sx={{ position: "absolute", top: 0, left: 0, right: 0 }}>
                <TextField
                  label="% Minutes Override"
                  variant="outlined"
                  fullWidth
                  type="number"
                  inputProps={{ min: -100, max: 100 }}
                  value={percentValue}
                  onChange={(e) => setPercentValue(e.target.value)}
                  error={!!error && overrideMode === "percent"}
                  helperText={
                    overrideMode === "percent"
                      ? error || "Enter % change (±30mins of current value)"
                      : ""
                  }
                  size="small"
                />
              </Box>
            </Slide>
          </Box>
        </Box>

        <TextField
          sx={{ mt: 2 }}
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
          onClick={handleUpdate}
          color="primary"
          disabled={
            !selectedOption &&
            ((overrideMode === "percent" && (!percentValue || !!error)) ||
              (overrideMode === "minutes" && (!minutesValue || !!error)))
          }
          variant="outlined"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};