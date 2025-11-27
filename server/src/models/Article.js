const mongoose = require("mongoose");


const getISTDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60; // in minutes me hai
  const istTime = new Date(now.getTime() + istOffset * 60000);
  return istTime;
};

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bodyHtml: { type: String, required: true },
  excerpt: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },// this is writer hai 
  assignedEditorbywriter:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  status: {
    type: String,
    enum: ["Submitted", "Approved", "Rejected"],
    default: "Submitted"
  },
  editorComment: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: getISTDate },
  updatedAt: { type: Date, default: getISTDate }
});



module.exports = mongoose.model("Article", articleSchema);
