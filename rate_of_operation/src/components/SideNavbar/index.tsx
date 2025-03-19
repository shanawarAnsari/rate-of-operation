import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Drawer, Box, useTheme, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import NavbarList from "./NavbarList";

const drawerExpandedWidth = 240;
const drawerCollapsedWidth = 64;

const SideNavbar: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
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
            top: "54px",
            height: "calc(100% - 54px)",
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
          <NavbarList collapsed={collapsed} location={location} />
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
