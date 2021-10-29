// import { Application, Request, Response } from 'express';
// import { Messages } from '../../constants';
// import { JsonResponse, TryCatch } from '../../helper';
// import { BaseController } from '../BaseController';
// import { TemplateRepository } from './template.repository';
// import { TemplateValidation } from './template.validation';
// import { guard } from "../../helper/Auth";
// import TemplateBusiness from "./template.business";
// import { ITemplate } from "./template.types";

// export class TemplateController extends BaseController<ITemplate> {

//     constructor() {
//         //@ts-expect-error
//         super(new TemplateBusiness(), 'template', true);
//         this.init();
//     }

//     /**
//      * To register auth module base API
//      * @param express
//      */
//     register(express: Application): void {
//         express.use('/api/v1/template', guard, this.router);
//     }

//     /**
//      * { /api/manage/template }
//      */
//     init() {
//         const validation: TemplateValidation = new TemplateValidation();
//         this.router.get('/', TryCatch.tryCatchGlobe(this.findBC));
//         this.router.get('/index', TryCatch.tryCatchGlobe(this.indexBC));
//         this.router.post('/', validation.createTemplate, TryCatch.tryCatchGlobe(this.createBC));
//         this.router.put('/', validation.updateTemplate, TryCatch.tryCatchGlobe(this.updateBC));
//         this.router.delete('/', TryCatch.tryCatchGlobe(this.deleteBC));
//         this.router.get('/get-by-id', TryCatch.tryCatchGlobe(this.findByIdBC));
//     }

//     /**
//      * This is to List Industry master
//      * @param req
//      * @param res
//      */
//     // async getWithRecipientCount(req: Request, res: Response): Promise<void> {
//     //     const repo: TemplateRepository = new TemplateRepository();
//     //     const industries: object = await repo.getWithRecipientCountData();
//     //     res.locals.data = industries;
//     //     res.locals.message = Messages.SUCCESSFULLY_RECEIVED;
//     //     //console.log(res);
//     //     await JsonResponse.jsonSuccess(req, res, 'industry-master.index');
//     // }

// }
