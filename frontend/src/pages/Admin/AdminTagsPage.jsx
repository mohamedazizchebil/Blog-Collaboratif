// src/pages/admin/AdminTagsPage.jsx
import { useEffect, useMemo, useState } from "react";
import { getTags, createTag, updateTag, deleteTag } from "../../api/tagApi";

export default function AdminTagsPage() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await getTags();
      setTags(data);
      setErr("");
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur chargement des tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editId) {
        const updated = await updateTag(editId, name.trim());
        setTags((prev) => prev.map((t) => (t._id === editId ? updated : t)));
      } else {
        const created = await createTag(name.trim());
        setTags((prev) => [...prev, created]);
      }
      setName("");
      setEditId(null);
    } catch (e) {
      alert(e.response?.data?.message || "Erreur enregistrement tag");
    }
  };

  const handleEdit = (tag) => {
    setEditId(tag._id);
    setName(tag.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce tag ?")) return;
    try {
      await deleteTag(id);
      setTags((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Erreur suppression tag");
    }
  };

  const filteredTags = useMemo(() => {
    if (!search.trim()) return tags;
    const term = search.toLowerCase();
    return tags.filter((t) => t.name.toLowerCase().includes(term));
  }, [tags, search]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement des tags...</p>
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">Gestion des tags</h1>
          <p className="text-muted small mb-0">
            Créez, modifiez et supprimez les tags utilisés sur vos articles.
          </p>
        </div>
        <span className="badge bg-primary">
          {filteredTags.length} tag{filteredTags.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="row g-4">
        {/* Formulaire */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 fw-bold mb-3">
                {editId ? "Modifier un tag" : "Nouveau tag"}
              </h2>
              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label">Nom du tag</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex : JavaScript, Backend..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editId ? "Mettre à jour" : "Créer"}
                  </button>
                  {editId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEditId(null);
                        setName("");
                      }}
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Liste */}
        <div className="col-12 col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 className="h6 fw-bold mb-0">Liste des tags</h2>
                <div className="input-group" style={{ maxWidth: 280 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher un tag..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {filteredTags.length === 0 ? (
                <div className="alert alert-info mb-0">
                  Aucun tag ne correspond à votre recherche.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Nom</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTags.map((tag) => (
                        <tr key={tag._id}>
                          <td>
                            <span className="badge bg-secondary">
                              {tag.name}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(tag)}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(tag._id)}
                            >
                              Supprimer
                            </button>
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
      </div>
    </div>
  );
}
