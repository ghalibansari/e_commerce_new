import { Application, Request, Response, Router } from "express";
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch } from "../../helper";
import { CategoriesMd } from "../categories/categories.model";
import { CategoriesRepository } from '../categories/categories.repository';
import { CustomRepository } from "./custom.repository";




export class CustomController {
    router

    constructor() {
        this.router = Router();
        // super()
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1`, AuthGuard, this.router);

    init() {
        this.router.get("/home", TryCatch.tryCatchGlobe(this.home));
        this.router.get("/filter", TryCatch.tryCatchGlobe(this.filter));

        this.router.get("/test", TryCatch.tryCatchGlobe(this.test));
    };

    home = async (req: Request, res: Response): Promise<void> => {
        const data = await new CustomRepository().home()
        res.locals = { data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `homePage`);
    };

    test = async (req: Request, res: Response): Promise<void> => {
        // const lal = await new UserRepository().findBulkBR({ include: [{ model: AuthMd, as: 'xxx' }] });
        const lal = await new CategoriesRepository().findBulkBR({ where: { show_on_home_screen: true, parent_id: null }, include: [{ model: CategoriesMd, as: 'sub_cat', attributes: ['category_name', 'parent_id'] }], attributes: ['category_name', 'parent_id'], order: [] });
        res.locals = { data: { lal }, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `homePage`);
    };

    filter = async (req: Request, res: Response): Promise<void> => {
        const data = await new CustomRepository().filter()
        res.locals = { data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `shop`);
    };
};
