import {Application} from "express"
import { BrandController } from "./modules/brand/brand.controller";
import {UserController} from "./modules/user/user.controller";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new BrandController().register(app)
}
