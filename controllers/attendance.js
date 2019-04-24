const { CourseParent, CourseChild } = require('../config/tableModal/attendance');    // 导入请假表模型
const { Student } = require('../config/tableModal/user');    // 导入请假表模型
const { parsePostData } = require('../utils/handlePost');    // 导入 POST 请求数据处理函数
const { handleValue } = require('../utils/handleData');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const config = require('../config/mysql');       // 导入数据库配置

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
            address: postData.address,
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

/**
 * 完成签到操作。
 * @author Tinybo
 * @date 2019 04 20
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function signIn (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据
    let createTime = new Date();                // 创建注册时间
    let dateTime = createTime.toLocaleDateString();
    let momentTime = createTime.toLocaleTimeString();

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        let hasRecordCombine = false;

        // 1. 判断该学校-系别-专业-年级-班级是否被保存过。
        let string = postData.college + '-' + postData.department + '-' + postData.major + '-' + postData.grade + '-' + postData.class; 
        await CourseParent.findAll({
            where: {
                combine_string: { $like:'%' + string + '%' },
                id: postData.course_id
            }
        }).then((data) => {
            if (data[0]) {
                hasRecordCombine = true;
            }
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });

        console.log('是否有：', hasRecordCombine);
        // 2. 如果没有，则将该值插入到 course_parent，并查找该学校-系别-专业-年级-班级的所有学生。
        if (!hasRecordCombine) {
            // 将组合值插入到 course_parent
            await CourseParent.update({
                tea_id: postData.tea_id,
                tea_name: postData.tea_name,
                name: postData.course_name,
                department: '',
                major: '',
                grade: '',
                class: '',
                combine_string: Sequelize.fn("concat", Sequelize.col("combine_string"), string + ';'), 
            },{
                where: {
                    id: postData.course_id
                }
            });

            // 3. 查找同专业、同年级、同班级的所有学生
            let allStudents = [];
            await Student.findAll({
                where: {
                    college: postData.college,
                    department: postData.department,
                    major: postData.major,
                    grade: postData.grade,
                    class: postData.class
                }
            }).then((data) => {
                if (data[0]) {
                    allStudents = handleValue(data);
                } else {
                    console.log('该专业，年级，班级的同学没有！');
                    ctx.response.body = {
                        code: '404',
                        msg: string + '：没有学生！'
                    };
                } 
            }).catch((error) => {
                ctx.response.body = {
                    code: '404',
                    msg: '错误原因：' + error
                };
            });

            // 4. 将所有学生插入到课堂子表。
            console.log('allStudents', allStudents.length);
            allStudents.forEach(async (x) => {
                let status = x.stu_id == postData.userId ? 1 : 0;
                await CourseChild.create({
                    userId: x.stu_id,
                    course_id: postData.course_id,
                    stu_name: x.stu_name,
                    course_name: postData.course_name,
                    tea_id: postData.tea_id,
                    tea_name: postData.tea_name,
                    num: x.num,
                    college: x.college,
                    department: x.department,
                    phone: x.phone,
                    createTime: dateTime + ' ' + momentTime,
                    major: x.major,
                    grade: x.grade,
                    class: x.class,
                    status: status
                }).then((data) => {
                    if (data) {
                        console.log(x.stu_name + ' 已经成功签到。');
                    } else {
                        console.log(x.stu_name + ' 签到失败。');
                    } 
                }).catch((error) => {
                    ctx.response.body = {
                        code: '404',
                        msg: '插入到学生信息到子表出错：' + error
                    };
                });
            });
        } else {
            // 更改该学生的签到状态
            await CourseChild.update({
                userId: postData.userId,
                course_id: postData.course_id,
                course_name: postData.course_name,
                num: postData.num,
                college: postData.college,
                department: postData.department,
                phone: postData.phone,
                createTime: dateTime + ' ' + momentTime,
                major: postData.major,
                grade: postData.grade,
                class: postData.class,
                status: 1
            },{
                where: {
                    userId: postData.userId,
                    course_id: postData.course_id
                }
            }).then((data) => {
                if (data) {
                    console.log(postData.stu_name + ' 已经成功签到。');
                } else {
                    console.log(postData.stu_name + ' 签到失败。');
                } 
            }).catch((error) => {
                ctx.response.body = {
                    code: '404',
                    msg: '更改学生状态出错：' + error
                };
            });
        }

        // 5. 更改实到人数, 总人数可以最后保存时更新
        await CourseParent.findById(postData.course_id).then(function(user){
            user.increment('real_num').then(function(user){
                console.log(postData.stu_name + ' 已经成功签到。');
                ctx.response.body = {
                    code: '200',
                    data: {
                        stu_id: postData.userId
                    }
                };
            }).catch((error) => {
                ctx.response.body = {
                    code: '404',
                    msg: '错误原因1：' + error
                };
            });
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因2：' + error
            };
        });

        ctx.response.body = {
            code: '200',
            data: {
                stu_id: postData.userId
            }
        };
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因3：' + error
        };
    }

    await next();
}

/**
 * 完成获取所有课堂操作。
 * @author Tinybo
 * @date 2019 04 21
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function getAllCourse (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        // 根据教师ID查找所有课程
        await CourseParent.findAll({
            where: {
                tea_id: postData.tea_id
            }
        }).then((data) => {
            if (data[0]) {
                console.log('已经成功找到所有课程。');

                ctx.response.body = {
                    code: '200',
                    data: data
                };
            } else {
                console.log('该课程不存在！');
                ctx.response.body = {
                    code: '404',
                    msg: '无课程！'
                };
            } 
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 完成获取某堂课的某个班的所有学生操作。
 * @author Tinybo
 * @date 2019 04 22
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function getAllStudent (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        // 根据教师ID查找所有学生
        await CourseChild.findAll({
            where: {
                course_id: postData.course_id,
                college: postData.college,
                department: postData.department,
                major: postData.major,
                grade: postData.grade,
                class: postData.class
            }
        }).then((data) => {
            if (data[0]) {
                console.log('已经成功找到所有学生。');

                ctx.response.body = {
                    code: '200',
                    data: data
                };
            } else {
                console.log('该班级学生不存在！');
                ctx.response.body = {
                    code: '200',
                    data: []
                };
            } 
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 设置学生的到课状态。
 * @author Tinybo
 * @date 2019 04 23
 * @param {*} ctx 上下文对象
 * @param {*} next 程序控制对象
 */
