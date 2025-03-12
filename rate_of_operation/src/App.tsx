import { useState, useMemo, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Container } from "@mui/material";
import { getTheme } from "./theme";
import TopNavbar from "./components/TopNavbar";
import SideNavbar from "./components/SideNavbar";
import AppRoutes from "./routes";

function App() {
  // Initialize theme from localStorage or default to "light"
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode === "light" || savedMode === "dark" ? savedMode : "light";
  });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      // Save to localStorage when theme changes
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // Optional: Sync with system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? "dark" : "light";
      setMode(systemTheme);
      localStorage.setItem("themeMode", systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <TopNavbar mode={mode} onToggleTheme={toggleColorMode} />
          <Box sx={{ display: "flex", flex: 1 }}>
            <SideNavbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Container sx={{ mt: 2 }}>
                <AppRoutes />
              </Container>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
