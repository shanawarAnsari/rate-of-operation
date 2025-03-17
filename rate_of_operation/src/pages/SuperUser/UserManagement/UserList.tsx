import React from "react";
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

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
      <CardContent sx={{ mt: -4 }}>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.email}
              sx={{
                borderBottom: "1px solid #eee",
                "&:hover": { backgroundColor: "action.hover" },
              }}
            >
              <ListItemText
                primary={user.email}
                secondary={`Role: ${user.role} | Categories: ${user.categories.join(
                  ", "
                )}`}
              />
              <IconButton color="primary" onClick={() => onEdit(user)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => onDelete(user.email)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UserList;
