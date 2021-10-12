import {Application, Request, Response} from 'express';
import {Constant, Messages} from '../../constants';
import {JsonResponse, TryCatch} from '../../helper';
import {BaseController} from '../BaseController';
import {IUser, userverificationMethodEnum} from '../user/user.types';
import UserBusiness from "../user/user.business";
import jwt from "jsonwebtoken";
import {AES} from "crypto-js";
import {AuthValidation} from "./auth.validation";
import VerificationBusiness from "../verification/verification.bussiness";
import Moment from "moment";
import {BaseHelper} from "../BaseHelper";
import {guard} from "../../helper/Auth"
import {RoleRepository} from "../role/role.repository";
import {PermissionController} from "../permission/permission.controller";
import {CompanyRepository} from "../company/company.repository";
import userModel from "../user/user.model";
import bcrypt from 'bcrypt'
import sessionModel from "../session/session.model";
import {sessionLoginTypeEnum} from "../session/session.types";
import skuModel from "../sku/sku.model";
import {skuDmStatusEnum} from "../sku/sku.types";
import mongoose from "mongoose";
import initMB from 'messagebird';
const messageBird = initMB(Constant.MessageBird_Token);

/**
 * Auth API
 */
export class AuthController extends BaseController<any> {

    //protected UserValidation:UserValidation;

    constructor() {
        super('','auth');
        this.init();
    }

    /**
     * To register auth module base API
     * @param express
     */
    public register(express: Application) : void{
        express.use('/api/v1/auth', this.router);
    }

    /**
     * Initialize the API for authentication
     * { host/api/auth }
     */
    public init() {
        const validation: AuthValidation = new AuthValidation();
        this.router.post('/login', validation.login,TryCatch.tryCatchGlobe(this.devLogin));
        this.router.post('/ping', validation.login,TryCatch.tryCatchGlobe(this.ping));
        this.router.post('/hash', validation.login,TryCatch.tryCatchGlobe(this.hash));
        this.router.post('/newlogin', validation.login,TryCatch.tryCatchGlobe(this.login));
        this.router.post('/newloginverify', validation.loginVerify, TryCatch.tryCatchGlobe(this.loginVerify));
        this.router.post('/chnagepassword', validation.changePassword, TryCatch.tryCatchGlobe(this.changePassword));
        this.router.post('/changepasswordverify', validation.changePasswordVerify, TryCatch.tryCatchGlobe(this.changePasswordVerify));;
        this.router.post('/forgetpassword', validation.forgetPassword, TryCatch.tryCatchGlobe(this.forgetPassword));
        this.router.post('/forgetpasswordverify', validation.forgetPasswordVerify, TryCatch.tryCatchGlobe(this.forgetPasswordVerify));
        this.router.post('/logout',guard, TryCatch.tryCatchGlobe(this.logout))
        // this.router.get('/is-logged-in',AuthHelper.guard, TryCatch.tryCatchGlobe(this.isLoggedIn));
        // this.router.post('/getJWT', TryCatch.tryCatchGlobe(AuthHelper.getJWToken));
    }

    async ping(req: Request, res: Response): Promise<void> {    //Todo test function remove in production.
        res.locals = {data: 'empty', message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, "ping");
    }

