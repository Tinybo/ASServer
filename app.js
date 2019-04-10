const Koa = require('koa');                                // 倒入Koa框架
const router = require('koa-router')();             // 集中处理URL
const bodyParser = require('koa-bodyparser');   // 处理post请求的body内容
const controller = require('./controller');     // 导入URL映射文件
const staticFiles = require('./static-files');  // 导入静态文件处理中间件
const templating = require('./templating');     // 导入模版引擎处理中间件
const isProduction = process.env.NODE_ENV === 'production';     // 开发环境下，关闭缓存，刷新浏览器即可看到效果
const { Student } = require('./config/tableModal/user');        // 导入用户表模型
const cors = require('koa-cors')            // 解决跨域问题

const app = new Koa(); // 创建一个Koa对象表示web app本身
app.use(bodyParser()); // 解析POST请求
app.use(cors());

// 处理静态文件
if (!isProduction) {
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// 记录URL日志
app.use(async (ctx, next) => {
    // 设置Content-Type:
    ctx.response.type = 'application/json';
    // 设置Response Body:
    ctx.response.body = {
        products: 'bob'
    };
    /* ctx.response.body = '<h2>fefjeife</h2>';
    await next();
    console.log(`Process ${ ctx.request.method } ${ ctx.request.url }`);
    var
        start = new Date().getTime(),
        execTime;
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); */
});

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));                        // 给app添加render函数
app.use(controller());      // 添加路由中间件

// 数据库插入操作
/* (async () => {
    let stu = await Student.create({
        stu_name: 'Bob',
        num: '201517030234',
        sex: '男',
        age: 21,
        college: '湖南文理学院',
        department: '计算机与电气工程学院',
        major: '网络工程',
        class: '2',
        grade: '15',
        phone: '18711787678',
        qq: '1069792236',
        type: 1,
        isFinish: 0
    });
})(); */

(async () => {
    Student.findAll({
        where: {
            phone: '666',
            password: '666'
        }
    }).then((data) => {
        if (data[0]) {
            console.log('返回结果：', data[0].dataValues);
        } else {
            console.log('没找到该用户。');
        }
        
    }).catch((error) => {
        console.log('出错了：', error);
    });
})();

app.listen(3001);           // 监听3001端口
console.log('app started at port 3001...');