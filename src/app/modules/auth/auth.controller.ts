import { compare } from 'bcrypt';
import { Application, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import moment from 'moment';
import { Op } from 'sequelize';
import { v4 } from 'uuid';
import { Constant, Messages } from '../../constants';
import { DBTransaction, JsonResponse, randomAlphaNumeric, TryCatch, validateBody } from '../../helper';
import { AuthGuard } from '../../helper/Auth';
import { BaseController } from '../BaseController';
import { BaseHelper } from '../BaseHelper';
import { UserRepository } from '../user/user.repository';
import { authActionEnum, IAuth, IMAuth } from './auth.types';
import { AuthValidation } from "./auth.validation";
import { AuthRepository } from './authRepository';


export class AuthController extends BaseController<IAuth, IMAuth> {
    constructor() {
        super('auth', new AuthRepository(), ['*'], [['created_at', 'DESC']]);
        this.init();
    };

    register = (express: Application) => express.use('/api/v1/auth', this.router)


    public init() {
        this.router.post('/login', validateBody(AuthValidation.login), TryCatch.tryCatchGlobe(this.login));
        this.router.post('/register', validateBody(AuthValidation.register), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.userRegister));
        this.router.post('/forgot-password', validateBody(AuthValidation.forgotPassword), TryCatch.tryCatchGlobe(this.forgotPassword));
        // this.router.post('/newlogin', validation.login,TryCatch.tryCatchGlobe(this.login));
        // this.router.post('/newloginverify', validation.loginVerify, TryCatch.tryCatchGlobe(this.loginVerify));
        this.router.post('/change-password', AuthGuard, validateBody(AuthValidation.changePassword), TryCatch.tryCatchGlobe(this.changePassword));
        //  this.router.post('/changepasswordverify', validation.changePasswordVerify, TryCatch.tryCatchGlobe(this.changePasswordVerify));;
        // this.router.post('/forgetpassword', validation.forgetPassword, TryCatch.tryCatchGlobe(this.forgetPassword));
        this.router.post('/email-verification', validateBody(AuthValidation.emailVerification), DBTransaction.startTransaction, TryCatch.tryCatchGlobe(this.emailVerification));
        // this.router.post('/logout',guard, TryCatch.tryCatchGlobe(this.logout))
        this.router.post('/reset-password', validateBody(AuthValidation.resetPassword), TryCatch.tryCatchGlobe(this.resetPassword))

    };



    async login(req: Request, res: Response): Promise<void> {   //Todo optimize this whole Auth controller
        const { email, password } = req.body
        // const ip = req.connection.remoteAddress || req.socket.remoteAddress
        const userData = await new UserRepository().findOneBR({ where: { email }, attributes: ['user_id', 'email', 'password', 'first_name', 'last_name'] })
        if (!userData) { throw new Error("Invalid Email Id") }

        const comparePassword = await compare(password, userData?.password!)
        if (comparePassword) {
            const { user_id }: any = userData
            // @ts-expect-error
            delete userData.password
            const token = jwt.sign({ ...userData }, Constant.jwt_key);
            res.locals.data = token
            new AuthRepository().createOneBR({ newData: { ip: '192.168.0.1', action: authActionEnum.login, token, user_id: user_id }, created_by: user_id })
            res.locals.message = Messages.SUCCESSFULLY_LOGIN;
            return JsonResponse.jsonSuccess(req, res, "login")
        }
        else {
            res.locals.data = null;
            res.locals.message = "Invalid Email or Password.";
            return JsonResponse.jsonError(req, res, "login");
        }
    };



    changePassword = async (req: Request, res: Response): Promise<void> => {
        const { user: { user_id }, body: { email, oldPassword, newPassword } }: any = req

        if (oldPassword == newPassword) throw new Error("Old And New Password is Same");

        const userRepo = new UserRepository()

        const user = await userRepo.findOneBR({ where: { email }, attributes: ['user_id', 'email', 'password'] })
        if (!user) throw new Error('Invalid Email');

        const compareOldPassword = await compare(oldPassword, user.password)
        if (!compareOldPassword) throw new Error("Invalid oldPassword!!");

        await userRepo.updateByIdBR({ id: user.user_id, newData: { password: newPassword }, updated_by: user_id })
        new AuthRepository().createOneBR({ newData: { ip: '192.168.0.1', action: authActionEnum.change_pass, user_id: user_id }, created_by: user_id })

        res.locals = { status: true, message: Messages.PASSWORD_CHANGED_SUCCESSFULLY }
        return JsonResponse.jsonSuccess(req, res, "change password")
    };



    userRegister = async (req: Request, res: Response): Promise<void> => {
        const id = v4()
        const { transaction, body, body: { email, mobile, first_name } }: any = req

        const userData = await new UserRepository().findOneBR({ where: { [Op.or]: [{ email }, { mobile: mobile.toString() }] }, attributes: ['user_id', 'email', 'mobile'] })
        if (userData?.email == email) { throw new Error("Email In Use") }
        if (userData?.mobile == mobile) { throw new Error("Number In Use") }

        const otp = randomAlphaNumeric(8)

        await Promise.all([
            await new UserRepository().createOneBR({ newData: { ...body, user_id: id }, created_by: id, transaction }),
            await new AuthRepository().createOneBR({ newData: { ip: '192.168.0.1', action: authActionEnum.register, user_id: id, token: otp }, created_by: id, transaction }),
        ]);

        new BaseHelper().sendEmail({ template_name: "user_registration", to: email, paramsVariable: { OTP: otp, NAME: first_name } })

        res.locals = { status: true, message: Messages.SUCCESSFULLY_REGISTERED }
        return JsonResponse.jsonSuccess(req, res, "register");
    };


    emailVerification = async (req: Request, res: Response): Promise<void> => {
        const { email, otp, transaction } = req.body
        const userRepo = new UserRepository();
        const authRepo = new AuthRepository();

        const user = await userRepo.findOneBR({ where: { email }, attributes: ["user_id"] });
        if (!user) throw new Error("Invalid Email!!");

        const verify = await authRepo.findOneBR({ where: { user_id: user.user_id, token: otp, action: authActionEnum.register }, attributes: ["auth_id"] });
        if (!verify) throw new Error("Invalid email or otp");

        await Promise.all([
            await authRepo.updateByIdBR({ id: verify.auth_id, newData: { is_active: false }, updated_by: user.user_id, transaction }),
            await userRepo.updateByIdBR({ id: user.user_id, newData: { email_verified_at: new Date() }, updated_by: user.user_id, transaction })
        ])

        res.locals = { status: true, message: Messages.SUCCESS };
        return await JsonResponse.jsonSuccess(req, res, "emailVerification");

    };




    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        const { email } = req.body
        const user = await new UserRepository().findOneBR({ where: { email }, attributes: ["user_id", 'first_name'] });
        if (!user) throw new Error("Invalid Email");

        const auth = await new AuthRepository().findOneBR({ where: { action: authActionEnum.forgot_pass, user_id: user.user_id, created_at: { [Op.gte]: moment().subtract(600, "seconds") } } });
        if (auth) throw new Error("Already Sent Email");

        const otp = randomAlphaNumeric(8)

        await new AuthRepository().createOneBR({ newData: { ip: "192.168.0.1", action: authActionEnum.forgot_pass, user_id: user.user_id, token: otp }, created_by: user.user_id });
        new BaseHelper().sendEmail({ template_name: "forgot_password", to: email, paramsVariable: { OTP: otp, NAME: user.first_name } })

        res.locals = { status: true, message: Messages.OTP_SENT_SUCCESSFULLY };
        return await JsonResponse.jsonSuccess(req, res, "forgot Password");

    };


    resetPassword = async (req: Request, res: Response): Promise<void> => {
        const { email, otp, password } = req.body
        const userRepo = new UserRepository(), authRepo = new AuthRepository()

        const user = await userRepo.findOneBR({ where: { email }, attributes: ['user_id', "first_name"] });
        if (!user) throw new Error("Invalid Email!!");

        const auth = await authRepo.findOneBR({ where: { user_id: user.user_id, token: otp, created_at: { [Op.gte]: moment().subtract(300, "seconds") } } })
        if (!auth) throw new Error("Invalid email or otp");

        await Promise.all([
            await authRepo.updateByIdBR({ id: auth.auth_id, newData: { is_active: false }, updated_by: user.user_id }),
            await userRepo.updateByIdBR({ id: user.user_id, newData: { password }, updated_by: user.user_id })
        ]);

        res.locals = { status: true, message: Messages.PASSWORD_RESET_SUCCESS_PLEASE_LOGIN_WITH_YOUR_NEW_PASSWORD };
        return await JsonResponse.jsonSuccess(req, res, "resetPassword");
    };




};