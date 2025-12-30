const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");


const postController = require("../controllers/postController");

// Public routes
router.get("/published", postController.getPublishedPosts);
router.get("/:id", protect, postController.getPostById);

// Protected routes
router.post("/", protect, postController.createPost);
router.put("/:id", protect, postController.updatePost);
router.delete("/:id", protect, postController.deletePost);
module.exports = router;