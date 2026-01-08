import React, { useEffect, useState } from "react";
import { getPublishedPosts } from "../../api/postApi";
import PostCard from "../../components/PostCard"; // ton composant déjà créé
import { useNavigate } from "react-router-dom";

export default function UserPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublishedPosts();
        setPosts(data);
      } catch (e) {
        setErr(e.response?.data?.message || "Erreur chargement des articles");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = posts.filter((p) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const title = p.title?.toLowerCase() || "";
    const category = p.category?.name?.toLowerCase() || "";
    const author =
      p.author?.username?.toLowerCase() ||
      p.author?.email?.toLowerCase() ||
      "";
    return (
      title.includes(term) ||
      category.includes(term) ||
      author.includes(term)
    );
  });

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement des articles...</p>
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="text-uppercase text-muted small fw-semibold">
            Espace utilisateur
          </span>
          <h1 className="h3 fw-bold mb-1">Articles</h1>
          <p className="text-muted small mb-0">
            Parcourez les articles publiés et participez en commentant.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge rounded-pill bg-primary">
            {filtered.length} article{filtered.length > 1 ? "s" : ""}
          </span>

          <div className="position-relative" style={{ minWidth: 260 }}>
            <i
              className="bi bi-search text-muted position-absolute"
              style={{ top: "50%", left: 10, transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Rechercher un article..."
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
        </div>
      </div>

      {/* Liste de cartes */}
      {filtered.length === 0 ? (
        <div className="alert alert-info">
          Aucun article ne correspond à votre recherche.
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((post) => (
            <div className="col-12 col-md-6 col-lg-4" key={post._id}>
              <PostCard
                post={post}
                onClick={() => navigate(`/user/posts/${post._id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
