import { IIndexParam, IIndexProjection, ISort } from "../../../../interfaces/IRepository";
import {BaseRepository} from "../../../BaseRepository";
import clarityMasterModel from "../clarity-master/clarity-master.model";
import mongoose, {ClientSession} from "mongoose";
import { IUser } from "../../../user/user.types";
import { IColorRange } from "./color-range.types";
import colorRangeModel from "./color-range.model";
import colorMasterModel from "../color-master/color-master.model";
import { Messages } from "../../../../constants";


export class ColorRangeRepository extends BaseRepository<IColorRange> {
    constructor () {
        super(colorRangeModel);
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
            {$lookup: {from: 'colormasters', localField: 'fromColor', foreignField: 'code', as: 'fromColor'}},
            {$unwind: {path: "$fromColor", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'colormasters', localField: 'toColor', foreignField: 'code', as: 'toColor'}},
            {$unwind: {path: "$toColor", preserveNullAndEmptyArrays: true}},
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

    create = async (body: any, user: IUser['_id']) => {
        let colorRangeData: IColorRange[][] = [], existingRange: any = []
        const check = body.colorRange.map(async (body: any) => {
            body.createdBy = body.updatedBy = user
            let facetData = await colorMasterModel.aggregate([
                {
                    $facet: {
                        fromColor: [{ $match: { color: body.fromColor, isDeleted: false } }],
                        toColor: [{ $match: { color: body.toColor, isDeleted: false } }]
                    }
                }
            ]).then(data => {
                let facetData: any = {};
                facetData.fromColor = (data[0]?.fromColor[0]) ? data[0].fromColor[0] : undefined
                facetData.toColor = (data[0]?.toColor[0]) ? data[0].toColor[0] : undefined
                return facetData
            });            
            if (facetData.fromColor && facetData.toColor) {
                body.fromColor = facetData.fromColor.code;
                body.toColor = facetData.toColor.code;
                let data = await colorRangeModel.findOne({ "fromColor": {$lte: body.fromColor}, "toColor": {$gte: body.toColor}, isDeleted:false });
                // console.log(data, "===========data");
                                           
                if (!data && (body.fromColor <= body.toColor)) colorRangeData.push(body);
                else existingRange.push({fromColor : facetData.fromColor.color, toColor : facetData.toColor.color})
            }
        })
        await Promise.all(check)        
        let data = this.removeDuplicate(colorRangeData, "fromColor")        
        let createdData = await colorRangeModel.create(data)
        if(existingRange.length > 0) return {status: false, message: Messages.COLOR_RANGE_EXISTS, data: existingRange }
        else return {status: true, message: Messages.CREATE_SUCCESSFUL, data: createdData }

    }

    removeDuplicate = (arr: IColorRange[][], prop: any) => {
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