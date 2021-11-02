import { Application } from "express"
import { AuthController } from "./modules/auth/auth.controller";
import { TemplateController } from "./modules/template/template.controller";
import { UserController } from "./modules/user/user.controller";
import { CategoryController } from "./modules/categories/categories.controller";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new AuthController().register(app)
    new TemplateController().register(app)
    new CategoryController().register(app)
}
