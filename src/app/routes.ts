import {Application} from "express"
import {UserController} from "./modules/user/user.controller";
import { AdminRoutes } from "./view-routes/admin";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
}
