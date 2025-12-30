const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Auth
router.post("/register", userController.register);
router.post("/login", userController.login);

// Public test
router.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur la route publique des utilisateurs" });
});

// GET /api/users/me
router.get("/me", protect, userController.getUserById);

// PUT /api/users/me
router.put("/me", protect, userController.update);

// Admin
router.get("/all", protect, authorize("admin"), userController.getAllUsers);
router.delete("/:id", protect, authorize("admin"), userController.deleteUser);

// (Optionnel) Admin peut voir un user par id
router.get("/:id", protect, authorize("admin"), userController.getUserById);



module.exports = router;
