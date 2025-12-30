const Category = require("../models/Category");
const Post = require("../models/Post");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Le nom est requis" });

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ message: "Catégorie déjà existante" });

    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ message: "Erreur création catégorie", error: e.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: "Erreur serveur", error: e.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Accès interdit" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Le nom est requis" });

    const existing = await Category.findOne({ name: name.trim(), _id: { $ne: category._id } });
    if (existing) return res.status(400).json({ message: "Une autre catégorie avec ce nom existe déjà" });

    category.name = name.trim();
    await category.save();
    res.json(category);
  } catch (e) {
    res.status(400).json({ message: "Erreur mise à jour catégorie", error: e.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(403).json({ message: "Accès interdit" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Catégorie non trouvée" });

    const postsCount = await Post.countDocuments({ category: category._id });
    if (postsCount > 0) return res.status(400).json({ message: "Impossible de supprimer une catégorie utilisée par des posts" });

    await category.remove();
    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (e) {
    res.status(500).json({ message: "Erreur suppression catégorie", error: e.message });
  }
};