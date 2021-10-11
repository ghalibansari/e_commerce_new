import {model, Schema} from "mongoose";
import {IDiamondMatchRule} from "./diamond-match-rule.types";
import {paramsSchema} from "../params/params.model";
import {TableName} from "../../constants";

const {Types: {ObjectId, String, Boolean}} = Schema


const DiamondMatchRuleSchema: Schema<IDiamondMatchRule> = new Schema({
    param: paramsSchema,
    companyId: {type: ObjectId, ref: TableName.COMPANY, required:true},
    effectiveDate: {type: Date, required:true},
    isActive: {type: Boolean, default: 1},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER},
    updatedBy: {type: ObjectId, ref: TableName.USER},
   //
}, {timestamps: true, versionKey: false});

const diamondMatchRuleModel = model<IDiamondMatchRule>(TableName.DIAMOND_MATCH_RULE, DiamondMatchRuleSchema);

export default diamondMatchRuleModel