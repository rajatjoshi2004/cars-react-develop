import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "https://cars.asicompany.com/", // Set your API base URL
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "1b1f7cc1adef57b33d4e5346bc5e9346",
    },
});

/**
 * Axios API call helper function.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {string} url - API endpoint.
 * @param {Object} [params={}] - Query parameters (for GET).
 * @param {Object} [data={}] - Request body (for POST, PUT).
 * @param {Object} [config={}] - Additional Axios config (e.g., headers).
 * @returns {Promise<any>} - API response or error.
 */
export const apiCall = async (
    method: string,
    url: string,
    params: object = {},
    data: object = {},
    config: object = {}
): Promise<any> => {
    try {
        const response = await api({
            method,
            url,
            params, // Query parameters (for GET)
            data, // Request body (for POST, PUT)
            ...config, // Additional Axios configuration (e.g., override headers if needed)
        });

        return response.data;
    } catch (error: any) {
        // Error Handling with Ant Design Notification
        // notification.error({
        //   message: "API Error",
        //   description: error?.response?.data?.message || "Something went wrong!",
        //   placement: "topRight",
        // });

        throw error;
    }
};
