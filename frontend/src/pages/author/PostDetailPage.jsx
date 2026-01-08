// src/pages/posts/PostDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../api/postApi";
import CommentsSection from "../../components/CommentsSection";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
        setErr("");
      } catch (e) {
        setErr(e.response?.data?.message || "Erreur chargement du post");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement de l'article...</p>
      </div>
    );
  }

  if (err || !post) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{err || "Post introuvable"}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <article className="mb-4">
        <div className="mb-2 d-flex justify-content-between align-items-center">
          {post.category && (
            <span className="badge bg-secondary">
              {post.category.name}
            </span>
          )}
          {post.createdAt && (
            <small className="text-muted">
              {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </small>
          )}
        </div>

        <h1 className="h3 fw-bold mb-2">{post.title}</h1>

        {post.author && (
          <p className="text-muted small mb-3">
            Par{" "}
            {post.author.username || post.author.email || "Auteur"}
          </p>
        )}

        <div className="mb-4">
          <p>{post.content}</p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag._id}
                className="badge bg-light text-muted border me-1 mb-1"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Section commentaires */}
      <CommentsSection postId={post._id} />
    </div>
  );
}
