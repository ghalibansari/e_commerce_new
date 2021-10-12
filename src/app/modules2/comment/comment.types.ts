import {Document} from "mongoose";


export interface IComment extends Document {
    _id: string;
    comment: string;
    isDeleted:boolean;
    createdBy:string;
    createdAt:Date;
}