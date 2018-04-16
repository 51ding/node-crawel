var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ObjectId=Schema.Types.ObjectId;

var apiSchema = new Schema({
    Id:ObjectId,
    name: String,
    url: String,
    href: String,
    func:[{
      order:Number,
      name:String,
      anchor:String,
      content:String,
      children:Array
    }]
  }
)

module.exports = mongoose.model("Api", apiSchema);