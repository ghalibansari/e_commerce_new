import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {TryCatch, JsonResponse} from "../../helper";
import {guard} from "../../helper/Auth";
import VerificationBusiness from "./verification.bussiness";
import { IVerification } from "./verification.types";
import UserBusiness from "../user/user.business";
import {Messages} from "../../constants";
import {BaseHelper} from "../BaseHelper";
// import lo from "lodash"
import {UserValidation} from "../user/user.validation";
import {VerificationValidation} from "../verification/verification.validation"

export class VerificationController extends BaseController<IVerification> {
    constructor() {
        super(new VerificationBusiness(), "verification", true);
        this.init();
    }

    register(express: Application): void {
        express.use('/api/v1/verification', this.router);
    }

    init(): void {
        const validation: VerificationValidation = new VerificationValidation();
        //const validation: UserValidation = new UserValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        // this.router.post("/", validation.createUser, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateUser, TryCatch.tryCatchGlobe(this.updateBC));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        //this.router.post("/send-otp",guard,validation.sendOtpValidation,TryCatch.tryCatchGlobe(this.sendOtp));
    }

    // async sendOtp(req: Request, res: Response): Promise<void> {
    //     let { body, body: { _id }, body: { loggedInUser: { _id: loggedInUserId } } } = req
    //     res.locals = { status: false, message: Messages.FAILED, data: null };
    //     let userData = await new UserBusiness().findOneBB({ _id: loggedInUserId, isDeleted: false, isActive: true })
    //     const ip = req.connection.remoteAddress || req.socket.remoteAddress
    //     let otp = Math.floor(100000 + Math.random() * 900000).toString();
    //     if (otp.length < 6) otp = otp + "0";
    //     let lead_mail_body: any = otp
    //     //@ts-expect-error
    //     new BaseHelper().emailSend('otp_mail', { LEAD_BODY: lead_mail_body, NAME: `${userData.firstName} ${userData.lastName}`, OTP: otp }, userData.email).then()
    //     //@ts-expect-error
    //     const verifyToBeInserted = { userId: userData._id, operation: body.operation, module: body.module, otp, ip, createdBy: userData._id, updatedBy: userData._id }
    //     //@ts-expect-error
    //     const verifyData = await new VerificationBusiness().createBB(verifyToBeInserted)
    //     if (verifyData) res.locals = { data: null, message: Messages.OTP_SENT_SUCCESSFULLY }
    //     await JsonResponse.jsonSuccess(req, res, "login");
    // }

    // async create(req: Request, res: Response): Promise<void> {
    //     //let { body, body: { _id, loggedInUser: { _id: loggedInUserId } } } = req
    //     let body = req.body;
    //     let userData = await new UserBusiness().findOneBB({ "email": body.email })
    //     // console.log("-->",userData);
    //     if (!userData) throw new Error("Invalid email")
    //      body.userId = userData._id
    //     // let userIdData = await new UserBusiness().findIdByIdBB(body.userId)
    //     // if (!userIdData ?._id) throw new Error("Invalid userId")
    //     // console.log(userIdData);
    //
    //     let random = Math.floor(100000 + Math.random() * 900000).toString();
    //     if (random.length < 6) {
    //         random = random + "0";
    //     }
    //     body.otp = random
        // body.createdBy = body.updatedBy = loggedInUserId
        // let [emailData, createData,] = await Promise.all([
        //     new VerificationController().sendEmail(body),
        //     new VerificationBusiness().createBB(body)
        //    ])
    //    let emailRes = await new VerificationController().sendEmail(body);
    //    console.log(emailRes);
    //
    //     res.locals.data = await new VerificationBusiness().createBB(body);
    //     res.locals.message = Messages.CREATE_SUCCESSFUL;
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    // }

    // async sendEmail(body:IVerification): Promise<void|never> {
    //     let lead_mail_body: any = `<table border=1 id="table"><tr><th> Otp. </th><th> Email. </th></tr>`;
    //     lead_mail_body += `<tr><td>'test otp mail'</td><td>Your OTP is</td></tr>`;
    //     lead_mail_body += `</table>`;
    //     const mail: BaseHelper = new BaseHelper();
    //     const x = await new BaseHelper().emailSend('test_otp_mail',{LEAD_BODY: lead_mail_body, OTP:body.otp }, body.email)
    //     // const x = await new BaseHelper().emailSend('test',lead_mail_body, 'ghalibansari1994@gmail.com','','', [{path: '../../../public/INFINITY.zip', filename: 'INFINITY.zip'}])
    //     return x;
    //     // res.locals.message = "email send";
    //     // await JsonResponse.jsonSuccess(req, res, "email");
    // }

    // async verify(req: Request, res: Response): Promise<void> {
    //     // let { body, body: { _id, loggedInUser: { _id: loggedInUserId } } } = req
    //     let body = req.body;
    //     let userData = await new UserBusiness().findOneBB({ "email": body.email })
    //     // console.log("-->",userData);
    //     if (!userData) throw new Error("Invalid email")
    //     let userId = userData._id
    //     let verifyData = await new VerificationBusiness().findBB({ "userId": userId }, {}, { "createdAt": -1 }, 1, 0, [])
    //     if (!(verifyData.length > 0)) throw new Error("OTP data unavailable for userId")
    //     // console.log("V-->", verifyData);
    //     let currentotp = verifyData[0].otp
    //     res.locals.message = (currentotp === body.otp) ? Messages.VALID_OTP : Messages.INVALID_OTP
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.verify`)
    // }
}