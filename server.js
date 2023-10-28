const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const blogRouter = require("./routes/blog.router");
const userRouter = require("./routes/user.router");
const app = express();

const dbUri = "mongodb://0.0.0.0:27017/students";
mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("mongdb connected");
  });

const store = new mongodbSession({
  uri: dbUri,
  collection: "mySessions",
});
app.set("view engine", "ejs");
app.use(
  session({
    secret: "my secrete key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const authUser = (req, res, next) => {
//   if (req.session.isAuth) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// };

// API endpoints
app.get("/dashboard", (req, res) => {
  res.render("home");
});
// app.get("/dashboard", (req, res) => {
//   res.render("dashboard");
// });

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

// Routes
app.use("/dashboard", blogRouter);
app.use(userRouter);
app.listen(3000, () => {
  console.log("App running on port 3000");
});
