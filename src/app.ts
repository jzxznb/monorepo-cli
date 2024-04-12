import Pigger from "pigger";
import { koaBody } from "koa-body";
import AppModule from "./app.module";
import { redisConnect, mongoConnect } from "./connect";
import { CONFIG, session } from "./utils/session";

const start = async () => {
    const app = new Pigger();
    app.createFactory(AppModule);
    app.keys = ["pigger keys"];
    Promise.all([redisConnect(), mongoConnect()]);
    //inject middleware here
    app.use(koaBody());
    app.use(async (ctx, next) => {
        const start = Number(new Date());
        await next();
        const ms = Number(new Date()) - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });
    app.routing();
    app.listen(3000);

    app.on("error", (err, ctx) => console.error("server error", err, ctx));
};

start();
