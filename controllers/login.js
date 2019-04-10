const { Student } = require('../config/tableModal/user');        // 导入用户表模型

/**
 * 完成登录操作。
 * @author Tinybo
 * @date 2019 04 10
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function login (ctx, next) {
    ctx.response.type = 'json' // 设置数据返回格式
    let reqUrl = ctx.request.url;
    let reqData = reqUrl.split('?');
    reqData = reqData[1].split('&');
    let oriData = {};

    reqData.forEach(value => {
        let temp = value.split('=');
        oriData[temp[0]] = temp[1]; 
    });

    console.log('请求参数：', oriData);

    // 编写查询语句
    await Student.findAll({
        where: {
            phone: oriData['phone'],
            password: oriData['password']
        }
    }).then((data) => {
        if (data[0]) {
            console.log('已经成功找到该用户。');
            ctx.response.body = {
                code: '200',
                data: data[0].dataValues
            };
        } else {
            console.log('该用户不存在。');
            ctx.response.body = {
                code: '404',
                msg: '该用户不存在。'
            };
        } 
    }).catch((error) => {
        console.log('出错了：', error);
    });

    await next();
}

module.exports = {
    'GET /login': login
};