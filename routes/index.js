const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserInfo,
  addProfilePicture,
} = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "Authenticated User ...",
    user,
  });
});
router.get("/get-user-info/:userId", getUserInfo);
router.patch("/profile-picture", addProfilePicture);

module.exports = router;
