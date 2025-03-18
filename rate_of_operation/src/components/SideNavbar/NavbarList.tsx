import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  ExpandLess,
  ExpandMore,
  Speed as SpeedIcon,
  Timer as TimerIcon,
  AdminPanelSettings as SuperUserIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import ReviewStatusIcon from "@mui/icons-material/AssignmentTurnedIn";
import UserManagementIcon from "@mui/icons-material/Group";

const NavbarList: React.FC<{ collapsed: boolean; location: any }> = ({
  collapsed,
  location,
}) => {
  const theme = useTheme();
  const [operationsOpen, setOperationsOpen] = useState(
    location.pathname.includes("/operations") ? true : false
  );
  const [superUserOpen, setSuperUserOpen] = useState(
    location.pathname.includes("/super-user") ? true : false
  );

  const handleOperationsClick = () => {
    if (!collapsed) {
      setOperationsOpen(!operationsOpen);
    }
  };

  const handleSuperUserClick = () => {
    if (!collapsed) {
      setSuperUserOpen(!superUserOpen);
    }
  };

  const menuIconStyle = {
    fontSize: "1.5rem",
    color: theme.palette.text.secondary,
  };

  const menuTextStyle = {
    "& .MuiTypography-root": {
      fontSize: "0.875rem",
      fontWeight: 550,
      color: theme.palette.text.secondary,
    },
  };

  const selectedItemStyle = {
    backgroundColor: theme.palette.primary.main + "10",
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main + "15",
    },
    "&.Mui-selected:hover": {
      backgroundColor: theme.palette.primary.main + "25",
    },
    "&.Mui-selected .MuiListItemIcon-root, & .Mui-selected .MuiListItemIcon-root": {
      color: `${theme.palette.primary.main} !important`,
    },
    "&.Mui-selected .MuiListItemText-primary, & .Mui-selected .MuiListItemText-primary":
      {
        color: `${theme.palette.primary.main} !important`,
      },
    "&.Mui-selected .MuiSvgIcon-root, & .Mui-selected .MuiSvgIcon-root": {
      color: `${theme.palette.primary.main} !important`,
    },
  };

  const getActiveStyle = (path: string) =>
    location.pathname === path ? selectedItemStyle : {};

  const renderListItem = (to: string, text: string, Icon: any) => (
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
              "& .MuiSvgIcon-root": menuIconStyle,
            }}
          >
            <Icon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary={text} sx={menuTextStyle} />}
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );

  const renderSubListItem = (to: string, text: string, Icon: any) => (
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
      <ListItemIcon sx={{ "& .MuiSvgIcon-root": menuIconStyle }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} sx={menuTextStyle} />
    </ListItemButton>
  );

  return (
    <List dense>
      {renderListItem("/", "Dashboard", DashboardIcon)}
      {!collapsed && (
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSuperUserClick}
            sx={{
              minHeight: 42,
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: "center",
                "& .MuiSvgIcon-root": menuIconStyle,
              }}
            >
              <SuperUserIcon />
            </ListItemIcon>
            <ListItemText primary="Super User" sx={menuTextStyle} />
            {!superUserOpen ? (
              <ExpandLess sx={menuIconStyle} />
            ) : (
              <ExpandMore sx={menuIconStyle} />
            )}
          </ListItemButton>
        </ListItem>
      )}
      {!collapsed && (
        <Collapse in={!superUserOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {renderSubListItem(
              "/super-user/review-status",
              "Review Status",
              ReviewStatusIcon
            )}
            {renderSubListItem(
              "/super-user/user-management",
              "User Management",
              UserManagementIcon
            )}
          </List>
        </Collapse>
      )}
      {collapsed && (
        <>
          {renderListItem(
            "/super-user/review-status",
            "Review Status",
            ReviewStatusIcon
          )}
          {renderListItem(
            "/super-user/user-management",
            "User Management",
            UserManagementIcon
          )}
        </>
      )}
      {!collapsed && (
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleOperationsClick}
            sx={{
              minHeight: 42,
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: "center",
                "& .MuiSvgIcon-root": menuIconStyle,
              }}
            >
              <PrecisionManufacturingIcon />
            </ListItemIcon>
            <ListItemText primary="Production Rates" sx={menuTextStyle} />
            {!operationsOpen ? (
              <ExpandLess sx={menuIconStyle} />
            ) : (
              <ExpandMore sx={menuIconStyle} />
            )}
          </ListItemButton>
        </ListItem>
      )}
      {!collapsed && (
        <Collapse in={!operationsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {renderSubListItem(
              "/operations/rate-of-operation",
              "Rate of Operations",
              SpeedIcon
            )}
            {renderSubListItem("/operations/wrenchtime", "Wrench Time", TimerIcon)}
            {renderSubListItem(
              "/operations/financial-rate",
              "Financial Rate",
              MoneyIcon
            )}
          </List>
        </Collapse>
      )}
      {collapsed && (
        <>
          {renderListItem(
            "/operations/rate-of-operation",
            "Rate of Operations",
            SpeedIcon
          )}
          {renderListItem("/operations/wrenchtime", "Wrench Time", TimerIcon)}
          {renderListItem("/operations/financial-rate", "Financial Rate", MoneyIcon)}
        </>
      )}
    </List>
  );
};

export default NavbarList;
