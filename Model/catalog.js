//目录,目录是一棵树
var mongoose=require("mongoose");
var {Schema}=mongoose;
var {Mixed,ObjectId}=Schema.Types;

var CatalogSchema=new Schema({
  name:String,
  anchorClass:String,
  level:Number,
  leaf:Boolean,
  children:[Schema.Types.Mixed],
  parentid:ObjectId,
  versions:[{key:String,value:String}],
  docapiid:{type:ObjectId,ref:"apidoc"},
  parameters:[String]
})

module.exports=mongoose.model("catalog",CatalogSchema);