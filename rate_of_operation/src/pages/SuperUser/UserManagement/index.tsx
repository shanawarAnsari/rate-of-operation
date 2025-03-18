import React from "react";
import {
  Container,
  Card,
  CardContent,
  useTheme,
  Divider,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import UserManagementIcon from "@mui/icons-material/Group";
import UserList from "./UserList";
import UserDialog from "./UserDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { useUserManagement } from "./hooks/useUserManagement";

const UserAccessManagement: React.FC = () => {
  const theme = useTheme();
  const {
    users,
    email,
    role,
    categories,
    openDialog,
    deleteDialogOpen,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    selectedUser,
    handleOpenDialog,
    handleCloseDialog,
    handleAddOrUpdateUser,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleCategoryChange,
    setSnackbarOpen,
  } = useUserManagement();

  return (
    <Container maxWidth="xl">
      <Card
        sx={{
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={(theme) => ({
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[200] // Lighter background for better contrast
                : "black", // Primary color for dark mode
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[800] // Dark gray text for light mode
                : theme.palette.common.white, // White text for dark mode
            p: 1,
            borderRadius: 1,
            mb: 1,
          })}
        >
          <Stack direction="row" alignItems="center">
            <UserManagementIcon sx={{ mr: 1 }} />
            <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
              User Access Management
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Stack>

        <UserList
          users={users}
          onEdit={handleOpenDialog}
          onDelete={handleOpenDeleteDialog}
        />
      </Card>
      <UserDialog
        open={openDialog}
        email={email}
        role={role}
        categories={categories}
        selectedUser={selectedUser}
        onClose={handleCloseDialog}
        onSave={handleAddOrUpdateUser}
        onCategoryChange={handleCategoryChange}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
      <Snackbar
        sx={{ mt: 8 }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default UserAccessManagement;
