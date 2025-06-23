import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";
import { Edit, Delete, AdminPanelSettings, Person } from "@mui/icons-material";
import { Group as UsersIcon } from "@mui/icons-material";
import AddUserDialog from "./components/AddUserDialog";
import EditUserDialog from "./components/EditUserDialog";
import DeleteConfirmationDialog from "./components/DeleteConfirmationDialog";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/useUserManegement";
import SearchInput from "../../Operations/RateOfOperation/components/SearchInput";

interface User {
  email: string;
  role: string;
  category: string[];
  interface: string[];
  updated_by: string;
  updated_on: string;
}

const UserAccessManagement: React.FC = () => {
  const { users, loading, error, refetch } = useUsers();
  const { createUser, loading: createLoading } = useCreateUser();
  const [visibleUsers, setVisibleUsers] = useState<User[]>()
  const theme = useTheme();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchKey, setSearchKey] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "severityStatus" as "success" | "error",
  });
  const { updateUser, loading: updateLoading } = useUpdateUser();
  const { deleteUser, loading: deleteLoading } = useDeleteUser();
  useEffect(() => {
    setVisibleUsers(users)
  }, [users])
  // Helper function to format date safely
  const formatDate = (dateString: string) => {
    if (!dateString) {
      // Use current date/time as fallback
      const now = new Date();
      return {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Use current date/time as fallback for invalid dates too
      const now = new Date();
      return {
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleAddUser = async (newUser: User) => {
    try {
      const createUserResponse = await createUser(newUser);
      await refetch();
      setAddDialogOpen(false);
      setSnackbar({
        open: true,
        message: createUserResponse?.message || "User added successfully.",
        severity: createUserResponse?.success ? "success" : "error",
      });
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        // Axios-style error
        errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }

  }

  const handleEditUser = async (updatedUser: User) => {
    try {
      const updateResponse = await updateUser(updatedUser.email, updatedUser);
      await refetch();
      setSnackbar({
        open: true,
        message: updateResponse?.message || "User updated successfully.",
        severity: updateResponse?.success ? "success" : "error",
      });
      setEditDialogOpen(false);
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        // Axios-style error
        errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }

  };

  const handleDeleteUser = async () => {
    try {
      if (selectedUser) {
        const deleteResponse = await deleteUser(selectedUser.email);
        await refetch();
        setSnackbar({
          open: true,
          message: deleteResponse?.message || "User deleted successfully.",
          severity: deleteResponse?.success ? "success" : "error",
        });
        setDeleteDialogOpen(false);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to delete user. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleSearchChange = (e: any) => {
    setSearchKey(e.target.value)
    searchUsers(e.target.value)
  }

  function searchUsers(searchKey: string) {
    let filteredUsers = users?.filter((item: User) => {
      if (item.email.includes(searchKey)) {
        return item
      }
    })
    setVisibleUsers(filteredUsers || [] as any)

  }
  return (
    <Box sx={{ backgroundColor: theme.palette.background.default }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor:
              theme.palette.mode === "light"
                ? theme.palette.grey[200] // Lighter background for better contrast
                : "black", // Primary color for dark mode
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[800] // Dark gray text for light mode
                : theme.palette.common.white, // White text for dark mode
            borderBottom: `1px solid ${theme.palette.divider}`,
            p: 2,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                <UsersIcon sx={{ color: "white", fontSize: 20 }} />
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
                  User Management
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    opacity: 0.8,
                    fontSize: "12px",
                  }}
                >
                  Manage user assigned categories and interfaces
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SearchInput
                searchText={searchKey}
                handleSearchChange={handleSearchChange}
              />
              <Button
                variant="contained"
                startIcon={<Person sx={{ fontSize: 16 }} />}
                onClick={() => setAddDialogOpen(true)}
                disabled={createLoading}
                size="small"
                sx={{
                  borderRadius: 1.5,
                  px: 2,
                  py: 0.5,
                  ml: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Add User
              </Button>
            </Box>
          </Stack>
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              mx: 2,
              mb: 2,
              borderRadius: 1,
              border: `1px solid ${theme.palette.error.light}`,
              "& .MuiAlert-icon": {
                fontSize: "1rem",
              },
            }}
          >
            {error}
          </Alert>
        )}
        {/* Content Section */}
        <Box sx={{ p: 0 }}>
          {loading ? (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ p: 3 }}
            >
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2, fontSize: "0.875rem" }}>
                Loading users...
              </Typography>
            </Stack>
          ) : (
            <TableContainer>
              <Table
                size="small"
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    fontSize: "0.8rem",
                  },
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? theme.palette.grey[50]
                          : theme.palette.grey[900],
                      "& th": {
                        padding: "8px 12px",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        letterSpacing: "0.3px",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      User
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      Categories
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      Interface
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      Updated On
                    </TableCell>
                    <TableCell
                      sx={{
                        color: theme.palette.text.primary,
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleUsers && visibleUsers?.length > 0 ? (
                    visibleUsers?.map((user: User) => {
                      console.log("User object:", user);
                      const { date, time } = formatDate(user.updated_on);
                      return (
                        <TableRow
                          key={user.email}
                          sx={{
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                              transition: "all 0.2s ease-in-out",
                            },
                            "&:last-child td": { border: 0 },
                          }}
                        >
                          <TableCell sx={{ p: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{ fontSize: "0.8rem" }}
                            >
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            {user.category && user.category.length > 0 ? (
                              <Box
                                sx={{ display: "flex", flexWrap: "wrap", gap: 0.25 }}
                              >
                                {user.category.map(
                                  (category: string, index: number) => (
                                    <Chip
                                      key={index}
                                      label={category}
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        borderColor: 'transparent',
                                        color: theme.palette.primary.main,
                                        fontWeight: 500,
                                        fontSize: "0.75rem",
                                        height: "24px",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.primary.main + "10",
                                          borderColor: theme.palette.primary.dark,
                                        },
                                      }}
                                    />
                                  )
                                )}
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontStyle="italic"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                No categories
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            {user.interface && user.interface.length > 0 ? (
                              <Box
                                sx={{ display: "flex", flexWrap: "wrap", gap: 0.25 }}
                              >
                                {user.interface.map(
                                  (iface: string, index: number) => (
                                    <Chip
                                      key={index}
                                      label={iface}
                                      variant="outlined"
                                      size="small"
                                      sx={{
                                        borderColor: 'transparent',
                                        color: theme.palette.secondary.main,
                                        fontWeight: 500,
                                        fontSize: "0.75rem",
                                        height: "24px",
                                        "&:hover": {
                                          backgroundColor:
                                            theme.palette.secondary.main + "10",
                                          borderColor: theme.palette.secondary.dark,
                                        },
                                      }}
                                    />
                                  )
                                )}
                              </Box>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontStyle="italic"
                                sx={{ fontSize: "0.7rem" }}
                              >
                                No interfaces
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Chip
                              label={user.role}
                              variant="outlined"
                              icon={
                                user.role == "Admin" ? (
                                  <AdminPanelSettings
                                    sx={{
                                      fontSize: "16px",
                                    }}
                                  />
                                ) : (
                                  <Person
                                    sx={{
                                      fontSize: "16px",
                                    }}
                                  />
                                )
                              }
                              sx={{
                                borderColor:
                                  user.role === "Admin" ? "#ffc107" : "#28a745",
                                color: user.role === "Admin" ? "#ffc107" : "#28a745",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                height: "24px",
                                "&:hover": {
                                  backgroundColor:
                                    (user.role === "Admin" ? "#ffc107" : "#28a745") +
                                    "10",
                                  borderColor:
                                    user.role === "Admin" ? "#ffb300" : "#1e7e34",
                                },
                                "& .MuiChip-icon": {
                                  color:
                                    user.role === "Admin" ? "#ffc107" : "#28a745",
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ mb: 0.1, fontSize: "0.75rem" }}
                              >
                                {date}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.65rem" }}
                              >
                                {time}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Stack direction="row" spacing={0.25}>
                              <IconButton
                                size="small"
                                color="primary"
                                disabled={updateLoading || user.role === "Admin"}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditDialogOpen(true);
                                }}
                                sx={{
                                  padding: "4px",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                    bgcolor: theme.palette.primary.main + "20",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                <Edit sx={{ fontSize: "14px" }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={deleteLoading || user.role === "Admin"}
                                onClick={() => {
                                  setSelectedUser(user);
                                  setDeleteDialogOpen(true);
                                }}
                                sx={{
                                  padding: "4px",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                    bgcolor: theme.palette.error.main + "20",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                <Delete sx={{ fontSize: "14px" }} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ p: 6 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <UsersIcon
                            sx={{ fontSize: 48, color: theme.palette.text.disabled }}
                          />
                          <Typography variant="h6" color="text.secondary">
                            No users found
                          </Typography>
                          <Typography variant="body2" color="text.disabled">
                            Get started by adding your first user
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <AddUserDialog
          open={isAddDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onSave={handleAddUser}
          loading={createLoading}
          currentUserEmail="admin@kcc.com"
        />
        {selectedUser && (
          <EditUserDialog
            open={isEditDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            user={selectedUser}
            onSave={handleEditUser}
            loading={updateLoading}
          />
        )}
        {selectedUser && (
          <DeleteConfirmationDialog
            open={isDeleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteUser}
            userEmail={selectedUser.email}
            loading={deleteLoading}
          />
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={15000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            zIndex: 9999,
            "& .MuiSnackbarContent-root": {
              minWidth: "300px",
            },
          }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              "&.MuiAlert-standardSuccess": {
                backgroundColor: "#4caf50",
                color: "white",
              },
              "&.MuiAlert-standardError": {
                backgroundColor: "#f44336",
                color: "white",
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default UserAccessManagement;