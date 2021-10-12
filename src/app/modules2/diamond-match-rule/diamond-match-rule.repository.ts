import {BaseRepository} from "../BaseRepository";
import diamondMatchRuleModel from "./diamond-match-rule.model";
import {IDiamondMatchRule} from "./diamond-match-rule.types"
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import {IUserNested} from "../user/user.types";
import mongoose, {Types} from "mongoose";

export class DiamondMatchRuleRepository extends BaseRepository<IDiamondMatchRule> {
    constructor(){
        super(diamondMatchRuleModel)
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<IUserNested[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {__v: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k]: v}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'companyId.name': _S}, {'companyId.contacts.number': _S},{'companyId.contacts.name': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                // if(k === 'startDate' || k === 'endDate') {
                //     if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                //     if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                //     if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                // }
                // else
                if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
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
            // {$match: cond},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    findAll = async (condition: object = {}) => diamondMatchRuleModel.find(condition)
}