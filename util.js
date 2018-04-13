var cheerio = require("cheerio");
var mongoose = require("mongoose");
var fs=require("fs");
exports.saveApiContent = saveApiContent;
exports.getPage = getPage;
exports.sleep = sleep;


//等待函数
async function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  })
}

//保存主表数据
exports.saveApi = async function (result) {
  var $ = result.$;
  var href = result.href;
  var host = result.host;
  var protocol = result.protocol;
  var list = $("#column2 ul li");
  list.each(function (index, item) {
    var name = $(this).find("a").text();
    var url = $(this).find("a").attr("href");
    var ApiSchema = mongoose.model("Api");
    ApiSchema.findOne({name: name}, (err, doc) => {
      if (!doc) {
        var api = new ApiSchema({name, url, href});
        api.save((err, product) => {
          if (err) Promise.reject(err);
        })
      }
    })

  })
}

//根据url获取页面数据
async function getPage(browser, url) {
  const page = await browser.newPage();
  await page.goto(url);
  await sleep(1000);
  const bodyHandle = await page.$('body');
  var result = await page.evaluate(body => {
    var html = body.innerHTML;
    var href = window.location.href;
    return {
      html,
      href
    }
  }, bodyHandle);
  fs.writeFile("./a.html",result.html,()=>{
    console.log("保存成功！");
  })
  return Promise.resolve({$: cheerio.load(result.html), href: result.href});
}


//保存详细的信息
async function saveApiContent(browser) {
  var ApiSchema = mongoose.model("Api");
  ApiSchema.find({}, (err, doc) => {
    if (err) return Promise.reject(err);

    for(let i=0;i<doc.length;i++){
      if(i==0){
        var url = `${doc[i].href}${doc[i].url}`;
        saveApiDetail(browser, url,doc[i].name);
      }
    }
  })
}


async function saveApiDetail(browser, url, name) {
  var result = await getPage(browser, url);
  var apiSchema = mongoose.model("Api");
  var $ = result.$;
  console.log($("#toc ul li ul").find("li").length);
}




