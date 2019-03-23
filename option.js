const express = require('express');
const app = express();
const path = require('path');
const proxy = require('http-proxy-middleware');
const compression = require('compression'); //解析gzip格式文件 js,css
const history = require('connect-history-api-fallback'); //解析history路由模式项目
app.all('*', function(req, res, next) { // 解决跨域问题
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use('/admin_demo_api', proxy({
  target: 'https://guojiongwei.com/admin_demo_api',
  pathRewrite: {'^/admin_demo_api' : '/'},
  changeOrigin: true
}))
app.use(history());
app.use(compression())
app.use(express.static(path.join(__dirname, '/dist')));//和上面是一样的
// 监听端口
app.listen(3000, '0.0.0.0', () => {
 console.log(`server running localhost:3000`);
});
