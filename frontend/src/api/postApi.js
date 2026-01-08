import api from "./axios";

// GET /api/posts/published (public)
export const getPublishedPosts = async () => {
  const res = await api.get("/posts/published");
  return res.data;
};

// GET /api/posts/mine (author)
export const getMyPosts = async () => {
  const res = await api.get("/posts/mine"); // à implémenter côté backend
  return res.data;
};

// GET /api/posts/:id (protected)
export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

// POST /api/posts (protected)
export const createPost = async (postData) => {
  const res = await api.post("/posts", postData);
  return res.data;
};

// PUT /api/posts/:id (protected)
export const updatePost = async (id, postData) => {
  const res = await api.put(`/posts/${id}`, postData);
  return res.data;
};

// DELETE /api/posts/:id (protected)
export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};
