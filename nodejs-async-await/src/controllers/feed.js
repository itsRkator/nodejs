const path = require("path");

const { validationResult } = require("express-validator");

const Post = require("../models/Post");
const User = require("../models/User");

const { clearFile } = require("../utils/file-handler");

const getPost = async (req, res, next) => {
  // ------------------------- USING CALLBACKS --------------------------

  // const { postId } = req.params;

  // Post.findById(postId)
  //   .then((post) => {
  //     if (!post) {
  //       const err = new Error("Invalid Post ID, Post doesn't exist.");
  //       err.statusCode = 404;
  //       err.errors = [];
  //       throw err;
  //     }
  //     res.status(200).json({
  //       message: "Post fetched successfully!!",
  //       post,
  //     });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     console.log(err);
  //     next(err);
  //   });

  // ------------------------- USING ASYNC/AWAIT --------------------------

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
  // ------------------------- USING CALLBACKS --------------------------
  // const { page = 1, limit = 10 } = req.query;

  // let totalPosts;

  // Post.countDocuments()
  //   .then((postCount) => {
  //     totalPosts = postCount;
  //     return Post.find().populate('creator')
  //       .skip((page - 1) * limit)
  //       .limit(limit);
  //   })
  //   .then((posts) => {
  //     res.status(200).json({
  //       message: "Fetched posts successfully!!",
  //       posts,
  //       totalPosts,
  //     });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     console.log(err);
  //     next(err);
  //   });

  // ------------------------- USING ASYNC/AWAIT --------------------------

  const { page = 1, limit = 10 } = req.query;

  try {
    const postCount = await Post.countDocuments();
    const posts = await Post.find()
      .populate("creator")
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
  // ------------------------- USING CALLBACKS --------------------------

  // const { title, content } = req.body;
  // const image = req.file;

  // let postCreator;

  // if (!image) {
  //   const error = new Error("Image file is required!!");
  //   error.statusCode = 422;
  //   error.errors = [];
  //   throw error;
  // }

  // const imageUrl = path.join("images", image.filename);

  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   const error = new Error("Validation failure, incorrect data provided");
  //   error.statusCode = 422;
  //   error.errors = errors.array();
  //   throw error;
  // }

  // const post = new Post({
  //   title,
  //   content,
  //   imageUrl,
  //   creator: req.userId,
  // });

  // post
  //   .save()
  //   .then(post => User.findById(req.userId)).then((user) => {
  //     console.log(user);
  //     postCreator = user;
  //     user.posts.push(post);
  //     return user.save();
  //   }).then(result => {
  //     res.status(201).json({
  //       message: "Post created successfully",
  //       post,
  //       creator: { _id: postCreator._id, name: postCreator.name }
  //     });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     console.log(err);
  //     next(err);
  //   });

  // ------------------------- USING ASYNC/AWAIT --------------------------

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
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const updatedUser = await user.save();

    res.status(201).json({
      message: "Post created successfully",
      post,
      creator: { _id: user._id, name: user.name },
    });
    return updatedUser;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  // ------------------------- USING CALLBACKS --------------------------

  // const { postId } = req.params;
  // const { title, content } = req.body;
  // const image = req.file;
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   const error = new Error("Validation failure, incorrect data provided");
  //   error.statusCode = 422;
  //   error.errors = errors.array();
  //   throw error;
  // }

  // // if (!image) {
  // //   const error = new Error("Image file is required!!");
  // //   error.statusCode = 422;
  // //   error.errors = [];
  // //   throw error;
  // // }

  // // const imageUrl = path.join("images", image.filename);

  // Post.findById(postId)
  //   .then((post) => {
  //     if (!post) {
  //       const err = new Error("Invalid Post ID, Post doesn't exist.");
  //       err.statusCode = 404;
  //       err.errors = [];
  //       throw err;
  //     }

  //     if (post.creator.toString() !== req.userId) {
  //       const error = new Error('Forbidden!!');
  //       error.statusCode = 403;
  //       throw error;
  //     }

  //     post.title = title;
  //     post.content = content;
  //     if (image) {
  //       const imagePath = path.join(__dirname, "..", post.imageUrl);
  //       const imageUrl = path.join("images", image.filename);
  //       clearFile(imagePath);
  //       post.imageUrl = imageUrl;
  //     }
  //     return post.save();
  //   })
  //   .then((result) => {
  //     res.status(200).json({
  //       message: "Post updated successfully!",
  //       post: result,
  //     });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     console.log(err);
  //     next(err);
  //   });

  // ------------------------- USING ASYNC/AWAIT --------------------------

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

    // const imageUrl = path.join("images", image.filename);

    const post = await Post.findById(postId);

    if (!post) {
      const err = new Error("Invalid Post ID, Post doesn't exist.");
      err.statusCode = 404;
      err.errors = [];
      throw err;
    }

    if (post.creator.toString() !== req.userId) {
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
  // ------------------------- USING CALLBACKS --------------------------

  // const { postId } = req.params;

  // // Post.findOneAndDelete({ _id: postId, creator: req.userId })
  // //   .then((post) => {
  // //     console.log("Post deleted.", post);
  // //     if (!post) {
  // //       const err = new Error("Invalid Post or Forbidden, Either Post doesn't exist or you are not allowed to deleted this post.");
  // //       err.statusCode = 404;
  // //       err.errors = [];
  // //       throw err;
  // //     }
  // //     res.status(200).json({ message: "Post deleted successfully!" });
  // //   })
  // //   .catch((err) => {
  // //     if (!err.statusCode) {
  // //       err.statusCode = 500;
  // //     }
  // //     console.log(err);
  // //     next(err);
  // //   });

  // Post.findById(postId).then(post => {
  //   if (!post) {
  //     const error = new Error("Post doesn't exist.")
  //     error.statusCode = 404;
  //     throw error;
  //   }

  //   console.log(post, req.userId)

  //   if (post.creator.toString() !== req.userId) {
  //     const error = new Error('Forbidden!!');
  //     error.statusCode = 403;
  //     throw error;
  //   }

  //   const imagePath = path.join(__dirname, "..", post.imageUrl);
  //   clearFile(imagePath);
  //   return Post.findByIdAndDelete(postId);
  // }).then(post => {
  //   console.log(post);
  //   return User.findById(req.userId);
  // }).then(user => {
  //   user.posts.pull(postId);
  //   return user.save();
  // }).then(result => {
  //   res.status(200).json({ message: "Post deleted successfully!!" })
  // }).catch((err) => {
  //   if (!err.statusCode) {
  //     err.statusCode = 500;
  //   }
  //   console.log(err);
  //   next(err);
  // });

  // ------------------------- USING ASYNC/AWAIT --------------------------

  try {
    const { postId } = req.params;

    // Post.findOneAndDelete({ _id: postId, creator: req.userId })
    //   .then((post) => {
    //     console.log("Post deleted.", post);
    //     if (!post) {
    //       const err = new Error("Invalid Post or Forbidden, Either Post doesn't exist or you are not allowed to deleted this post.");
    //       err.statusCode = 404;
    //       err.errors = [];
    //       throw err;
    //     }
    //     res.status(200).json({ message: "Post deleted successfully!" });
    //   })
    //   .catch((err) => {
    //     if (!err.statusCode) {
    //       err.statusCode = 500;
    //     }
    //     console.log(err);
    //     next(err);
    //   });

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
