import { getApi, postApi } from './common';

export const getRecipies = async (req) => {
    return getApi(`rate-of-operations/getRecipies?pageNumber=${req.pageNumber}
    &rowsPerPage=${req.rowsPerPage}&reviewedStatus=${req.reviewedStatus}`)
        .then((data) => data)
        .catch((error) => error);
};
export const getFilters = async () => {
    return getApi('rate-of-operations/getFilters')
        .then((data) => data)
        .catch((error) => error);
};
export const getCategories = async () => {
    return getApi('rate-of-operations/getCategories')
        .then((data) => data)
        .catch((error) => error);
};
export const getReviewedStatus = async () => {
    return getApi('rate-of-operations/getReviewedStatus')
        .then((data) => data)
        .catch((error) => error);
};