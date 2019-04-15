const { StudentLeave, TeacherLeave } = require('../config/tableModal/leave');    // 导入请假表模型
const { parsePostData } = require('../utils/handlePost');    // 导入 POST 请求数据处理函数

/**
 * 完成填写请假条操作。
 * @author Tinybo
 * @date 2019 04 14
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function leave (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let createTime = new Date();                // 创建注册时间
    let dateTime = createTime.toLocaleDateString();
    let momentTime = createTime.toLocaleTimeString();

    console.log('请假条数据：', postData); // 输出接收到的请假条信息

    try {
        switch (postData.type) {
            case '1': result = await StudentLeave.create({
                name: postData.name,
                num: postData.num,
                sex: postData.sex,
                college: postData.college,
                department: postData.department,
                major: postData.major,
                class: postData.class,
                grade: postData.grade,
                position: postData.position,
                phone: postData.phone,
                qq: postData.qq,
                createTime: dateTime + ' ' + momentTime,
                startTime: postData.startTime + ' ' + postData.startMoment,
                endTime: postData.endTime + ' ' + postData.endMoment,
                reason: postData.reason,
                total: 0
            }); break;
            case '2': result = await TeacherLeave.create({
                name: '',
                num: '',
                sex: '',
                college: '',
                department: '',
                position: '',
                phone: postData.phone,
                create_time: createTime,
                total: 0,
                type: postData.type,
                isFinish: 1,
                password: postData.password
            }); break;
            default: break;
        }
        
        if (result.dataValues) {
            console.log('已经成功提交请假条。');
            let temp = result.dataValues;
            ctx.response.body = {
                code: '200',
                data: {
                    phone: temp['phone']
                }
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
            msg: '服务器异常（插入数据），提交请假条失败。'
        };
    }

    await next();
}

module.exports = {
    'POST /leave': leave
};