//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
    
//目标网址
var url = 'https://cnodejs.org/';
    
//本地存储目录
var dir = './images';

//代理(在host前加上代理的账号密码xxxx:xxxx@)
const proxy = 'http://eproxy.sz.intech:3128';
    
//创建目录
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});
    
//发送请求
request(url, {'proxy': proxy}, function(error, response, body) {
    if(!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        $('img').each(function() {
            var src = $(this).attr('src');
            if(src.indexOf("http") < 0){
                src = "http:" + src;
            }
            console.log('正在下载' + src);
            download(src, dir, Math.floor(Math.random()*100000) + '.jpg');//src.substr(-4,4)
            console.log('下载完成');
        });
    }
});
    
//下载方法
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url, {'proxy': proxy}).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};