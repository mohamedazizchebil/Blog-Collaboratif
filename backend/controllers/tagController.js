const Tag = require("../models/Tag");

// GET /api/tags (public)
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET /api/tags/:id (public)
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag non trouvé" });
    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ message: "ID invalide", error: error.message });
  }
};

// POST /api/tags (admin)
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "name est obligatoire" });
    }

    const exists = await Tag.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ message: "Tag existe déjà" });

    const tag = await Tag.create({ name: name.trim() });
    res.status(201).json(tag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tag existe déjà" });
    }
    res.status(400).json({ message: "Erreur création tag", error: error.message });
  }
};

// PUT /api/tags/:id (admin)
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "name ne doit pas être vide" });
    }

    const updated = await Tag.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(name !== undefined ? { name: name.trim() } : {}) } },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Tag non trouvé" });
    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Nom de tag déjà utilisé" });
    }
    res.status(400).json({ message: "Erreur update tag", error: error.message });
  }
};

// DELETE /api/tags/:id (admin)
exports.deleteTag = async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tag non trouvé" });
    res.status(200).json({ message: "Tag supprimé " });
  } catch (error) {
    res.status(400).json({ message: "Erreur suppression tag", error: error.message });
  }
};