    async hash(req: Request, res: Response): Promise<void> {    //Todo test function remove in production.
        const userData = await userModel.find()
        for await(let {email, password: oldPassword} of userData) {
            let password = bcrypt.hashSync(oldPassword, bcrypt.genSaltSync(10))
            await userModel.updateOne({email}, {password})
            console.log('updated for Email: ',email, password)
        }
        res.locals = {data: 'empty', message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, "ping");
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        res.locals = {message: Messages.FAILED, data: null};
        const verificationBusinessInstance = new VerificationBusiness()
        const {body:{email, oldpassword, newpassword}} = req
        const ip = req.connection.remoteAddress || req.socket.remoteAddress
        let userData = await new UserBusiness().findOneBB({email, isDeleted: false, isActive: true})
        let compare = bcrypt.compareSync(oldpassword, <string>userData?.password)
        if(oldpassword === newpassword) res.locals.message = Messages.OLD_PASSWORD_AND_NEW_PASSWORD_ARE_SAME
        else if(userData && compare){
            const verify = await verificationBusinessInstance.findOneBB({userId: userData._id, isVerified: false, operation: 'changepassword'}, {createdAt: 'desc'})
            if(verify && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) res.locals = {data: null, message: Messages.OTP_IS_ALREADY_SENT}
            else{
                let otp = Math.floor(100000 + Math.random() * 900000).toString();
                if (otp.length < 6) otp = otp + "0";
                let lead_mail_body: any = otp
                await new BaseHelper().emailSend('change_password',{LEAD_BODY: lead_mail_body, NAME: `${userData.firstName} ${userData.lastName}`, OTP: otp}, userData.email)
                const verifyToBeInserted = {userId: userData._id, operation: 'changepassword', otp, ip, createdBy: userData._id, updatedBy: userData._id}
                //@ts-expect-error
                const verifyData = await verificationBusinessInstance.createBB(verifyToBeInserted)
                if(verifyData) {
                    res.locals = {data: null, message: Messages.OTP_SENT_SUCCESSFULLY}
                    await JsonResponse.jsonSuccess(req, res, "changePassword");
                }
            }
        }
        else res.locals.message = Messages.INVALID_EMAIL_OLD_PASSWORD
        await JsonResponse.jsonError(req, res, "changePassword");
    }

    async changePasswordVerify(req: Request, res: Response): Promise<void> {
        res.locals = {message: Messages.FAILED, data: null};
        const verificationBusinessInstance = new VerificationBusiness()
        const {body:{email, oldpassword, newpassword, otp}} = req
        const ip = req.connection.remoteAddress || req.socket.remoteAddress
        let userData = await new UserBusiness().findOneBB({email, isDeleted: false, isActive: true})
        let compare = bcrypt.compareSync(oldpassword, <string>userData?.password)
        if(oldpassword === newpassword) res.locals.message = Messages.OLD_PASSWORD_AND_NEW_PASSWORD_ARE_SAME
        else if(userData && compare){
            const verify = await verificationBusinessInstance.findOneBB({userId: userData._id, isDeleted: false, ip, operation: 'changepassword'}, {createdAt: 'desc'})
            if(verify && verify.otp == otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
                //@ts-expect-error
                const verifyData = await verificationBusinessInstance.updateBB({_id: verify._id}, {updatedBy: userData._id, isVerified: true, isActive: false})
                if(verifyData){
                    const saltRounds = 10;  //Todo create a separate common function to encrypt password
                    let salt = bcrypt.genSaltSync(saltRounds)
                    let password = bcrypt.hashSync(newpassword, salt)
                    //@ts-expect-error
                    const user = await new UserBusiness().updateBB({email}, {password})
                    if(user.nModified){
                        res.locals = {data: null, message: Messages.PASSWORD_CHANGED_SUCCESSFULLY}
                        await JsonResponse.jsonSuccess(req, res, "changePasswordVerify");
                    }
                }
            }
            else res.locals.message = Messages.INVALID_OTP
        }
        else res.locals.message = Messages.INVALID_EMAIL_OLD_PASSWORD
        await JsonResponse.jsonError(req, res, "changePasswordVerify");
    }

