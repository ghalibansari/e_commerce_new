import {BaseRepository} from "../BaseRepository";
import { IRapNetPrice } from "./rap-net-price.types";
import rapNetPriceModel from "./rap-net-price.model";
import { IUser } from "../user/user.types";
import userModel from "../user/user.model";
import mongoose, {ClientSession, Types} from "mongoose";
import { IIndexProjection } from "../../interfaces/IRepository";
import { Texts } from "../../constants";

export class RapNetPriceRepository extends BaseRepository<IRapNetPrice> {
    constructor () {
        super(rapNetPriceModel);
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> =>
    {
        let cond: {[p: string]: string|boolean|Types.ObjectId|{$in: any[]}|{$gte: any}|{$lte: any}} = {'isDeleted': false};
        let secondCond: {[p: string]: string|boolean|Types.ObjectId|{$in: any[]}|{$gte: any}|{$lte: any}|{[q: string]: {$regex: string, $options: "i"}}[]} = {     //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
        };
        let sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0, 'userId.password': 0}, status: any = []

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            //const {key: k, value: v} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = {createdAt: -1, updatedAt: -1};

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key:k, value:v}: {k: string, v: string|string[]|number[]|(Types.Object)[]}) => {
                if(k === 'startDate' || k === 'endDate') {
                    //@ts-expect-error
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    //@ts-expect-error
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    //@ts-expect-error
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === 'startEffectiveDate' || k === 'endEffectiveDate') {
                    //@ts-expect-error
                    if(!(cond['effectiveDate'] instanceof Object)) cond['effectiveDate'] = {}
                    //@ts-expect-error
                    if(k === 'startEffectiveDate') cond['effectiveDate']['$gte'] = new Date(v as string)
                    //@ts-expect-error
                    if(k === 'endEffectiveDate') cond['effectiveDate']['$lte'] = new Date(v as string)
                }
                else if(k==='weight' || k==='price' || k==='rapList' || k==='rapNetDiscount') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        let aggregate = [
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
        ]
        const sCond = [
            {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]},
            {$match: secondCond}, {$project: projection},
        ]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        
        let data = await rapNetPriceModel.aggregate([
            { $match: {isDeleted: false} },
            {
                $group: {
                    _id: null,
                    "shape": { "$addToSet": "$shape" },
                    "clarity": { "$addToSet": "$clarity" },
                    "color": { "$addToSet": "$color" },
                    "rapList": { "$addToSet": "$rapList" },
                    "weightRange": { "$addToSet": "$weightRange" },
                    "price": { "$addToSet": "$price" },
                    "rapNetDiscount": {"$addToSet" : "$rapNetDiscount"}
                }
            },
            {$project: {_id: 0}}
        ]).then(data => data[0])        

        return data
    } 
}