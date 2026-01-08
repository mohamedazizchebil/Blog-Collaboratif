import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UserNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user || user.role !== "user") return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 border-bottom">
      <Link to="" className="navbar-brand fw-bold">
        Tech<span className="text-primary">Community</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#userNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div id="userNav" className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto gap-2">
          <li className="nav-item">
            <Link to="/user/posts" className="nav-link">
              Articles
            </Link>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-3">
          <Link to="/profile" className="nav-link">
            Mon profil
          </Link>
          <span className="badge bg-secondary text-uppercase">user</span>
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
