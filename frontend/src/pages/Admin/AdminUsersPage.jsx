import { useEffect, useState, useMemo } from "react";
import { getAllUsers, deleteUser } from "../../api/userApi";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setErr("");
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "Erreur suppression utilisateur");
    }
  };

  // filtrer admin + recherche
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => u.role !== "admin")
      .filter((u) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return (
          u.email?.toLowerCase().includes(term) ||
          u.name?.toLowerCase().includes(term) ||
          u.username?.toLowerCase().includes(term)
        );
      });
  }, [users, search]);

  const getRoleBadgeClass = (role) => {
    if (role === "author") return "badge bg-info";
    if (role === "user") return "badge bg-secondary";
    return "badge bg-dark";
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement des utilisateurs...</p>
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
  <div className="d-flex align-items-center gap-2">
    <i className="bi bi-people-fill fs-3 text-primary"></i>
    <div>
      <h1 className="h4 fw-semibold mb-1">Gestion des utilisateurs</h1>
      <p className="text-muted small mb-0">Visualisez et gérez les comptes</p>
    </div>
  </div>
</div>


      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="fw-semibold">
              Total :{" "}
              <span className="badge bg-primary">
                {filteredUsers.length} utilisateur
                {filteredUsers.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="input-group" style={{ maxWidth: 320 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher (email, nom...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="alert alert-info mb-0">
              Aucun utilisateur ne correspond à votre recherche.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Email</th>
                    <th scope="col">Nom</th>
                    <th scope="col">Rôle</th>
                    <th scope="col" className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.email}</td>
                      <td>{u.name || u.username || <span className="text-muted">—</span>}</td>
                      <td>
                        <span className={getRoleBadgeClass(u.role)}>
                          {u.role}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="btn btn-sm btn-outline-danger"
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
  );
}
