const Article = require("../models/Article");
const sanitizeHtml = require("sanitize-html");
const { sendEmail } = require("../utils/email");
const User = require("../models/User");

exports.create = async (req, res) => {
  const { title, bodyHtml, assignedEditorbywriter } = req.body;
  console.log("assigned Editor", assignedEditorbywriter)

  const clean = sanitizeHtml(bodyHtml);
  const excerpt = clean.replace(/<[^>]+>/g, "").slice(0, 200);

  const article = await Article.create({
    title,
    bodyHtml: clean,
    excerpt,
    author: req.user.id,
    assignedEditorbywriter:assignedEditorbywriter
  });

  res.json(article);
};


exports.getAllApproved = async (req, res) => {
  const q = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const filter = {
      status: "Approved",
      title: { $regex: q, $options: "i" }
    };

    const count = await Article.countDocuments(filter);

    if (skip >= count) {
      return res.json({
        data: [],
        total: count,
        hasMore: false
      });
    }

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name");

    res.json({
      data: articles,
      total: count,
      hasMore: skip + articles.length < count
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getById = async (req, res) => {
  console.log("req in article get by id", req.user);

  // Only populate author name
  const art = await Article.findById(req.params.id)
    .populate("author", "name");

  if (!art) return res.status(404).json({ message: "Not found" });

  // Access Control
  if (art.status !== "Approved") {
    if (!req.user) return res.status(403).json({ message: "Login required" });

    if (
      req.user.role !== "Admin" &&
      req.user.id !== art.author._id.toString() &&
      req.user.role !== "Editor"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  //  Fetch logged-in user with bookmarks only
  let fullUser = null;
  if (req.user) {
    fullUser = await User.findById(req.user.id)
      .select("name email role bookmarks") 
      .populate("bookmarks", "title");      
  }


  res.json({
    article: art,
    user: fullUser,
  });
};


exports.myArticles = async (req, res) => {
  const list = await Article.find({ author: req.user.id });
  res.json(list);
};

exports.updateRejected = async (req, res) => {
  const { title, bodyHtml } = req.body;

  const article = await Article.findById(req.params.id);

  if (!article) return res.status(404).json({ message: "Article not found" });

  if (article.status !== "Rejected") {
    return res.status(400).json({ message: "Only rejected articles can be resubmitted" });
  }

  // Update values
  article.title = title;
  article.bodyHtml = bodyHtml;

  // no chnaging of the editor remains same

  // Resetting status & comment on the rejected document
  article.status = "Submitted";
  article.editorComment = null;
  article.rejectedBy = null;

  article.updatedAt = new Date();

  await article.save();

  res.json({ message: "Resubmitted", article });
};


exports.queue = async (req, res) => {
  const list = await Article.find({
    assignedEditorbywriter: req.user.id,
    status: "Submitted"
  }).populate("author");
  res.json(list);
};

//this is used to approve the article
exports.approve = async (req, res) => {
  const art = await Article.findById(req.params.id).populate("author");
  const editor = await User.findById(req.user.id);

  art.status = "Approved";
  art.approvedBy = editor._id;
  await art.save();

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
    <h2 style="color: #2e7d32;">Your Article Has Been Approved!</h2>

    <p>Hi <b>${art.author.name}</b>,</p>

    <p>Your article titled:</p>

    <h3 style="color:#0d47a1;">"${art.title}"</h3>

    <p style="margin-top:10px;">
      has been <span style="color:green; font-weight:bold;">approved</span> by the editor.
    </p>

    <p><b>Approved By:</b> ${editor.name}</p>

    <hr style="margin:20px 0;">

    <p>Congratulations! Your article will now be visible publicly.</p>

    <p style="margin-top:30px; font-size:14px; color:#555;">
      — Newsroom CMS System
    </p>
  </div>
  `;

  await sendEmail({
    to: art.author.email,
    subject: `Your Article "${art.title}" is Approved`,
    html
  });

  res.json(art);
};

// this is used to reject the article
exports.reject = async (req, res) => {
  const { comment } = req.body;

  const art = await Article.findById(req.params.id).populate("author");
  const editor = await User.findById(req.user.id);

  art.status = "Rejected";
  art.editorComment = comment;
  art.rejectedBy = editor._id;
  await art.save();

  const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
    <h2 style="color: #d32f2f;">Your Article Has Been Rejected</h2>

    <p>Hi <b>${art.author.name}</b>,</p>

    <p>Your article titled:</p>

    <h3 style="color:#0d47a1;">"${art.title}"</h3>

    <p style="margin-top:10px;">
      has been <span style="color:red; font-weight:bold;">rejected</span> by the editor.
    </p>

    <p><b>Reviewed By:</b> ${editor.name}</p>

    <p style="margin-top:20px; font-weight:bold;">Rejection Reason:</p>

    <div style="background:#ffe6e6; padding:10px; border-left:5px solid #d32f2f;">
      ${comment}
    </div>

    <hr style="margin:20px 0;">

    <p>You can update your article and submit again.</p>

    <p style="margin-top:30px; font-size:14px; color:#555;">
      — Newsroom CMS System
    </p>
  </div>
  `;

  await sendEmail({
    to: art.author.email,
    subject: `Your Article "${art.title}" is Rejected`,
    html
  });

  res.json(art);
};

//this is used to get the approved artcile by the particlur author
exports.getApproved = async (req, res) => {
  const editorId = req.user.id;

  const articles = await Article.find({
    approvedBy: editorId,
    status: "Approved"
  })
    .populate("author", "name")
    .populate("approvedBy", "name");

  res.json(articles);
};

//this is used to get the rejected articel for the patrticular author
exports.getRejected = async (req, res) => {
  const editorId = req.user.id;

  const articles = await Article.find({
    rejectedBy: editorId,
    status: "Rejected"
  })
    .populate("author", "name")
    .populate("rejectedBy", "name");

  res.json(articles);
};

exports.toggleBookmark = async (req, res) => {
  const user = await User.findById(req.user.id);

  const idx = user.bookmarks.indexOf(req.params.id);

  if (idx === -1) user.bookmarks.push(req.params.id);
  else user.bookmarks.splice(idx, 1);

  await user.save();

  res.json(user.bookmarks);
};

// Search articles by title or author name
exports.search = async (req, res) => {
  const { q, limit = 5 } = req.query;
  if (!q) return res.json({ data: [] });

  try {
    const articles = await Article.aggregate([
      // Joining with users collection
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" }, // convert array to object
      // Filter by title or author name
      {
        $match: {
          status: "Approved",
          $or: [
            { title: { $regex: q, $options: "i" } },
            { "author.name": { $regex: q, $options: "i" } }
          ]
        }
      },
      // Sort by createdAt descending
      { $sort: { createdAt: -1 } },
      // Limit results
      { $limit: parseInt(limit) },
      // Project only necessary fields
      {
        $project: {
          title: 1,
          excerpt: 1,
          createdAt: 1,
          "author._id": 1,
          "author.name": 1
        }
      }
    ]);

    console.log("articles in search", articles);
    res.json({ data: articles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
