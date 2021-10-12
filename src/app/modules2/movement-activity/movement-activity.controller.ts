import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {Messages} from "../../constants"
import {guard} from "../../helper/Auth";
import AddressBusiness from "../address/address.business";
import RoleBusiness from "../role/role.business";
import CompanyBusiness from "../company/company.business";
import {IMovementActivity} from "./movement-activity.types";
import MovementActivityBusiness from "./movement-activity.business";


export class MovementActivityController extends BaseController<IMovementActivity> {
    constructor() {
        super(new MovementActivityBusiness(), "user", true);
        this.init();
    }

    register(express: Application) {
        express.use('/api/v1/movement-activity', guard, this.router);
    }

    init() {
        // const validation: MovementActivityValidation = new MovementActivityValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.post("/", validation.createUser, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateUser, TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
    }

    async create(req: Request, res: Response){
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        // let encryptPassword = await hash(body.password, genSaltSync(10));
        // let compared = await compare(body.password, encryptPassword);
        // console.log(compared, "compared", body.password, encryptPassword);
        // body.password = encryptPassword;
        await new MovementActivityController().checkIdS(body)
        res.locals.data = await new MovementActivityBusiness().createBB(body)
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `create`);
    }

    async checkIdS({addressId, roleId, companyId}:any): Promise<void|never>{
        let [addressIdData, roleIdData, companyIdData] = await Promise.all([
            await new AddressBusiness().findIdByIdBB(addressId),
            await new RoleBusiness().findIdByIdBB(roleId),
            await new CompanyBusiness().findIdByIdBB(companyId)
        ])
        if(!addressIdData?._id) throw new Error("Invalid AddressId")
        if(!roleIdData?._id) throw new Error("Invalid roleId")
        if(!companyIdData?._id) throw new Error("Invalid companyId")
    }

}