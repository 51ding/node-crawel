var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var apiSchema = new Schema({
    name: String,
    url: String,
    href: String,
    func:[{
      order:Number,
      name:String,
      anchor:String,
      content:String
    }]
  }
)

module.exports = mongoose.model("Api", apiSchema);