import { useState } from "react";

interface User {
  email: string;
  role: "admin" | "user";
  categories: string[];
}

const initialUsers: User[] = [
  {
    email: "admin@example.com",
    role: "admin",
    categories: ["Family Care", "Personal Care"],
  },
  { email: "user@example.com", role: "user", categories: ["Personal Care"] },
];

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setEmail(user.email);
      setRole(user.role);
      setCategories(user.categories);
    } else {
      setSelectedUser(null);
      setEmail("");
      setRole("user");
      setCategories([]);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddOrUpdateUser = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.kcc\.com$/;

    if (email.trim() === "") {
      setSnackbarMessage("Email is required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setSnackbarMessage("Email must be a valid @kcc.com email address.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (selectedUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.email === selectedUser.email ? { email, role, categories } : user
        )
      );
      setSnackbarMessage("User updated successfully!");
      setSnackbarSeverity("success");
    } else {
      setUsers((prev) => [...prev, { email, role, categories }]);
      setSnackbarMessage("User added successfully!");
      setSnackbarSeverity("success");
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteUser = (email: string) => {
    setUsers((prev) => prev.filter((user) => user.email !== email));
    setSnackbarMessage("User deleted successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleOpenDeleteDialog = (email: string) => {
    setUserToDelete(email);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
    }
    handleCloseDeleteDialog();
  };

  const handleCategoryChange = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  return {
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
  };
};
