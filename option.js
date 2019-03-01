const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
const compression = require('compression'); //解析gzip格式文件 js,css
const history = require('connect-history-api-fallback'); //解析history路由模式项目
app.all('*', function(req, res, next) { // 解决跨域问题
  if(req.protocol == 'http') {
    let host = req.headers.host;
    host = host.replace(/\:\d+$/, ''); // Remove port number
    res.redirect(`https://${host}:3000${req.originalUrl}`);
    return
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  }
});
// Configuare https
const httpsOption = {
  key : fs.readFileSync(path.resolve(__dirname,"./ssl/guojiongwei.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "./ssl/guojiongwei.pem"))
}
app.use('/admin_demo_api', proxy({
  target: 'https://guojiongwei.com/admin_demo_api',
  pathRewrite: {'^/admin_demo_api' : '/'},
  changeOrigin: true
}))
app.use(history());
app.use(compression())
app.use(express.static(path.join(__dirname, '/admin')));//和上面是一样的
// 监听端口

var httpsServer = https.createServer(httpsOption,app);
var httpServer = http.createServer(app);
//https监听3000端口
httpsServer.listen(3000);
//http监听4000端口
httpServer.listen(4000);
