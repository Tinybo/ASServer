async function home (ctx, next) {
    ctx.render('success.html', {
        title: 'home success.'
    });
    await next();
}

module.exports = {
    'GET /home': home
};