const router = require("express").Router();
const { authRequired, roleCheck } = require("../middleware/auth");
const ctrl = require("../controllers/articleController");

//serach ka route
router.get("/search", ctrl.search);

// Public ke saare routes
router.get("/approved", ctrl.getAllApproved);
router.get("/:id", authRequired, ctrl.getById);

// Writer ke saare routes
router.post("/", authRequired, roleCheck(["Writer", "Admin"]), ctrl.create);
router.get("/mine/me", authRequired, roleCheck(["Writer", "Admin"]), ctrl.myArticles);
router.patch("/rejected/update/:id", authRequired, roleCheck(["Writer"]), ctrl.updateRejected)

// Editor ke saare routes
router.get("/editor/queue", authRequired, roleCheck(["Editor", "Admin"]), ctrl.queue);
router.patch("/:id/approve", authRequired, roleCheck(["Editor", "Admin"]), ctrl.approve);
router.patch("/:id/reject", authRequired, roleCheck(["Editor", "Admin"]), ctrl.reject);

router.get("/editor/approved", authRequired, roleCheck(["Editor"]), ctrl.getApproved);//partcular author approved article
router.get("/editor/rejected", authRequired, roleCheck(["Editor"]), ctrl.getRejected);//particular author rejected article

// Bookmark
router.patch("/:id/bookmark", authRequired, ctrl.toggleBookmark);




module.exports = router;
