const express = require("express");
const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const userRouter = express.Router();

userRouter.get("/register", (req, res) => {
  res.render("register");
});
userRouter.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  let user = await userModel.findOne({ email });
  if (user) {
    res.status(400).json({
      Error: `Oppps..., A user with the same email already exists. Email addresses should be unique`,
    });
  }

  user = new userModel({
    username,
    email,
    role,
    password: await bcryptjs.hash(password, 10),
  });
  await user.save();
  res.redirect("/login");
});
userRouter.get("/login", (req, res) => {
  res.render("login");
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      Error: `Ooops...  No user with this email, ${email}, was found`,
    });
  }
  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ Error: "Ooops... incorrect Password" });
  }
  req.session.isAuth = true;
  res.redirect("/dashboard/blogs");
});

module.exports = userRouter;
