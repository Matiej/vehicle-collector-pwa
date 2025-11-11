import axios from 'axios';


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


export function ownerId(): string {
    return import.meta.env.VITE_APP_OWNER_ID as string;
}