import {Application} from "express";
import { AdminRoutes } from "./view-routes/admin";

export function registerViewRoutes(app: Application): void {

    new AdminRoutes().register(app)
}
