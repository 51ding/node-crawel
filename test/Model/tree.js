var mongoose=require("mongoose");

var Schema=mongoose.Schema;

var TreeSchema=new Schema({
  id:Schema.Types.ObjectId,
  name:String,
  level:Number,
  leaf:Boolean,
  children:[TreeSchema]
});

module.exports=mongose.model("tree",TreeSchema);