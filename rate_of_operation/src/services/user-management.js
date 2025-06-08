import { getApi, postApi, putApi, deleteApi } from "./common";

export const getAllUsers = async () => {
  return getApi("user-management/")
    .then((data) => data)
    .catch((error) => error);
};

export const getUserByEmail = async (email) => {
  return getApi(`user-management/users/${email}`)
    .then((data) => data)
    .catch((error) => error);
};

export const createUser = async (userData) => {
  return postApi("user-management/user", userData)
    .then((data) => data)
    .catch((error) => error);
};

export const updateUser = async (email, userData) => {
  return putApi(`user-management/users/${email}`, userData)
    .then((data) => data)
    .catch((error) => error);
};

export const deleteUser = async (email) => {
  return deleteApi(`user-management/users/${email}`)
    .then((data) => data)
    .catch((error) => error);
};
