import { Constant } from '../../constants';
import { Application, Request, Response } from 'express';
import jwt from "jsonwebtoken";
// import { Messages } from '../../constants';
import { JsonResponse, TryCatch, validateBody } from '../../helper';
import { BaseController } from '../BaseController';
import { UserRepository } from '../user/user.repository';
// import { IMUser } from '../user/user.types';
import { AuthValidation } from "./auth.validation";
import { compare } from "bcrypt";
import { AuthRepository } from './authRepository';
import { authActionEnum, IAuth, IMAuth } from './auth.types';
// import { BaseRepository } from '../BaseRepository';
// import { tokenToString } from 'typescript';

export class AuthController extends BaseController<IAuth, IMAuth> {
    constructor() {
        super('auth', new AuthRepository(), ['*'], []);
        this.init();
    }

    //@ts-expect-error
    public register(express: Application): void {
        express.use('/api/v1/auth', this.router);
    }

    /**
     * Initialize the API for authentication
     * { host/api/auth }
     */
    public init() {
        this.router.post('/login', validateBody(AuthValidation.login), TryCatch.tryCatchGlobe(this.login));
        // this.router.post('/ping', validation.login,TryCatch.tryCatchGlobe(this.ping));
        // this.router.post('/hash', validation.login,TryCatch.tryCatchGlobe(this.hash));
        // this.router.post('/newlogin', validation.login,TryCatch.tryCatchGlobe(this.login));
        // this.router.post('/newloginverify', validation.loginVerify, TryCatch.tryCatchGlobe(this.loginVerify));
        // this.router.post('/chnagepassword', validation.changePassword, TryCatch.tryCatchGlobe(this.changePassword));
        // this.router.post('/changepasswordverify', validation.changePasswordVerify, TryCatch.tryCatchGlobe(this.changePasswordVerify));;
        // this.router.post('/forgetpassword', validation.forgetPassword, TryCatch.tryCatchGlobe(this.forgetPassword));
        // this.router.post('/forgetpasswordverify', validation.forgetPasswordVerify, TryCatch.tryCatchGlobe(this.forgetPasswordVerify));
        // this.router.post('/logout',guard, TryCatch.tryCatchGlobe(this.logout))

    }

    async ping(req: Request, res: Response): Promise<void> {    //Todo test function remove in production.
        // res.locals = { data: 'empty', message: Messages.FETCH_SUCCESSFUL }
        // res.locals.message = "Invalid Email or Password.";|
        await JsonResponse.jsonSuccess(req, res, "ping");
    }

    // async hash(req: Request, res: Response): Promise<void> {    //Todo test function remove in production.
    //     const userData = await userModel.find()
    //     for await (let { email, password: oldPassword } of userData) {
    //         let password = bcrypt.hashSync(oldPassword, bcrypt.genSaltSync(10))
    //         await userModel.updateOne({ email }, { password })
    //         console.log('updated for Email: ', email, password)
    //     }
    //     res.locals = { data: 'empty', message: Messages.FETCH_SUCCESSFUL }
    //     await JsonResponse.jsonSuccess(req, res, "ping");    // }

    async login(req: Request, res: Response): Promise<void> {   //Todo optimize this whole Auth controller
        const { body: { email, password } } = req
        // const ip = req.connection.remoteAddress || req.socket.remoteAddress
        const userData = await new UserRepository().findOneBR({ email }, ['user_id', 'email', 'password', 'first_name', 'last_name'])
        //@ts-expect-error
        const comparee = await compare(password, userData?.password)
        if (comparee) {
            const { user_id }: any = userData
            // @ts-expect-error
            delete userData.password
            console.log("*************************huihjhhig")
            const token = jwt.sign({ userData }, Constant.jwt_key);
            res.locals.data = token
            console.log("*************************lllllllll");
            new AuthRepository().createOneBR({ ip: '192.168.0.1', action: authActionEnum.login, token, user_id: user_id, created_by: user_id, updated_by: user_id })
            console.log("=============================|||||||=============================");
            // res.locals.message = Messages.SUCCESSFULLY_LOGIN;
            return JsonResponse.jsonSuccess(req, res, "Success")
        }
        else {
            res.locals.data = null;
            res.locals.message = "Invalid Email or Password.";
            return JsonResponse.jsonError(req, res, "login");
        }
    }
}
