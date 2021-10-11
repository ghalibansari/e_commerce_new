import {model, Schema} from "mongoose";
import {IAclUserUrl} from "./acl-user-url.types";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema



//aclModule schema.
const aclUserUrlSchema: Schema<IAclUserUrl> = new Schema({
    userId: { type: ObjectId, ref: TableName.USER, required: true},
    urlId: { type: ObjectId, ref: TableName.ACL_URL , required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false});

const aclUserUrlModel = model<IAclUserUrl>(TableName.ACL_USER_URL, aclUserUrlSchema);

export default aclUserUrlModel