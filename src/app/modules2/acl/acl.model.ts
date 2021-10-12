import {model, Schema, Document} from "mongoose";
import {IAcl} from "./acl.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


//aclModule schema.
//@ts-ignore //Todo remove this line...
const aclSchema: Schema<IAcl> = new Schema({
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    userId: {type: ObjectId, ref: TableName.USER, required: true},
    module: {type: String, required: true},
    url: {type: String, required: true},
    isDelete: {type: Boolean, default: false},
    viewAll: {type: Boolean, default: false},
    viewOne: {type: Boolean, default: false},
    add: {type: Boolean, default: false},
    edit: {type: Boolean, default: false},
    delete: {type: Boolean, default: false},
    faker: {type: Boolean, default: false},//Todo remove this in Production.
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const aclModel = model<IAcl>(TableName.ACL, aclSchema);

export default aclModel