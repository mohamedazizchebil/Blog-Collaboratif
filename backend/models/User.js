const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, 'Le nom d’utilisateur est obligatoire.'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L’email est obligatoire.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Format d’email invalide.']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire.'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.']
  },
    role: { type: String, enum: ["user", "author", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);