const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../src/models/User");
const { login, getUserStatus } = require("../src/controllers/auth");

describe("Auth controller", () => {
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

  it("Should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "asdf",
      },
    };

    login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("Should send response with valid user status for an existing user", (done) => {
    const req = { userId: "671f5f8f3d98d6cbe403127e" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
        return this;
      },
    };

    getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("User");
      done();
    });
  });

  after((done) => {
    User.deleteMany({})
      .then(() => mongoose.disconnect())
      .then(() => {
        console.log("Cleaned up the database!");
        done();
      });
  });
});
