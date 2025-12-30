const Comment = require("../models/Comment");

// GET /api/comments/post/:postId (public)
exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      isHidden: false,
    })
      .populate("user", "username role")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST /api/comments (user connecté)
exports.createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Le texte est obligatoire" });
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user.id,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: "Erreur création commentaire", error: error.message });
  }
};

// PATCH /api/comments/:id/hide (admin)
exports.hideComment = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { isHidden: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// DELETE /api/comments/:id (owner ou admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    // owner ou admin
    if (
      req.user.role !== "admin" &&
      String(comment.user) !== req.user.id
    ) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Commentaire supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
