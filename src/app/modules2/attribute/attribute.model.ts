import {model, Schema} from "mongoose";
import {IAttribute} from "./attribute.types";
import { TableName } from "../../constants"

const {Types: {ObjectId, String, Boolean}} = Schema


const attributeSchema: Schema<IAttribute> = new Schema({
    key: {type: String, required: true},
    value: {type: String, required: true}
});

const attributeModel = model<IAttribute>(TableName.ATTRIBUTE, attributeSchema);

export default attributeModel;
export {attributeSchema}