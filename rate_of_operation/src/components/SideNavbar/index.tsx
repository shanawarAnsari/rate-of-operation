import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Build as BuildIcon,
  ExpandLess,
  ExpandMore,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

const drawerExpandedWidth = 240;
const drawerCollapsedWidth = 64;

const SideNavbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [operationsOpen, setOperationsOpen] = useState(
    location.pathname.includes("/operations") ? true : false
  );
  const [collapsed, setCollapsed] = useState(true);

  const handleOperationsClick = () => {
    if (!collapsed) {
      setOperationsOpen(!operationsOpen);
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (!collapsed) {
      setOperationsOpen(false);
    }
  };

  return (
    <Box sx={{ position: "relative", mt: 5 }}>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? drawerCollapsedWidth : drawerExpandedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? drawerCollapsedWidth : drawerExpandedWidth,
            boxSizing: "border-box",
            top: "64px",
            height: "calc(100% - 64px)",
            borderRight: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            bgcolor:
              theme.palette.mode === "light"
                ? "#f0f0f0" // Slightly darker than default light background
                : "#121212", // Darker than the default dark background
          },
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <List>
            {/* Dashboard Link - Always visible */}
            <ListItem disablePadding>
              <Tooltip title={collapsed ? "Dashboard" : ""} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  to="/"
                  selected={location.pathname === "/"}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "initial",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 3,
                      justifyContent: "center",
                    }}
                  >
                    <DashboardIcon />
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary="Dashboard" />}
                </ListItemButton>
              </Tooltip>
            </ListItem>

            {/* Operations Section - Only visible when expanded */}
            {!collapsed && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleOperationsClick}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: "center",
                    }}
                  >
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText primary="Operations" />
                  {operationsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
            )}

            {/* Operations Submenu - Only visible when expanded and open */}
            {!collapsed && (
              <Collapse in={operationsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/operations/rate-of-operation"
                    selected={location.pathname === "/operations/rate-of-operation"}
                  >
                    <ListItemIcon>
                      <SpeedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Rate of Operation" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/operations/wrenchtime"
                    selected={location.pathname === "/operations/wrenchtime"}
                  >
                    <ListItemIcon>
                      <TimerIcon />
                    </ListItemIcon>
                    <ListItemText primary="Wrenchtime" />
                  </ListItemButton>
                </List>
              </Collapse>
            )}

            {/* When collapsed, show only direct navigation links */}
            {collapsed && (
              <>
                <ListItem disablePadding>
                  <Tooltip title="Rate of Operation" placement="right" arrow>
                    <ListItemButton
                      component={Link}
                      to="/operations/rate-of-operation"
                      selected={
                        location.pathname === "/operations/rate-of-operation"
                      }
                      sx={{
                        minHeight: 48,
                        justifyContent: "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: "center",
                        }}
                      >
                        <SpeedIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                <ListItem disablePadding>
                  <Tooltip title="Wrenchtime" placement="right" arrow>
                    <ListItemButton
                      component={Link}
                      to="/operations/wrenchtime"
                      selected={location.pathname === "/operations/wrenchtime"}
                      sx={{
                        minHeight: 48,
                        justifyContent: "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: "center",
                        }}
                      >
                        <TimerIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Toggle button positioned on the right border in the middle */}
      <IconButton
        onClick={toggleCollapse}
        size="small"
        sx={{
          position: "absolute",
          right: -16,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "50%",
          zIndex: 1200,
          boxShadow: 2,
          width: 32,
          height: 32,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
    </Box>
  );
};

export default SideNavbar;
