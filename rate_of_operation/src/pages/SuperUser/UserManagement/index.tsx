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

const UserManagement: React.FC = () => {
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
    <Container maxWidth="xl" sx={{ mt: 2, ml: -2 }}>
      <Card
        sx={{
          mt: 3,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
          width: "100%",
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center">
            <UserManagementIcon sx={{ mr: 1 }} />
            <Typography variant="h6">User Management</Typography>
          </Stack>
          <Divider sx={{ mt: 1, mb: 2 }} />
          <Stack
            sx={{ mx: 2 }}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
            >
              Add New User
            </Button>
          </Stack>
        </CardContent>
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

export default UserManagement;
