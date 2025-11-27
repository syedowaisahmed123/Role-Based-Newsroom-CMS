const User = require("../models/User");
const Article = require("../models/Article");
const bcrypt = require("bcryptjs");

exports.listUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json(users);
};

exports.assignRole = async (req, res) => {
  const { userId, role } = req.body;
  console.log(req.body)

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();

  res.json(user);
};

exports.createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "Email exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, passwordHash, role });
  res.json(user);
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
