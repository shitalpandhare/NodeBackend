const Post = require("../models/posts");

//create post

exports.createPost = (req, res, next) => {
  const id = new Date().toISOString();
  const title = req.body.title;
  const content = req.body.content;

  console.log(req.userData);

  const post = new Post(id, title, content, req.userData.userId);
  post
    .save()
    .then((data) => {
      console.log("here", data);
      if (data.affectedRows == 0) {
        return res
          .status(500)
          .json({ message: "error occure while post  creating !" });
      }
      return res.status(201).json({ message: "post added sucessfully!" });
    })
    .catch((err) => console.log(err));
};

//fetch All posts

exports.getPosts = (req, res, next) => {
  Post.fetchAll()
    .then((post) => {
      if (post[0].length == 0) {
        return res.status(404).json({
          message: "Posts are not found",
        });
      }
      res.status(200).json({
        message: "Post fetch successfully",
        posts: post[0],
      });
    })
    .catch((err) => console.log(err));
};

//fetch single post

exports.getPost = async (req, res, next) => {
  const pid = req.params.id;
  console.log(pid);

  const post = await Post.findById(pid);

  try {
    if (post[0].length == 0) {
      res.status(404).json({
        message: " Post is not found with id :" + pid,
      });
    } else {
      res.status(200).json({
        message: " Single Post fetch successfully",
        posts: post[0],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//delete single post

exports.deletePost = (req, res, next) => {
  const pid = req.params.id;
  const userId = req.userData.userId;

  Post.findById(pid).then((post) => {
    if (post[0].length == 0) {
      return res.status(404).json({
        message: "Post is not found with id :" + pid,
      });
    }
  });

  Post.deletePost(pid, userId)
    .then((data) => {
      if (data[0].affectedRows == 0) {
        return res
          .status(401)
          .json({ message: "error occure while post  deleting !" });
      }

      return res.status(200).json({
        message: "Post Deteled  successfully",
      });
    })
    .catch((err) => console.log(err));
};

//update post

exports.updatePost = (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const userId = req.userData.userId;

  const post = new Post(id, title, content, userId);
  post
    .updatePost()
    .then((data) => {
      console.log(data[0]);
      if (data[0].affectedRows == 0) {
        console.log("heree");
        return res
          .status(401)
          .json({ message: "error occure while  updating" });
      }
      return res.status(201).json({ message: "post updated sucessfully!" });
    })
    .catch((err) => console.log(err));
};
// app.get("/api/posts", (req, res, next) => {

//   firstName = req.body.firstName;
//   lastName = req.body.lastName;

//   res.status(201).json({
//     id: new Date().toISOString(),
//     firstName: firstName,
//     lastName: lastName,
//   });
// };
