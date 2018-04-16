var mongoose = require("mongoose");
var connectString = "mongodb://127.0.0.1:27017/test";
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed
mongoose.set("debug", true);
mongoose.connect(connectString);

var db = mongoose.connection;


db.once("open", () => {
  console.log("数据库链接成功！");
  testPopulate(() => {
    var Person=mongoose.model("Person");

    var author = new Person({
      _id: new mongoose.Types.ObjectId(),
      name: 'Ian Fleming',
      age: 50
    });

    author.save(function (err) {
      if (err) return handleError(err);
      var Story=mongoose.model("Story");
      var story1 = new Story({
        title: 'Casino Royale',
        author: author._id    // assign the _id from the person
      });

      story1.save(function (err) {
        if (err) return handleError(err);
        // thats it!
      });
    });
  })
  ;
})

db.on("error", (error) => {
  if (error) console.log(error.message);
})

function testPopulate(callback) {

  var personSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    age: Number,
    stories: [{type: Schema.Types.ObjectId, ref: 'Story'}]
  });

  var storySchema = Schema({
    author: {type: Schema.Types.ObjectId, ref: 'Person'},
    title: String,
    fans: [{type: Schema.Types.ObjectId, ref: 'Person'}]
  });

  var Story = mongoose.model('Story', storySchema);
  var Person = mongoose.model('Person', personSchema);
  callback();
}


function saveData() {
  var TreeSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: String,
    level: Number,
    leaf: Boolean,
    children: [Schema.Types.Mixed],
    parentId: {type: Schema.Types.ObjectId, ref: 'tree'}
  });

  TreeSchema.var
  treeSchema = mongoose.model("tree", TreeSchema);
  var root = new treeSchema();
  root.name = "我是根节点";
  root.level = 1;
  root.leaf = false;
  var child1 = new treeSchema({name: "子1", level: 2, leaf: true, parentId: root._id});
  var child2 = new treeSchema({
    parentId: root._id,
    name: "子2",
    level: 2,
    leaf: false,
    children: [new treeSchema({name: "孙1", level: 3, leaf: true})]
  });
  root.children.push(child1);
  root.children.push(child2);
  root.save((error) => {
    if(error) return console.log(error.message);
  console.log("保存成功！");
})
}

