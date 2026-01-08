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

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function App() {
  return (
   

      <Routes>
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/" element={<Home />} />
         <Route path="/users" element={ <AdminUsersPage />} />
          <Route path="/tags" element={ <AdminTagsPage />} />
          <Route path="/categories" element={ <AddminCategoriesPage />} />
          <Route path="/posts" element={ <AdminPostsPage />} />
          <Route path="/author/posts" element={ <AuthorPostsPage />} />
          <Route path="/author/posts/new" element={ <AuthorPostFormPage />} />
             <Route path="/author/posts/:id/edit" element={<AuthorPostFormPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

  {/* 🔹 Espace user */}
  <Route path="/user/posts" element={<UserPostsPage />} />
  <Route path="/user/posts/:id" element={<UserPostDetailPage />} />
      </Routes>
 
  );
}
