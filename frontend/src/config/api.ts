import axios from "axios";
import { tokenStore } from "./token-store";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
    const token = tokenStore.getAccessToken();
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
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/logout")
        ) {
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
                const storedRefresh = tokenStore.getRefreshToken();
                const response = await axios.post<{
                    accessToken: string;
                    refreshToken: string;
                }>(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    storedRefresh ? { refreshToken: storedRefresh } : {},
                    { withCredentials: true }
                );

                const { accessToken, refreshToken } = response.data;
                tokenStore.setTokens(accessToken, refreshToken);

                processQueue(null, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenStore.clearTokens();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
