const { Student, Teacher, Office, Leader } = require('../config/tableModal/user');    // 导入用户表模型
const { parsePostData } = require('../utils/handlePost');    // 导入 POST 请求数据处理函数

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

    let Query = Student;
    switch (oriData['type']) {
        case '1': Query = Student; break;
        case '2': Query = Teacher; break;
        case '3': Query = Office; break;
        case '4': Query = Leader; break;
        default: break;
    }

    // 编写查询语句
    await Query.findAll({
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
                msg: '账号或密码错误！'
            };
        } 
    }).catch((error) => {
        console.log('出错了：', error);
    });

    await next();
}

/**
 * 完成注册操作。
 * @author Tinybo
 * @date 2019 04 11
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function register (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let createTime = new Date();                // 创建注册时间
    let result = '';
    let canNext = false;

    console.log(postData.type);

    let Query = Student;
    switch (postData['type']) {
        case '1': Query = Student; break;
        case '2': Query = Teacher; break;
        case '3': Query = Office; break;
        case '4': Query = Leader; break;
        default: break;
    }
    
    try {
        // 检查该用户是否存在
        await Query.findAll({
            where: {
                phone: postData['phone'],
                password: postData['password']
            }
        }).then((data) => {
            if (data[0]) {
                console.log('该手机号已被注册！');
                ctx.response.body = {
                    code: '404',
                    msg: '该手机号已被注册！'
                };
                return;
            } else {
                canNext = true;
            }
        }).catch((error) => {
            console.log('出错了：', error);
        });
        // 编写注册插入语句
        if (canNext) {
            switch (postData.type) {
                case '1': result = await Student.create({
                    stu_name: '',
                    num: '',
                    sex: '',
                    college: '',
                    department: '',
                    major: '',
                    class: '',
                    grade: '',
                    position: '',
                    phone: postData.phone,
                    qq: '',
                    create_time: createTime,
                    total: 0,
                    type: postData.type,
                    isFinish: 1,
                    password: postData.password
                }); break;
                case '2': result = await Teacher.create({
                    tea_name: '',
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
                case '3': result = await Office.create({
                    off_name: '',
                    num: '',
                    sex: '',
                    college: '',
                    department: '',
                    phone: postData.phone,
                    qq: '',
                    create_time: createTime,
                    total: 0,
                    type: postData.type,
                    isFinish: 1,
                    password: postData.password
                }); break;
                case '4': result = await Leader.create({
                    lea_name: '',
                    num: '',
                    college: '',
                    department: '',
                    phone: postData.phone,
                    total: 0,
                    type: postData.type,
                    isFinish: 1,
                    password: postData.password
                }); break;
                default: break;
            }
            
            if (result.dataValues) {
                console.log('已经成功注册。');
                let temp = result.dataValues;
                ctx.response.body = {
                    code: '200',
                    data: {
                        phone: temp['phone'],
                        isFinish: temp['isFinish']
                    }
                };
            } else {
                console.log('注册失败。');
                ctx.response.body = {
                    code: '404',
                    msg: '服务器异常，注册失败。'
                };
            } 
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
 * 完成完善信息操作。
 * @author Tinybo
 * @date 2019 04 12
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function perfectInfo (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let createTime = new Date();                // 创建注册时间
    let result = '';
    let oriId = '';
    let oriName = '';

    // 统一数据命名(id)
    oriId = postData.id;
    oriId = oriId ? oriId : postData.stu_id;
    oriId = oriId ? oriId : postData.tea_id;
    oriId = oriId ? oriId : postData.off_id;
    oriId = oriId ? oriId : postData.lea_id;

    // 统一数据命名(name)
    oriName = postData.name;
    oriName = oriName ? oriName : postData.stu_name;
    oriName = oriName ? oriName : postData.tea_name;
    oriName = oriName ? oriName : postData.off_name;
    oriName = oriName ? oriName : postData.lea_name;

    console.log(postData);

    try {
        // 编写注册插入语句
        switch (postData.type) {
            case '1': result = await Student.update({
                stu_name: oriName,
                num: postData.num,
                sex: postData.sex,
                age: postData.age,
                college: postData.college,
                department: postData.department,
                major: postData.major,
                class: postData.class,
                grade: postData.grade,
                position: postData.position,
                qq: postData.qq,
                create_time: createTime,
                total: 0,
                isFinish: 2
            }, {
                where: {
                    stu_id: oriId
                }
            }); break;
            case '2': result = await Teacher.update({
                tea_name: oriName,
                num: postData.num,
                sex: postData.sex,
                age: postData.age,
                college: postData.college,
                department: postData.department,
                position: postData.position,
                phone: postData.phone,
                create_time: createTime,
                total: 0,
                type: postData.type,
                isFinish: 2,
            }, {
                where: {
                    tea_id: oriId
                }
            }); break;
            case '3': result = await Office.update({
                off_name: oriName,
                num: postData.num,
                sex: postData.sex,
                age: postData.age,
                college: postData.college,
                department: postData.department,
                position: postData.position,
                phone: postData.phone,
                create_time: createTime,
                total: 0,
                type: postData.type,
                isFinish: 2,
            }, {
                where: {
                    off_id: oriId
                }
            }); break;
            case '4': result = await Leader.update({
                lea_name: oriName,
                num: postData.num,
                sex: postData.sex,
                age: postData.age,
                college: postData.college,
                department: postData.department,
                position: postData.position,
                phone: postData.phone,
                create_time: createTime,
                total: 0,
                type: postData.type,
                isFinish: 2,
            }, {
                where: {
                    lea_id: oriId
                }
            }); break;
            default: break;
        }

        console.log('result', result);
        
        if (result) {
            console.log('已经完善成功。');
    
            ctx.response.body = {
                code: '200',
                data: {
                    type: postData.type,
                    id: oriId,
                    name: oriName,
                    num: postData.num,
                    sex: postData.sex,
                    college: postData.college,
                    department: postData.department,
                    major: postData.major,
                    class: postData.class,
                    grade: postData.grade,
                    position: postData.position,
                    qq: postData.qq,
                    phone: postData.phone,
                    age: postData.age,
                    isFinish: 2
                }
            };
        } else {
            console.log('完善信息失败。');
            ctx.response.body = {
                code: '404',
                msg: '服务器异常，完善信息失败。'
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

module.exports = {
    'GET /login': login,
    'POST /register': register,
    'POST /perfectInfo': perfectInfo
};