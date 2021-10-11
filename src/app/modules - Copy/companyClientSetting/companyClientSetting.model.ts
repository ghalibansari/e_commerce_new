import {Document, model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {ICompanyClientSetting, ICompanyClientSettingIsOpenBusiness} from "./companyClientSetting.types";


const {Types: {ObjectId, String, Boolean, Number, }} = Schema


//user schema.
const companyClientSettingSchema: Schema = new Schema<Document<ICompanyClientSetting>>({
    diamondMatchRegistration: {type: Boolean, required: true, default: false},
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true, unique: true },
    ltv: {type: Number, default: 0, min: 0, max: 100}, 
    isOpenBusiness: {type: String, required: true, enum: Object.values(ICompanyClientSettingIsOpenBusiness), default: ICompanyClientSettingIsOpenBusiness.NO},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER },
    updatedBy: {type: ObjectId, ref: TableName.USER },
}, {timestamps: true, versionKey: false});

const companyClientSettingModel = model<ICompanyClientSetting>(TableName.COMPANY_CLIENT_SETTING, companyClientSettingSchema);

//@ts-ignore
export default companyClientSettingModel