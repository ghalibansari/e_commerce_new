import {model, Schema} from "mongoose"
import {IAclRoleUrl} from "./acl-role-url.types"
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


//aclModule schema.
const aclRoleUrlSchema: Schema<IAclRoleUrl> = new Schema({
    roleId: {type: ObjectId, ref: TableName.ROLE, required: true},
    urlId: { type: ObjectId, ref: 'AclUrl' , required: true},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: true, versionKey: false})

const aclRoleUrlModel = model<IAclRoleUrl>(TableName.ACL_ROLE_URL, aclRoleUrlSchema);

export default aclRoleUrlModel