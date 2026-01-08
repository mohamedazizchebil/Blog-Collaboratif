import React, { useEffect, useMemo, useState } from "react";
import { getMyPosts, deletePost } from "../../api/postApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthorPostsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (e) {
        setErr(e.response?.data?.message || "Erreur chargement de vos posts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const term = search.toLowerCase();
    return posts.filter((p) => {
      const title = p.title?.toLowerCase() || "";
      const status = p.status?.toLowerCase() || "";
      const category = p.category?.name?.toLowerCase() || "";
      return (
        title.includes(term) ||
        status.includes(term) ||
        category.includes(term)
      );
    });
  }, [posts, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce post ?")) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Erreur suppression du post");
    }
  };

  if (!user || user.role !== "author") {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning mb-0">
          Accès réservé aux auteurs.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement de vos posts...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger mb-0">{err}</div>
      </div>
    );
  }

  const hasPosts = posts.length > 0;
  const hasFiltered = filteredPosts.length > 0;

  const formatStatus = (status) => {
    if (status === "PUBLISHED") return "PUBLIÉ";
    if (status === "DRAFT") return "DRAFT";
    return status;
  };

  const statusBadgeClass = (status) =>
    status === "PUBLISHED" ? "badge bg-success" : "badge bg-secondary";

  return (
    <div className="container py-4">
      {/* Header / titre */}
     <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
  {/* Bloc titre */}
  <div>
    <span className="text-uppercase text-muted small fw-semibold">
      Espace auteur
    </span>
    <h1 className="h3 fw-bold mb-1">Mes posts</h1>
    <p className="text-muted small mb-0">
      {posts.length > 0
        ? `Vous avez actuellement ${posts.length} article${posts.length > 1 ? "s" : ""}.`
        : "Aucun article pour le moment, créez votre premier contenu."}
    </p>
  </div>

  {/* Actions */}
  <div className="d-flex align-items-center gap-2 flex-wrap">
    {/* Compteur */}
    <span className="badge rounded-pill bg-light text-dark border">
      <i className="bi bi-file-text me-1" />
      {posts.length} article{posts.length > 1 ? "s" : ""}
    </span>

    {/* Barre de recherche */}
    <div className="position-relative" style={{ minWidth: 260 }}>
      <i
        className="bi bi-search text-muted position-absolute"
        style={{ top: "50%", left: 10, transform: "translateY(-50%)" }}
      />
      <input
        type="text"
        className="form-control ps-5"
        placeholder="Rechercher un titre, une catégorie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <button
          type="button"
          className="btn btn-sm btn-link text-muted position-absolute"
          style={{ top: "50%", right: 6, transform: "translateY(-50%)" }}
          onClick={() => setSearch("")}
        >
          <i className="bi bi-x-lg" />
        </button>
      )}
    </div>

    {/* Bouton nouveau post */}
    <button
      className="btn btn-primary d-flex align-items-center"
      onClick={() => navigate("/author/posts/new")}
    >
      <i className="bi bi-plus-lg me-2" />
      Nouveau post
    </button>
  </div>
</div>


      {/* Carte principale */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {!hasPosts ? (
            <div className="p-4">
              <div className="alert alert-info mb-0">
                Vous n&apos;avez encore créé aucun article.{" "}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary ms-1"
                  onClick={() => navigate("/author/posts/new")}
                >
                  Commencer
                </button>
              </div>
            </div>
          ) : !hasFiltered ? (
            <div className="p-4">
              <div className="alert alert-info mb-0">
                Aucun article ne correspond à votre recherche.
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: 220 }}>Titre</th>
                    <th style={{ minWidth: 140 }}>Catégorie</th>
                    <th style={{ minWidth: 120 }}>Statut</th>
                    <th style={{ minWidth: 130 }}>Créé le</th>
                    <th className="text-end" style={{ minWidth: 220 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="fw-semibold text-truncate">
                          {p.title}
                        </div>
                        <small className="text-muted">
                          {p.status === "PUBLISHED"
                            ? "Visible publiquement"
                            : "Brouillon non publié"}
                        </small>
                      </td>
                      <td>
                        {p.category ? (
                          <span className="badge bg-light text-dark border">
                            {p.category.name}
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={statusBadgeClass(p.status)}>
                          {formatStatus(p.status)}
                        </span>
                      </td>
                      <td>
                        {p.createdAt ? (
                          <small className="text-muted">
                            {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </small>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              navigate(`/author/posts/${p._id}/edit`)
                            }
                          >
                            <i className="bi bi-pencil me-1" />
                            Modifier
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(p._id)}
                          >
                            <i className="bi bi-trash me-1" />
                            Supprimer
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => navigate(`/posts/${p._id}`)}
                          >
                            <i className="bi bi-box-arrow-up-right me-1" />
                            Voir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
