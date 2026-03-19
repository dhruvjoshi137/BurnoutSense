import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function predictBurnout(payload) {
    const response = await apiClient.post("/api/predict", payload);
    return response.data;
}
