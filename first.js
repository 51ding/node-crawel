var puppeteer = require("puppeteer");
var {initDatabase, initSchema} = require("./init");
var mongoose = require("mongoose");
var {sleep,saveApi,formData,getPage,saveApiContent} = require("./util");
var cheerio = require("cheerio");

(async () => {
  await initDatabase();
  await initSchema();
  console.log("初始化完成！");
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    dumpio: false,
    networkIdleTimeout: 5000
  })
  // const page = await browser.newPage();
  // await page.goto("http://nodejs.cn/api/", {waitUntil: 'networkidle2'});
  // await sleep(1000);
  // const bodyHandle = await page.$('body');
  // var result=await page.evaluate(body => {
  //   var html=body.innerHTML;
  //   var host=window.location.host;
  //   var protocol=window.location.protocol;
  //   return {
  //     html,
  //     host,
  //     protocol
  //   }
  // }, bodyHandle);
  var result=await getPage(browser,"http://nodejs.cn/api/");
  await saveApi(result);
  await saveApiContent(browser);

 // await formData();


})()

