import React from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";

interface User {
  email: string;
  role: "admin" | "user";
  categories: string[];
}

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (email: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        backgroundColor: "background.paper",
        width: "100%",
        height: "60vh",
        overflowY: "auto",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "light" ? "#f5f5f5" : "#424242",
                  height: "40px", // Adjust the height as needed
                }}
              >
                <TableCell sx={{ fontSize: "0.875rem", padding: "8px" }}>
                  User
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", padding: "8px" }}>
                  Categories
                </TableCell>
                <TableCell sx={{ fontSize: "0.875rem", padding: "8px" }}>
                  Role
                </TableCell>
                <TableCell
                  sx={{ textAlign: "right", fontSize: "0.875rem", padding: "8px" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email} hover>
                  <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body2">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {user.categories.length > 0 ? (
                      user.categories.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No Categories
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role === "admin" ? "Admin" : "User"}
                      sx={{
                        backgroundColor:
                          user.role === "admin" ? "orange" : "#4CAF50",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => onEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(user.email)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default UserList;
