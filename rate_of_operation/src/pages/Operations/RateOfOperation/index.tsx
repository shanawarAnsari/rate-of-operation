import React from "react";
import {
  Typography,
  Paper,
  Container,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import { Speed as SpeedIcon } from "@mui/icons-material";
import RateOfOperationTable from "./components/RateOfOperationTable";
import { mockData } from "./mockData";

const RateOfOperation: React.FC = () => {
  const theme = useTheme();
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Stack
        direction="row"
        alignItems={"center"}
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "light" ? "#0F059E" : theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          p: 1,
          borderRadius: 1,
          mb: 1,
        })}
      >
        <SpeedIcon sx={{ fontSize: "28px" }} />
        <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
          Rate of Operations
        </Typography>
      </Stack>
      <Container maxWidth="xl" sx={{ width: "100%", display: "flex", flexGrow: 1 }}>
        <RateOfOperationTable data={mockData} />
      </Container>
    </Paper>
  );
};

export default RateOfOperation;
