const router = require("express").Router();
const { check } = require("express-validator");
const ctrl = require("../controllers/authController");

router.post(
  "/signup",
  [
    check("name").isLength({ min: 2 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 })
  ],
  ctrl.signup
);

router.post("/login", ctrl.login);

module.exports = router;
