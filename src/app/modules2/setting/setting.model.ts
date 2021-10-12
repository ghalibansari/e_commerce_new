import {model, Schema} from "mongoose";
import {giaKeyEnum, ISetting} from './setting.types'
import {TableName} from "../../constants";
import {genSaltSync, hashSync} from "bcrypt";
const {Types: {ObjectId, String, Boolean, Number}} = Schema


//user schema.
const settingSchema: Schema<ISetting> = new Schema<ISetting>({
    giaProductionKey: {type: String, required: true, unique: true},
    giaSandBoxKey: {type: String, required: true, unique: true},
    powerBiUrl: {type: String, required: true, unique: true},
    EmailId: {type: String, required: true, unique: true},
    EmailPassword: {type: String, required: true, unique: true},
    MailSender: {type: String, required: true, unique: true},
    EmailFrom: {type: String, required: true, unique: true},
    EmailTo: {type: String, required: true, unique: true},
    EmailHost: {type: String, required: true, unique: true},
    EmailPort: {type: Number, required: true},
    EmailSecure: {type: Boolean, default: false},
    cdnUrl: {type: String, required: true, unique: true},
    giaKey: {type: String, required: true, enum: Object.values(giaKeyEnum), unique: true},
    masterPassword: {type: String, required: true, unique: true},
    defaultPageSize: {type: Number, required: true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER },
    updatedBy: {type: ObjectId, ref: TableName.USER },
}, {timestamps: true, versionKey: false});

settingSchema.pre('save', function async (next) {
    this.masterPassword = hashSync(this.masterPassword, genSaltSync(8))
    next()
})

settingSchema.pre('updateOne', function async (next: any) {
    //@ts-expect-error
    if(this?._update?.masterPassword) this._update.masterPassword = hashSync(this._update.masterPassword, genSaltSync(8))
    next()
})

const settingModel = model<ISetting>(TableName.SETTING, settingSchema);

export default settingModel
