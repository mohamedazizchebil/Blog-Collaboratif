import api from "./axios";

// GET /api/categories
export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// GET /api/categories/:id
export const getCategoryById = async (id) => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

// POST /api/categories  (admin only)
export const createCategory = async (name) => {
  const res = await api.post("/categories", { name });
  return res.data;
};

// PUT /api/categories/:id  (admin only)
export const updateCategory = async (id, name) => {
  const res = await api.put(`/categories/${id}`, { name });
  return res.data;
};

// DELETE /api/categories/:id  (admin only)
export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};
