import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Assure-toi que le path est correct
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      {/* Brand */}
      <Link to="/" className="navbar-brand fw-bold fs-4">
        Tech<span className="text-primary">Community</span>
      </Link>

      {/* Links */}
      <div className="ms-auto d-flex align-items-center gap-3">
        {!user && (
          <>
            <Link to="/login" className="btn btn-outline-primary">
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary">
              Inscription
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/" className="nav-link">
              Accueil
            </Link>

            {(user.role === "author" || user.role === "admin") && (
              <Link to="/create" className="nav-link">
                Créer un post
              </Link>
            )}

            {user.role === "admin" && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}

            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold">{user.username}</span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