    async login(req: Request, res: Response): Promise<void> {   //Todo optimize this whole Auth controller
        const verificationBusinessInstance = new VerificationBusiness()
        const {body:{email, password}} = req
        res.locals = {message: Messages.FAILED, data: null};
        const ip = req.connection.remoteAddress || req.socket.remoteAddress
        let userData = await new UserBusiness().findOneBB({email, isDeleted: false, isActive: true})
        let compare = bcrypt.compareSync(password, <string>userData?.password)
        // if(!compare) {

        if(!userData) {
            res.locals.data = null;
            res.locals.message = "Invalid Email";
            return JsonResponse.jsonError(req, res, "login");
        }
        else if(!compare)
        {
            res.locals.data = null;
            res.locals.message = "Invalid Password.";
            return JsonResponse.jsonError(req, res, "login");
        }
        else {

            let otp = Math.floor(100000 + Math.random() * 900000).toString();
            if (otp.length < 6) otp = otp + "0";
            let lead_mail_body: any = otp
            // console.log(userData?.verificationMethod, "=============checking");            
            if(userData?.verificationMethod === userverificationMethodEnum.EMAIL || !userData?.verificationMethod) {
                // console.log("======coming insideEmail");        
                await new BaseHelper().emailSend('otp_login',{LEAD_BODY: lead_mail_body, NAME: `${userData.firstName} ${userData.lastName}`, OTP: otp}, userData.email)
                const verifyToBeInserted = {userId: userData._id, operation: 'login', type: userverificationMethodEnum.EMAIL, otp, ip, createdBy: userData._id, updatedBy: userData._id}
                //@ts-expect-error
                const verifyData = await verificationBusinessInstance.createBB(verifyToBeInserted)
                if(verifyData)
                {
                    res.locals = {data: null, message: Messages.OTP_SENT_SUCCESSFULLY}
                    await JsonResponse.jsonSuccess(req, res, "login");
                }
            }
            else {
                // console.log("coming inside mobile===========");  
                messageBird.messages.create({
                    originator : 'otp',
                    recipients : [ userData?.interNationalCode + userData?.phone ],
                    body : `use OTP ${otp} to login to your infinity account`
                 }, async (err, response) => {
                    if(err) res.send(err)
                    else {
                        // console.log(response, "========response");                     
                        const verifyToBeInserted = {userId: userData?._id, type: userverificationMethodEnum.MOBILE, messageId: response?.id,  otp, operation: 'login', ip, createdBy: userData?._id, updatedBy: userData?._id}
                        //@ts-expect-error
                        const verifyData = await verificationBusinessInstance.createBB(verifyToBeInserted)
                        if(verifyData)
                        {
                            res.locals = {data: null, message: Messages.OTP_SENT_SUCCESSFULLY_TO_YOUR_MOBILE}
                            await JsonResponse.jsonSuccess(req, res, "login");
                        }
            
                    }                
                 }); 
            }
        }
    }

    async loginVerify(req: Request, res: Response): Promise<void> {
        res.locals = {message: Messages.FAILED, data: null};
        const verificationBusinessInstance = new VerificationBusiness()
        const {body:{email, password, otp}} = req
        const ip = req.connection.remoteAddress || req.socket.remoteAddress
        let userData = await new UserBusiness().findOneBB({email, isDeleted: false, isActive: true})
        let compare = bcrypt.compareSync(password, <string>userData?.password)
        // console.log(userData);
        if(userData && compare){
            const [roleData, verify, companyData] = await Promise.all([
                await new RoleRepository().findOneBR({_id: userData?.roleId}),
                await verificationBusinessInstance.findOneBB({userId: userData._id, isActive: true, operation: 'login'}, {createdAt: -1}),
                await new CompanyRepository().findOneBR({_id: userData?.companyId})
            ])
            // const roleData = await new RoleRepository().findIdByIdBR(userData?.roleId)
            // const verify = await verificationBusinessInstance.findOneBB({userId: userData._id, isActive: true, operation: 'login'}, {createdAt: -1})
            req.body.loggedInUser = userData
            req.body.loggedInUser.roleName = roleData?.shortDescription
            const permissionData = await new PermissionController().per(req, res)
            if(verify && verify.otp == otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
                //@ts-expect-error
                const verifyData = await verificationBusinessInstance.updateManyBB({_id: verify._id}, {updatedBy: userData._id, isVerified: true, isActive: false})
                if(verifyData){
                    // const newIp = req.connection.remoteAddress || req.socket.remoteAddress
                    // await new SessionBusiness().createBB({userId: userData?._id, token: jwt_token_encrypt, ip: newIp})
                    // const sessionData = await new SessionBusiness().findOneBB({userId: userData._id},{createdAt: 'desc'})
                    const user: object = {_id: userData._id, email: userData.email, firstName: userData.firstName, lastName: userData.lastName, companyId: userData.companyId, company: companyData?.name, roleId: roleData?._id, roleName: roleData?.shortDescription, permission: permissionData[0]?.permission}    //Todo remove unnecessary data from token and user object
                    const jwt_token_encrypt = await jwt.sign({_id: userData._id, email: userData.email, companyId: userData.companyId,firstName:userData.firstName,lastName:userData.lastName, roleId: roleData?._id, roleName: roleData?.shortDescription}, Constant.jwt_key, {expiresIn: 7200})
                    const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString()
                    await sessionModel.create({userId: userData._id, ip, token: jwt_token, loginType: sessionLoginTypeEnum.email})
                    //@ts-expect-error
                    user.lastLogin = userData.updatedAt//sessionData?.createdAt;    //Todo, fix this and properly implement lastLogin time from session table. and implement sessions here.
                    res.locals = {data: {token: jwt_token, user}, message: Messages.SUCCESSFULLY_LOGIN}
                    return JsonResponse.jsonSuccess(req, res, "loginVerify");
                }
            }
            else res.locals.message = Messages.INVALID_OTP
        }
        return JsonResponse.jsonError(req, res, "loginVerify");
    }

