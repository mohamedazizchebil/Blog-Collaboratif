import api from "./axios";


// GET /api/users/me
export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

// PUT /api/users/me
export const updateMe = async (updateData) => {
  const res = await api.put("/users/me", updateData);
  return res.data;
};

// GET /api/users/all (admin)
export const getAllUsers = async () => {
  const res = await api.get("/users/all");
  return res.data;
};

// GET /api/users/:id (admin)
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

// DELETE /api/users/:id (admin)
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
