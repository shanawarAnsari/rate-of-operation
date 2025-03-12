import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  SelectChangeEvent,
  useTheme,
  styled,
  TextField,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import logoImage from "../../assets/KC_LOGO.png";

interface TopNavbarProps {
  mode: "light" | "dark";
  onToggleTheme: () => void;
}

// Create a styled component for the logo image that responds to theme
const LogoImage = styled("img")(({ theme }) => ({
  height: "40px",
  filter: theme.palette.mode === "dark" ? "brightness(0.9) contrast(1.1)" : "none",
  transition: "filter 0.3s ease",
}));

const TopNavbar: React.FC<TopNavbarProps> = ({ mode, onToggleTheme }) => {
  const [region, setRegion] = useState("KCNA"); // Initialize with the only available option
  const [subRegion, setSubRegion] = useState("North America"); // Initialize with the only available option
  const theme = useTheme();

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegion(event.target.value);
  };

  const handleSubRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubRegion(event.target.value);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.palette.mode === "light" ? 1 : 3,
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LogoImage src={logoImage} alt="Company Logo" />
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        <TextField
          select
          id="region-select"
          label="Region"
          value={region}
          onChange={handleRegionChange}
          variant="outlined"
          size="small"
          sx={{
            minWidth: 160,
            mr: 2,
            "& .MuiInputBase-root": {
              height: 40,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.23)"
                  : "rgba(255, 255, 255, 0.23)",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <MenuItem value="KCNA">KCNA</MenuItem>
        </TextField>

        <TextField
          select
          id="subregion-select"
          label="Sub-Region"
          value={subRegion}
          onChange={handleSubRegionChange}
          variant="outlined"
          size="small"
          sx={{
            minWidth: 160,
            mr: 2,
            "& .MuiInputBase-root": {
              height: 40,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.23)"
                  : "rgba(255, 255, 255, 0.23)",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <MenuItem value="North America">North America</MenuItem>
        </TextField>

        <IconButton onClick={onToggleTheme} color="inherit">
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
