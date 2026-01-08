import api from "./axios";

// GET /api/comments/post/:postId (public)
export const getCommentsByPost = async (postId) => {
  const res = await api.get(`/comments/post/${postId}`);
  return res.data;
};

// POST /api/comments (logged-in user)
export const createComment = async ({ postId, text }) => {
  const res = await api.post("/comments", { postId, text });
  return res.data;
};

// PATCH /api/comments/:id/hide (admin)
export const hideComment = async (id) => {
  const res = await api.patch(`/comments/${id}/hide`);
  return res.data;
};

// DELETE /api/comments/:id (owner or admin)
export const deleteComment = async (id) => {
  const res = await api.delete(`/comments/${id}`);
  return res.data;
};
