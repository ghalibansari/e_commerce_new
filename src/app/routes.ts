import { Application } from "express";
import { AuthController } from "./modules/auth/auth.controller";
import { BannerController } from "./modules/banners/banner.controller";
import { BrandController } from "./modules/brands/brands.controller";
import { CategoryController } from "./modules/categories/categories.controller";
import { TemplateController } from "./modules/template/template.controller";
import { UserController } from "./modules/user/user.controller";


export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new AuthController().register(app)
    new TemplateController().register(app)
    new CategoryController().register(app)
    new BrandController().register(app)
    new BannerController().register(app)
}
