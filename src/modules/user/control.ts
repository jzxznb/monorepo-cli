import { Control, Get } from "pigger/core";

@Control("/user")
export default class {
    @Get("/print")
    print(ctx) {
        ctx.body = "hello /user/print";
    }
}
