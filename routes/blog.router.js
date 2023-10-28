const express = require("express");
const blogModel = require("../models/blog.model");
const userModel = require("../models/user.model");
const blogRouter = express.Router();

const authUser = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};
// const isAdmin = (req, res, next) => {
//   const { email, role } = req.body;
//   if (role !== "admin") {
//     return res.send("Access denied");
//   }
//   next();
// };

blogRouter.get("/blogs", async (req, res) => {
  const blogs = await blogModel.find().sort({
    createdAt: "desc",
  });

  res.render("blogs", { blogs: blogs });
});
blogRouter.get("/adminPage", authUser, async (req, res) => {
  const blogs = await blogModel.find().sort({
    createdAt: "desc",
  });

  res.render("adminPage", { blogs: blogs });
});

blogRouter.get("/blogs/:id", authUser, async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  res.render("blog", { blog: blog });
});
blogRouter.get("/newBlog", authUser, (req, res) => {
  res.render("newBlog");
});
blogRouter.post("/newBlog", async (req, res) => {
  const { title, author, content } = req.body;
  const blog = new blogModel({
    title,
    author,
    content,
  });
  await blog.save();
  res.redirect(`/dashboard/blogs/${blog.id}`);
});
module.exports = blogRouter;
