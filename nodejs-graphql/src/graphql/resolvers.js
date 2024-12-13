const path = require("path");

const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Post = require("../models/Post");
const { clearFile } = require("../utils/file-handler");

const JWT_SECRET = "REPLACE_WITH_YOUR_JWT_SECRET"; // To be fetched from env variables

const createUser = async ({ userInput }, req) => {
  const { email, password, name } = userInput;

  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({ field: "email", message: "E-Mail is invalid." });
  }

  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 character long",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input fields.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error(
      "User already exists with the provided email address"
    );
    error.code = 422;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  const createdUser = await user.save();

  return { ...createdUser._doc, _id: createdUser._id.toString() };
};

const login = async ({ email, password }, req) => {
  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push({ field: "email", message: "E-Mail is invalid." });
  }

  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 character long",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input fields.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(
      "User doesn't exists with the provided email address"
    );
    error.code = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.code = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    userId: user._id.toString(),
  };
};

const createPost = async ({ postInputData }, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }
  const { title, content, imageUrl } = postInputData;

  const errors = [];

  if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
    errors.push({
      field: "title",
      message: "Invalid title, must be at least 3 character long",
    });
  }
  if (validator.isEmpty(content) || !validator.isLength(content, { min: 3 })) {
    errors.push({
      field: "content",
      message: "Invalid content, must be at least 3 character long",
    });
  }
  if (
    validator.isEmpty(imageUrl) ||
    !validator.isLength(imageUrl, { min: 5 })
  ) {
    errors.push({
      field: "imageUrl",
      message: "Invalid imageUrl, must be a valid URL",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input fields.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const user = await User.findById(req.userId);

  if (!user) {
    const error = new Error("Invalid user.");
    error.data = errors;
    error.code = 401;
    throw error;
  }

  const post = new Post({ title, content, imageUrl, creator: user });
  const createdPost = await post.save();

  user.posts.push(post);
  await user.save();

  return {
    ...createdPost._doc,
    _id: createdPost._id.toString(),
    creator: { name: user.name, _id: user._id.toString() },
    createdAt: createdPost.createdAt.toISOString(),
    updatedAt: createdPost.updatedAt.toISOString(),
  };
};

const posts = async ({ page = 1, limit = 10 }, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  const totalPosts = await Post.find().countDocuments();
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("creator");

  return {
    totalPosts,
    posts: posts.map((post) => ({
      ...post._doc,
      _id: post._id.toString(),
      creator: { name: post.creator.name, _id: post.creator._id.toString() },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    })),
  };
};

const post = async ({ id }, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  const post = await Post.findById(id).populate("creator");

  if (!post) {
    const error = new Error("Post not found.");
    error.data = errors;
    error.code = 404;
    throw error;
  }

  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    creator: { _id: post.creator._id.toString(), name: post.creator.name },
  };
};

const updatePost = async ({ id, postInput }, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Forbidden");
    error.code = 403;
    throw error;
  }

  const { title, content, imageUrl } = postInput;

  const post = await Post.findById(id).populate("creator");

  if (!post) {
    const error = new Error("Post not found.");
    error.data = errors;
    error.code = 404;
    throw error;
  }

  if (req.userId.toString() !== post.creator._id.toString()) {
    const error = new Error("Forbidden");
    error.data = errors;
    error.code = 403;
    throw error;
  }

  const errors = [];

  if (validator.isEmpty(title) || !validator.isLength(title, { min: 3 })) {
    errors.push({
      field: "title",
      message: "Invalid title, must be at least 3 character long",
    });
  }

  if (validator.isEmpty(content) || !validator.isLength(content, { min: 3 })) {
    errors.push({
      field: "content",
      message: "Invalid content, must be at least 3 character long",
    });
  }

  if (
    validator.isEmpty(imageUrl) ||
    !validator.isLength(imageUrl, { min: 5 })
  ) {
    errors.push({
      field: "imageUrl",
      message: "Invalid imageUrl, must be a valid URL",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input fields.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  post.title = title;
  post.content = content;

  if (imageUrl !== "undefined") {
    post.imageUrl = imageUrl;
  }

  const updatedPost = await post.save();

  return {
    ...updatedPost._doc,
    _id: updatedPost._id.toString(),
    createdAt: updatedPost.createdAt.toISOString(),
    updatedAt: updatedPost.updatedAt.toISOString(),
    creator: {
      _id: updatedPost.creator._id.toString(),
      name: updatedPost.creator.name,
    },
  };
};

const deletePost = async ({ id }, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Forbidden");
    error.code = 403;
    throw error;
  }

  const post = await Post.findById(id).populate("creator");

  if (!post) {
    const error = new Error("Post not found.");
    error.data = errors;
    error.code = 404;
    throw error;
  }

  const imagePath = path.join(__dirname, "..", post.imageUrl);
  clearFile(imagePath);

  await Post.findByIdAndDelete(id);

  return "Post deleted successfully!";
};

const updateStatus = async ({ updatedStatus }, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  if (!req.userId) {
    const error = new Error("User not found.");
    error.data = errors;
    error.code = 404;
    throw error;
  }

  const errors = [];

  if (
    validator.isEmpty(updatedStatus) ||
    !validator.isLength(updatedStatus, { min: 3 })
  ) {
    errors.push({
      field: "updatedStatus",
      message: "Invalid status, must be at least 3 characters long",
    });
  }

  if (errors.length > 0) {
    const error = new Error("Invalid input fields.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const user = await User.findById(req.userId);
  user.status = updatedStatus;

  await user.save();

  return "Status updated successfully";
};

const status = async (args, req) => {
  if (!req.isAuthorized) {
    const error = new Error("Unauthorized");
    error.code = 401;
    throw error;
  }

  if (!req.userId) {
    const error = new Error("User not found.");
    error.data = errors;
    error.code = 404;
    throw error;
  }

  const user = await User.findById(req.userId);

  return { status: user.status };
};

module.exports = {
  createUser,
  login,
  createPost,
  posts,
  post,
  updatePost,
  deletePost,
  updateStatus,
  status,
};
