import { Application } from 'express';
import { TryCatch, validateBody, validateParams } from '../../helper';
import { BaseController } from '../BaseController';
import { BrandRepository } from './brands.repository';
import { IBrands, IMBrands } from './brands.types';
import { BrandsValidation } from './brands.validation';

export class BrandController extends BaseController<IBrands, IMBrands> {
    constructor() {
        super("brands", new BrandRepository(), ['*'], [['brand_name', 'DESC']], [], [])
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/brands', this.router)

    init() {
        const validation: BrandsValidation = new BrandsValidation();
        this.router.get('/', TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post('/', validateBody(BrandsValidation.addBrands), TryCatch.tryCatchGlobe(this.createOneBC));
        this.router.put('/:id', validateBody(BrandsValidation.editBrands), TryCatch.tryCatchGlobe(this.updateByIdkBC));
        this.router.delete('/:id', validateParams(BrandsValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC));
        this.router.get('/:id', TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}
