import { getApi, postApi, putApi, deleteApi } from "./common";

export const getAllUsers = async () => {
    return getApi("user-management/")
        .then((data) => data)
        .catch((error) => error);
};

export const getUserByEmail = async (email) => {
    const encodedEmail = encodeURIComponent(email);
    return getApi(`user-management/user/${encodedEmail}`)
        .then((data) => data)
        .catch((error) => error);
};

export const createUser = async (userData) => {
    return postApi("user-management/user", userData)
        .then((data) => data)
        .catch((error) => error);
};

export const updateUser = async (email, userData) => {
    const encodedEmail = encodeURIComponent(email);
    return putApi(`user-management/user/${encodedEmail}`, userData)
        .then((data) => data)
        .catch((error) => error);
};

export const deleteUser = async (email) => {
    const encodedEmail = encodeURIComponent(email);
    return deleteApi(`user-management/user/${encodedEmail}`)
        .then((data) => data)
        .catch((error) => error);
};