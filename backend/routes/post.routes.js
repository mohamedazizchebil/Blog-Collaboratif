const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

// Public
router.get("/published", postController.getPublishedPosts);

// Auteur connecté : ses propres posts
router.get("/mine", protect, authorize("author"), postController.getMyPosts);

// Voir un post (protégé, avec logique publiée/non publiée)
router.get("/:id", protect, postController.getPostById);

// Création / modification / suppression
router.post("/", protect, authorize("author"), postController.createPost);
router.put("/:id", protect, authorize("author", "admin"), postController.updatePost);
router.delete("/:id", protect, authorize("author", "admin"), postController.deletePost);

module.exports = router;
