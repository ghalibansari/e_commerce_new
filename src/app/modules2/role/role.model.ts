import {model, Schema} from "mongoose";
import {IRole} from "./role.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


//user schema.
const roleSchema: Schema<IRole> = new Schema({
    code: {type: String, required: true, unique: true},
    shortDescription: {type: String, required: true},
    longDescription: {type: String, required: true},
    companyTypeId: {type: ObjectId, required: true, ref: TableName.COMPANY_TYPE},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

}, {timestamps: true, versionKey: false});

const roleModel = model<IRole>(TableName.ROLE, roleSchema);

export default roleModel