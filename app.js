const Koa = require("koa");
const { koaBody } = require("koa-body");
const { CONFIG, session, verifySession } = require("./utils/session");
const { connectDB, connectRedic, redis } = require("./connect/store.js");

const app = new Koa();
Promise.all([connectDB(), connectRedic()]);

app.keys = ["model j-screct0key"];
app.use(
    koaBody({
        parsedMethods: ["POST", "PUT", "PATCH", "GET"],
        multipart: true,
        formidable: {
            maxFileSize: 50 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
        },
    })
).use(session(CONFIG, app));

// logger
app.use(verifySession).use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
// app.use(model.routes(), model.allowedMethods()).use(pay.routes(), pay.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});

module.exports = app;
