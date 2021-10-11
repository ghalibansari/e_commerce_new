import { BaseController } from "../BaseController";
import { Application, Request, Response } from "express";
import { JsonResponse, TryCatch, Upload } from "../../helper";
import { guard } from "../../helper/Auth";
import { IUser } from "../user/user.types";
import UserBusiness from "../user/user.business";
import { Messages } from "../../constants";
import { IAccess } from "./access.types";
import XLSX from "xlsx";
import AccessBusiness from "./access.business";
import multer from "multer";
import accessModel from "./access.model";
import { AccessRepository } from "./access.repository";



export class AccessController extends BaseController<IAccess> {
    public multipart = multer().any
    constructor() {
        super(new AccessBusiness(), "access", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/access', guard, this.router)
    }

    init() {
        // const validation: AclValidation = new AclValidation();
        this.router.post("/", Upload.uploadFile('/uploads/excels').single("file"), guard, TryCatch.tryCatchGlobe(this.create));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {data, page}: any = await new AccessRepository().index(req.query)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const { body, body: { loggedInUser: { _id: loggedInUserId } } } = req as any
        if (!body.userId && !body.roleId) throw new Error("userId/roleId is missing")
        if (!req?.file?.path) throw new Error('Invalid File.')
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req?.file?.path);
        const sheets: string[] = file.SheetNames;
        let limit: number = 0, module: any[] = [];
        if (sheets.find(sheet => sheet.toLowerCase() == 'access')) {
            limit = Number(file.Sheets.access['!ref'].split(':')[1].slice(1));
            for (let i = 2; i <= limit; i++) {
                let subModule = file.Sheets.access[`B${i}`].v.replace(/ /gi, '').split(",")
                module.push({ [file.Sheets.access[`A${i}`].v]: subModule })
            }
        };
        if (body.roleId) {
            let accessData = await accessModel.findOne({ roleId: body.roleId }, '_id');
            res.locals.data = (accessData?._id) ? await accessModel.findOneAndUpdate({ _id: accessData._id }, { module, updatedBy: loggedInUserId }) :
                await accessModel.create({ userId: body.userId, roleId: body.roleId, module, createdBy: loggedInUserId, updatedBy: loggedInUserId });
        }
        else {
            let accessData = await accessModel.findOne({ userId: body.userId });
            res.locals.data = (accessData) ? await accessModel.findOneAndUpdate({ _id: accessData._id }, { module, updatedBy: loggedInUserId }) :
                await accessModel.create({ userId: body.userId, roleId: body.roleId, module, createdBy: loggedInUserId, updatedBy: loggedInUserId });
        }
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.accessDevice`);
    }


}