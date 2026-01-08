import { useEffect, useMemo, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../../api/categoryApi";
import AdminNavbar from "./AdminNavbar";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setErr("");
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur chargement catégories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editId) {
        const updated = await updateCategory(editId, name.trim());
        setCategories((prev) => prev.map((c) => (c._id === editId ? updated : c)));
      } else {
        const created = await createCategory(name.trim());
        setCategories((prev) => [...prev, created]);
      }
      setName("");
      setEditId(null);
    } catch (e) {
      alert(e.response?.data?.message || "Erreur sauvegarde catégorie");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Impossible de supprimer une catégorie utilisée"
      );
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(term));
  }, [categories, search]);

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (err) return <div className="alert alert-danger">{err}</div>;

  return (
    <>
   
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1">Gestion des catégories</h1>
          <p className="text-muted small mb-0">
            Organisez et structurez vos articles via des catégories.
          </p>
        </div>
        <span className="badge bg-primary">
          {filtered.length} catégorie{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="row g-4">
        {/* Form */}
        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 fw-bold mb-3">
                {editId ? "Modifier une catégorie" : "Nouvelle catégorie"}
              </h2>

              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex : Technologie, Science..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">
                    {editId ? "Mettre à jour" : "Créer"}
                  </button>
                  {editId && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
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

        {/* List */}
        <div className="col-12 col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h2 className="h6 fw-bold mb-0">Liste des catégories</h2>
                <div className="input-group" style={{ maxWidth: 280 }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="alert alert-info mb-0">
                  Aucune catégorie trouvée.
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
                      {filtered.map((cat) => (
                        <tr key={cat._id}>
                          <td>{cat.name}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(cat)}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(cat._id)}
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
    </>
  );
}
