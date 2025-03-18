import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { mockData } from "./hooks/mockData";
import { Group as UsersIcon } from "@mui/icons-material";
import AddUserDialog from "./components/AddUserDialog";
import EditUserDialog from "./components/EditUserDialog";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";

const UserAccessManagement: React.FC = () => {
  const [users, setUsers] = useState(mockData);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const theme = useTheme();

  const handleAddUser = (newUser: {
    email: string;
    role: string;
    categories: string[];
  }) => {
    setUsers([...users, newUser]);
  };

  const handleEditUser = (updatedUser: {
    email: string;
    role: string;
    categories: string[];
  }) => {
    setUsers(
      users.map((user) =>
        user.email === updatedUser.email ? { ...updatedUser } : user
      )
    );
  };

  const handleDeleteUser = () => {
    setUsers(users.filter((user) => user.email !== selectedUser.email));
    setDeleteDialogOpen(false);
  };

  return (
    <Paper>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={(theme) => ({
          backgroundColor:
            theme.palette.mode === "light" ? theme.palette.grey[200] : "black",
          color:
            theme.palette.mode === "light"
              ? theme.palette.grey[800]
              : theme.palette.common.white,
          p: 1,
          borderRadius: 1,
          mb: 1,
        })}
      >
        <Stack direction="row" alignItems="center">
          <UsersIcon sx={{ mr: 1 }} />
          <Typography sx={{ ml: 0.5, fontSize: "16px", fontWeight: 525 }}>
            Review Status
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add User
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                "& th": {
                  padding: "8px",
                },
              }}
            >
              <TableCell
                sx={{ color: theme.palette.mode === "light" ? "black" : "white" }}
              >
                User
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.mode === "light" ? "black" : "white" }}
              >
                Categories
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.mode === "light" ? "black" : "white" }}
              >
                Role
              </TableCell>
              <TableCell
                sx={{ color: theme.palette.mode === "light" ? "black" : "white" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.categories.map((category, index) => (
                    <Chip key={index} label={category} sx={{ marginRight: 1 }} />
                  ))}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    sx={{
                      backgroundColor: user.role === "Admin" ? "#ffc107" : "#28a745",
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    disabled={user.role === "Admin"}
                    onClick={() => {
                      setSelectedUser(user);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    disabled={user.role === "Admin"}
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddUserDialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddUser}
      />

      {selectedUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          user={selectedUser}
          onSave={handleEditUser}
        />
      )}

      {selectedUser && (
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteUser}
          userEmail={selectedUser.email}
        />
      )}
    </Paper>
  );
};

export default UserAccessManagement;
