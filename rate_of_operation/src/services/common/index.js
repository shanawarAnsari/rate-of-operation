import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const getApi = async (url, data = null, headers = {}) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${BASE_URL}/${url}`,
            params: data,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('authToken')}`,
                ...headers
            }
        });
        if (response.status >= 200 && response.status <= 300) {
            return response.data;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        throw error;
    }
};

export const postApi = async (url, data, headers = {}) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${BASE_URL}/${url}`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('authToken')}`,
                ...headers
            },
            responseType:
                url === 'price-elasticity/download-query' || url === 'price-elasticity-simulator/profit-parabola-download' ? 'blob' : 'json'
        });
        if (response.status >= 200 && response.status <= 300) {
            return response.data;
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        throw error;
    }
};
