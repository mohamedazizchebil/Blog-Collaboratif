import api from "./axios";

export const loginApi = (data) => api.post("/users/login", data);
export const registerApi = (data) => api.post("/users/register", data);
