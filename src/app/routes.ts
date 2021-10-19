import { Application } from "express"
import { AuthController } from "./modules/auth/auth.controller";
import { UserController } from "./modules/user/user.controller";
import { AdminRoutes } from "./view-routes/admin";

export function registerRoutes(app: Application): void {
    new UserController().register(app)
    new AuthController().register(app)
}
