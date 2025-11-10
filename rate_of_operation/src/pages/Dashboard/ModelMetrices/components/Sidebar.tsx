import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  ListItemIcon,
  Collapse,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Speed as SpeedIcon,
  Timer as AccessTimeIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";

interface SidebarProps {
  selectedItem: string;
  onItemSelect: (item: string) => void;
}

const sidebarItems = [
  {
    id: "rate-of-operations",
    label: "Rate of Operations",
    icon: <SpeedIcon />,
    shortLabel: "RO",
  },
  {
    id: "setup-time",
    label: "Setup Time",
    icon: <AccessTimeIcon />,
    shortLabel: "ST",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedItem, onItemSelect }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        minHeight: 400,
        width: collapsed ? 60 : 240,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "visible",
        borderLeft: 1,
        borderRadius: 0,
        borderColor: "divider",
        bgcolor: "background.secondary",
        position: "relative",
      }}
    >
      {/* Collapse/Expand Button - Centered on Left Border */}
      <Tooltip title={collapsed ? "Expand" : "Collapse"} placement="left">
        <IconButton
          onClick={toggleCollapse}
          size="small"
          sx={{
            position: "absolute",
            left: -14,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1300,
            color: "primary.main",
            width: 28,
            height: 28,
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            boxShadow: 1,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          {collapsed ? (
            <ChevronLeftIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {/* Header Section */}
      {/* <Box
        sx={{
          py: 1,
          px: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 48,
          bgcolor: "background.paper",
        }}
      > */}
      {/* {!collapsed && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
              }}
            >
              <BarChartIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "primary.main",
                whiteSpace: "nowrap",
              }}
            >
              Model Metrics
            </Typography>
          </Box>
        )} */}
      {/* {collapsed && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
            }}
          >
            <BarChartIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
        )}
      </Box> */}

      {/* Menu Items */}
      <List sx={{ p: 1 }}>
        {sidebarItems.map((item, index) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip
              title={collapsed ? item.label : ""}
              placement="left"
              disableHoverListener={!collapsed}
            >
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => onItemSelect(item.id)}
                sx={{
                  minHeight: 40,
                  borderRadius: 1,
                  px: collapsed ? 0 : 1.5,
                  py: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: collapsed ? "center" : "flex-start",
                  transition: "all 0.2s",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "#fff",
                    "& .MuiListItemIcon-root": {
                      color: "#fff",
                    },
                    "& .MuiListItemText-root": {
                      color: "#fff",
                    },
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: selectedItem === item.id ? "#fff" : "text.secondary",
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: 13,
                        fontWeight: selectedItem === item.id ? 600 : 500,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
