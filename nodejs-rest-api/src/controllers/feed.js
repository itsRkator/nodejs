const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: "First Post", content: "This is my first post" },
      { title: "Second Post", content: "This is my Second Post" },
    ],
  });
};

const createPost = (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.body);
  // Post must be saved in the DB

  res.status(201).json({
    message: "Post created successfully",
    post: { id: Date.now(), title, content },
  });
};

module.exports = { getPosts, createPost };
