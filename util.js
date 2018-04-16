var cheerio = require("cheerio");
var mongoose = require("mongoose");
var fs = require("fs");

exports.saveApiCatalog = saveApiCatalog;
exports.getPage = getPage;
exports.sleep = sleep;


//等待函数
async function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  })
}

//保存所有大模块
exports.saveApi = async function (result) {
  var $ = result.$;
  var href = result.href;
  var host = result.host;
  var protocol = result.protocol;
  var list = $("#column2 ul li");
  list.each(function (index, item) {
    var name = $(this).find("a").text();
    var url = $(this).find("a").attr("href");

    var ApiDocSchema = mongoose.model("apidoc");

    ApiDocSchema.findOne({name: name}, (err, doc) => {
      if (!doc) {
        var api = new ApiDocSchema({name, url, href});
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

  return Promise.resolve({$: cheerio.load(result.html), href: result.href});
}


//保存Api的目录
async function saveApiCatalog(browser) {
  var ApiDocSchema = mongoose.model("apidoc");
  ApiDocSchema.find({}, (err, doc) => {
    if (err) return Promise.reject(err);

    for (let i = 0; i < doc.length; i++) {
      if (i == 2) {
        var url = `${doc[i].href}${doc[i].url}`;
        saveApiDetail(browser, url, doc[i].name);
      }
    }
  })
}


async function saveApiDetail(browser, url, name) {
  var result = await getPage(browser, url);
  var apiSchema = mongoose.model("Api");
  var $ = result.$;
  var children = $("#toc > ul").first();
  var CatalogSchema = mongoose.model("catalog");
  var root = new CatalogSchema();
  getChild(children, 1, $, root);
  var CatalogSchema = mongoose.model("catalog");
  root.save(() => {
    console.log("保存成功！");
  })
}


//使用递归实现
function getChild(child, currentLevel, $, root, parent) {
  var level = currentLevel;

  if (child.is("ul")) {
    //第一层保存根节点
    level++;
    child.children("li").each((t, s) => {
      var me = $(s);
      var span = $(s).find("span").first();
      var anchorClass = "#" + span.children("a").first().attr("href").replace("#", "");
      //锚点
      var anchor = $(anchorClass).parent().parent();
      //获取锚点下对应的信息
      if (level - 1 == 1 && t == 0) {
        root.name = span.text();
        root.level = level;
        root.leaf = true;
        root.anchorClass = anchorClass;
        getVersionInformation(root, anchorClass, $);
        getParameterInformation(root, anchor, $);
      }
      else {
        var data = {
          name: span.text(),
          level: level - 1,
          leaf: true,
          anchorClass: anchorClass,
          children: [],
          versions: [],
          parameters: []
        }
        getVersionInformation(data, anchorClass, $);
        getParameterInformation(data, anchor, $);
        if (level - 1 == 2) {
          root.children.push(data);
        }
        else {
          parent.children.push(data);
        }
      }


      // var space = ""
      // for (var i = 0; i < level; i++)
      //   space += " ";
      // console.log(space + span.text());
      // var href = span.children("a").first().attr("href");
      // // var x=$(`a[href=${href}]`);
      // // console.log(x.length);
      // var anchor = $(`#${href.replace("#", "")}`).parent().parent();
      // //获取版本信息版本信息
      // var metaData = anchor.next().next();
      // //如果存在就读取版本信息
      // if (metaData.hasClass("api_metadata")) {
      //   var table = metaData.find(".changelog table tbody")
      //   if (table.length == 0) {
      //     //console.log("当前版本:"+metaData.children().first().text())
      //   }
      //   //读取版本列表
      //   else {
      //     table.children("tbody tr").each((index, item) => {
      //       if (index == 0) {
      //         // console.log("版本            变更");
      //       }
      //       if (index > 0) {
      //         var meta = $(item);
      //         //console.log(`${meta.children().first().text()}            ${meta.children().first().next().text()}`);
      //       }
      //     });
      //   }
      //
      // }
      //
      // //获取参数列表
      // var parameterlist = anchor.next().next().next();
      // if (parameterlist.is("ul")) {
      //   parameterlist.children("li").each((index, item) => {
      //     //console.log($(item).text().trim().replace("\n",""));
      //   });
      // }
      // //获取接口详细内容
      // var content = parameterlist.nextUntil("h1,h2,h3,h4,h5");
      // content.each((index, item) => {
      //   console.log($(item).text());
      // })

      getChild(me.children().first().next(), level, $, root, data);
    })

  }
}

//获取版本信息
function getVersionInformation(data, anchorClass, $) {
  var anchor = $(anchorClass).parent().parent();
  var metaData = anchor.next().next();
  if (metaData.hasClass("api_metadata")) {
    var table = metaData.find(".changelog table tbody")
    if (table.length == 0) {
      data.versions.push({key: "当前版本", value: metaData.children().first().text()});
    }
    //读取版本列表
    else {
      table.children("tbody tr").each((index, item) => {
        if (index > 0) {
          var meta = $(item);
          data.versions.push({key: meta.children().first().text(), value: meta.children().first().next().text()});
        }
      });
    }

  }
}

//获取参数信息
function getParameterInformation(data, element, $) {
  var parameterlist = element.next().next().next();
  if (parameterlist.is("ul")) {
    parameterlist.children("li").each((index, item) => {
      console.log(index);
        data.parameters.push($(item).text().trim().replace("\n", ""));
    });
  }
}


//获取Api详情数据
function  getApiDetailInformation(data,element,$) {
  var content = parameterlist.nextUntil("h1,h2,h3,h4,h5");
  content.each((index, item) => {

    console.log($(item).text());
  })
}



