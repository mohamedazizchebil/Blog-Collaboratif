import React, { useEffect, useState } from "react";
import { getPublishedPosts } from "../../api/postApi";
import PostCard from "../../components/PostCard";
import { useNavigate } from "react-router-dom";

export default function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublishedPosts();
        setPosts(data);
      } catch (e) {
        setErr(e.response?.data?.message || "Erreur chargement des posts");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-2">Chargement des posts...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{err}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Aucun post pour le moment.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h4 fw-bold mb-4">Articles</h1>

      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-12 col-md-6 col-lg-4" key={post._id}>
            <PostCard
              post={post}
              onClick={() => navigate(`/posts/${post._id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
