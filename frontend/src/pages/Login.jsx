import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext"; // 🔹 important

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ↩ récupère la fonction login du contexte

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setError("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email et mot de passe sont obligatoires.");
      return;
    }

    try {
      setLoading(true);

      // selon comment tu as codé loginApi :
      // - soit loginApi retourne res (axios)
      // - soit loginApi retourne res.data
      // Je pars sur la version la plus fréquente = axios → res.data
      const res = await loginApi(form);     // si loginApi = api.post(...)

      const data = res.data ?? res;         // compat : res.data ou data direct
      const token = data?.token;
      const user = data?.user;

      if (!token || !user) {
        setError("Réponse de connexion invalide (token ou user manquant).");
        return;
      }

      // 🔹 pour ton AuthContext existant :
      // login(token, role)
      login(token, user.role);

      // 🔹 tu stockes aussi l'objet user pour l'utiliser ailleurs (profil, etc.)
      localStorage.setItem("user", JSON.stringify(user));

      // 🔹 Redirection en fonction du rôle
      if (user.role === "admin") {
        navigate("/users");
      } else if (user.role === "author") {
        navigate("/author/posts");
      } else {
        // role = "user" ou autre
        navigate("/user/posts");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Connexion</h3>
          <p className="text-muted">Accède à ton blog collaboratif</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
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
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted">Pas encore inscrit ? </span>
          <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}
