const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/Post");
const User = require("../models/User");

const { clearFile } = require("../utils/file-handler");
const { getIO } = require("../../socket");

const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      const err = new Error("Invalid Post ID, Post doesn't exist.");
      err.statusCode = 404;
      err.errors = [];
      throw err;
    }
    res.status(200).json({
      message: "Post fetched successfully!!",
      post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const postCount = await Post.countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      message: "Fetched posts successfully!!",
      posts,
      postCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const image = req.file;
  try {
    if (!image) {
      const error = new Error("Image file is required!!");
      error.statusCode = 422;
      error.errors = [];
      throw error;
    }

    const imageUrl = path.join("images", image.filename);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failure, incorrect data provided");
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }

    const post = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });

    await post.save();
    const user = User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    getIO().emit("posts", {
      action: "create",
      post: {
        ...post._doc,
        creator: {
          _id: user._id,
          name: user.name,
          email: user.email,
          status: user.status,
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const image = req.file;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failure, incorrect data provided");
      error.statusCode = 422;
      error.errors = errors.array();
      throw error;
    }

    // if (!image) {
    //   const error = new Error("Image file is required!!");
    //   error.statusCode = 422;
    //   error.errors = [];
    //   throw error;
    // }

    const post = await Post.findById(postId).populate("creator");

    if (!post) {
      const err = new Error("Invalid Post ID, Post doesn't exist.");
      err.statusCode = 404;
      err.errors = [];
      throw err;
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Forbidden!!");
      error.statusCode = 403;
      throw error;
    }

    post.title = title;
    post.content = content;

    if (image) {
      const imagePath = path.join(__dirname, "..", post.imageUrl);
      const imageUrl = path.join("images", image.filename);
      clearFile(imagePath);
      post.imageUrl = imageUrl;
    }

    const updatedPost = await post.save();

    // Emitting the post update with sanitized data
    getIO().emit("posts", {
      action: "update",
      post: {
        ...updatedPost._doc,
        creator: {
          _id: updatedPost.creator._id, // Exposing only the user ID
          name: updatedPost.creator.name, // Exposing user name
          status: updatedPost.creator.status, // Exposing user status
        },
      },
    });

    res.status(200).json({
      message: "Post updated successfully!",
      post: updatedPost,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post doesn't exist.");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("Forbidden!!");
      error.statusCode = 403;
      throw error;
    }

    const imagePath = path.join(__dirname, "..", post.imageUrl);
    clearFile(imagePath);
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    getIO().emit("posts", { action: "delete", post: { _id: postId } });
    res.status(200).json({ message: "Post deleted successfully!!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

module.exports = { getPost, getPosts, createPost, updatePost, deletePost };
