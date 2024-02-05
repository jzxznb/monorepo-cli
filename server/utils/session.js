const session = require("koa-session");
const { redis } = require("../connect/store.js");

const prefix = "user";

class SessionStore {
    redis = redis;
    async get(id) {
        const data = await redis.get(`${id}`);
        return JSON.parse(data);
    }
    async set(id, data, maxAge, { changed, rolling }) {
        const session = JSON.stringify(data);
        await this.redis.set(id, session, { EX: maxAge / 1000 });
        // return id;
    }
    async destroy() {}
}

const CONFIG = {
    prefix: prefix,
    key: "koa:sess",
    httpOnly: true,
    // maxAge: 24 * 60 * 60 * 1000,
    autoCommit: true,
    signed: true,
    renew: true,
    store: new SessionStore(),
};

async function verifySession(ctx, next) {
    try {
        const { url } = ctx.request;
        const requestUrl = url.split("?")[0];
        const noVerifyList = ["/pay/login"];
        const noVerify = noVerifyList.includes(requestUrl);
        if (noVerify) {
            await next();
        } else {
            if (ctx.session?.username) {
                await next();
            } else {
                ctx.response.body = {
                    code: "error",
                    msg: "用户信息错误, 请重新登陆。",
                    type: "verify",
                };
            }
        }
    } catch (err) {
        console.log(err);
        ctx.response.body = {
            code: "error",
            msg: "请重新登陆用户信息。",
            type: "verify",
        };
    }
}

module.exports = {
    verifySession,
    CONFIG,
    SessionStore,
    session,
};
