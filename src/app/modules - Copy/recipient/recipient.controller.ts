import {Application, Request, Response} from 'express';
import {Messages} from '../../constants';
import {JsonResponse, TryCatch} from '../../helper';
import {BaseController} from '../BaseController';
import {RecipientRepository} from './recipient.repository';
import {RecipientValidation} from './recipient.validation';
import {guard} from "../../helper/Auth";
import RecipientBusiness from "./recipient.business";
import {IRecipient} from "./recipient.types";

export class RecipientController extends BaseController<IRecipient> {

    constructor() {
        super(new RecipientBusiness(),'recipient');
        this.init();
    }

    /**
     * To register auth module base API
     * @param express
     */
    register(express: Application) : void{
        express.use('/api/v1/recipient', guard, this.router);
    }

    /**
     * { /api/manage/recipient }
     */
    init() {
        const validation: RecipientValidation = new RecipientValidation();
        this.router.get('/', TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post('/', validation.addValidation, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put('/', validation.editValidation, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete('/', TryCatch.tryCatchGlobe(this.deleteBC));

        this.router.get('/get-by-id', TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    /**
     * get data by presence_detail_id
     * @param req
     * @param res
     */
    // async getByTemplateId(req: Request, res: Response): Promise<void>{
    //     const repo = new RecipientRepository();
    //     const templateId: number = req.body['templateId'];
    //     console.log(templateId,"temp");
    //     const data: object = await repo.getByTemplateIdData(templateId);
    //     res.locals.data = data;
    //     res.locals.message = Messages.SUCCESSFULLY_RECEIVED;
    //     await JsonResponse.jsonSuccess(req, res, 'wishlist-contact.getByPresenceDetailId');
    // }
}
