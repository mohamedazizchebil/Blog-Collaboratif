import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    isAuthor: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setError("");
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email || !form.password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const role = form.isAuthor ? "author" : "user";

    try {
      setLoading(true);
      await registerApi({
        username,
        email,
        password: form.password,
        role,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l’inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Créer un compte</h3>
          <p className="text-muted">
            Rejoins la communauté et publie des articles
          </p>
        </div>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom d’utilisateur</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="ex: ayoub"
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="ex: user@mail.com"
              autoComplete="email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="min 6 caractères"
              autoComplete="new-password"
            />
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="isAuthor"
                checked={form.isAuthor}
                onChange={onChange}
                id="isAuthor"
              />
              <label className="form-check-label" htmlFor="isAuthor">
                Je veux être <b>Author</b>
              </label>
            </div>

            <span className="badge bg-secondary">
              Rôle : {form.isAuthor ? "author" : "user"}
            </span>
          </div>

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Inscription..." : "S’inscrire"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Déjà un compte ? </span>
          <Link to="/login">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
