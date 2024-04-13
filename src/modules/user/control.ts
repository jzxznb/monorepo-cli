import { Control, Get, Post } from "pigger/core";
import UserService from "./service";
import { Context } from "koa";

@Control("/user")
export default class {
    service: UserService;

    @Get("/print")
    print(ctx) {
        const userName = this.service.getUser();
        ctx.body = `hello /user/print ${userName}`;
    }

    @Post("/login")
    user(ctx: Context) {
        ctx.session = { username: "username", password: "password", logged: true } as any;
    }
}
