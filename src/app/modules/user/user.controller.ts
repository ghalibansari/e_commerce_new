import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
import { BaseHelper } from "../BaseHelper";
import { UserAddressMd } from "../user-address/user-address.model";
import { UserRepository } from "./user.repository";
import { IMUser, IUser } from "./user.types";
import { UserValidation } from "./user.validation";


export class UserController extends BaseController<IUser, IMUser> {

    constructor() {
        //url, user0repo, attributes/columns, include/joints, sort, search-columns 
        super("user", new UserRepository(), ['*'], [['last_name', 'DESC']], [], ['first_name', 'last_name'])
        this.init()
    }

    register = (express: Application) => express.use(`/api/v1/${this.url}`, AuthGuard, this.router)

    init() {
        this.router.get("/", TryCatch.tryCatchGlobe(this.indexBC));
        // this.router.get("/:id", validateParams(UserValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(UserValidation.addUser), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(UserValidation.addUserBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put('/profile', validateBody(UserValidation.editProfile), TryCatch.tryCatchGlobe(this.updateProfile));
        // this.router.put("/:id", validateParams(UserValidation.findById), validateBody(UserValidation.editUser), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(UserValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))

        this.router.post("/trans", validateBody(UserValidation.addUser), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.createOne))
        this.router.get("/test", TryCatch.tryCatchGlobe(this.test));
        this.router.get("/profile", TryCatch.tryCatchGlobe(this.viewProfile));
    }

    createOne = async (req: Request, res: Response): Promise<void> => {
        const { body, transaction, user: { user_id } }: any = req
        const data = await this.repo.createOneBR({ newData: body, created_by: user_id, transaction })
        res.locals = { status: true, data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `createOneBC`)
    };

    test = async (req: Request, res: Response): Promise<void> => {
        const data = await new BaseHelper().sendEmail({ template_name: 'demo', to: 'amangoswami2042000@gmail.com', cc: 'ghdlin@gmail.com', paramsVariable: { NAME: 'AMAN', AGE: 19 } })
        // const data = await new NotificationService().sendMail({to: 'amangoswami2042000@gmail.com, ak8828979484@gmail.com', subject: 'terter bro new mail', html: `<h1>hellooo pppp</h1>`});
        res.locals = { data, status: true, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `test`)
    };

    viewProfile = async (req: Request, res: Response): Promise<void> => {
        const { user: { user_id } }: any = req
        const data = await new UserRepository().findBulkBR({ where: { user_id }, attributes: ['first_name', 'last_name', 'mobile', 'email', 'gender'], include: [{ model: UserAddressMd, as: 'addresses', attributes: ['is_default', 'address_1', 'address_2', 'city', 'state', 'pin_code'] }] })
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `shop`);
    };

    updateProfile = async (req: Request, res: Response): Promise<void> => {
        const { body, user: { user_id } }: any = req
        const { count, data: { first_name, last_name, gender, email, mobile } = {} } = await this.repo.updateByIdBR({ id: user_id, newData: body, updated_by: user_id })
        let data
        if (first_name) data = { first_name, last_name, gender, email, mobile }
        res.locals = { status: !!count, data, message: !!count ? Messages.UPDATE_SUCCESSFUL : Messages.UPDATE_FAILED };
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.updateProfile`)
    };
};
