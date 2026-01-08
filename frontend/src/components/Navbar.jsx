import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm px-4">
      {/* Brand */}
      <Link to="/" className="navbar-brand fw-bold fs-4">
        Tech<span className="text-primary">Community</span>
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">

        {/* === Non connecté === */}
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

        {/* === Connecté === */}
        {user && (
          <>
            {/* Posts utilisateur */}
            {user.role === "user" && (
              <Link to="/user/posts" className="nav-link">
                Articles
              </Link>
            )}

            {/* Auteur */}
            {user.role === "author" && (
              <>
                <Link to="/author/posts" className="nav-link">
                  Mes articles
                </Link>

                <button
                  className="btn btn-success btn-sm"
                  onClick={() => navigate("/author/posts/new")}
                >
                  + Nouveau
                </button>
              </>
            )}

            {/* Admin */}
            {user.role === "admin" && (
              <>
                <Link to="/users" className="nav-link">
                  Admin
                </Link>
                <Link to="/posts" className="nav-link">
                  Gestion posts
                </Link>
              </>
            )}

            {/* Profil accessible à tous */}
            <Link to="/profile" className="nav-link">
              Profil
            </Link>

            {/* Username + Logout */}
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold text-muted">{user.role}</span>
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
