const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const categoryController = require("../controllers/categoryController");

// Public routes
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
// Protected routes
router.post("/", protect, authorize("admin"), categoryController.createCategory);
router.put("/:id", protect, authorize("admin"), categoryController.updateCategory);
router.delete("/:id", protect, authorize("admin"), categoryController.deleteCategory);

module.exports = router;