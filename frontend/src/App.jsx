import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminTagsPage from "./pages/Admin/AdminTagsPage";
import AddminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
import AdminPostsPage from "./pages/Admin/AdminPostsPage";
import AuthorPostsPage from "./pages/author/AuthorPostsPage";
import AuthorPostFormPage from "./pages/author/AuthorPostFormPage";
import PostDetailPage from "./pages/author/PostDetailPage";
import UserPostsPage from "./pages/user/UserPostsPage";
import UserPostDetailPage from "./pages/user/UserPostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminNavbar from "./pages/Admin/AdminNavbar";

import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext"; // si tu utilises ton contexte

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AuthorNavbar from "./pages/author/AuthorNavbar";
import UserNavbar from "./pages/user/UserNavbar";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminNavbar /> 
        <AuthorNavbar />
        <UserNavbar />
  

        {/* Contenu principal */}
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public / accueil */}
            <Route path="/" element={<Home />} />

            {/* Admin */}
            <Route path="/users" element={<AdminUsersPage />} />
            <Route path="/tags" element={<AdminTagsPage />} />
            <Route path="/categories" element={<AddminCategoriesPage />} />
            <Route path="/posts" element={<AdminPostsPage />} />

            {/* Auteur */}
            <Route path="/author/posts" element={<AuthorPostsPage />} />
            <Route path="/author/posts/new" element={<AuthorPostFormPage />} />
            <Route path="/author/posts/:id/edit" element={<AuthorPostFormPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />

            {/* Profil */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Espace user */}
            <Route path="/user/posts" element={<UserPostsPage />} />
            <Route path="/user/posts/:id" element={<UserPostDetailPage />} />
          </Routes>
        </main>

        {/* Footer affiché sur toutes les pages */}
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
