import {Application} from "express"
import { BrandController } from "./modules/brand/brand.controller";
import { CategoryController } from "./modules/category/category.controller";
import { UnitController } from "./modules/unit/unit.controller";
import {UserController} from "./modules/user/user.controller";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new BrandController().register(app)
    new CategoryController().register(app);
    new UnitController().register(app);
}
