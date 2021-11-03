import { Application } from 'express';
import { AuthGuard, TryCatch, validateBody, validateParams } from '../../helper';
import { BaseController } from '../BaseController';
import { BrandRepository } from './banner.repository';
import { IBanner, IMBanner } from './banner.types';
import { BannerValidation } from './bannner.validation';

export class BannerController extends BaseController<IBanner, IMBanner> {
    constructor() {
        super("banner", new BrandRepository(), ['*'], [['banner_text', 'DESC']], [], [])
        this.init();
    }


    register = (express: Application) => express.use('/api/v1/banner', AuthGuard, this.router)

    init() {
        this.router.get('/', TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post('/', validateBody(BannerValidation.addBanner), TryCatch.tryCatchGlobe(this.createOneBC));
        this.router.put('/:id', validateBody(BannerValidation.editBanner), TryCatch.tryCatchGlobe(this.updateByIdkBC));
        this.router.delete('/:id', validateParams(BannerValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC));
        this.router.get('/:id', TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}
