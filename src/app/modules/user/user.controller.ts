import { Application, Request, Response } from "express";
import { Messages } from "../../constants";
import { AuthGuard, DBTransaction, JsonResponse, TryCatch, validateBody, validateParams } from "../../helper";
import { BaseController } from "../BaseController";
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
        this.router.get("/:id", validateParams(UserValidation.findById), TryCatch.tryCatchGlobe(this.findByIdBC))
        this.router.post("/", validateBody(UserValidation.addUser), TryCatch.tryCatchGlobe(this.createOneBC))
        this.router.post("/bulk", validateBody(UserValidation.addUserBulk), TryCatch.tryCatchGlobe(this.createBulkBC))
        this.router.put("/:id", validateParams(UserValidation.findById), validateBody(UserValidation.editUser), TryCatch.tryCatchGlobe(this.updateByIdkBC))
        this.router.delete("/:id", validateParams(UserValidation.findById), TryCatch.tryCatchGlobe(this.deleteByIdBC))

        this.router.post("/trans", validateBody(UserValidation.addUser), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.createOne))
        this.router.get("/test", TryCatch.tryCatchGlobe(this.test));
    }

    createOne = async (req: Request, res: Response): Promise<void> => {
        const { body, transaction, user: { user_id } }: any = req
        const data = await this.repo.createOneBR({ newData: body, created_by: user_id, transaction })
        res.locals = { data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `createOneBC`)
    };

    test = async (req: Request, res: Response): Promise<void> => {
        const user = await new UserRepository().findOneBR({});
        res.locals = { data: user?._attributes.password, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `test`)
    };
};
