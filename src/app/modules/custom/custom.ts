import { Application, Request, Response, Router } from "express";
import { Op } from 'sequelize';
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch } from "../../helper";
import { BannerRepository } from "../banners/banner.repository";
import { CategoriesMd } from "../categories/categories.model";
import { BrandRepository } from './../brand/brand.repository';
import { CategoriesRepository } from './../categories/categories.repository';




export class CustomController {
    router

    constructor() {
        this.router = Router();
        // super()
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1`, AuthGuard, this.router);

    init() {
        this.router.get("/home-page", TryCatch.tryCatchGlobe(this.homePage));
        // this.router.get("/:id", validateParams(UserValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        // this.router.post("/", validateBody(UserValidation.addUser), TryCatch.tryCatchGlobe(this.createOneBC))
        // this.router.post("/bulk", validateBody(UserValidation.addUserBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        // this.router.put("/:id", validateParams(UserValidation.findById), validateBody(UserValidation.editUser), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        // this.router.delete("/:id", validateParams(UserValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))

        // this.router.post("/trans", validateBody(UserValidation.addUser), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.createOne))
        this.router.get("/test", TryCatch.tryCatchGlobe(this.test));
    }

    homePage = async (req: Request, res: Response): Promise<void> => {
        const BrandRepo = new BrandRepository(), CategoriesRepo = new CategoriesRepository();
        const [brandHeader, categoriesHeader, banner, categories, subCategories, brand] = await Promise.all([
            await BrandRepo.findBulkBR({ where: { show_on_header: true }, attributes: ['*'] }),
            await CategoriesRepo.findBulkBR({ where: { show_on_header: true, parent_id: null } }),   //TODO need joint

            await new BannerRepository().findBulkBR({ where: { show_on_home_screen: true } }),
            await CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true } }),  //TODO need joint
            await CategoriesRepo.findBulkBR({ where: { show_on_home_screen: true, parent_id: { [Op.ne]: null } } }),
            await BrandRepo.findBulkBR({ where: { show_on_home_screen: true }, attributes: ['*'] }),
        ])
        const data = { header: { brand: brandHeader, categories: categoriesHeader }, banner, categories, subCategories, brand };
        res.locals = { data, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `homePage`);
    };

    test = async (req: Request, res: Response): Promise<void> => {
        // const lal = await new UserRepository().findBulkBR({ include: [{ model: AuthMd, as: 'xxx' }] });
        const lal = await new CategoriesRepository().findBulkBR({ where: { show_on_home_screen: true, parent_id: null }, include: [{ model: CategoriesMd, as: 'child', attributes: ['category_name', 'parent_id'] }], attributes: ['category_name', 'parent_id'] })
        res.locals = { data: { lal }, message: Messages.FETCH_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, `homePage`);
    };
};
