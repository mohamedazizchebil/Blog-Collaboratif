import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "admin") return null; // sécurité

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link to="" className="navbar-brand fw-bold">
        Admin<span className="text-primary">Panel</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adminNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div id="adminNav" className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto gap-2">
          <li className="nav-item">
            <Link to="/users" className="nav-link">Utilisateurs</Link>
          </li>
          <li className="nav-item">
            <Link to="/tags" className="nav-link">Tags</Link>
          </li>
          <li className="nav-item">
            <Link to="/categories" className="nav-link">Catégories</Link>
          </li>
          <li className="nav-item">
            <Link to="/posts" className="nav-link">Posts</Link>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-3 text-white">
          <span className="fw-semibold">
            {user.username} <span className="badge bg-secondary">ADMIN</span>
          </span>
          <button className="btn btn-sm btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
