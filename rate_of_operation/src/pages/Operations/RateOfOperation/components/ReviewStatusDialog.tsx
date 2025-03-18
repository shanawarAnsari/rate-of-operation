import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface ReviewStatusDialogProps {
  open: boolean;
  onClose: () => void;
  rowData: any;
}

const ReviewStatusDialog: React.FC<ReviewStatusDialogProps> = ({
  open,
  onClose,
  rowData,
}) => {
  const [reviewStatus, setReviewStatus] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);
  const handleSave = () => {
    // Handle save logic here
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        sx={{
          backgroundColor: (theme) => {
            return theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[900];
          },
        }}
      >
        TRO Sign-Off
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          size="small"
          label="Recipe Number"
          value={rowData.recipe}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true, disableUnderline: true }}
          sx={{ pointerEvents: "none" }}
        />
        <TextField
          size="small"
          label="Resource"
          value={rowData.resource}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true, disableUnderline: true }}
          sx={{ pointerEvents: "none" }}
        />
        <TextField
          size="small"
          label="Material"
          value={rowData.material}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true, disableUnderline: true }}
          sx={{ pointerEvents: "none" }}
        />
        <TextField
          select
          label="Review Status"
          value={reviewStatus}
          onChange={(e) => setReviewStatus(e.target.value)}
          fullWidth
          size="small"
          margin="normal"
        >
          <MenuItem value="Not Reviewed">Not Reviewed</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="N">N</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={acknowledge}
              onChange={(e) => setAcknowledge(e.target.checked)}
            />
          }
          label="I acknowledge the Review Status change"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            !acknowledge || reviewStatus === rowData.reviewed || reviewStatus === ""
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewStatusDialog;
