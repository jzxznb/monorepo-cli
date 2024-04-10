import { Control, Get } from "pigger/core";
import UserService from "./service";

@Control("/user")
export default class {
    service: UserService;

    @Get("/print")
    print(ctx) {
        const userName = this.service.getUser();
        ctx.body = `hello /user/print ${userName}`;
    }
}
