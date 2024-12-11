const express = require("express");
const { body } = require("express-validator");

const { isAuthorized } = require("../middlewares/authorization");
const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/feed");

const router = express.Router();

router.get("/post/:postId", isAuthorized, getPost);
router.get("/posts", isAuthorized, getPosts);
router.post(
  "/post",
  isAuthorized,
  [
    body("title", "Title must be at least 5 character long")
      .trim()
      .isLength({ min: 5 }),
    body("content", "Content must be at least 5 character long")
      .trim()
      .isLength({ min: 5 }),
  ],
  createPost
);
router.put(
  "/post/:postId",
  isAuthorized,
  [
    body("title", "Title must be at least 5 character long")
      .trim()
      .isLength({ min: 5 }),
    body("content", "Content must be at least 5 character long")
      .trim()
      .isLength({ min: 5 }),
  ],
  updatePost
);
router.delete("/post/:postId", isAuthorized, deletePost);

module.exports = router;
