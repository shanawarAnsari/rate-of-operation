import { useState, useEffect } from "react";
import * as userService from "../../../../services/user-manegement";


interface User {
  email: string;
  category: string[];
  interface: string[];
  updated_on: string;
  updated_by: string;
  role: string
}

const parseJsonArray = (value: any): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};


// Hook for fetching all users
export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getAllUsers();
      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data)
      ) {
        // converting all the object keys to what is expected in api payload
        const parsedUsers = response.data.map((user: any) => {
          return {
            email: user.EMAIL_ID,
            role: user.ROLE,
            category: parseJsonArray(user.CATEGORIES),
            interface: parseJsonArray(user.INTERFACES),
            updated_by: user.UPDATED_BY,
            updated_on: user.UPDATED_ON,
          };
        });
        setUsers(parsedUsers);
      } else {
        console.error("Unexpected response structure:", response);
        setError("Something went wrong! Please check with your admin");
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
  const createUser = async (userData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userService.createUser(userData);
      if (response) {
        // Check for explicit error indicators
        if (
          response.error ||
          response.success === false ||
          response.message?.toLowerCase().includes("error")
        ) {
          const errorMessage =
            response.message || response.error || "Failed to create user";
          setError(errorMessage);
          throw new Error(errorMessage);
        } else {
          // If no explicit error, consider it successful
          setSuccess(true);
          return response;
        }
      } else {
        throw new Error("No response received from server");
      }
    } catch (err: any) {
      console.error("Error creating user:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create user";
      setError(errorMessage);
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

  const updateUser = async (email: string, userData: any) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await userService.updateUser(email, userData);
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
export const useUserByEmail = (email: any) => {

  const [user, setUser] = useState<User[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUserByEmail(email);
      if (
        response &&
        response.success &&
        response.data &&
        Array.isArray(response.data)
      ) {

        const parsedUsers = response.data.map((user: any) => {
          return {
            email: user.EMAIL_ID,
            role: user.ROLE,
            category: parseJsonArray(user.CATEGORIES),
            interface: parseJsonArray(user.INTERFACES),
            updated_by: user.UPDATED_BY,
            updated_on: user.UPDATED_ON,
          };
        });
        setUser(parsedUsers);
      } else {
        console.error("Unexpected response structure:", response);
        setError("Something went wrong! Please check with your admin");
      }

    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [email]);
  return { loading, error, fetchUser, user };
};
export const useGetCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState([]);

  const getCategoryInterfaceMap = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getCategpriesInterfaceMap();
      if (response && !response.error) {
        setData(response);
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

  useEffect(() => {
    getCategoryInterfaceMap()
  }, [])

  return { getCategoryInterfaceMap, data, loading, error };
};