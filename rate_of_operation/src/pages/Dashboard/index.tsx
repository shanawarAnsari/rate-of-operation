import React from "react";
import TabPanel from "./TabPannel";
import ModelMetrices from "./ModelMetrices";
import UsageMetrices from "./usageDashboard/index";
import {
  Card,
  Tabs,
  Tab,
  Box,
  Stack,
  useTheme,
  Typography,
  Divider,
} from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Dashboard as DashboardTwoTone } from "@mui/icons-material";
import { useUserStore } from "../../store/userStore";
import {
  useUserByEmail,
  useUsers,
} from "../SuperUser/UserManagement/hooks/useUserManegement";
import ModelMetrics from "./ModelMetrices";
interface User {
  email: string;
  category: string[];
  interface: string[];
  updated_on: string;
  updated_by: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user: currentUser } = useUserStore();
  const { user } = useUserByEmail(currentUser?.email);
  const [tabIndex, setTabIndex] = React.useState(0);
  const handleTabChange = (_event: any, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <Card sx={{ pt: 0 }}>
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
            <DashboardTwoTone sx={{ color: "white", fontSize: 20 }} />
          </Box>

          <Stack direction={"column"}>
            <Typography sx={{ ml: 1, fontSize: "16px", fontWeight: 600 }}>
              Dashboard
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
              Metrices at a glance
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Box sx={{ px: 0 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InsightsIcon fontSize="small" />
                Model Metrices
              </Box>
            }
          />
          {user && user[0]?.role === "Admin" && (
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BarChartIcon fontSize="small" />
                  Usage Metrices
                </Box>
              }
            />
          )}
        </Tabs>
        <Divider
          sx={{
            border: "1px solid",
            mt: -0.25,
            borderColor: theme.palette.divider,
          }}
        />
        <TabPanel value={tabIndex} index={0}>
          <ModelMetrics />
        </TabPanel>
        {user && user[0]?.role === "Admin" && (
          <TabPanel value={tabIndex} index={1}>
            <UsageMetrices />
          </TabPanel>
        )}
      </Box>
    </Card>
  );
};

export default Dashboard;
