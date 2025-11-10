import { createTheme, PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  typography: {
    fontFamily: "'Lato', sans-serif",
  },
  palette: {
    mode,
    ...(mode === "light"
      ? {
        // Light mode palette
        primary: {
          main: "#092acd",
        },
        secondary: {
          main: "#9c27b0",
        },
        background: {
          default: "#e5e5e5",
          paper: "#ffffff",
        },
      }
      : {
        // Dark mode palette
        primary: {
          main: "#fc8b3a",
        },
        secondary: {
          main: "#ce93d8",
        },
        background: {
          default: "#121212",
          paper: "#00010a",
          secondary: '##0d0e16'
        },
      }),
  },
});

export const getTheme = (mode: PaletteMode) => {
  return createTheme(getDesignTokens(mode));
};
