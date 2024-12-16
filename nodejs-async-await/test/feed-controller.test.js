const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const Post = require("../src/models/Post");
const User = require("../src/models/User");
const { createPost } = require("../src/controllers/feed");

describe("Feed controller", () => {
  before((done) => {
    mongoose
      .connect("DB_URI") // to be added real DB URI
      .then((result) => {
        console.log("Connected to the database");
        const user = new User({
          name: "Rohitash Kator",
          password: "qwerty",
          email: "test@test.com",
          posts: [],
          _id: "671f5f8f3d98d6cbe403127e",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  it("Should add a created post to the posts of the creator", (done) => {
    const req = {
      body: {
        title: "A test post",
        content: "A post test content",
      },
      file: {
        path: "abc",
        filename: "alpha.jpeg",
      },
      userId: "671f5f8f3d98d6cbe403127e",
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {
        return this;
      },
    };

    createPost(req, res, () => {}).then((updatedUser) => {
      expect(updatedUser).to.have.property("posts");
      expect(updatedUser.posts).to.have.length(1);
      done();
    });
  });

  after((done) => {
    Post.deleteMany({}).then(() => {
      User.deleteMany({})
        .then(() => mongoose.disconnect())
        .then(() => {
          console.log("Cleaned up the database!");
          done();
        });
    });
  });
});
