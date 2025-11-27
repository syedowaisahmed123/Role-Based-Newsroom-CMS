const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Editor", "Writer", "Reader"],
    default: "Reader"
  },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Article" }]
});

module.exports = mongoose.model("User", userSchema);
