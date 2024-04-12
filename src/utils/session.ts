import { redis } from "../connect";
import { RedisClientType } from "redis";
import { Context, Next } from "koa";

const prefix: string = "auth";

export class SessionStore {
    redis: RedisClientType = redis;
    async get(id: string): Promise<Object> {
        const data = await this.redis.get(`${id}`);
        return JSON.parse(data);
    }
    async set(id: string, data: Object, maxAge: number, { changed, rolling }): Promise<string> {
        const session = JSON.stringify(data);
        await this.redis.set(id, session, { EX: maxAge / 1000 });
        return id;
    }
    async _destroy() {}
}

export const CONFIG = {
    prefix: prefix,
    key: "koa:sess",
    httpOnly: true,
    // maxAge: 24 * 60 * 60 * 1000,
    autoCommit: true,
    signed: true,
    renew: true,
    store: new SessionStore(),
};

export { default as session } from "koa-session";

export async function verifySession(ctx: Context, next: Next) {
    try {
    } catch (error) {
        console.log(error);
        ctx.response.body = {
            code: "error",
            msg: "请重新登录用户信息",
            type: "verify",
        };
    }
}
