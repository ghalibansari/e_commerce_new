import {model, Schema} from "mongoose";
import {IAclModule} from "./acl-module.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


//aclModule schema.
const aclModuleSchema: Schema<IAclModule> = new Schema({
    moduleName: {type: String, required: true, unique: true},
    moduleUrl: {type: String, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const aclModuleModel = model<IAclModule>(TableName.ACL_MODULE, aclModuleSchema);

export default aclModuleModel