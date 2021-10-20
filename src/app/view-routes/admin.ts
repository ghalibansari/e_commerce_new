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
        this.router.get("/categories", this.categoryPage);
        this.router.get("/units", this.unitPage);
    }

    brandPage(req: Request, res: Response) {
        res.render('Masters/Brands/index');
    }

    categoryPage(req: Request, res: Response) {
        res.render('Masters/Categories/index');
    }

    unitPage(req: Request, res: Response) {
        res.render('Masters/Units/index');
    }
}