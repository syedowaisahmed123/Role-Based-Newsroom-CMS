const router = require("express").Router();
const { authRequired, roleCheck } = require("../middleware/auth");
const ctrl = require("../controllers/userController");

router.get("/", authRequired, ctrl.listUsers);
router.post("/create", authRequired, roleCheck(["Admin"]), ctrl.createUserByAdmin);
router.post("/role", authRequired, roleCheck(["Admin"]), ctrl.assignRole);
router.get("/me", authRequired, ctrl.getMe);
router.get("/articles/approved", authRequired, roleCheck(["Admin"]), ctrl.getApprovedArticles);

module.exports = router;
