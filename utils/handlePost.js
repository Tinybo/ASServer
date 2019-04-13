/**
 * 处理 POST 传来的数据。
 * @author Tinybo
 * @date 2019 04 11
 * @param {*} ctx 上下文对象
 */
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postData = '';
            ctx.req.addListener('data', (data) => { // 有数据传入的时候
                postData += data;
            });
            ctx.req.on('end', () => {
                let parseData = parseQueryStr(postData);
                resolve(parseData);
            });
        } catch (e) {
            reject(e);
        }
    })
}

/**
 * 处理 string => json。
 * @author Tinybo
 * @date 2019 04 11
 * @param {*} ctx 上下文对象
 */
function parseQueryStr(queryStr) {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    for(let [index,queryStr] of queryStrList.entries()){
        let itemList = queryStr.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1]);
    }
    return queryData;
}

module.exports = {
    parsePostData
}