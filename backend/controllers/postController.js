const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags, status } = req.body;

    const post = await Post.create({
      title,
      content,
      category,
      tags: tags || [],
      status: status || "DRAFT",
      author: req.user.id,
    });

    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ message: "Erreur création post", error: e.message });
  }
};

// 🔹 NOUVEAU : posts de l'auteur connecté
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "username role")
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "PUBLISHED" })
      .populate("author", "username role")
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username role")
      .populate("category", "name")
      .populate("tags", "name");
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // si pas publié -> seulement auteur ou admin
    if (
      post.status !== "PUBLISHED" &&
      post.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Accès interdit à ce post" });
    }

    res.json(post);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Non autorisé à modifier ce post" });
    }

    const { title, content, category, tags, status } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.status = status || post.status;

    await post.save();
    res.json(post);
  } catch (e) {
    res.status(400).json({ message: "Erreur mise à jour post", error: e.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Non autorisé à supprimer ce post" });
    }

    // 🧹 plus propre que post.remove()
    await Post.findByIdAndDelete(post._id);

    res.json({ message: "Post supprimé avec succès" });
  } catch (e) {
    res.status(500).json({ message: "Erreur suppression post", error: e.message });
  }
};