    /**
     * This is to login
     * @param req
     * @param res
     */
    async devLogin(req: Request, res: Response): Promise<void> {
        try
        {
            const ip = req.connection.remoteAddress || req.socket.remoteAddress
            let body: IUser = req.body;
            let userData = await new UserBusiness().findOneBB({email: body.email, isDeleted: false, isActive: true})
            const [roleData, companyData] = await Promise.all([await new RoleRepository().findOneBR({_id: userData?.roleId}),
                await new CompanyRepository().findOneBR({_id: userData?.companyId})]);
            if(!userData) {
                res.locals.data = null;
                res.locals.message = "Invalid Credentials";
                return JsonResponse.jsonError(req, res, "login");
            }
            else {
                let compare = bcrypt.compareSync(body.password, userData.password)
                if(!compare) {
                    res.locals.data = null;
                    res.locals.message = "Invalid Credentials";
                    return JsonResponse.jsonError(req, res, "login");
                }
                req.body.loggedInUser = userData;
                req.body.loggedInUser.roleName = roleData?.shortDescription;
                const permissionData = await new PermissionController().per(req, res);
                const user: object = {_id: userData._id, email: userData.email, firstName: userData.firstName, lastName: userData.lastName, companyId: userData.companyId, company: companyData?.name, roleId: roleData?._id, roleName: roleData?.shortDescription, permission: permissionData[0]?.permission};
                const jwt_token_encrypt = await jwt.sign({_id: userData._id, email: userData.email, companyId: userData.companyId,firstName:userData.firstName,lastName:userData.lastName, roleId: roleData?._id, roleName: roleData?.shortDescription}, Constant.jwt_key, {expiresIn: 7200});
                const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString();
                await sessionModel.create({userId: userData._id, ip, token: jwt_token, loginType: sessionLoginTypeEnum.email})
                // res.locals.data = {token: jwt_token, user}
                // res.locals.message = Messages.SUCCESSFULLY_LOGIN;
                res.locals = {data: {token: jwt_token, user}, message: Messages.SUCCESSFULLY_LOGIN};
                await JsonResponse.jsonSuccess(req, res, "login");
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    async forgetPassword(req: Request, res: Response): Promise<void> {
        const verificationBusinessInstance = new VerificationBusiness()
        res.locals.message = Messages.FAILED
        let {body:{email}} : {body:IUser} = req
        const ip = req.connection.remoteAddress || req.socket.remoteAddress
        let userData = await new UserBusiness().findOneBB({email})
        if(userData){
            const verify = await verificationBusinessInstance.findOneBB({userId: userData._id, isVerified: false, operation: 'forgetPassword'}, {createdAt: 'desc'})
            if(verify && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
                res.locals.message = Messages.OTP_IS_ALREADY_SENT
            }
            else{
                let otp = Math.floor(100000 + Math.random() * 900000).toString();
                if (otp.length < 6) otp = otp + "0";
                let lead_mail_body: any = otp
                new BaseHelper().emailSend('otp_forget_password',{LEAD_BODY: lead_mail_body, NAME: `${userData.firstName} ${userData.lastName}`, OTP: otp}, userData.email).then()
                const verifyToBeInserted = {userId: userData._id, operation: 'forgetPassword', otp, ip, createdBy: userData._id, updatedBy: userData._id}
                //@ts-expect-error
                const verifyData = await verificationBusinessInstance.createBB(verifyToBeInserted)
                if(verifyData) {
                    res.locals.message = Messages.OTP_SENT_SUCCESSFULLY
                    return await JsonResponse.jsonSuccess(req, res, "forgetPassword");
                }
            }
        }
        await JsonResponse.jsonError(req, res, "forgetPassword");
    }

    async forgetPasswordVerify(req: Request, res: Response): Promise<void> {
        const verificationBusinessInstance = new VerificationBusiness()
        res.locals = {message: Messages.FAILED, data: null};
        const {body:{email, otp, password}} = req
        const userData = await new UserBusiness().findOneBB({email, isDeleted: false})
        // console.log(userData,'userData....................////////////////////////////////')
        const ip = req.connection.remoteAddress || req.socket.remoteAddress
        if(userData){   //Todo add ip later here...
            const verify = await verificationBusinessInstance.findOneBB({userId: userData._id, isDeleted: false, operation: 'forgetPassword'}, {createdAt: 'desc'})
            // console.log(verify, verify?.otp == otp, verify?.isActive, !verify?.isVerified, Moment(verify?.createdAt).add(10, 'minutes').format() > Moment().format(),';;;;;;;;;;;;;;;;;;;;;;;')
            // console.log('verify && verify.otp == otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, \'minutes\').format() > Moment().format()')
            if(verify && verify.otp == otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()){
                //@ts-expect-error
                const verifyData = await verificationBusinessInstance.updateManyBB({_id: verify._id}, {updatedBy: userData._id, isVerified: true, isActive: false})
                if(verifyData){
                    const saltRounds = 10;  //Todo create a separate common function to encrypt password
                    let salt = bcrypt.genSaltSync(saltRounds)
                    let newPassword = bcrypt.hashSync(password, salt)
                    //@ts-expect-error
                    const user = await new UserBusiness().updateManyBB({email}, {password: newPassword})
                    //@ts-expect-error
                    if(user?.nModified){
                        // const user: object = {email: userData.email, firstName: userData.firstName, lastName: userData.lastName}
                        // const jwt_token_encrypt = await jwt.sign({_id: userData._id, email: userData.email, companyId: userData.companyId}, Constant.jwt_key, {expiresIn: 36000})
                        // const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString()
                        // res.locals = {data: {token: jwt_token, user}, message: Messages.PASSWORD_CHANGED_SUCCESSFULLY}
                        res.locals.message = Messages.PASSWORD_CHANGED_SUCCESSFULLY
                        return await JsonResponse.jsonSuccess(req, res, "forgetPasswordVerify");
                    }
                }
            }
            else res.locals.message = Messages.INVALID_OTP
        }
        await JsonResponse.jsonError(req, res, "forgetPasswordVerify");
    }

    async logout(req: Request, res: Response): Promise<void> {
        let {body, body:{ loggedInUser:{_id:loggedInUserId}}} = req
        // let session = await new SessionBusiness().findAndUpdateBB({userId: loggedInUserId},{isLoggedIn : false})
        // if(session){
            res.locals.message = Messages.SUCCESSFULLY_LOGOUT
            await JsonResponse.jsonSuccess(req, res, "logout");
        // }
    }
}
