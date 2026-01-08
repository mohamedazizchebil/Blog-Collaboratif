import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>

      {/* HERO */}
      <section className="bg-dark text-light py-5">
        <div className="container text-center py-5">
          <h1 className="fw-bold display-4 mb-3">
            Plateforme de Blog Technologie
          </h1>

          <p className="text-secondary fs-5 mb-4">
            Développement Web, React, UI/UX, bonnes pratiques et retours
            d’expérience partagés par la communauté.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">
              Rejoindre la communauté
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Pourquoi cette plateforme ?</h2>
            <p className="text-muted">
              Un espace pensé par et pour les passionnés de technologie
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-4">
                <h4 className="fw-semibold mb-3">💻 Dev Web</h4>
                <p className="text-muted">
                  Articles sur HTML, CSS, JavaScript, frameworks modernes
                  et bonnes pratiques professionnelles.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-4">
                <h4 className="fw-semibold mb-3">⚛ React & Frontend</h4>
                <p className="text-muted">
                  React, Angular, performances, architecture frontend,
                  composants réutilisables et state management.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm text-center p-4">
                <h4 className="fw-semibold mb-3">🎨 UI / UX</h4>
                <p className="text-muted">
                  Design systems, UX thinking, accessibilité, expériences
                  utilisateur modernes et efficaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
