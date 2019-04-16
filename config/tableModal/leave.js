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

// 学生用户表映射模型
const StudentLeave = sequelize.define('student_leave', {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    num: Sequelize.STRING,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    major: Sequelize.STRING,
    class: Sequelize.STRING,
    grade: Sequelize.STRING,
    position: Sequelize.STRING,
    phone: Sequelize.STRING,
    qq: Sequelize.STRING,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE,
    createTime: Sequelize.DATE,
    isSuccess: Sequelize.BIGINT,
    off_opinion: Sequelize.BIGINT,
    department_opinion: Sequelize.BIGINT,
    note: Sequelize.STRING,
    cancel_leave: Sequelize.BIGINT,
    reason: Sequelize.STRING,
    userId: Sequelize.BIGINT,
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

// 教师用户表映射模型
const TeacherLeave = sequelize.define('teacher_leave', {
    id: { type: Sequelize.STRING, primaryKey: true },
    name: Sequelize.STRING,
    num: Sequelize.STRING,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    position: Sequelize.STRING,
    phone: Sequelize.STRING,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE,
    createTime: Sequelize.DATE,
    isSuccess: Sequelize.BIGINT,
    department_opinion: Sequelize.BIGINT,
    note: Sequelize.STRING,
    cancel_leave: Sequelize.BIGINT,
    reason: Sequelize.STRING,
    userId: Sequelize.STRING
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

module.exports = {
    StudentLeave,
    TeacherLeave,
}