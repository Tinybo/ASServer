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
const Student = sequelize.define('student', {
    stu_id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
    stu_name: Sequelize.STRING,
    num: Sequelize.STRING,
    sex: Sequelize.STRING,
    age: Sequelize.BIGINT,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    major: Sequelize.STRING,
    class: Sequelize.STRING,
    grade: Sequelize.STRING,
    position: Sequelize.STRING,
    phone: Sequelize.STRING,
    qq: Sequelize.STRING,
    create_time: Sequelize.DATE,
    new_time: Sequelize.DATE,
    total: Sequelize.BIGINT,
    type: Sequelize.BIGINT,
    isFinish: Sequelize.BIGINT,
    password: Sequelize.STRING
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

// 教师用户表映射模型
const  Teacher = sequelize.define('teacher', {
    tea_id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
    tea_name: Sequelize.STRING,
    num: Sequelize.STRING,
    sex: Sequelize.STRING,
    age: Sequelize.BIGINT,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    position: Sequelize.STRING,
    create_time: Sequelize.DATE,
    new_time: Sequelize.DATE,
    total: Sequelize.BIGINT,
    type: Sequelize.BIGINT,
    isFinish: Sequelize.BIGINT,
    phone: Sequelize.STRING,
    password: Sequelize.STRING
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

// 学工办用户表映射模型
const  Office = sequelize.define('office', {
    off_id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
    off_name: Sequelize.STRING,
    num: Sequelize.STRING,
    sex: Sequelize.STRING,
    age: Sequelize.BIGINT,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    position: Sequelize.STRING,
    phone: Sequelize.STRING,
    create_time: Sequelize.DATE,
    new_time: Sequelize.DATE,
    type: Sequelize.BIGINT,
    isFinish: Sequelize.BIGINT,
    password: Sequelize.STRING,
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

// 学院领导用户表映射模型
const Leader = sequelize.define('leader', {
    lea_id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
    lea_name: Sequelize.STRING,
    college: Sequelize.STRING,
    department: Sequelize.STRING,
    position: Sequelize.STRING,
    num: Sequelize.STRING,
    sex: Sequelize.STRING,
    age: Sequelize.BIGINT,
    phone: Sequelize.STRING,
    type: Sequelize.BIGINT,
    isFinish: Sequelize.BIGINT,
    password: Sequelize.STRING,
    create_time: Sequelize.DATE,
}, {
    timestamps: false,
    freezeTableName: true
}, function(require, factory) {
    'use strict';
    console.log('ORM已完成！');
});

module.exports = {
    Student,
    Teacher,
    Office,
    Leader
}