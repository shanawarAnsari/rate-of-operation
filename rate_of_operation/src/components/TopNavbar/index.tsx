import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  MenuItem,
  useTheme,
  styled,
  TextField,
  Avatar,
  Typography,
} from "@mui/material";
import { Brightness4, Brightness7, AccountCircle } from "@mui/icons-material";
import logoImage from "../../assets/bluedark.png";
import logoImageOrange from "../../assets/orange.png"
import { useUserStore } from "../../store/userStore";

interface TopNavbarProps {
  mode: "light" | "dark";
  onToggleTheme: () => void;
}

// Create a styled component for the logo image that responds to theme
const LogoImage = styled("img")(({ theme }) => ({
  height: "36px",
  filter: "none",
}));

const TopNavbar: React.FC<TopNavbarProps> = ({ mode, onToggleTheme }) => {
  const [regionSubRegion, setRegionSubRegion] = useState("KCNA-North America"); // Initialize with the only available option

  const theme = useTheme();
  const user = useUserStore(state => state.user)


  const handleRegionSubRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegionSubRegion(event.target.value);
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
        <Box sx={{ display: "flex", alignItems: "center", ml: -1.5 }}>
          {(theme.palette.mode === "light") ? <LogoImage src={logoImage} alt="Company Logo" height="200" /> :
            <LogoImage src={logoImageOrange} alt="Company Logo" height="200" />}
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        {/* Theme toggle now appears before the dropdowns */}
        <IconButton onClick={onToggleTheme} color="inherit" sx={{ mr: 2 }}>
          {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>


        <TextField
          select
          id="subregion-select"
          label="Region-SubRegion"
          value={regionSubRegion}
          onChange={handleRegionSubRegionChange}
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
          <MenuItem value="KCNA-North America" sx={{ fontSize: "0.75rem" }}>KCNA-North America</MenuItem>
        </TextField>

        {/* Profile section with avatar and username */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{ width: 24, height: 24, bgcolor: theme.palette.primary.main }}
          >
            <AccountCircle />
          </Avatar>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {user?.name}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
