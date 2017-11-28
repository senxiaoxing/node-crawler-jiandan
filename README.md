# node-crawler-jiandan
用superagent和cheerio和fs抓取http://jiandan.net/ooxx/ ![煎蛋主頁圖片](http://jandan.net/ooxx/)  
  
1.通过superagent 获取目标网站的dom  
2.通过cheerio对dom进行解析，获得通用布局。  
3.如果只是爬取一个页面，则可以直接将目标页面的目标元素获取。  
4.如果是分页或者多个页面，可以通过循环获得目标链接，进行多次抓取。  
***
## notice:
對於該網站，無意冒犯，只做學習用
