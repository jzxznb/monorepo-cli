import Pigger from "pigger";
import { koaBody } from "koa-body";
import AppModule from "./src/app.module";

const start = async () => {
    const app = new Pigger();
    app.createFactory(AppModule);
    //inject middleware here
    app.use(koaBody());
    app.routing();
    app.listen(3000);

    app.on("error", (err, ctx) => console.error("server error", err, ctx));
};

start();
