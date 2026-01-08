import React, { useEffect, useState } from "react";
import { getCommentsByPost, createComment, hideComment } from "../api/commentApi";
import { useAuth } from "../context/AuthContext";

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [moderating, setModerating] = useState(null); // id en cours de modération

  const { user } = useAuth();

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getCommentsByPost(postId);
      setComments(data);
      setErr("");
    } catch (e) {
      setErr(
        e.response?.data?.message || "Erreur chargement des commentaires"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  // user ET author peuvent commenter
  const canComment =
    user && (user.role === "user" || user.role === "author");

  const isAdmin = user?.role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!canComment) return; // sécurité côté front

    try {
      setSubmitting(true);
      const newComment = await createComment({
        postId: postId,
        text: content.trim(),
      });
      setComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Erreur lors de l'envoi du commentaire (êtes-vous connecté ?)"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHide = async (id) => {
    if (!isAdmin) return;
    try {
      setModerating(id);
      await hideComment(id);
      // soit tu recharges, soit tu mets à jour localement
      setComments((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isHidden: !c.isHidden } : c
        )
      );
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Erreur lors de la modération du commentaire"
      );
    } finally {
      setModerating(null);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="h5 mb-3">Commentaires</h3>

      {/* Formulaire ou message selon l'état */}
      {!user ? (
        <div className="alert alert-info">
          Vous devez être connecté pour laisser un commentaire.
        </div>
      ) : !canComment ? (
        <div className="alert alert-warning">
          Votre rôle (<strong>{user.role}</strong>) ne vous permet pas
          d&apos;ajouter des commentaires.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-2">
            <label className="form-label">Votre commentaire</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Écrivez un commentaire..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Envoi..." : "Publier"}
          </button>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <p>Chargement des commentaires...</p>
      ) : err ? (
        <div className="alert alert-danger">{err}</div>
      ) : comments.length === 0 ? (
        <p className="text-muted">Aucun commentaire pour le moment.</p>
      ) : (
        <div className="list-group">
          {comments.map((c) => (
            <div
              key={c._id}
              className={
                "list-group-item list-group-item-action" +
                (c.isHidden ? " opacity-75" : "")
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>
                    {c.user?.name ||
                      c.user?.username ||
                      c.user?.email ||
                      "Utilisateur"}
                  </strong>
                  {c.isHidden && (
                    <span className="badge bg-warning text-dark ms-2">
                      Masqué
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">
                    {c.createdAt &&
                      new Date(c.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </small>
                  {isAdmin && (
                    <button
                      type="button"
                      className={
                        "btn btn-sm " +
                        (c.isHidden ? "btn-success" : "btn-outline-warning")
                      }
                      disabled={moderating === c._id}
                      onClick={() => handleToggleHide(c._id)}
                    >
                      {moderating === c._id
                        ? "..."
                        : c.isHidden
                        ? "Afficher"
                        : "Masquer"}
                    </button>
                  )}
                </div>
              </div>

              <p className="mb-0 mt-1 text-break">
                {c.isHidden && !isAdmin
                  ? "(Ce commentaire a été masqué par un modérateur.)"
                  : c.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
