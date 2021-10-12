import {Document, model, Schema} from "mongoose";
import {IDisplayConfiguration} from './diaplay-configuration.types'
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema

export const displayConfigurationSchema: Schema = new Schema<Document<IDisplayConfiguration>>({
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    roleId: {type: ObjectId, ref: TableName.ROLE, required: true},
    userId: {type: ObjectId, ref: TableName.USER},
    /*text: {type: String, required: true},
    sequence: {type: Number, default: null},
    preFix: {type: String, default: ""},
    postFix: {type: String, default: ""},
    align: {type: String, enum:['center', 'right', 'left', null], default: null},
    valKey: {type: String, default: ""},*/
    screen:{type: String, default: ""},
    config:{type:Array},    //Todo define Proper Array structure...
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},

}, {timestamps: true, versionKey: false});


//     dbField: {type: String, required: true},
//     display: {type: String,default:""},
//     alignment: {type: String, enum:['Center', 'Right', 'Left', null], default: null},
//     prefix: {type: String, default: ""},
//     postfix: {type: String, default: ""},
//     companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
//     roleId: {type: ObjectId, ref: TableName.ROLE, required: true},
//     screen: {type: String, required: true},
//     isActive: {type: Boolean, default: 1},
//     isDeleted: {type: Boolean, default: 0},
//     createdBy: {type: ObjectId, ref: TableName.USER},
//     updatedBy: {type: ObjectId, ref: TableName.USER},
// }, {timestamps: true, versionKey: false});

const displayConfigurationModel = model<IDisplayConfiguration>(TableName.DISPLAY_CONFIGURATION, displayConfigurationSchema);

export default displayConfigurationModel