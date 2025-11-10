import React, { useEffect, useState } from "react";
import {
  Tabs, Tab, Box, Typography, Card, Stack, Button, TextField, MenuItem
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SpeedIcon from "@mui/icons-material/Speed";
import TimerIcon from "@mui/icons-material/Timer";
import AppRegistration from "@mui/icons-material/AutoFixHigh";
import PipelineModal from "./adfPipelineDashboard/PipelineModal";
import ReviewChartTable from "./ReviewChartTable";
import { useReviewStatus } from "./hooks/useReviewStatus";

const groupByOptions = ["category", "business_unit", "interface"] as const;
type GroupByOption = typeof groupByOptions[number];

const ReviewStatus = () => {
  const [activeTab, setActiveTab] = useState<"rateOfOperations" | "wrenchTime">("rateOfOperations");
  const [openModal, setOpenModal] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupByOption>("interface");
  const theme = useTheme();

  const { result, loading, error, getReviewedStatus } = useReviewStatus();

  useEffect(() => {
    getReviewedStatus(activeTab === "rateOfOperations" ? "operations" : "wrenchtime", groupBy);
  }, [activeTab, groupBy, getReviewedStatus]);

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric"
  });

  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper, width: "100%" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[200] : "black",
          color: theme.palette.mode === "light" ? theme.palette.grey[800] : theme.palette.common.white,
          p: 2,
          borderRadius: 1,
          mb: 1
        }}
      >
        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" spacing={1}>
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
              <AssignmentIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  fontSize: "16px",
                  mb: -0.5,
                }}
              >
                Review Status Board
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  opacity: 0.8,
                  fontSize: "12px",
                }}
              >
                Monitor reviews and generate predictions in realtime
              </Typography>
            </Box>
          </Stack>
          <Box display="flex" justifyContent="flex-end" mx={2}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              sx={{ zIndex: 9 }}
              startIcon={<AppRegistration />}
              onClick={() => setOpenModal(true)}
            >
              Tools
            </Button>
          </Box>
        </Stack>

        <Box textAlign="right">
          <Typography fontSize="14px" fontWeight="500">Planning Window</Typography>
          <Typography fontSize="12px">{currentMonthStart} - {currentMonthEnd}</Typography>
        </Box>
      </Stack>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ px: 2, mt: -2 }}
      >
        <Tab
          sx={{ mb: -1 }}
          icon={<SpeedIcon />}
          iconPosition="start"
          label={<Typography fontWeight="500" fontSize={14}>Rate of Operations</Typography>}
          value="rateOfOperations"
        />
        <Tab
          sx={{ mb: -1 }}
          icon={<TimerIcon />}
          iconPosition="start"
          label={<Typography fontWeight="500" fontSize={14}>Setup Time</Typography>}
          value="wrenchTime"
        />
      </Tabs>
      <Stack direction="row" sx={{ mt: -5, mr: 1 }} justifyContent={"flex-end"}>
        <TextField
          select
          size="small"
          label="Group By"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
          sx={{
            width: 180,
            mb: 2,
            '& .MuiInputBase-input': {
              fontSize: '12px',
              padding: '6px 8px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '16px',
            },
          }}
        >
          {groupByOptions.map((option) => (
            <MenuItem key={option} value={option} sx={{ fontSize: '11px', padding: '4px 8px' }}>
              {option.toUpperCase()}
            </MenuItem>
          ))}
        </TextField></Stack>
      {Array.isArray(result) ? <ReviewChartTable
        type={activeTab === "rateOfOperations" ? "operations" : "wrenchtime"}
        groupBy={groupBy}
        result={result}
        loading={loading}
        error={error}
      /> :
        <Box sx={{ px: 2, py: 3, display: "flex", textAlign: "center", flexDirection: "column" }}>
          <Typography fontSize={12} color="error" gutterBottom>
            Something went wrong!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {typeof error === "string" ? error : "Unable to access review status data. Please try again later."}
          </Typography>
        </Box>
      }
      <PipelineModal open={openModal} onClose={() => setOpenModal(false)} />
    </Card>
  );
};

export default ReviewStatus;
