import { IIndexParam, IIndexProjection, ISort } from "../../../../interfaces/IRepository";
import {BaseRepository} from "../../../BaseRepository";
import clarityMasterModel from "../clarity-master/clarity-master.model";
import clarityRangeModel from "./clarity-range.model";
import { IClarityRange } from "./clarity-range.types";
import mongoose, {ClientSession} from "mongoose";
import { IUser } from "../../../user/user.types";
import { Messages } from "../../../../constants";


export class ClarityRangeRepository extends BaseRepository<IClarityRange> {
    constructor () {
        super(clarityRangeModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<object[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false};
        let secondCond: any = {} //Todo add isDeleted condition here in every table
        let sort: ISort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}

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
            // {$match: cond},
            {$lookup: {from: 'claritymasters', localField: 'fromClarity', foreignField: 'code', as: 'fromClarity'}},
            {$unwind: {path: "$fromClarity", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'claritymasters', localField: 'toClarity', foreignField: 'code', as: 'toClarity'}},
            {$unwind: {path: "$toClarity", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
            // {$unset: ["userId.password"]}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    // create = async (body: any): Promise<IClarityRange> => {
    //     let facetData = await clarityMasterModel.aggregate([
    //         {
    //             $facet: {
    //                 fromClarity:[{ $match:{clarity: body.fromClarity}}],
    //                 toClarity:[{ $match:{clarity: body.toClarity}}]
    //             }
    //         }
    //     ]).then(data => {
    //         let facetData: any = {};
    //         facetData.fromClarity = (data[0]?.fromClarity[0])? data[0].fromClarity[0] : undefined
    //         facetData.toClarity = (data[0]?.toClarity[0])? data[0].toClarity[0] : undefined
    //         return facetData
    //     });
    //     if(!facetData.fromClarity || !facetData.toClarity) throw new Error("clarity is not present");
    //     body.fromClarity = facetData.fromClarity.code;
    //     body.toClarity = facetData.toClarity.code;  
    //     return await clarityRangeModel.create(body);
    // }

    create = async (body: any, user: IUser['_id']) => {
        let clarityRangeData: IClarityRange[][] = [], existingRange : any = []
        const check = body.clarityRange.map(async (body: any) => {
            body.createdBy = body.updatedBy = user
            let facetData = await clarityMasterModel.aggregate([
                {
                    $facet: {
                        fromClarity: [{ $match: { clarity: body.fromClarity, isDeleted: false } }],
                        toClarity: [{ $match: { clarity: body.toClarity, isDeleted: false } }]
                    }
                }
            ]).then(data => {
                let facetData: any = {};
                facetData.fromClarity = (data[0]?.fromClarity[0]) ? data[0].fromClarity[0] : undefined
                facetData.toClarity = (data[0]?.toClarity[0]) ? data[0].toClarity[0] : undefined
                return facetData
            });            
            if (facetData.fromClarity && facetData.toClarity) {
                body.fromClarity = facetData.fromClarity.code;
                body.toClarity = facetData.toClarity.code;
                let data = await clarityRangeModel.findOne({ "fromClarity": {$lte: body.fromClarity }, "toClarity": {$gte: body.toClarity }, isDeleted:false })                
                if (!data && (body.fromClarity <= body.toClarity)) clarityRangeData.push(body);
                else existingRange.push({fromClarity : facetData.fromClarity.clarity, toClarity : facetData.toClarity.clarity})
            }
        })
        await Promise.all(check)
        let data = this.removeDuplicate(clarityRangeData, "fromClarity")        
        let createdData = await clarityRangeModel.create(data)
        if(existingRange.length > 0) return {status: false, message: Messages.CLARITY_RANGE_EXISTS, data: existingRange }
        else return {status: true, message: Messages.CREATE_SUCCESSFUL, data: createdData }
    }

    removeDuplicate = (arr: IClarityRange[][], prop: any) => {
        const new_arr = [];
        const lookup: any = {};
        for (var i in arr) {
            //@ts-expect-error
            lookup[arr[i][prop]] = arr[i];
        }
        for (i in lookup) {
            new_arr.push(lookup[i]);
        }
        return new_arr;
    }

}