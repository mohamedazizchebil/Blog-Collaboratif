import React, { useEffect, useState } from "react";
import { getMe, updateMe } from "../api/userApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 🔹 mode édition ou pas

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const data = await getMe(); // { user, profile }
        setUserData(data);

        setUsername(data.user?.username || "");
        setEmail(data.user?.email || "");
        setBio(data.profile?.bio || "");
        setAvatar(data.profile?.avatar || "");
        setErr("");
      } catch (e) {
        setErr(e.response?.data?.message || "Erreur chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, navigate]);

  const resetForm = () => {
    if (!userData) return;
    setUsername(userData.user?.username || "");
    setEmail(userData.user?.email || "");
    setBio(userData.profile?.bio || "");
    setAvatar(userData.profile?.avatar || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return; // sécurité : on n'envoie que si en édition

    setSuccess("");
    setErr("");

    try {
      setSaving(true);
      const payload = {
        username: username.trim(),
        email: email.trim(),
        bio,
        avatar,
      };
      const data = await updateMe(payload);
      setUserData(data);       // met à jour la source
      setSuccess("Profil mis à jour avec succès.");
      setIsEditing(false);     // repasse en lecture seule
    } catch (e) {
      setErr(
        e.response?.data?.message ||
          "Erreur lors de la mise à jour du profil"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null; // redirection déjà faite dans useEffect
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement de votre profil...</p>
      </div>
    );
  }

  if (err && !userData) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger mb-0">{err}</div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Mon profil</h1>
          <p className="text-muted small mb-0">
            Gérez vos informations personnelles et votre bio.
          </p>
        </div>

        {/* 🔹 Boutons Modifier / Annuler */}
        <div className="d-flex gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                  setErr("");
                  setSuccess("");
                }}
              >
                Annuler
              </button>
              <button
                form="profile-form"
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </button>
          )}
        </div>
      </div>

      {err && (
        <div className="alert alert-danger py-2">{err}</div>
      )}
      {success && (
        <div className="alert alert-success py-2">{success}</div>
      )}

      <form
        id="profile-form"
        onSubmit={handleSubmit}
        className="card shadow-sm"
      >
        <div className="card-body d-grid gap-3">
          {/* Avatar (URL simple) */}
          <div className="d-flex align-items-center gap-3">
            <div>
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="rounded-circle"
                  width={64}
                  height={64}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center text-muted"
                  style={{ width: 64, height: 64 }}
                >
                  <i className="bi bi-person fs-3" />
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              <label className="form-label mb-1">URL de l’avatar</label>
              <input
                type="text"
                className="form-control"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                disabled={!isEditing}
              />
              <small className="text-muted">
                Vous pouvez mettre un lien vers une image de profil.
              </small>
            </div>
          </div>

          {/* Username + email */}
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Nom d’utilisateur</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                required
              />
              <small className="text-muted">
                Utilisé pour la connexion et les notifications.
              </small>
            </div>
          </div>

          {/* Rôle (lecture seule) */}
          <div>
            <label className="form-label mb-1">Rôle</label>
            <p className="form-control-plaintext mb-0">
              <span className="badge bg-secondary text-uppercase">
                {userData?.user?.role}
              </span>
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Parlez un peu de vous, de vos centres d’intérêt, etc."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
