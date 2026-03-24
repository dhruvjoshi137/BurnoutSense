import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "burnoutSenseToken";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function predictBurnout(payload) {
    const response = await apiClient.post("/api/predict", payload);
    return response.data;
}

export function getApiBaseUrl() {
    return BASE_URL;
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function signup(payload) {
    const response = await apiClient.post("/api/auth/signup", payload);
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
}

export async function login(payload) {
    const response = await apiClient.post("/api/auth/login", payload);
    localStorage.setItem(TOKEN_KEY, response.data.access_token);
    return response.data;
}

export async function getCurrentUser() {
    const response = await apiClient.get("/api/auth/me");
    return response.data;
}

export async function saveDailyProgress(payload) {
    const response = await apiClient.post("/api/progress", payload);
    return response.data;
}

export async function getDailyProgress() {
    const response = await apiClient.get("/api/progress");
    return response.data;
}

export async function getRiskSummary() {
    const response = await apiClient.get("/api/progress/summary");
    return response.data;
}
