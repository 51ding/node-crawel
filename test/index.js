
var cheerio=require("cheerio");

var fs=require("fs");

(
	async ()=>{
		fs.readFile("./index.html","utf8",(err,data)=>{
			if(err) return 
			 var $=cheerio.load(data);
			 formData($);
		})
	}
)()


function formData($){
	var level=level;
	$("#toc >ul >li >ul >li").each((index,item)=>{
		var me=$(item);
		var title=me.children().first().text();
		console.log(`标题:${title}`);
	  var child=me.children().first().next();
	  getChild(child,1,$);
	  
	})
}

function getChild(child,ok,$){
	var level=ok;
	if(child.is("ul")){
		  level++;
	  	child.children("li").each((t,s)=>{
	  		var me=$(s);
	  		var content=$(s).find("span").first().text();
	  		var space=""
	  		for(var i=0;i<level;i++)
	  			space+=" ";
	  		console.log(space+content);
	  		getChild(me.children().first().next(),level,$);
	  	})
	  	
	 }
}

