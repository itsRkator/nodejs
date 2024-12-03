const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "MONGO_URI" // To be replaced
  )
    .then((client) => {
      console.log("Connected to Database");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database connection found";
};

module.exports = { mongoConnect, getDb };
