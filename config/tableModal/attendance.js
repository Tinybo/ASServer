const Sequelize = require('sequelize');         // 导入ORM框架
const config = require('../mysql');       // 导入数据库配置

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

// 课程主表
const CourseParent = sequelize.define('course_parent', {
    id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    name: Sequelize.STRING,
    tea_id: Sequelize.BIGINT,
    tea_name: Sequelize.STRING,
    num: Sequelize.STRING,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    phone: Sequelize.STRING,
    major: Sequelize.STRING,
    grade: Sequelize.STRING,
    class: Sequelize.STRING,
    createTime: Sequelize.DATE,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE,
    should_num: Sequelize.BIGINT,
    real_num: Sequelize.BIGINT,
    ask_leave_num: Sequelize.BIGINT,
    late_num: Sequelize.BIGINT,
    truancy_num: Sequelize.BIGINT,
    leave_early_num: Sequelize.BIGINT,
    address: Sequelize.STRING,
    type: Sequelize.BIGINT,
    isFinish: Sequelize.BIGINT
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

// 课程子表
const CourseChild = sequelize.define('course_child', {
    id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
    userId: Sequelize.BIGINT,
    course_id: Sequelize.BIGINT,
    name: Sequelize.STRING,
    course_name: Sequelize.STRING,
    num: Sequelize.STRING,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    phone: Sequelize.STRING,
    createTime: Sequelize.DATE,
    major: Sequelize.STRING,
    class: Sequelize.STRING,
    grade: Sequelize.STRING,
    type: Sequelize.BIGINT,
    status: Sequelize.BIGINT
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

module.exports = {
    CourseParent,
    CourseChild
}