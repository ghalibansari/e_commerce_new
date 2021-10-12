import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {IAccess, IPermission} from "./permission.types";

const {Types: {ObjectId, String, Boolean}} = Schema


const permissionSchema: Schema = new Schema({
    companyId: {type: ObjectId, ref: TableName.COMPANY},
    userId: {type: ObjectId, ref: TableName.USER},
    roleId: {type: ObjectId, ref: TableName.ROLE},
    // permission: [{screen: {type: String, required: true}, access: [{type: String, enum: Object.keys(IAccess), required: true}]}],
    permission: [{
            _id: false,
            screen: {type: String, required: true},
            access: [{
                _id: false,
                key: {type: String, enum: Object.values(IAccess), required: true},
                value: {type: Boolean, default: 0}
            },{_id: false}]
        },{_id: false}],
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, default: null},
    updatedBy: {type: ObjectId, ref: TableName.USER, default: null},

}, {timestamps: true, versionKey: false});

const permissionModel = model<IPermission>(TableName.PERMISSION, permissionSchema);

export default permissionModel