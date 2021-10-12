import {BaseRepository} from "../BaseRepository";
import registerDeviceModel from "./register-device.model";
import { IRegisterDevice } from "./register-device.types";
import { ClientSession } from "mongoose";
import deviceModel from "../device/device.model";
import jwt from "jsonwebtoken";
import {AES} from "crypto-js";
import {Constant, Messages} from '../../constants';



export class RegisterDeviceRepository extends BaseRepository<IRegisterDevice> {
    constructor () {
        super(registerDeviceModel);
    }

    async create(body: any, session: ClientSession): Promise<any> {
        let populate = [{path: 'companyId'}];
        let device = await deviceModel.findOne({serialNumber: body.serialNumber, isDeleted: false}).populate(populate)
        let registerDevice = await registerDeviceModel.findOne({serialNumber: body.serialNumber, isDeleted: false}).sort({createdAt:-1})
        if(registerDevice) return {status: true, message: Messages.DEVICE_ALREADY_REGISTERED, data: registerDevice}
        if(device?._id && device?.companyId ) {
            //@ts-expect-error
            const jwt_token_encrypt = await jwt.sign({_id: device.companyId?._id, firstName:device.companyId?.name}, Constant.jwt_key)
            const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString()
            body.token = jwt_token
        }
        else throw new Error("Invalid serialNumber")
        let data = await registerDeviceModel.create([body], {session}).then( registerDevice => registerDevice[0])
        return {status: true, message: Messages.CREATE_SUCCESSFUL, data}
    }
}