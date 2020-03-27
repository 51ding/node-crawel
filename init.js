var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var config=require("./config");
var {resolve}=require("path");
var glob=require("glob");

exports.initDatabase =function(){

  return new Promise((resolve, reject) => {

    mongoose.set("debug", true);

    mongoose.connect(config.connectionString);

    var db = mongoose.connection;

    db.once("open", () => {
      console.log("成功链接数据库!");
      resolve();
    })

    db.on('error', console.error.bind(console, 'connection error:'));

  })
}

exports.initSchema=async function(){
  glob.sync(resolve(__dirname,"./Model","**/*.js")).forEach(require);
}

//做了一些修改
////这是第二次修改


