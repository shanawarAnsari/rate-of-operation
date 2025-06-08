import { useState, useEffect } from "react";
import * as userService from "../../../../services/user-management";

// Define User type to match API response exactly
export interface User {
  email: string;
  role: string;
  category: string[];
  interface: string[];
  updated_by: string;
  updated_on: string;
}

// Hook for fetching all users
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAllUsers();
      console.log("API Response:", response); // Debug log

      // Handle the specific API response structure: {success: true, data: [...]}
      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data)
      ) {
        setUsers(response.data);
      } else if (response && Array.isArray(response)) {
        setUsers(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response && response.message && !response.success) {
        setError(response.message);
      } else {
        console.error("Unexpected response structure:", response);
        setError("Unexpected response format from server");
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

// Hook for creating a user
export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userService.createUser(userData);
      console.log("Create User Response:", response); // Debug log

      if (response && !response.error) {
        setSuccess(true);
        return response;
      } else {
        setError(response.message || response.error || "Failed to create user");
        throw new Error(
          response.message || response.error || "Failed to create user"
        );
      }
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.message || "Failed to create user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error, success };
};

// Hook for updating a user
export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateUser = async (email: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userService.updateUser(email, userData);
      console.log("Update User Response:", response); // Debug log

      if (response && !response.error) {
        setSuccess(true);
        return response;
      } else {
        setError(response.message || response.error || "Failed to update user");
        throw new Error(
          response.message || response.error || "Failed to update user"
        );
      }
    } catch (err: any) {
      console.error("Error updating user:", err);
      setError(err.message || "Failed to update user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, success };
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteUser = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userService.deleteUser(email);
      console.log("Delete User Response:", response); // Debug log

      if (response && !response.error) {
        setSuccess(true);
        return response;
      } else {
        setError(response.message || response.error || "Failed to delete user");
        throw new Error(
          response.message || response.error || "Failed to delete user"
        );
      }
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error, success };
};
