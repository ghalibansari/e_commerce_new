import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {ISku, skuCollateralStatusEnum, skuColorTypeEnum, skuDmStatusEnum, skuGemlogistStatusEnum, skuRfIdStatusEnum, skuStoneStatusEnum} from './sku.types'

const {Types: {ObjectId, String, Boolean, Number}} = Schema


//Sku schema.
const skuSchema: Schema<ISku> = new Schema({
    infinityRefId: {type: String, required: true, unique: true},
    // isCollateral: {type: Boolean},
    deviceId: {type: ObjectId, ref: TableName.DEVICE},
    clientRefId: {type: String, required: true},
    infinityShape: {type: String, required: true},
    iavId: {type: ObjectId, ref: TableName.IAV},
    clientShape: {type: String, required: true},
    labShape: {type: String, required: true},
    shape: {type: String, required: true},
    labsId: [{type: ObjectId, ref: TableName.LAB, required: true}],
    weight: {type: Number, required: true},
    colorCategory: {type: String, required: true},
    colorSubCategory: {type: String, default: ""},
    gradeReportColor: {type: String, required: true},
    colorRapnet: {type: String, required: true},
    clarity: {type: String, required: false},
    cut: {type: String, default: ""},
    measurement: {type: String, default: ""},
    colorType: {type: String, required: true, enum: Object.values(skuColorTypeEnum)},
    comments: [{type: ObjectId, ref: TableName.COMMENT}],
    companyId: {type: ObjectId, ref: TableName.COMPANY, required: true},
    rfId: {type: ObjectId, ref: TableName.RFID},
    polish: {type: String, default: ""},
    tagId: {type: String, default: ""},
    symmetry: {type: String, default: ""},
    dmGuid: {type: String, unique: true, sparse: true},
    stoneRegistration: {type: Boolean, default: false},
    skuInfinityPriceId: {type: ObjectId, ref: TableName.SKU_INFINITY_PRICE},
    error: [{
        code: {type: String, default: ""},
        description: {type: String, default: ""},
        createdBy: {type: ObjectId, ref: TableName.USER, default: null},
        createdAt: {type: Date, required: true}
    }, {_id: false}],    //Todo implement proper enum's in project...
    // movementStatus: {type: String, default: null, enum:
    //     ['INVENTORY', 'ALERT', 'IN', 'OUT', 'APPROVED','REJECTED','IMPORTED', 'FINGERPRINT', 'ARRIVAL', 'OPENBIZ', 'CLOSEBIZ',
    //     'SOLD', 'VAULT', 'MISSING', 'RESTART', 'RETURN', 'PING', 'OPERATIONAL', 'STANDBY', 'TRANSIT', "COLLATERAL","CONSIGNMENT", "ARRIVAL"]},
    // status: {type: String, default: null},
    stoneStatus: {type: String, default: skuStoneStatusEnum.ARRIVAL, enum: Object.values(skuStoneStatusEnum)},
    rfIdStatus: {type: String, default: skuRfIdStatusEnum[""], enum: Object.values(skuRfIdStatusEnum)},
    collateralStatus: {
        type: String,
        default: skuCollateralStatusEnum[""],
        enum: Object.values(skuCollateralStatusEnum)
    },
    fluorescence: {type: String},
    gemlogistStatus: {
        type: String,
        default: skuGemlogistStatusEnum.NO_ACTION,
        enum: Object.values(skuGemlogistStatusEnum)
    },
    dmStatus: {type: String, default: skuDmStatusEnum.NOT_APPLICABLE, enum: Object.values(skuDmStatusEnum)},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},
    pwvImport: {type: String},
    reader: {type: Object},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
}, {timestamps: true, versionKey: false});

const skuModel = model<ISku>(TableName.SKU, skuSchema);

export default skuModel
