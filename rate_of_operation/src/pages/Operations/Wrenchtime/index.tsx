import React, { useEffect } from "react";
import {
  Typography,
  Paper,
  Stack,
  useTheme,
  Box,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import {
  Timer as TimerIcon,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";
import WrenchtimeTable from "./components/WrenchTimeTable";
import { useUserByEmail } from "../../SuperUser/UserManagement/hooks/useUserManegement";
import { useUserStore } from "../../../store/userStore";
import { useWrenchtimeFilterStore } from "../../../store/wrenchtimeFilterStore";

interface User {
  email: string;
  category: string[];
  interface: string[];
  updated_on: string;
  updated_by: string;
  role: string;
}

const Wrenchtime: React.FC = () => {
  const theme = useTheme();
  const { user, setUserAssignedCategories, setUserAssignedInterfaces } =
    useUserStore();
  const { user: userByEmail, loading: userByEmailLoading } = useUserByEmail(
    user?.email
  );
  const { setSelectedCategory } = useWrenchtimeFilterStore();

  const userDetails: User | undefined =
    Array.isArray(userByEmail) && userByEmail.length > 0
      ? userByEmail[0]
      : undefined;

  const hasCategoryAndInterface =
    userDetails &&
    userByEmail &&
    Array.isArray(userDetails.category) &&
    userDetails.category.length > 0 &&
    Array.isArray(userDetails.interface) &&
    userDetails.interface.length > 0;

  useEffect(() => {
    if (userDetails) {
      setUserAssignedCategories(userDetails?.category || []);
      setSelectedCategory(userDetails?.category[0]);
      setUserAssignedInterfaces(userDetails?.interface || []);
    }
  }, [
    userDetails,
    setUserAssignedCategories,
    setUserAssignedInterfaces,
    setSelectedCategory,
  ]);

  const now = new Date();
  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const currentMonthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
        sx={{
          backgroundColor:
            theme.palette.mode === "light" ? theme.palette.grey[200] : "black",
          color:
            theme.palette.mode === "light"
              ? theme.palette.grey[800]
              : theme.palette.common.white,
          p: 2,
          borderRadius: 1,
          mb: 1,
        }}
      >
        <Stack direction="row" alignItems="center">
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
              p: 1.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TimerIcon sx={{ color: "white", fontSize: 20 }} />
          </Box>

          <Stack direction={"column"}>
            <Typography sx={{ ml: 1, fontSize: "16px", fontWeight: 600 }}>
              Wrenchtime
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.8,
                fontSize: "0.75rem",
                ml: 1,
              }}
            >
              Review setup times and their optimization
            </Typography>
          </Stack>
        </Stack>
        <Box textAlign="right">
          <Typography fontSize="14px" fontWeight="500">
            Planning Window
          </Typography>
          <Typography fontSize="12px">
            {currentMonthStart} - {currentMonthEnd}
          </Typography>
        </Box>
      </Stack>

      {userByEmailLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
          {!hasCategoryAndInterface ? (
            <WrenchtimeTable />
          ) : (
            <Alert
              severity="warning"
              icon={<WarningIcon fontSize="inherit" />}
              sx={{ width: "100%" }}
            >
              <AlertTitle>No Category/Interface Assigned</AlertTitle>
              Please check your assignment — <strong>contact your admin!</strong>
            </Alert>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default Wrenchtime;
