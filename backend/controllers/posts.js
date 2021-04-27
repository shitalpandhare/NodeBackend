const Post = require("../models/posts");

//create post

exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  //if use express jwt
  // const userId = req.userData.userId;

  //if use passport jwt
  const userId = req.user[0][0].id;

  const post = new Post(null, title, content, userId);
  const data = await post.save();

  try {
    console.log(data);
    if (data.affectedRows == 0) {
      return res
        .status(500)
        .json({ message: "error occure while post  creating !" });
    }
    return res.status(201).json({ message: "post added sucessfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error occure while post  creating !" });
  }
};

//fetch All posts

exports.getPosts = async (req, res, next) => {
  const post = await Post.fetchAll();
  try {
    if (post[0].length == 0) {
      return res.status(404).json({
        message: "Posts are not found",
      });
    }
    res.status(200).json({
      message: "Post fetch successfully",
      posts: post[0],
    });
  } catch (err) {
    console.log(err);
  }
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

exports.deletePost = async (req, res, next) => {
  const pid = req.params.id;
  //if use express jwt
  // const userId = req.userData.userId;

  //if use passport jwt
  const userId = req.user[0][0].id;

  const post = await Post.findById(pid);

  if (post[0].length == 0) {
    return res.status(404).json({
      message: "Post is not found with id :" + pid,
    });
  }

  const data = await Post.deletePost(pid, userId);
  try {
    if (data[0].affectedRows == 0) {
      return res
        .status(401)
        .json({ message: "error occure while post  deleting !" });
    }

    return res.status(200).json({
      message: "Post Deteled  successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
//update post

exports.updatePost = async (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;

  //if use express jwt
  // const userId = req.userData.userId;

  //if use passport jwt
  const userId = req.user[0][0].id;
  console.log(id);
  const post = new Post(id, title, content, userId);
  const data = await post.updatePost();
  try {
    if (data[0].affectedRows == 0) {
      return res.status(401).json({ message: "error occure while  updating" });
    }
    return res.status(201).json({ message: "post updated sucessfully!" });
  } catch (err) {
    return res.status(401).json({ message: "error occure while  updating" });
  }
};
