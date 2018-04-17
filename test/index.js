var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var connectionString = "mongodb://127.0.0.1:27017/test";

exports.init = async function (callback) {
  return new Promise((resolve, reject) => {
    mongoose.set("debug", true);

    mongoose.connect(connectionString);

    var db = mongoose.connection;

    db.once("open", () => {
      callback();
      resolve();
    })

    db.on("error", (error) => {
      reject(error);
    })
  })
}

exports.initSchema = async function () {
  const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    cars: [{
      type: Schema.Types.ObjectId,
      ref: "car"
    }]
  });

  const carSchema = new Schema({
    make: String,
    model: String,
    year: String,
    seller: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  })

  mongoose.model("user", userSchema);
  mongoose.model("car", carSchema);
}
