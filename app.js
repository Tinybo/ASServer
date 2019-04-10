const Koa = require('koa');                     // 倒入Koa框架
const router = require('koa-router')();         // 集中处理URL
const bodyParser = require('koa-bodyparser');   // 处理post请求的body内容
const controller = require('./controller');     // 导入URL映射文件
const staticFiles = require('./static-files');  // 导入静态文件处理中间件
const templating = require('./templating');     // 导入模版引擎处理中间件
const isProduction = process.env.NODE_ENV === 'production'; // 开发环境下，关闭缓存，刷新浏览器即可看到效果
const Sequelize = require('sequelize');         // 导入ORM框架
const config = require('./config/mysql');       // 导入数据库配置

const app = new Koa(); // 创建一个Koa对象表示web app本身
app.use(bodyParser()); // 解析POST请求

// 处理静态文件
if (!isProduction) {
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// 记录URL日志
app.use(async (ctx, next) => {
    ctx.response.body = '<h2>fefjeife</h2>';
    await next();
    console.log(`Process ${ ctx.request.method } ${ ctx.request.url }`);
    var
        start = new Date().getTime(),
        execTime;
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));                        // 给app添加render函数
app.use(controller());      // 添加路由中间件

// 创建sequelize(ORM)实例
let sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 30000
        }
    }
);

// 创建连接数据库表的实例（对象模型）。
let Students = sequelize.define('student', {
    name: Sequelize.STRING(10),
    sex: Sequelize.STRING(2),
    age: Sequelize.BIGINT
}, {
    timestamps: false
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

// 数据库插入操作
(async () => {
    let stu = await Students.create({
        id: null,
        name: 'Hongdou',
        sex: 'W',
        age: 21
    });
})();

app.listen(3000);           // 监听3000端口
console.log('app started at port 3000...');