async function setStudentStatus (ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        // 根据教师ID查找所有课程
        // 更改该学生的签到状态
        await CourseChild.update({
            userId: postData.stu_id,
            course_id: postData.course_id,
            course_name: postData.course_name,
            num: postData.num,
            college: postData.college,
            department: postData.department,
            phone: postData.phone,
            createTime: postData.createTime,
            major: postData.major,
            grade: postData.grade,
            class: postData.class,
            status: postData.status
        },{
            where: {
                userId: postData.stu_id,
                course_id: postData.course_id
            }
        }).then((data) => {
            if (data) {
                ctx.response.body = {
                    code: '200',
                    data: postData
                };
            } else {
                ctx.response.body = {
                    code: '404',
                    msg: '更改学生状态出错：' + error
                };
            } 
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '更改学生状态出错：' + error
            };
        });
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 结束课堂。
 * @author Tinybo
 * @date 2019 04 24
 * @param {*} ctx 
 * @param {*} next 
 */
async function endCourse(ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        let allStu = [];
        // 1. 根据课堂ID查找所有学生
        await CourseChild.findAll({
            where: {
                course_id: postData.course_id,
                status: 0
            }
        }).then((data) => {
            if (data[0]) {
                allStu = handleValue(data);
            }
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });

        // 2. 更改该学生的签到状态
        if (allStu[0]) {
            // 2. 更改该学生的签到状态
            allStu.forEach(async (x) => {
                await CourseChild.update({
                    userId: x.userId,
                    course_id: x.course_id,
                    course_name: x.course_name,
                    num: x.num,
                    college: x.college,
                    department: x.department,
                    phone: x.phone,
                    createTime: x.createTime,
                    major: x.major,
                    grade: x.grade,
                    class: x.class,
                    status: 5
                },{
                    where: {
                        userId: x.userId,
                        course_id: x.course_id
                    }
                }).then((data) => {
                    if (data) {
                        console.log(x.stu_name + ' 已经设置为旷课。');
                    } else {
                        ctx.response.body = {
                            code: '404',
                            msg: '更改学生状态出错：' + error
                        };
                    } 
                }).catch((error) => {
                    ctx.response.body = {
                        code: '404',
                        msg: '更改学生状态出错：' + error
                    };
                });
            })
        }

        // 3. 结束课堂
        await CourseParent.update({
            isFinish: 1
        },{
            where: {
                id: postData.course_id
            }
        }).then(data => {
            ctx.response.body = {
                code: '200',
                data: postData
            };
            console.log('设置课堂为结束状态。', data)
        }).catch(error => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        }); 
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 结束课堂。
 * @author Tinybo
 * @date 2019 04 24
 * @param {*} ctx 
 * @param {*} next 
 */
