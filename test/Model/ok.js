var {Schema}=require("mongoose");

var childSchema = new Schema({ name: 'string' });
//像是一种复用策略
var parentSchema = new Schema({

  children: [childSchema],

  child: childSchema
});


var Parent = mongoose.model('Parent', parentSchema);

var parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] })

parent.children[0].name = 'Matthew';


parent.save(()=>{
  console.log("保存成功")
});