const { CourseParent, CourseChild } = require('../config/tableModal/attendance');    // 导入请假表模型
const { parsePostData } = require('../utils/handlePost');    // 导入 POST 请求数据处理函数

/**
 * 完成填写课堂表操作。
 * @author Tinybo
 * @date 2019 04 14
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function createCourse (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let createTime = new Date();                // 创建注册时间
    let dateTime = createTime.toLocaleDateString();
    let momentTime = createTime.toLocaleTimeString();

    console.log('课堂表数据：', postData); // 输出接收到的请假条信息

    try {
        result = await CourseParent.create({
            tea_id: postData.userId,
            tea_name: postData.tea_name,
            name: postData.name,
            num: postData.num,
            college: postData.college,
            department: '',
            major: '',
            grade: '',
            class: '',
            position: postData.position,
            phone: postData.phone,
            createTime: dateTime + ' ' + momentTime,
            address: postData.addrss,
            isFinish: 0
        });
        
        if (result.dataValues) {
            console.log('已经成功提交请假条。');
            let temp = result.dataValues;
            ctx.response.body = {
                code: '200',
                data: temp
            };
        } else {
            console.log('提交请假条失败。');
            ctx.response.body = {
                code: '404',
                msg: '服务器异常，提交请假条失败。'
            };
        } 
    } catch (error) {
        console.log('插入数据异常。');
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 完成搜索课堂操作。
 * @author Tinybo
 * @date 2019 04 20
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function searchCourse (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let createTime = new Date();                // 创建注册时间
    let dateTime = createTime.toLocaleDateString();
    let momentTime = createTime.toLocaleTimeString();

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    await CourseParent.findAll({
        where: {
            id: postData.courseId
        }
    }).then((data) => {
        if (data[0]) {
            console.log('已经成功找到该课堂。');
            ctx.response.body = {
                code: '200',
                data: data[0]
            };
        } else {
            console.log('该用户不存在。');
            ctx.response.body = {
                code: '404',
                msg: '该课堂不存在！'
            };
        } 
    }).catch((error) => {
        console.log('出错了：', error);
    });

    await next();
}

module.exports = {
    'POST /createCourse': createCourse,
    'POST /searchCourse': searchCourse
};