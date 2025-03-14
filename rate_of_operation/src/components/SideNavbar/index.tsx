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
  AdminPanelSettings as SuperUserIcon,
  AttachMoney as MoneyIcon,
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

  const selectedItemStyle = {
    backgroundColor: theme.palette.primary.main + "10",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main + "15",
    },
    "&.Mui-selected:hover": {
      backgroundColor: theme.palette.primary.main + "25",
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
    "& .MuiListItemText-primary": {
      color: theme.palette.primary.main,
    },
  };

  const getActiveStyle = (path: string) =>
    location.pathname === path ? selectedItemStyle : {};

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
                    ...getActiveStyle("/"),
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
                  <ListItemText primary="Production Rates" />
                  {operationsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
            )}

            {/* Operations Submenu - Only visible when expanded and open */}
            {!collapsed && (
              <Collapse in={!operationsOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    sx={{
                      pl: 4,
                      ...getActiveStyle("/operations/rate-of-operation"),
                    }}
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
                    sx={{
                      pl: 4,
                      ...getActiveStyle("/operations/wrenchtime"),
                    }}
                    component={Link}
                    to="/operations/wrenchtime"
                    selected={location.pathname === "/operations/wrenchtime"}
                  >
                    <ListItemIcon>
                      <TimerIcon />
                    </ListItemIcon>
                    <ListItemText primary="Wrench Time" />
                  </ListItemButton>
                  <ListItemButton
                    sx={{
                      pl: 4,
                      ...getActiveStyle("/operations/financial-rate"),
                    }}
                    component={Link}
                    to="/operations/financial-rate"
                    selected={location.pathname === "/operations/financial-rate"}
                  >
                    <ListItemIcon>
                      <MoneyIcon />
                    </ListItemIcon>
                    <ListItemText primary="Financial Rate" />
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
                        ...getActiveStyle("/operations/rate-of-operation"),
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
                        ...getActiveStyle("/operations/wrenchtime"),
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

                <ListItem disablePadding>
                  <Tooltip title="Financial Rate" placement="right" arrow>
                    <ListItemButton
                      component={Link}
                      to="/operations/financial-rate"
                      selected={location.pathname === "/operations/financial-rate"}
                      sx={{
                        minHeight: 48,
                        justifyContent: "center",
                        px: 2.5,
                        ...getActiveStyle("/operations/financial-rate"),
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          justifyContent: "center",
                        }}
                      >
                        <MoneyIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              </>
            )}

            {/* Super User item - always visible */}
            <ListItem disablePadding>
              <Tooltip title={collapsed ? "Super User" : ""} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  to="/super-user"
                  selected={location.pathname === "/super-user"}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? "center" : "initial",
                    px: 2.5,
                    ...getActiveStyle("/super-user"),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 3,
                      justifyContent: "center",
                    }}
                  >
                    <SuperUserIcon />
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary="Super User" />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <IconButton
        onClick={toggleCollapse}
        size="small"
        sx={{
          position: "fixed",
          left: collapsed ? drawerCollapsedWidth - 16 : drawerExpandedWidth - 16,
          top: "50%",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "50%",
          zIndex: 1200,
          boxShadow: 2,
          width: 32,
          height: 32,
          transition: theme.transitions.create("left", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
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
