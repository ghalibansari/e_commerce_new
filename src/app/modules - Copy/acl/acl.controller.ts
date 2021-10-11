import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import AclBusiness from "./acl.business";
import {guard} from "../../helper/Auth";
import {IAcl} from "./acl.types";
import {AclValidation} from "./acl.validation";
import {IUser} from "../user/user.types";
import UserBusiness from "../user/user.business";
import {Messages} from "../../constants";

export class AclController extends BaseController<IAcl> {
    constructor() {
        super(new AclBusiness(), "acl", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/acl', guard, this.router)
    }

    init() {
        const validation: AclValidation = new AclValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        this.router.post("/", validation.createAcl, TryCatch.tryCatchGlobe(this.createBC));
        this.router.put("/", validation.updateAcl, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async update(req: Request, res: Response){
        const AclBusinessInstance = new AclBusiness()
        let {body, body:{_id, companyId, userId, module, url, loggedInUser:{_id:loggedInUserId}}} = req
        let oldData = await AclBusinessInstance.findOneBB({_id, userId, companyId, isDelete: false})
        if(oldData){

            await AclBusinessInstance.findAndUpdateBB(_id, {isDelete: true, updatedBy: loggedInUserId})
            //@ts-expect-error
            delete oldData._id
            //@ts-expect-error
            delete oldData.isDelete
            //@ts-expect-error
            delete oldData.updatedAt
            // @ts-expect-error
            delete oldData.createdAt
            delete oldData.__v
            delete body.loggedInUser
            delete body._id
            let newData = await Object.assign(oldData, body)
            newData.createdBy = newData.updatedBy = loggedInUserId
            res.locals.data = await AclBusinessInstance.createBB(newData)
            res.locals.message = Messages.UPDATE_SUCCESSFUL;
            await JsonResponse.jsonSuccess(req, res, `update`);
        }
        else{
            res.locals.data = null//await new UserBusiness().createBB(body)
            res.locals.message = Messages.UPDATE_FAILED;
            await JsonResponse.jsonSuccess(req, res, `update`);
        }
    }
}