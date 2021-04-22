const express = require("express");
const bodyParser = require("body-parser");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,Origin,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT");
  next();
});

//
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
