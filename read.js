var cheerio=require("cheerio");
var fs=require("fs");

fs.readFile("./a.html","utf8",(err,data)=>{
  if(err) return console.log(err.message);
  var $=cheerio.load(data);
  $("#toc ul li ul").children("li").each((i,item)=>{
    console.log($(item).text());
    console.log(i);
  })

})