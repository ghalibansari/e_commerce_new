import mongoose, {model, Schema} from "mongoose";
import {IComment} from "./comment.types";
import {TableName} from "../../constants";
const {Types: {ObjectId, String, Boolean}} = Schema


//Comments schema.
const commentSchema: Schema<IComment> = new Schema({
    comment: {type: String},
    isDeleted: {type: Boolean, default: 0},
    createdBy: {type: ObjectId, ref: TableName.USER, required: true},
}, {timestamps: {createdAt: true, updatedAt: false}});

const commentModel = model<IComment>(TableName.COMMENT, commentSchema);

export default commentModel
export {commentSchema}