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
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: "#092acd",
          },
          secondary: {
            main: "#ce93d8",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
        }),
  },
});

export const getTheme = (mode: PaletteMode) => {
  return createTheme(getDesignTokens(mode));
};
