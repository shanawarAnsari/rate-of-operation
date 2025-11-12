import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

export const MetricCardsLoading: React.FC = () => {
  return (
    <Grid container spacing={2}>
      {[1, 2, 3].map((index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
          <Card
            sx={{
              height: 100,
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="40%" height={14} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export const ChartLoading: React.FC<{ height?: number }> = ({ height = 300 }) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="60%" height={16} />
        </Box>
        <Skeleton variant="rectangular" width="100%" height={height} />
      </CardContent>
    </Card>
  );
};

export const ViewSelectorLoading: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 1,
      }}
    >
      <Skeleton variant="rectangular" width={200} height={32} />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton variant="rectangular" width={120} height={28} />
        <Skeleton variant="rectangular" width={140} height={28} />
      </Box>
    </Box>
  );
};

export const SidebarLoading: React.FC = () => {
  return (
    <Box
      sx={{
        width: 60,
        height: "100%",
        minHeight: 300,
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {[1, 2].map((index) => (
        <Skeleton key={index} variant="rectangular" width="100%" height={40} />
      ))}
    </Box>
  );
};

export const TableLoading: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" width="40%" height={24} />
        </Box>
        <Stack spacing={1}>
          {Array.from({ length: rows }).map((_, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" sx={{ flex: 1 }} height={32} />
              <Skeleton variant="rectangular" sx={{ flex: 1 }} height={32} />
              <Skeleton variant="rectangular" sx={{ flex: 1 }} height={32} />
              <Skeleton variant="rectangular" sx={{ flex: 1 }} height={32} />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const FullPageLoading: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <ViewSelectorLoading />
      <Box sx={{ mt: 2 }}>
        <MetricCardsLoading />
      </Box>
      <Box sx={{ mt: 2 }}>
        <ChartLoading height={250} />
      </Box>
    </Box>
  );
};
