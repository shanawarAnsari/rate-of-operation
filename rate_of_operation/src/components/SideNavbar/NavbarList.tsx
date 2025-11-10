import React, { useState, useCallback } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
} from "@mui/material";
import { Link, Location } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useUserStore } from "../../store/userStore";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SuperUserIcon from "@mui/icons-material/AdminPanelSettings";
import ReviewStatusIcon from "@mui/icons-material/AssignmentTurnedIn";
import UserManagementIcon from "@mui/icons-material/ManageAccounts";
import RunningWithErrors from "@mui/icons-material/RunningWithErrors";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import SpeedIcon from "@mui/icons-material/Speed";
import TimerIcon from "@mui/icons-material/Timer";
import MinusIcon from "@mui/icons-material/Remove";
import PlusIcon from "@mui/icons-material/Add";

// Props
interface NavbarListProps {
  collapsed: boolean;
  location: Location;
}

const NavbarList: React.FC<NavbarListProps> = ({ collapsed, location }) => {
  const { isUserAdmin } = useUserStore((state) => state);
  const theme = useTheme();

  // State
  const [isSuperUserOpen, setSuperUserOpen] = useState(
    location.pathname.includes("/super-user")
  );
  const [isOperationsOpen, setOperationsOpen] = useState(
    location.pathname.includes("/operations")
  );

  // Toggle handler
  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!collapsed) setter((prev) => !prev);
  };

  // Active style for selected items
  const getActiveStyle = (path: string) =>
    location.pathname === path
      ? {
        backgroundColor: theme.palette.primary.main + "10",
        "&.Mui-selected": { backgroundColor: theme.palette.primary.main + "25" },
        "&.Mui-selected:hover": { backgroundColor: theme.palette.primary.main + "25" },
        "&.Mui-selected .MuiListItemIcon-root": {
          color: `${theme.palette.primary.main} !important`,
        },
        "&.Mui-selected .MuiListItemText-primary": {
          color: `${theme.palette.primary.main} !important`,
        },
        "&.Mui-selected .MuiSvgIcon-root": {
          color: `${theme.palette.primary.main} !important`,
        },
      }
      : {};

  // Render functions
  const renderListItem = useCallback(
    (to: string, text: string, Icon: React.ElementType) => (
      <ListItem disablePadding>
        <Tooltip title={collapsed ? text : ""} placement="right" arrow>
          <ListItemButton
            component={Link}
            to={to}
            selected={location.pathname === to}
            sx={{
              minHeight: 42,
              justifyContent: collapsed ? "center" : "initial",
              px: 2.5,
              ...getActiveStyle(to),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 3,
                justifyContent: "center",
                "& .MuiSvgIcon-root": {
                  fontSize: "1.5rem",
                  color: theme.palette.text.primary,
                },
              }}
            >
              <Icon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={text}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.875rem",
                    color: theme.palette.text.primary,
                  },
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    ),
    [collapsed, location.pathname, theme]
  );

  const renderSubListItem = useCallback(
    (to: string, text: string, Icon: React.ElementType) => (
      <ListItemButton
        sx={{
          pl: 4,
          ...getActiveStyle(to),
          minHeight: 38,
        }}
        component={Link}
        to={to}
        selected={location.pathname === to}
      >
        <ListItemIcon
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: "1.5rem",
              color: theme.palette.text.primary,
            },
          }}
        >
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            "& .MuiTypography-root": {
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
            },
          }}
        />
      </ListItemButton>
    ),
    [location.pathname, theme]
  );

  // Menu Config
  const superUserMenu = [
    { to: "/super-user/review-status", text: "Review Status", icon: ReviewStatusIcon },
    { to: "/super-user/user-management", text: "User Management", icon: UserManagementIcon },
    { to: "/super-user/exclusion-list", text: "Exclusion List", icon: RunningWithErrors },
  ];

  const operationsMenu = [
    { to: "/operations/rate-of-operation", text: "Rate of Operations", icon: SpeedIcon },
    { to: "/operations/wrenchtime", text: "Setup Time", icon: TimerIcon },
  ];

  return (
    <List dense>
      {renderListItem("/", "Home", HomeIcon)}
      {renderListItem("/dashboard", "Dashboard", DashboardIcon)}

      {/* Super User Section */}
      {isUserAdmin && (
        <>
          {!collapsed && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleToggle(setSuperUserOpen)}
                  sx={{ minHeight: 42, px: 2.5 }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: "center",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.5rem",
                        color: theme.palette.text.primary,
                      },
                    }}
                  >
                    <SuperUserIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Super User"
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "0.875rem",
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                  {isSuperUserOpen ? (
                    <MinusIcon sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
                  ) : (
                    <PlusIcon sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
                  )}
                </ListItemButton>
              </ListItem>
              <Collapse in={isSuperUserOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                  {superUserMenu.map((item) => renderSubListItem(item.to, item.text, item.icon))}
                </List>
              </Collapse>
            </>
          )}
          {collapsed && superUserMenu.map((item) => renderListItem(item.to, item.text, item.icon))}
        </>
      )}

      {/* Operations Section */}
      {!collapsed && (
        <>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleToggle(setOperationsOpen)}
              sx={{ minHeight: 42, px: 2.5 }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.5rem",
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <PrecisionManufacturingIcon />
              </ListItemIcon>
              <ListItemText
                primary="Production Rates"
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: "0.875rem",
                    color: theme.palette.text.primary,
                  },
                }}
              />
              {isOperationsOpen ? (
                <MinusIcon sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
              ) : (
                <PlusIcon sx={{ fontSize: "1.25rem", color: theme.palette.text.primary }} />
              )}
            </ListItemButton>
          </ListItem>
          <Collapse in={isOperationsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              {operationsMenu.map((item) => renderSubListItem(item.to, item.text, item.icon))}
            </List>
          </Collapse>
        </>
      )}
      {collapsed && operationsMenu.map((item) => renderListItem(item.to, item.text, item.icon))}
    </List>
  );
};

export default NavbarList;