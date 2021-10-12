import {BaseRepository} from "../BaseRepository";
import type {ISkuInfinityPrice} from "./sku-infinity-price.types";
import skuInfinityPriceModel from "./sku-infinity-price.model";
import mongoose, {Aggregate} from 'mongoose'
import companyModel from "../company/company.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import userModel from "../user/user.model";
import skuModel from "../sku/sku.model";


export class SkuInfinityPriceRepository extends BaseRepository<ISkuInfinityPrice> {
    constructor() {
        super(skuInfinityPriceModel);
    }

    index = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: IIndexParam): Promise<Aggregate<ISkuInfinityPrice>> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            let {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k]: v}
        } else sort = {createdAt: -1, updatedAt: -1};

        // if(search){
        //     search = JSON.parse(search)
        //     const _S = {$regex: search, $options: "i"}
        //     secondCond['$or'] = [
        //         {'firstName': _S}, {'lastName': _S}, {'email': _S}, {'altEmail': _S}, {'phone': _S}, {'contacts.name': _S}, {'addressId.address1': _S},
        //         {'addressId.address2': _S}, {'addressId.city': _S}, {'addressId.state': _S}, {'addressId.country': _S}, {'addressId.zipCode': _S},
        //     ]
        // }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            // for(const {key: k, value: v} of filters) {
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                } else if (k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) {
                    v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val));
                    secondCond[k] = {$in: v}
                } else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) {
                    v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val));
                    cond[k] = {$in: v}
                } else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if (column && column[0] == '[' && column[column.length - 1] == ']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for (const col of column) projection[col] = 1
        }

        const aggregate = [
            {$lookup: {from: skuModel.collection.name, localField: 'skuId', foreignField: '_id', as: 'skuId'}},
            {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            {$unset: ['createdBy.password', 'updatedBy.password']}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }
}
