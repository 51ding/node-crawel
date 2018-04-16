//大的Api模块
var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var ApiDocSchema=new Schema({
  id:ObjectId,
  name:String,
  href:String,
  url: String
})

module.exports=mongoose.model("apidoc",ApiDocSchema);

