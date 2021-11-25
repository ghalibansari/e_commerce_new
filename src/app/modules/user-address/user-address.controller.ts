import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
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
        this.router.post("/", validateBody(UserAddressValidation.addUserAddress), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.addUserAddress))
        // this.router.post("/bulk", validateBody(UserAddressValidation.addUserAddressBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put('/', validateBody(UserAddressValidation.updateUserAddress), TryCatch.tryCatchGlobe(this.updateUserAddress))
        // this.router.put("/:id", validateParams(UserAddressValidation.findById), validateBody(UserAddressValidation.editUserAddress), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(UserAddressValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))
    };

    addUserAddress = async (req: Request, res: Response): Promise<void> => {
        const { body, transaction, user: { user_id } }: any = req
        const userAdd = await this.repo.findBulkBR({ where: { user_id }, attributes: ["address_id", "is_default"] });
        if (!userAdd.length) body.is_default = true;
        else if (userAdd.length && body.is_default) {
            let emptyArray = []
            for (let i = 0; i < userAdd.length; i++) {
                emptyArray.push(userAdd[i].address_id)
            };
            //@ts-expect-error
            await this.repo.updateBulkBR({ where: { "address_id": emptyArray }, newData: { is_default: false }, updated_by: user_id, transaction })
        }
        await this.repo.createOneBR({ newData: { ...body, user_id }, created_by: user_id, transaction });
        res.locals = { status: true, message: Messages.CREATE_SUCCESSFUL };
        return await JsonResponse.jsonSuccess(req, res, "addUserAddress")
    };

    updateUserAddress = async (req: Request, res: Response): Promise<void> => {
        const { body, user: { user_id }, query: { id } }: any = req
        const address = await this.repo.findOneBR({ where: { address_id: id, user_id, }, attributes: ['address_id'] })
        // const def = await this.repo.findOneBR({where:{address_id : id}, attributes:['is_default']})
        if (!address) throw new Error('Address Not Found')

        // else if(!def) throw new Error('address is not default')
        const { count } = await this.repo.updateByIdBR({ id: address.address_id, newData: body, updated_by: user_id })
        res.locals = { status: !!count, message: !!count ? Messages.UPDATE_SUCCESSFUL : Messages.UPDATE_FAILED };
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.updateProfile`)
    };
};
