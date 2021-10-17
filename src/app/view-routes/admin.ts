import { BaseController } from "app/modules/BaseController";
import { Application, Request, Response, Router } from "express";
import { JsonResponse, TryCatch } from "../helper";

export class AdminRoutes {
    protected router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    register = (express: Application) => express.use('/admin', this.router)

    init() {
        this.router.get("/brands", this.brandPage);
    }

    brandPage(req: Request, res: Response) {
        res.render('Masters/Brands/index');
    }
}