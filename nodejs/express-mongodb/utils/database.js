const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://itsrkator:Z0351$AlPhA@mongo-cluster.ostez.mongodb.net/node_application?retryWrites=true&w=majority&appName=mongo-cluster"
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
