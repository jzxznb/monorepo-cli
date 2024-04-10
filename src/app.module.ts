import { Module } from "pigger/core";
import UserModule from "./modules/user";

@Module({
    modules: [UserModule],
})
export default class {}
