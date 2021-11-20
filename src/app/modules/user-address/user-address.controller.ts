import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { UserAddressRepository } from "./user-address.repository";
import { IMUserAddress, IUserAddress } from "./user-address.type";
import { UserAddressValidation } from "./user-address.vallidation";

export class UserAddressController extends BaseController<IUserAddress, IMUserAddress> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("user-address", new UserAddressRepository())
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(UserAddressValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(UserAddressValidation.addUserAddress), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(UserAddressValidation.addUserAddressBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put('/update', validateBody(UserAddressValidation.updateUserAddress), TryCatch.tryCatchGlobe(this.updateUserAddress))
        // this.router.put("/:id", validateParams(UserAddressValidation.findById), validateBody(UserAddressValidation.editUserAddress), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(UserAddressValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    }

    updateUserAddress = async (req: Request, res: Response): Promise<void> => {
        const { body, user: { user_id }, query: { id } }: any = req
        const address = await this.repo.findOneBR({ where: { address_id: id, user_id, }, attributes: ['address_id'] })
        // const def = await this.repo.findOneBR({where:{address_id : id}, attributes:['is_default']})
        if (!address) throw new Error('Address Not Found')

        // else if(!def) throw new Error('address is not default')
        const { count } = await this.repo.updateByIdBR({ id: address.address_id, newData: body, updated_by: user_id })
        res.locals = { status: !!count, message: !!count ? Messages.UPDATE_SUCCESSFUL : Messages.UPDATE_FAILED };
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.updateProfile`)
    }
};
