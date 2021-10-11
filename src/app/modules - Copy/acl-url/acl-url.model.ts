import {model, Schema} from "mongoose";
import {IAclUrl} from "./acl-url.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


//aclModule schema.
const aclUrlSchema: Schema<IAclUrl> = new Schema({
    moduleId: { type: ObjectId, ref: TableName.ACL_MODULE , required: true},
    urlName: {type: String, required: true, unique:true},
    urlMethod: {type: String, required: true},
    url: {type: String, required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const aclUrlModel = model<IAclUrl>(TableName.ACL_URL, aclUrlSchema);

export default aclUrlModel