export default function Footer() {
  return (
<footer className="bg-light py-3 mt-auto border-top">
  <div className="container text-center">
    <small className="text-muted">
      © {new Date().getFullYear()} TechBlog. Tous droits réservés.
    </small>
  </div>
</footer>
  );
}
