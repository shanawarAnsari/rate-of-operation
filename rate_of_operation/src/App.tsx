import { useState, useMemo, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { getTheme } from "./theme";
import { oktaAuth } from "./configs/oktaConfig";
import { useUserStore } from "./store/userStore";
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

  const setUser = useUserStore(state => state.setUser);
  const setIsLoggedIn = useUserStore(state => state.setIsLoggedIn)

  useEffect(() => {
    const syncUser = async () => {
      const isAuthenticated = await oktaAuth.isAuthenticated();
      if (isAuthenticated) {
        const userInfo = await oktaAuth.getUser()
        setUser({
          name: userInfo.name || "",
          email: userInfo.email || ""
        })
        setIsLoggedIn(true)
      }
      else {
        setIsLoggedIn(false)
      }
    }
    syncUser()
  }, [setUser])
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <TopNavbar mode={mode} onToggleTheme={toggleColorMode} />
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <SideNavbar />
            <Box sx={{ flexGrow: 1, overflow: "auto", maxWidth: "100%" }}>
              <Box sx={{ m: 2 }}>
                <AppRoutes />
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
