import { Application, Request, Response } from 'express';
import { Messages } from '../../constants';
import { JsonResponse, TryCatch, validateBody, validateParams } from '../../helper';
import { BaseController } from '../BaseController';
import { TemplateRepository } from './template.repository';
import { TemplateValidation } from './template.validation';
import { AuthGuard } from "../../helper/Auth"
import { IMTemplate, ITemplate } from "./template.types";

export class TemplateController extends BaseController<ITemplate, IMTemplate> {

    constructor() {
        super("template", new TemplateRepository(), ['*'], [['title', 'DESC']], [], [])
        this.init();
    }

    /**
     * To register auth module base API
     * @param express
     */
    register = (express: Application) => express.use('/api/v1/user', this.router)

    /**
     * { /api/manage/template }
     */
    init() {
        const validation: TemplateValidation = new TemplateValidation();
        this.router.get('/', TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post('/', validateBody(TemplateValidation.addTemplate), TryCatch.tryCatchGlobe(this.createOneBC));
        this.router.put('/', validateParams(TemplateValidation.addTemplate), TryCatch.tryCatchGlobe(this.updateByIdkBC));
        this.router.delete('/', TryCatch.tryCatchGlobe(this.deleteByIdBC));
        this.router.get('/get-by-id', TryCatch.tryCatchGlobe(this.findByIdBC));
    }
}
