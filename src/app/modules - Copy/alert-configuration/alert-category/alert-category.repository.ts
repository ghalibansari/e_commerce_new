import {BaseRepository} from "../../BaseRepository";
import alertCategoryModel from "./alert-category.model";
import userModel from "../../user/user.model";
import { IIndexParam } from "../../../interfaces/IRepository";
import { ILoggerNested } from "../../loggers/logger.types";
import mongoose, {ClientSession, Types} from "mongoose";
import { IUser } from "app/modules/user/user.types";
import { IAlertCategory } from "./alert-category.types";
import alertSubCategoryModel from "../alert-sub-category/alert-sub-category.model";

export class AlertCategoryRepository extends BaseRepository<IAlertCategory> {
    constructor () {
        super(alertCategoryModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<ILoggerNested[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            //const {key, value} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = {createdAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'category': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            // for(const {key: k, value: v} of filters) {
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === "companyId") {}
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            {$unset: ['createdBy.password', 'updatedBy.password']}
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    delete = async (_id: IAlertCategory['_id'], loggedInUserId: IUser['_id'], session: ClientSession): Promise<number> => {
        const alertSubCategory = await alertSubCategoryModel.findOne({alertCategoryId: _id, isDeleted: false})
        if(alertSubCategory) throw 'Cannot Delete alert category is used in alert sub category.'
        const deleted = await alertCategoryModel.updateOne({_id, isDeleted: false}, {isDeleted: true, updatedBy: loggedInUserId}, {session});
        return deleted.nModified
    }

    async filter(userId: IUser['_id']): Promise<any> {
       return await alertCategoryModel.aggregate([
            {$match: {isDeleted: false }},
            {$group: {_id: null, category: {"$addToSet": "$category"}}},
            {$project: {_id: 0, category: 1}}
        ]).then(([data]) => data)
    } 
}