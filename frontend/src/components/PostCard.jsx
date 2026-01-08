import React from "react";

export default function PostCard({ post, onClick, onDelete, showActions = false }) {
  const {
    title,
    excerpt,
    content,
    category,
    tags,
    author,
    createdAt,
    coverImage,
  } = post;

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="card h-100 shadow-sm">
      {/* Image en haut si dispo */}
      {coverImage && (
        <img
          src={coverImage}
          className="card-img-top"
          alt={title}
          style={{ objectFit: "cover", maxHeight: "200px" }}
        />
      )}

      <div className="card-body d-flex flex-column">
        {/* Catégorie & date */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          {category ? (
            <span className="badge bg-secondary">{category.name}</span>
          ) : (
            <span />
          )}
          {dateStr && (
            <small className="text-muted">
              {dateStr}
            </small>
          )}
        </div>

        {/* Titre */}
        <h5 className="card-title">{title}</h5>

        {/* Auteur */}
        {author && (
          <p className="card-subtitle mb-2 text-muted small">
            Par{" "}
            {author.name || author.username || author.email || "Auteur inconnu"}
          </p>
        )}

        {/* Extrait / contenu court */}
        <p className="card-text flex-grow-1">
          {excerpt || content?.slice(0, 150) + (content && content.length > 150 ? "..." : "")}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-2">
            {tags.map((tag) => (
              <span
                key={tag._id || tag}
                className="badge bg-light text-muted border me-1 mb-1"
              >
                #{tag.name || tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          {onClick ? (
            <button className="btn btn-sm btn-primary" onClick={onClick}>
              Lire
            </button>
          ) : (
            <span />
          )}

          {showActions && onDelete && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={onDelete}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
