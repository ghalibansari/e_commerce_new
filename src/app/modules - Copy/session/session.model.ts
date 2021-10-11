import {model, Schema} from "mongoose";
import {ISession, sessionLoginTypeEnum} from './session.types'
import {addressSchema} from "../address/address.model";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


const sessionSchema = new Schema<ISession>({
    userId: {type: ObjectId, ref: TableName.USER, required: true},
    token: {type: String, required: true},
    ip: {type: String, required: true},
    loginType: {type: String, required: true, enum: Object.values(sessionLoginTypeEnum)},
    isLoggedIn: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: false},
}, {timestamps: true, versionKey: false});

const sessionModel = model<ISession>(TableName.SESSION, sessionSchema);

export default sessionModel