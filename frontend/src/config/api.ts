import axios from "axios";
import { tokenStore } from "./token-store";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
    const token = tokenStore.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

let isRefreshing = false;

type QueueItem = {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        // Guard: Prevent loops if the refresh endpoint itself throws a 401
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login")
        ) {
            console.log("isRefreshing", error.response);

            if (isRefreshing) {
                // Queue parallel requests while token is being fetched
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Hit the refresh endpoint. Browser submits HttpOnly cookie automatically
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data;
                tokenStore.setToken(accessToken);

                processQueue(null, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest); // Retry the initial failed request
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clearToken();
                // Redirect user to login or clear global context state here
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);