const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // 1-N
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    isHidden: { type: Boolean, default: false }, // modération
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
