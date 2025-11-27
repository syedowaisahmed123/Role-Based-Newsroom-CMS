const User = require("../models/User");
const Article = require("../models/Article");
const bcrypt = require("bcryptjs");

exports.listUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
};

exports.assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash, role });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};


exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: "bookmarks",
      populate: {
        path: "author",
        select: "name" 
      }
    });

  res.json(user);
};

// get all approved articles (Admin ke liye)
exports.getApprovedArticles = async (req, res) => {
  const articles = await Article.find({ status: "Approved" })
    .populate("author", "name email")
    .populate("approvedBy", "name email");

  res.json(articles);
};
