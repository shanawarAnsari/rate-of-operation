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
  AccessTime as AccessTimeIcon,
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
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Paper
      sx={{
        height: "100%",
        minHeight: 400,
        width: collapsed ? 80 : "100%",
        transition: "width 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BarChartIcon sx={{ fontSize: 24, color: "primary.main" }} />
          <Collapse in={!collapsed} orientation="horizontal">
            <Typography variant="h6" color="primary" sx={{ whiteSpace: "nowrap" }}>
              Model Metrics
            </Typography>
          </Collapse>
        </Box>
        <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          <IconButton
            onClick={toggleCollapse}
            size="small"
            sx={{
              ml: collapsed ? 0 : 1,
              color: "primary.main",
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <List sx={{ p: 0 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <Tooltip
              title={collapsed ? item.label : ""}
              placement="right"
              disableHoverListener={!collapsed}
            >
              <ListItemButton
                selected={selectedItem === item.id}
                onClick={() => onItemSelect(item.id)}
                sx={{
                  py: 1.5,
                  px: collapsed ? 1 : 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? "auto" : 40,
                    color:
                      selectedItem === item.id
                        ? "primary.contrastText"
                        : "text.primary",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Collapse in={!collapsed} orientation="horizontal">
                  <ListItemText
                    primary={item.label}
                    sx={{ ml: 1, whiteSpace: "nowrap" }}
                  />
                </Collapse>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
