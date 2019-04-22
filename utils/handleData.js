/**
 * 处理数据库返回的数据格式。
 * @author Tinybo
 * @date 2019 04 22
 * @param {*} arr 
 */
function handleValue (arr) {
    let result = [];
    arr.forEach(x => {
        result.push(x.dataValues);
    })

    return result;
}

module.exports = {
    handleValue
}