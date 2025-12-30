const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const tagController = require("../controllers/tagController");

// public
router.get("/", tagController.getTags);
router.get("/:id", tagController.getTagById);

// admin
router.post("/", protect, authorize("admin"), tagController.createTag);
router.put("/:id", protect, authorize("admin"), tagController.updateTag);
router.delete("/:id", protect, authorize("admin"), tagController.deleteTag);

module.exports = router;