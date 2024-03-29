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
                userId: postData.id,
                off_opinion: 0,
                department_opinion: 0,
                isSuccess: 0,
                cancel_leave: 0
            }); break;
            case '2': result = await TeacherLeave.create({
                name: postData.name,
                num: postData.num,
                sex: postData.sex,
                college: postData.college,
                department: postData.department,
                position: postData.position,
                phone: postData.phone,
                createTime: dateTime + ' ' + momentTime,
                startTime: postData.startTime + ' ' + postData.startMoment,
                endTime: postData.endTime + ' ' + postData.endMoment,
                reason: postData.reason,
                userId: postData.id,
                department_opinion: 0,
                isSuccess: 0,
                cancel_leave: 0
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
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 销假。
 * @author Tinybo
 * @date 2019 04 16
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function cancelLeave (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let result = '';

    console.log('销假数据：', postData);            // 输出接收到的请假条信息

    try {
        switch (postData.type) {
            case '1': result = await StudentLeave.update({
                cancel_leave: 1,
                isSuccess: 3
            }, {
                where: {
                    id: postData.id,
                    userId: postData.userId
                }
            }); break;
            case '2': result = await TeacherLeave.update({
                cancel_leave: 1,
                isSuccess: 3
            }, {
                where: {
                    id: postData.id,
                    userId: postData.userId, 
                }
            }); break;
            default: break;
        }

        if (result) {
            console.log('已经成功销假。');
            ctx.response.body = {
                code: '200',
                data: {
                    id: postData.id,
                    userId: postData.userId
                }
            };
        } else {
            console.log('销假失败。');
            ctx.response.body = {
                code: '404',
                msg: '服务器异常，销假失败。'
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
 * 查询请假条。
 * @author Tinybo
 * @date 2019 04 15
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function getLeaveNote (ctx, next) {
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

    let Query = StudentLeave;
    switch (oriData['type']) {
        case '1': Query = StudentLeave; break;
        case '2': Query = TeacherLeave; break;
        default: break;
    }

    try {
        // 编写查询语句
        await Query.findAll({
            where: {
                userId: oriData['userId'],
                num: oriData['num'],
            }
        }).then((data) => {
            if (data[0]) {
                console.log('已经成功找到该用户。');
                ctx.response.body = {
                    code: '200',
                    data: data
                };
            } else {
                console.log('该用户不存在。');
                ctx.response.body = {
                    code: '404',
                    msg: '账号或密码错误！'
                };
            } 
        }).catch((error) => {
            console.log('出错了：', error);
        });
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
 * 获取所有请假条。
 * @author Tinybo
 * @date 2019 04 18
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function getAllLeave (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let result = '';

    console.log('请求数据：', postData);          // 输出接收到的请假条信息

    let Query = StudentLeave;
    switch (postData['type']) {
        case '3': Query = StudentLeave; break;
        case '4': Query = TeacherLeave; break;
        default: break;
    }

    if (postData['userType'] == 'teacher') {
        Query = TeacherLeave;
    }

    // 处理判断条件
    let condition = postData['department'] ? {
        college: postData['college'],
        department: postData['department'],
    } : {
        college: postData['college']
    }

    try {
        // 编写查询语句
        await Query.findAll({
            where: condition
        }).then((data) => {
            if (data[0]) {
                console.log('已经成功找到所有请假条。');
                ctx.response.body = {
                    code: '200',
                    data: data
                };
            } else {
                console.log('请假条查找失败。');
                ctx.response.body = {
                    code: '404',
                    msg: '请假条查找失败。'
                };
            } 
        }).catch((error) => {
            console.log('出错了：', error);
        });
    } catch (error) {
        console.log('查询数据异常。');
        ctx.response.body = {
            code: '404',
            msg: '服务器异常（查询数据），请假条查找失败。。'
        };
    }

    await next();
}

/**
 * 批假。
 * @author Tinybo
 * @date 2019 04 18
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function passLeave (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let result = '';

    console.log('批假数据：', postData);            // 输出接收到的请假条信息

    try {
        switch (postData.type) {
            case '3': result = await StudentLeave.update({
                off_opinion: 1,
                isSuccess: 1
            }, {
                where: {
                    id: postData.id,
                    userId: postData.userId
                }
            }); break;
            case '4': result = await TeacherLeave.update({
                department_opinion: 1,
                isSuccess: 1
            }, {
                where: {
                    id: postData.id,
                    userId: postData.userId, 
                }
            }); break;
            default: break;
        }

        if (result) {
            console.log('已经成功批假。');
            ctx.response.body = {
                code: '200',
                data: {
                    id: postData.id,
                    userId: postData.userId
                }
            };
        } else {
            console.log('批假失败。');
            ctx.response.body = {
                code: '404',
                msg: '服务器异常，批假失败。'
            };
        } 
    } catch (error) {
        console.log('更新数据异常。');
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 拒绝请假。
 * @author Tinybo
 * @date 2019 04 19
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function rejectLeave (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let result = '';

    console.log('拒绝请假数据：', postData);            // 输出接收到的请假条信息

    try {
        switch (postData.type) {
            case '3': result = await StudentLeave.update({
                off_opinion: 2,
                isSuccess: 2,
                note: postData.note
            }, {
                where: {
                    id: postData.id,
                    userId: postData.userId
                }
            }); break;
            case '4': result = await TeacherLeave.update({
                department_opinion: 2,
                isSuccess: 2,
                note: postData.note
            }, {
                where: {
                    id: postData.id,
                    userId: postData.userId
                }
            }); break;
            default: break;
        }

        if (result) {
            console.log('已经成功拒绝。');
            ctx.response.body = {
                code: '200',
                data: {
                    id: postData.id,
                    userId: postData.userId
                }
            };
        } else {
            console.log('拒绝请假失败。');
            ctx.response.body = {
                code: '404',
                msg: '服务器异常，拒绝请假失败。'
            };
        } 
    } catch (error) {
        console.log('更新数据异常。');
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

module.exports = {
    'POST /leave': leave,
    'GET /getLeaveNote': getLeaveNote,
    'POST /getAllLeave': getAllLeave,
    'POST /cancelLeave': cancelLeave,
    'POST /passLeave': passLeave,
    'POST /rejectLeave': rejectLeave,
};