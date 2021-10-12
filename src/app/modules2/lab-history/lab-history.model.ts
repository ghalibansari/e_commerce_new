import {model, Schema} from "mongoose";
import {TableName} from "../../constants";
import {ILabHistory} from "./lab-history.types";

const {Types: {ObjectId, String, Boolean, Number}} = Schema


//Sku schema.
const LabHistorySchema: Schema<ILabHistory> = new Schema({
    lab: {type: String, required: true},
    labReportId: {type: String, required: true},
    labReportPath: {type: String, required: false},
    labReportDate: {type: Date, required: false},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
    updatedBy: {type: ObjectId, ref: TableName.USER, required: true},

});



const labHistoryModel = model<ILabHistory>(TableName.LAB_HISTORY, LabHistorySchema);

export default labHistoryModel