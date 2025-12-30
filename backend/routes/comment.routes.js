const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const commentController = require("../controllers/commentController");

// public
router.get("/post/:postId", commentController.getCommentsByPost);

// user connecté
router.post("/", protect, commentController.createComment);

// admin
router.patch("/:id/hide", protect, authorize("admin"), commentController.hideComment);

// owner ou admin
router.delete("/:id", protect, commentController.deleteComment);

module.exports = router;