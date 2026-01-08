import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthorNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user || user.role !== "author") return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
      <Link to="" className="navbar-brand fw-bold">
        Author<span className="text-primary">Space</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#authorNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div id="authorNav" className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto gap-2">
          <li className="nav-item">
            <Link to="/author/posts" className="nav-link">
              Mes articles
            </Link>
          </li>
         
        </ul>

        <div className="d-flex align-items-center gap-3">
          <Link to="/profile" className="nav-link">
            Profil
          </Link>
          <span className="badge bg-primary text-uppercase">author</span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
