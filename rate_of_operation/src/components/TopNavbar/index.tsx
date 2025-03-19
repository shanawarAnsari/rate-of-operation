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
  Avatar,
  Typography,
} from "@mui/material";
import { Brightness4, Brightness7, AccountCircle } from "@mui/icons-material";
import logoImage from "../../assets/KC_LOGO.png";

interface TopNavbarProps {
  mode: "light" | "dark";
  onToggleTheme: () => void;
}

// Create a styled component for the logo image that responds to theme
const LogoImage = styled("img")(({ theme }) => ({
  height: "22px",
  filter: theme.palette.mode === "dark" ? "brightness(10) contrast(10)" : "none",
}));

const TopNavbar: React.FC<TopNavbarProps> = ({ mode, onToggleTheme }) => {
  const [region, setRegion] = useState("KCNA"); // Initialize with the only available option
  const [subRegion, setSubRegion] = useState("North America"); // Initialize with the only available option
  const theme = useTheme();
  // Add username state (could also come from props or context)
  const [username, setUsername] = useState("Ansari, Shanawar");

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegion(event.target.value);
  };

  const handleSubRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubRegion(event.target.value);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        height: '54px',
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: theme.palette.mode === "light" ? 1 : 3,
        zIndex: theme.zIndex.drawer + 1, // Ensures navbar stays above other content
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LogoImage src={logoImage} alt="Company Logo" height="20" />
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        {/* Theme toggle now appears before the dropdowns */}
        <IconButton onClick={onToggleTheme} color="inherit" sx={{ mr: 2 }}>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

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
              height: 30,
              borderRadius: 0,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.23)"
                  : "rgba(255, 255, 255, 0.23)",
            },
            "& .MuiInputBase-input": { fontSize: "0.75rem" },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <MenuItem value="KCNA" sx={{ fontSize: "0.75rem" }}>KCNA</MenuItem>
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
              height: 30,
              borderRadius: 0,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.23)"
                  : "rgba(255, 255, 255, 0.23)",
            },
            "& .MuiInputBase-input": { fontSize: "0.75rem" },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        >
          <MenuItem value="North America" sx={{ fontSize: "0.75rem" }}>North America</MenuItem>
        </TextField>

        {/* Profile section with avatar and username */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ width: 24, height: 24, bgcolor: theme.palette.primary.main }}
          >
            <AccountCircle />
          </Avatar>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {username}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
