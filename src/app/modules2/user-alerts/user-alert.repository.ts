import { IIndexParam, IIndexProjection, ISort } from "../../interfaces/IRepository";
import {BaseRepository} from "../BaseRepository";
import mongoose, {Types} from "mongoose";
import { IUser } from "../user/user.types";
import userModel from "../user/user.model";
import { Errors } from "../../constants";
import { IUserAlerts } from "./user-alert.types";
import userAlertModel from "./user-alert.model";
import alertLevelModel from "../alert-configuration/alert-level/alert-level.model";
import companyModel from "../company/company.model";
import roleModel from "../role/role.model";

export class UserAlertRepository extends BaseRepository<IUserAlerts> {
    constructor () {
        super(userAlertModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam, user: IUser['_id']): Promise<object[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false, userIds: mongoose.Types.ObjectId(user as string)};
        let secondCond: any = {} //Todo add isDeleted condition here in every table
        let sort: ISort = {}, projection: IIndexProjection = {"userId.password": 0}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v}: ISort = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1}

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                // else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
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
            {$lookup: {from: 'users', localField: 'userIds', foreignField: '_id', as: 'userIds'}},
            // {$lookup: {from: alertLevelModel.collection.name, localField: 'level', foreignField: '_id', as: 'level'}},{$unwind: {path: "$level", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'createdBy.companyId', foreignField: '_id', as: 'createdBy.companyId'}},{$unwind: {path: "$createdBy.companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: roleModel.collection.name, localField: 'createdBy.roleId', foreignField: '_id', as: 'createdBy.roleId'}},{$unwind: {path: "$createdBy.roleId", preserveNullAndEmptyArrays: true}},

        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["userId.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    count = async(user: IUser['_id']) => {
        let cond: any = {'isDeleted': false, userIds: mongoose.Types.ObjectId(user as string)};
        let count: any = {}
        await userAlertModel.countDocuments(cond).then((value: Number) => count['totalCount'] = value)
        return count
    }
}