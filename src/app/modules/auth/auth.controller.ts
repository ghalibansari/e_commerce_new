import { compare } from 'bcrypt';
import { Application, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { v4 } from 'uuid';
import { Constant, Messages } from '../../constants';
import { JsonResponse, TryCatch, validateBody } from '../../helper';
import { AuthGuard } from '../../helper/Auth';
import { BaseController } from '../BaseController';
import { UserRepository } from '../user/user.repository';
import { authActionEnum, IAuth, IMAuth } from './auth.types';
import { AuthValidation } from "./auth.validation";
import { AuthRepository } from './authRepository';


export class AuthController extends BaseController<IAuth, IMAuth> {
    constructor() {
        super('auth', new AuthRepository(), ['*'], [['created_on', 'DESC']]);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/auth', this.router)


    public init() {
        this.router.post('/login', validateBody(AuthValidation.login), TryCatch.tryCatchGlobe(this.login));
        this.router.post('/register', validateBody(AuthValidation.register), TryCatch.tryCatchGlobe(this.userRegister));
        // this.router.post('/hash', validation.login,TryCatch.tryCatchGlobe(this.hash));
        // this.router.post('/newlogin', validation.login,TryCatch.tryCatchGlobe(this.login));
        // this.router.post('/newloginverify', validation.loginVerify, TryCatch.tryCatchGlobe(this.loginVerify));
        this.router.post('/change-password', AuthGuard, validateBody(AuthValidation.changePassword), TryCatch.tryCatchGlobe(this.changePassword));
        //  this.router.post('/changepasswordverify', validation.changePasswordVerify, TryCatch.tryCatchGlobe(this.changePasswordVerify));;
        // this.router.post('/forgetpassword', validation.forgetPassword, TryCatch.tryCatchGlobe(this.forgetPassword));
        // this.router.post('/forgetpasswordverify', validation.forgetPasswordVerify, TryCatch.tryCatchGlobe(this.forgetPasswordVerify));
        // this.router.post('/logout',guard, TryCatch.tryCatchGlobe(this.logout))

    }


    async login(req: Request, res: Response): Promise<void> {   //Todo optimize this whole Auth controller
        const { email, password } = req.body
        // const ip = req.connection.remoteAddress || req.socket.remoteAddress
        const userData = await new UserRepository().findOneBR({ email }, ['user_id', 'email', 'password', 'first_name', 'last_name'])

        const comparePassword = await compare(password, userData?.password!)
        if (comparePassword) {
            const { user_id }: any = userData
            // @ts-expect-error
            delete userData.password
            const token = jwt.sign({ ...userData }, Constant.jwt_key);
            res.locals.data = token
            new AuthRepository().createOneBR({ ip: '192.168.0.1', action: authActionEnum.login, token, user_id: user_id, created_by: user_id, updated_by: user_id })
            res.locals.message = Messages.SUCCESSFULLY_LOGIN;
            return JsonResponse.jsonSuccess(req, res, "login")
        }
        else {
            res.locals.data = null;
            res.locals.message = "Invalid Email or Password.";
            return JsonResponse.jsonError(req, res, "login");
        }
    }

    changePassword = async (req: Request, res: Response): Promise<void> => {
        const { email, oldPassword, newPassword } = req.body
        const { user: { user_id } }: any = req

        if (oldPassword == newPassword) throw new Error("Old And New Password is Same");

        const userRepo = new UserRepository()

        const user = await userRepo.findOneBR({ email }, ['user_id', 'email', 'password'])
        if (!user) throw new Error('Invalid Email');

        const compareOldPassword = await compare(oldPassword, user.password)
        if (!compareOldPassword) throw new Error("Invalid oldPassword!!");

        await userRepo.updateByIdBR(user.user_id, { password: newPassword })
        new AuthRepository().createOneBR({ ip: '192.168.0.1', action: authActionEnum.change_pass, user_id: user_id, created_by: user_id, updated_by: user_id })

        res.locals.message = "PASSWORD_CHANGED_SUCCESSFULLY"
        return JsonResponse.jsonSuccess(req, res, "change password")
    }


    userRegister = async (req: Request, res: Response): Promise<void> => {
        const id = v4()
        const user = await new UserRepository().createOneBR({ ...req.body, user_id: id, created_by: id, updated_by: id });

        new AuthRepository().createOneBR({ ip: '192.168.0.1', action: authActionEnum.register, user_id: id, created_by: id, updated_by: id });
        res.locals = { status: true, message: "CREATE_SUCCESSFUL" }
        return JsonResponse.jsonSuccess(req, res, "register");
    }

    // ForgetPassword = async (req: Request, res: Response): Promise<void> => {
    //     const { email } = req.body
    //     const user = await UserRepository.findOneBR({ email }, (err, user) => {
    //         if (!user) throw new Error("email does not exists")
    //     })



    // }
};
