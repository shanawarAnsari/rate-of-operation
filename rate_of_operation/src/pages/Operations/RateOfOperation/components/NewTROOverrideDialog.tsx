import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NewTROOverrideDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  rowData: any;
}> = ({ open, onClose, rowData }) => {
  const [newTROValue, setNewTROValue] = useState(rowData.new_tRO);
  const [comment, setComment] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  const handleUpdate = () => {
    // Handle the update logic here
    onClose();
  };

  const handleTROChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 999999999)
    ) {
      setNewTROValue(value);
    }
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
        Override New TRO
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
          label="Recipe"
          value={rowData.recipe}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true, disableUnderline: true }}
          sx={{ pointerEvents: "none" }}
        />
        <TextField
          size="small"
          label="New TRO"
          value={rowData.new_tRO}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true, disableUnderline: true }}
          sx={{ pointerEvents: "none" }}
        />
        <TextField
          label="New TRO Override Value"
          value={newTROValue}
          onChange={handleTROChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
          }
          label="I acknowledge the new TRO change"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handleUpdate}
          disabled={!acknowledged || !newTROValue}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTROOverrideDialog;
