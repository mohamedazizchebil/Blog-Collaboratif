const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, password sont obligatoires" });
    }

    // email unique
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ message: "Cet email est déjà utilisé" });

    // role (optionnel) : par défaut reader
    const allowedRoles = ["user", "author", "admin"];
    const finalRole = role && allowedRoles.includes(role) ? role : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: finalRole,
    });

    await Profile.create({ user: user._id });


    res.status(201).json({
      message: "Enregistrement réussi ",
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email et password sont obligatoires" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }
    const token = signToken(user);
    res.status(200).json({
      message: "Connexion réussie ",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Non autorisé à supprimer ce compte" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    await Profile.deleteOne({ user: id });

    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { username, email, bio, avatar } = req.body;

    const updateUserFields = {};
    if (username) updateUserFields.username = username.trim();
    if (email) updateUserFields.email = email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(userId, updateUserFields, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const updateProfileFields = {};
    if (bio !== undefined) updateProfileFields.bio = bio;
    if (avatar !== undefined) updateProfileFields.avatar = avatar;

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateProfileFields },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ message: "Profil mis à jour", user, profile });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: "Erreur de validation", errors: messages });
    }
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// ➤ Afficher un utilisateur par ID (ADMIN ou lui-même)
exports.getUserById = async (req, res) => {
  try {
    // Si admin appelle /api/users/:id → on prend req.params.id
    // Sinon /api/users/me → on prend req.user.id (via middleware protect)
    const requestedId = req.params.id || req.user?.id;

    if (!requestedId) {
      return res.status(400).json({ message: "ID utilisateur manquant" });
    }

    const user = await User.findById(requestedId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const profile = await Profile.findOne({ user: requestedId });

    return res.status(200).json({ user, profile });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};



