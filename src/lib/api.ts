import axios from 'axios';
import { useAuth } from '@/auth/AuthProvider';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

let accessToken: string | undefined;

export function setAuthToken(token: string | undefined) {
    accessToken = token;
}

export function getAccessToken(): string | undefined {
    return accessToken;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export function useOwnerId(): string {
    const { userId } = useAuth();
    return userId ?? "";
}