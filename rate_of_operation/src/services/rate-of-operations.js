import { getApi, postApi } from "./common";

export const getRecipies = async (req) => {
  return postApi("rate-of-operations/getRecipies", req)
    .then((data) => data)
    .catch((error) => error);
};
export const getFilters = async () => {
  return getApi("rate-of-operations/getFilters")
    .then((data) => data)
    .catch((error) => error);
};
export const getCategories = async () => {
  return getApi("rate-of-operations/getCategories")
    .then((data) => data)
    .catch((error) => error);
};
export const getReviewedStatus = async () => {
  return getApi("rate-of-operations/getReviewedStatus")
    .then((data) => data)
    .catch((error) => error);
};

export const searchRecipes = async (req) => {
  return postApi("rate-of-operations/search", req)
    .then((data) => data)
    .catch((error) => error);
};
