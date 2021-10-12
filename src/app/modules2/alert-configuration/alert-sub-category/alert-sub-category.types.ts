import { IUser } from "../../user/user.types";
import {Document, ObjectId} from "mongoose";
import { IAlertCategory } from "../alert-category/alert-category.types";

export interface IAlertSubCategory extends Document {
    _id: ObjectId,
    alertCategoryId: IAlertCategory['_id']
    subCategory: string,
    isActive:boolean;
    isDeleted:boolean;
    createdBy: IUser['_id'];
    updatedBy: IUser['_id'];
    createdAt: Date;
    updatedAt: Date;

}