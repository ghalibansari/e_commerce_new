import { Application } from 'express';
import { AuthGuard, TryCatch, validateBody, validateParams } from '../../helper';
import { BaseController } from '../BaseController';
import { BrandRepository } from './brand.repository';
import { IBrand, IMBrand } from './brand.types';
import { BrandValidation } from './brand.validation';


export class BrandController extends BaseController<IBrand, IMBrand> {
    constructor() {
        super("brand", new BrandRepository(), ['banner_image','banner_image',''], [['brand_name', 'DESC']], [], [])
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/brand', AuthGuard, this.router)

    init() {
        const validation: BrandValidation = new BrandValidation();
        this.router.get('/', TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post('/', validateBody(BrandValidation.addBrand), TryCatch.tryCatchGlobe(this.createOneBC));
        this.router.put('/:id', validateBody(BrandValidation.editBrand), TryCatch.tryCatchGlobe(this.updateByIdkBC));
        this.router.delete('/:id', validateParams(BrandValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC));
        this.router.post("/bulk", validateBody(BrandValidation.addBrandBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.get('/:id', TryCatch.tryCatchGlobe(this.findByIdBC));
    }
};
