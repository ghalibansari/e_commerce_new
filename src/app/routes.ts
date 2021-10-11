import {Application} from "express"
import {UserController} from "./modules/user/user.controller";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
}
