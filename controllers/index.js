let { home } = require('./home');
let { login } = require('./login');

async function about (ctx, next) {
    ctx.response.body = '<h1>Hello, welcome to about.</h1>';
    await next();
}

async function signIn (ctx, next) {
    let name = ctx.request.body.name || '';
    let password = ctx.request.body.password || '';
    console.log('进来了。', name, password);

    if (name === 'tinybo' && password === 'yuanbo') {
        ctx.response.body = '<h1>欢迎进入青豆博客.</h1>';
    } else {
        ctx.response.body = '<h1>大佬，账号或密码错误哦.</h1>';
    }
    await next();
}

/* async function login (ctx, next) {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" type="text"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
    console.log(`Process ${ ctx.request.method } ${ ctx.request.url }`);
    await next();
} */

module.exports = {
    'GET /about': about,
    'POST /signin': signIn,
    ...home,
    ...login
};