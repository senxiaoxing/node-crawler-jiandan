//引入第三方和通用模块
var fs = require('fs');//为了将抓取的图片存到本地，使用fs
var superagent = require('superagent');//引入superagent
require('superagent-proxy')(superagent);//引入代理
var cheerio = require('cheerio');//引入jquery实现
var mkdirp = require('mkdirp');
 
var filePath = './node/学习/sis/img/';//定义抓取妹子文件存放路径
//创建目录
mkdirp(filePath, function(err) {
    if(err){
        console.log(err);
    }
});
var count = 0;//记录抓取数量
var test = [];
//代理(在host前加上代理的账号密码xxxx:xxxx@)
const proxy = 'http://eproxy.sz.intech:3128';
//抓取一个页面的实现。
var getOnePage = function(url){
    //因为煎蛋对请求做了限制，所以将cookie加上了。如果你要访问该网站的话，可以通过浏览器查找cookie 并进行替换
    superagent.get(url)
    .proxy(proxy)
    .set({
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
    })
    .set('cookie','_ga=GA1.2.947901038.1533865806; _gid=GA1.2.2026719034.1533865806; _gat_gtag_UA_462921_3=1')
    .set({
        'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'connection' : 'keep-alive',
        'host' : 'jandan.net'
    })
    .end(function(err,sres){//这里是对获取的dom进行处理
        if(err)throw err;
        var $ = cheerio.load(sres.text);
        var nextUrl = $('.previous-comment-page').attr('href');//获得下一页的链接，为了开始下一次请求
        $('img').each(function(index,ele){//循环该页面的所有图片并得到对应的链接，放进数组。
            var u = '';
            if($(ele).attr('org_src')){
                u = $(ele).attr('org_src');
            }else{
                u = $(ele).attr('src');    
            }
            test.push(u);
            //通过superagent 获取图片数据，并保存到本地。
            superagent.get(u).proxy(proxy).end(function(err,sres){
                if(err)throw err;
                //根据访问路径获得文件名称
                var ttt = u.split('/');
                var name = ttt[ttt.length-1];
                var path = filePath+name
                fs.writeFile(path,sres.body,function(){
                    count++;
                    console.log(u);
                    console.log('已成功抓取..'+count+'张');
                });
            });
        });
        if(null != nextUrl && '' != nextUrl){ //何时开始下一次请求
            getOnePage(nextUrl);
        }
    }); 
 
};
 
getOnePage('http://jandan.net/ooxx/');//触发第一次请求开始
