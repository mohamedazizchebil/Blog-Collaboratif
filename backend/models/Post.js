const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 1-N
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // 1-N
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], // N-N (Post<->Tag)
    status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "DRAFT" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