async function endCourse(ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        let allStu = [];
        // 1. 根据课堂ID查找所有学生
        await CourseChild.findAll({
            where: {
                course_id: postData.course_id,
                status: 0
            }
        }).then((data) => {
            if (data[0]) {
                allStu = handleValue(data);
            }
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });

        // 2. 更改该学生的签到状态
        if (allStu[0]) {
            // 2. 更改该学生的签到状态
            allStu.forEach(async (x) => {
                await CourseChild.update({
                    userId: x.userId,
                    course_id: x.course_id,
                    course_name: x.course_name,
                    num: x.num,
                    college: x.college,
                    department: x.department,
                    phone: x.phone,
                    createTime: x.createTime,
                    major: x.major,
                    grade: x.grade,
                    class: x.class,
                    status: 5
                },{
                    where: {
                        userId: x.userId,
                        course_id: x.course_id
                    }
                }).then((data) => {
                    if (data) {
                        console.log(x.stu_name + ' 已经设置为旷课。');
                    } else {
                        ctx.response.body = {
                            code: '404',
                            msg: '更改学生状态出错：' + error
                        };
                    } 
                }).catch((error) => {
                    ctx.response.body = {
                        code: '404',
                        msg: '更改学生状态出错：' + error
                    };
                });
            })
        }

        // 3. 结束课堂
        await CourseParent.update({
            isFinish: 1
        },{
            where: {
                id: postData.course_id
            }
        }).then(data => {
            ctx.response.body = {
                code: '200',
                data: postData
            };
            console.log('设置课堂为结束状态。', data)
        }).catch(error => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        }); 
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 获取考勤统计信息。
 * @author Tinybo
 * @date 2019 04 24
 * @param {*} ctx 
 * @param {*} next 
 */
async function getStatistic(ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('统计请求参数', postData); // 输出接收到的请假条信息

    let condition = {};

    if (postData.type == '1') {
        condition = {
            userId: postData.userId
        }
    } else {
        condition = {
            tea_id: postData.userId
        }
    }

    console.log('统计条件：', condition);

    // 编写查询语句
    try {
        // 1. 根据课堂ID查找所有学生
        await CourseChild.findAll({
            where: condition
        }).then((data) => {
            if (data[0]) {
                ctx.response.body = {
                    code: '200',
                    data: data
                };
            }
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

/**
 * 获取学生到课信息。
 * @author Tinybo
 * @date 2019 04 24
 * @param {*} ctx 
 * @param {*} next 
 */
async function getCourseInfo(ctx, next) {
    ctx.response.type = 'json';                 // 设置数据返回格式
    let postData = await parsePostData(ctx);    // 获取请求数据

    console.log('请求参数', postData); // 输出接收到的请假条信息

    // 编写查询语句
    try {
        // 1. 根据课堂ID查找所有学生
        await CourseChild.findAll({
            where: {
                course_id: postData.course_id,
                userId: postData.stu_id
            }
        }).then((data) => {
            if (data[0]) {
                ctx.response.body = {
                    code: '200',
                    data: data
                };
            }
        }).catch((error) => {
            ctx.response.body = {
                code: '404',
                msg: '错误原因：' + error
            };
        });
    } catch (error) {
        ctx.response.body = {
            code: '404',
            msg: '错误原因：' + error
        };
    }

    await next();
}

module.exports = {
    'POST /createCourse': createCourse,
    'POST /searchCourse': searchCourse,
    'POST /signIn': signIn,
    'POST /getAllCourse': getAllCourse,
    'POST /getAllStudent': getAllStudent,
    'POST /setStudentStatus': setStudentStatus,
    'POST /endCourse': endCourse,
    'POST /getCourseInfo': getCourseInfo,
    'POST /getStatistic': getStatistic
};