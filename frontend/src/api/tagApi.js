import api from "./axios";

// GET /api/tags
export const getTags = async () => {
  const res = await api.get("/tags");
  return res.data;
};

// GET /api/tags/:id
export const getTagById = async (id) => {
  const res = await api.get(`/tags/${id}`);
  return res.data;
};

// POST /api/tags  (admin)
export const createTag = async (name) => {
  const res = await api.post("/tags", { name });
  return res.data;
};

// PUT /api/tags/:id  (admin)
export const updateTag = async (id, name) => {
  const res = await api.put(`/tags/${id}`, { name });
  return res.data;
};

// DELETE /api/tags/:id  (admin)
export const deleteTag = async (id) => {
  const res = await api.delete(`/tags/${id}`);
  return res.data;
};
