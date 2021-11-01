import { Application } from 'express';
import { TryCatch, validateBody, validateParams } from '../../helper';
import { BaseController } from '../BaseController';
import { TemplateRepository } from './template.repository';
import { IMTemplate, ITemplate } from "./template.types";
import { TemplateValidation } from './template.validation';

export class TemplateController extends BaseController<ITemplate, IMTemplate> {
    constructor() {
        super("template", new TemplateRepository(), ['*'], [['title', 'DESC']], [], [])
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/template', this.router)

    init() {
        this.router.get('/', TryCatch.tryCatchGlobe(this.indexBC));
        this.router.get("/:id", validateParams(TemplateValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post('/', validateBody(TemplateValidation.addTemplate), TryCatch.tryCatchGlobe(this.createOneBC));
        this.router.post("/bulk", validateBody(TemplateValidation.addTemplate), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(TemplateValidation.findById), validateBody(TemplateValidation.editTemplate), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(TemplateValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }
};