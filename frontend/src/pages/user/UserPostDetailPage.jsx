import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostById } from "../../api/postApi";
import CommentsSection from "../../components/CommentsSection";

export default function UserPostDetailPage() {
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
        setErr(e.response?.data?.message || "Erreur chargement de l'article");
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
        <div className="alert alert-danger mb-3">
          {err || "Article introuvable"}
        </div>
        <Link to="/user/posts" className="btn btn-outline-secondary btn-sm">
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Link to="/user/posts" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-arrow-left me-1" />
          Retour aux articles
        </Link>

        {post.category && (
          <span className="badge bg-secondary">
            {post.category.name}
          </span>
        )}
      </div>

      <article className="mb-4">
        <h1 className="h3 fw-bold mb-2">{post.title}</h1>

        <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
          {post.author && (
            <span className="text-muted small">
              Par{" "}
              {post.author.username ||
                post.author.email ||
                "Auteur"}
            </span>
          )}
          {post.createdAt && (
            <span className="text-muted small">
              ·{" "}
              {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

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

      {/* 🔥 zone commentaires : user + author peuvent commenter */}
      <CommentsSection postId={post._id} />
    </div>
  );
}
