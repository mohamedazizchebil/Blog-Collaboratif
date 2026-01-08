// src/pages/author/AuthorPostFormPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../../api/postApi";
import { getCategories } from "../../api/categoryApi";
import { getTags } from "../../api/tagApi";
import { useAuth } from "../../context/AuthContext";

export default function AuthorPostFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState("DRAFT");

  const [categories, setCategories] = useState([]);
  const [tags, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "author") {
      setErr("Accès réservé aux auteurs.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [cats, tgs] = await Promise.all([
          getCategories(),
          getTags(),
        ]);
        setCategories(cats);
        setTagsList(tgs);

        if (isEdit) {
          const post = await getPostById(id);
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.category?._id || "");
          setSelectedTags(post.tags?.map((t) => t._id) || []);
          setStatus(post.status || "DRAFT");
        }

        setErr("");
      } catch (e) {
        setErr(
          e.response?.data?.message ||
            "Erreur chargement des données du formulaire"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEdit, user]);

  const handleToggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) return;

    const payload = {
      title: title.trim(),
      content: content.trim(),
      category: categoryId,
      tags: selectedTags,
      status,
    };

    try {
      setSaving(true);
      if (isEdit) {
        await updatePost(id, payload);
      } else {
        await createPost(payload);
      }
      navigate("/author/posts");
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          "Erreur lors de l'enregistrement du post"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">
          {isEdit ? "Chargement du post..." : "Chargement du formulaire..."}
        </p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{err}</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">
            {isEdit ? "Modifier le post" : "Créer un nouveau post"}
          </h1>
          <p className="text-muted small mb-0">
            Remplissez les informations de votre article.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card shadow-sm">
        <div className="card-body d-grid gap-3">
          <div>
            <label className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Contenu</label>
            <textarea
              className="form-control"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Choisissez une catégorie...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Tags</label>
            <div className="d-flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <p className="text-muted mb-0">Aucun tag disponible.</p>
              ) : (
                tags.map((tag) => (
                  <button
                    key={tag._id}
                    type="button"
                    className={
                      "btn btn-sm " +
                      (selectedTags.includes(tag._id)
                        ? "btn-primary"
                        : "btn-outline-primary")
                    }
                    onClick={() => handleToggleTag(tag._id)}
                  >
                    #{tag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/author/posts")}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving
                ? "Enregistrement..."
                : isEdit
                ? "Mettre à jour"
                : "Créer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
