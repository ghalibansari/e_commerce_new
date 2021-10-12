import {BaseRepository} from "../BaseRepository";
import {IExport, IInfinityPriceNew} from "./infinity-price-new.types";
import infinityPriceNewModel from "./infinity-price-new.model";
import {IIndexProjection} from "../../interfaces/IRepository";
import mongoose, { ClientSession } from "mongoose";
import caratMasterModel from '../infinity-price/master/carat-master/carat-master.model';
import clarityMasterModel from "../infinity-price/master/clarity-master/clarity-master.model";
import colorMasterModel from "../infinity-price/master/color-master/color-master.model";
import userModel from "../user/user.model";
import rapPriceModel from "../rap-price/rap-price.model";
import rapNetPriceModel from "../rap-net-price/rap-net-price.model";
import {Constant, Texts} from "../../constants";
import {endOfDay, startOfDay} from 'date-fns'
import { IUser } from "../user/user.types";
import { skuColorTypeEnum } from "../sku/sku.types";
import infinityPriceMasterModel from "../infinity-price/master/infinity-price-master/infinty-price-master.model";
import clientPriceModel from "../client-price/client-price.model";
import moment from "moment";
import { IInfinityPriceMasterNested } from "../infinity-price/master/infinity-price-master/infinity-price-master.types";
import skuModel from "../sku/sku.model";
import type { ISkuInfinityPrice } from "../sku-infinity-price/sku-infinity-price.types";
import skuInfinityPriceModel from '../sku-infinity-price/sku-infinity-price.model';


export class InfinityPriceRepositoryNew extends BaseRepository<IInfinityPriceNew> {
    constructor () {
        super(infinityPriceNewModel);
    }

    indexWhite = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false, stoneType: skuColorTypeEnum.WHITE}, sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = {[sorter.key]: sorter.value}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S: { $regex: string, $options: "i" } = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if (k === 'labsId.labReportId') secondCond[k] = v
                else if (k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if (k === 'iavId.drv' || k === 'iavId.iav' || k === 'iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
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

        let aggregate = [
            {$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$stoneType', skuColorTypeEnum.WHITE]}}},
            {$lookup: {
                from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId',
                let: {id: '$infinityPriceMasterId'},
                pipeline: [
                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                    {$match: {isDeleted: false}},
                    {$lookup: {
                            from: caratMasterModel.collection.name, as: 'caratRangeMasterId',
                            let: {id: '$caratRangeMasterId'},
                            pipeline: [
                                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                {$match: {isDeleted: false}}, {$limit: 1}
                            ]
                        }}, {$unwind: {path: "$caratRangeMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                            from: clarityMasterModel.collection.name, as: 'clarityMasterId',
                            let: {id: '$clarityMasterId'},
                            pipeline: [
                                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                {$match: {isDeleted: false}}, {$limit: 1}
                            ]
                        }}, {$unwind: {path: "$clarityMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                            from: colorMasterModel.collection.name, as: 'colorMasterId',
                            let: {id: '$colorMasterId'},
                            pipeline: [
                                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                {$match: {isDeleted: false}}, {$limit: 1}
                            ]
                        }}, {$unwind: {path: "$colorMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                            from: userModel.collection.name, as: 'createdBy',
                            let: {id: '$createdBy'},
                            pipeline: [
                                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                {$match: {isDeleted: false}}, {$limit: 1}
                            ]
                        }}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                            from: userModel.collection.name, as: 'updatedBy',
                            let: {id: '$updatedBy'},
                            pipeline: [
                                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                {$match: {isDeleted: false}}, {$limit: 1}
                            ]
                        }}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                            from: rapPriceModel.collection.name,
                            let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                                fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                            },
                            as: 'rapPrice',
                            pipeline: [
                                {$match: {$and: [
                                    {$expr: {isDeleted: false}},
                                    {$expr: {$eq: ['$clarity', '$$clarity']}},
                                    {$expr: {$eq: ['$color', '$$color']}},
                                    {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                                    {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                                ]}},
                                // {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                                // {$project: {_id: 0}}
                                {$project: {price: 1}},
                                {$sort: {createdAt: -1}},
                                {$limit: 1}
                            ]
                        }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                            from: rapNetPriceModel.collection.name, as: 'rapNetPrice',
                            let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                                fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                            },
                            pipeline: [
                                {$match: {$and: [
                                    {$expr: {isDeleted: false}},
                                    {$expr: {$eq: ['$clarity', '$$clarity']}},
                                    {$expr: {$eq: ['$color', '$$color']}},
                                    {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                                    {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                                ]}},
                                {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                                {$project: {_id: 0}}
                            ]
                        }}, {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},
                    {$set: {
                            // 'rapPrice.min': {$cond: {if: '$rapPrice.min', then: '$rapPrice.min', else: 0}},
                            // 'rapPrice.max': {$cond: {if: '$rapPrice.max', then: '$rapPrice.max', else: 0}},
                            // 'rapPrice.avg': {$cond: {if: '$rapPrice.avg', then: '$rapPrice.avg', else: 0}},
                            'rapNetPrice.min': {$cond: {if: '$rapNetPrice.min', then: '$rapNetPrice.min', else: 0}},
                            'rapNetPrice.max': {$cond: {if: '$rapNetPrice.max', then: '$rapNetPrice.max', else: 0}},
                            'rapNetPrice.avg': {$cond: {if: '$rapNetPrice.avg', then: '$rapNetPrice.avg', else: 0}}
                        }},
                    {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]}
                ]
            }}, {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},
        ];
        const sCond = [{$match: secondCond}, {$project: projection}];
        return await this.aggregateFaceTIndex(cond, aggregate, sCond, sort, pageNumber, pageSize, skuColorTypeEnum.WHITE)
    }

    indexOffWhite = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false, stoneType: skuColorTypeEnum.OFF_WHITE}, sort = {},
            projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = {[sorter.key]: sorter.value}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S: { $regex: string, $options: "i" } = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if (k === 'labsId.labReportId') secondCond[k] = v
                else if (k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if (k === 'iavId.drv' || k === 'iavId.iav' || k === 'iavId.pwv') secondCond[k] = {
                    "$gte": v[0],
                    "$lte": v[1]
                }
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

        let aggregate = [
            {$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$stoneType', skuColorTypeEnum.OFF_WHITE]}}},
            {$lookup: {
                    from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId',
                    let: {id: '$infinityPriceMasterId'},
                    pipeline: [
                        {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                        {$match: {isDeleted: false}},
                        {$lookup: {
                                from: caratMasterModel.collection.name, as: 'caratRangeMasterId',
                                let: {id: '$caratRangeMasterId'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$caratRangeMasterId", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: clarityMasterModel.collection.name, as: 'clarityMasterId',
                                let: {id: '$clarityMasterId'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$clarityMasterId", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: colorMasterModel.collection.name, as: 'colorMasterId',
                                let: {id: '$colorMasterId'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$colorMasterId", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: userModel.collection.name, as: 'createdBy',
                                let: {id: '$createdBy'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: userModel.collection.name, as: 'updatedBy',
                                let: {id: '$updatedBy'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},

                        // {$lookup: {
                        //     from: rapPriceModel.collection.name,
                        //     let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                        //         fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                        //     },
                        //     as: 'rapPrice',
                        //     pipeline: [
                        //         {$match: {$and: [
                        //             {$expr: {isDeleted: false}},
                        //             {$expr: {$eq: ['$clarity', '$$clarity']}},
                        //             {$expr: {$eq: ['$color', '$$color']}},
                        //             {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                        //             {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                        //         ]}},
                        //         // {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        //         // {$project: {_id: 0}}
                        //     ]
                        // }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                            from: clientPriceModel.collection.name,
                            let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                                fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                            },
                            as: 'clientPrice',
                            pipeline: [
                                {$match: {$and: [
                                    {$expr: {isDeleted: false}},
                                    {$expr: {$eq: ['$clarity', '$$clarity']}},
                                    {$expr: {$eq: ['$color', '$$color']}},
                                    {$expr: {$gte: ['$weight', '$$fromWeight']}},
                                    {$expr: {$lte: ['$weight', '$$toWeight']}}
                                ]}},
                                {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                                {$project: {_id: 0}}
                            ]
                        }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},

                        // {$lookup: {
                        //     from: rapNetPriceModel.collection.name, as: 'rapNetPrice',
                        //     let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                        //         fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                        //     },
                        //     pipeline: [
                        //         {$match: {$and: [
                        //             {$expr: {isDeleted: false}},
                        //             {$expr: {$eq: ['$clarity', '$$clarity']}},
                        //             {$expr: {$eq: ['$color', '$$color']}},
                        //             {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                        //             {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                        //         ]}},
                        //         {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        //         {$project: {_id: 0}}
                        //     ]
                        // }}, {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},
                        {$set: {
                            'clientPrice.min': {$cond: {if: '$clientPrice.min', then: '$clientPrice.min', else: 0}},
                            'clientPrice.max': {$cond: {if: '$clientPrice.max', then: '$clientPrice.max', else: 0}},
                            'clientPrice.avg': {$cond: {if: '$clientPrice.avg', then: '$clientPrice.avg', else: 0}},
                            // 'rapPrice.min': {$cond: {if: '$rapPrice.min', then: '$rapPrice.min', else: 0}},
                            // 'rapPrice.max': {$cond: {if: '$rapPrice.max', then: '$rapPrice.max', else: 0}},
                            // 'rapPrice.avg': {$cond: {if: '$rapPrice.avg', then: '$rapPrice.avg', else: 0}},
                            // 'rapNetPrice.min': {$cond: {if: '$rapNetPrice.min', then: '$rapNetPrice.min', else: 0}},
                            // 'rapNetPrice.max': {$cond: {if: '$rapNetPrice.max', then: '$rapNetPrice.max', else: 0}},
                            // 'rapNetPrice.avg': {$cond: {if: '$rapNetPrice.avg', then: '$rapNetPrice.avg', else: 0}}
                        }},
                        {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]}
                    ]
                }}, {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},
        ];
        const sCond = [{$match: secondCond}, {$project: projection}];
        return await this.aggregateFaceTIndex(cond, aggregate, sCond, sort, pageNumber, pageSize, skuColorTypeEnum.OFF_WHITE)
    }

    indexFancy = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {isDeleted: false, stoneType: skuColorTypeEnum.FANCY}, sort = {},
            projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = {[sorter.key]: sorter.value}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S: { $regex: string, $options: "i" } = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if (k === 'labsId.labReportId') secondCond[k] = v
                else if (k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if (k === 'iavId.drv' || k === 'iavId.iav' || k === 'iavId.pwv') secondCond[k] = {
                    "$gte": v[0],
                    "$lte": v[1]
                }
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

        let aggregate = [
            {$match: {isDeleted: false}},
            {$lookup: {
                    from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId',
                    let: {id: '$infinityPriceMasterId'},
                    pipeline: [
                        {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                        {$match: {isDeleted: false}},
                        {$lookup: {
                                from: caratMasterModel.collection.name, as: 'caratRangeMasterId',
                                let: {id: '$caratRangeMasterId'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$caratRangeMasterId", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: clarityMasterModel.collection.name, as: 'clarityMasterId',
                                let: {id: '$clarityMasterId'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$clarityMasterId", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: colorMasterModel.collection.name, as: 'colorMasterId',
                                let: {id: '$colorMasterId'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$colorMasterId", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: userModel.collection.name, as: 'createdBy',
                                let: {id: '$createdBy'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                                from: userModel.collection.name, as: 'updatedBy',
                                let: {id: '$updatedBy'},
                                pipeline: [
                                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                                    {$match: {isDeleted: false}}, {$limit: 1}
                                ]
                            }}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},

                        // {$lookup: {
                        //         from: rapPriceModel.collection.name,
                        //         let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                        //             fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                        //         },
                        //         as: 'rapPrice',
                        //         pipeline: [
                        //             {$match: {$and: [
                        //                         {$expr: {isDeleted: false}},
                        //                         {$expr: {$eq: ['$clarity', '$$clarity']}},
                        //                         {$expr: {$eq: ['$color', '$$color']}},
                        //                         {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                        //                         {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                        //                     ]}},
                        //             {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        //             {$project: {_id: 0}}
                        //         ]
                        //     }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},

                        // {$lookup: {
                        //         from: rapNetPriceModel.collection.name, as: 'rapNetPrice',
                        //         let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                        //             fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                        //         },
                        //         pipeline: [
                        //             {$match: {$and: [
                        //                         {$expr: {isDeleted: false}},
                        //                         {$expr: {$eq: ['$clarity', '$$clarity']}},
                        //                         {$expr: {$eq: ['$color', '$$color']}},
                        //                         {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                        //                         {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                        //                     ]}},
                        //             {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        //             {$project: {_id: 0}}
                        //         ]
                        //     }}, {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},

                        {$lookup: {
                            from: clientPriceModel.collection.name,
                            let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                                fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                            },
                            as: 'clientPrice',
                            pipeline: [
                                {$match: {$and: [
                                    {$expr: {isDeleted: false}},
                                    {$expr: {$eq: ['$clarity', '$$clarity']}},
                                    {$expr: {$eq: ['$color', '$$color']}},
                                    {$expr: {$gte: ['$weight', '$$fromWeight']}},
                                    {$expr: {$lte: ['$weight', '$$toWeight']}}
                                ]}},
                                {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                                {$project: {_id: 0}}
                            ]
                        }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},

                        {$set: {
                            'clientPrice.min': {$cond: {if: '$clientPrice.min', then: '$clientPrice.min', else: 0}},
                            'clientPrice.max': {$cond: {if: '$clientPrice.max', then: '$clientPrice.max', else: 0}},
                            'clientPrice.avg': {$cond: {if: '$clientPrice.avg', then: '$clientPrice.avg', else: 0}},
                            // 'rapPrice.min': {$cond: {if: '$rapPrice.min', then: '$rapPrice.min', else: 0}},
                            // 'rapPrice.max': {$cond: {if: '$rapPrice.max', then: '$rapPrice.max', else: 0}},
                            // 'rapPrice.avg': {$cond: {if: '$rapPrice.avg', then: '$rapPrice.avg', else: 0}},
                            // 'rapNetPrice.min': {$cond: {if: '$rapNetPrice.min', then: '$rapNetPrice.min', else: 0}},
                            // 'rapNetPrice.max': {$cond: {if: '$rapNetPrice.max', then: '$rapNetPrice.max', else: 0}},
                            // 'rapNetPrice.avg': {$cond: {if: '$rapNetPrice.avg', then: '$rapNetPrice.avg', else: 0}}
                        }},
                        {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]}
                    ]
                }}, {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},
        ];
        const sCond = [{$match: secondCond}, {$project: projection}];
        return await this.aggregateFaceTIndex(cond, aggregate, sCond, sort, pageNumber, pageSize, skuColorTypeEnum.FANCY)
    }

    addBulk = async(newData: any, loggedInUserId: IUser['_id'], session: ClientSession) => {
        let simpleInsert: IInfinityPriceNew[] = [], skuInfinityPriceInsert: ISkuInfinityPrice[] = []
        const newDataMap = await newData.map(async (data: any) => {
            simpleInsert.push({...data, createdBy: loggedInUserId, updatedBy: loggedInUserId})

            if(moment().isSame(data.effectiveDate, 'day')) {
                let totalPrice = 0
                const SIP_ID = mongoose.Types.ObjectId()

                const IPM = await infinityPriceMasterModel.findOne({_id: data.infinityPriceMasterId, isDeleted: false}).populate('caratRangeMasterId colorMasterId clarityMasterId') as IInfinityPriceMasterNested|null
                const sku = await skuModel.findOne({isDeleted: false, colorCategory: IPM?.colorMasterId.color, clarity: IPM?.clarityMasterId.clarity, weight: {$gte: IPM?.caratRangeMasterId.fromCarat, $lte: IPM?.caratRangeMasterId.toCarat}}).select('_id colorType weight').lean()
                
                if(sku?.colorType === skuColorTypeEnum.FANCY || sku?.colorType === skuColorTypeEnum.OFF_WHITE) totalPrice = (data.price * sku?.weight!)
                else if(sku?.colorType === skuColorTypeEnum.WHITE){
                    const rapePriceData = await rapPriceModel.findOne({isDeleted: false, color: IPM?.colorMasterId.color, clarity: IPM?.clarityMasterId.clarity, 'weightRange.fromWeight': IPM?.caratRangeMasterId.fromCarat, 'weightRange.toWeight': IPM?.caratRangeMasterId.toCarat})
                    totalPrice = ((1-((data.price)/100))*(rapePriceData?.price||0))*sku.weight!
                }

                //@ts-expect-error
                sku && await skuModel.updateOne({_id: sku._id}, {skuInfinityPriceId: SIP_ID, updatedBy: loggedInUserId}, {session})
                //@ts-ignore
                sku && skuInfinityPriceInsert.push({_id: SIP_ID, skuId: sku?._id, price: data.price, totalPrice, createdBy: loggedInUserId, updatedBy: loggedInUserId})
            }
        })
        await Promise.all(newDataMap)
        await Promise.all([
            infinityPriceNewModel.insertMany(simpleInsert, {session}),
            skuInfinityPriceModel.insertMany(skuInfinityPriceInsert, {session})
        ])
    }

    async filterParamWhite(userId: IUser['_id'], { filters }: any): Promise<any> {
        // let cond: any = {}, secondCond: any = {}
        // let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])  //Todo we already have role id in req body login user.

        // if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
        //     filters = filters.replace(/'/g, '"')
        //     filters = JSON.parse(filters)
        //     filters.forEach(({ key: k, value: v }: any) => {
        //         if (k === 'inventories') {
        //             if (v) cond['stoneStatus'] = { $in: [Enum.stoneStatus.CONSIGNMENT, Enum.stoneStatus.APPROVED, Enum.stoneStatus.MISSING, Enum.stoneStatus.SOLD, Enum.stoneStatus.REMOVED] };
        //             if (v) cond['collateralStatus'] = { $nin: [Enum.collateralStatus.COLLATERAL_IN, Enum.collateralStatus.COLLATERAL_OUT] }
        //         }
        //         else if (k === 'collateralInventories') { if (v) cond['collateralStatus'] = { $in: [Enum.collateralStatus.COLLATERAL_IN] } }
        //     })
        // }
        ////@ts-expect-error
        // if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        return await infinityPriceNewModel.aggregate([  //Todo make this dynamic
            {$match: {isDeleted: false, stoneType: skuColorTypeEnum.WHITE}},
            {$lookup: {
                from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId', //let: {id: '$infinityPriceMasterId'},
                pipeline: [
                    {$match: {isDeleted: false}}, {$limit: 1},
                    {$lookup: {
                        from: caratMasterModel.collection.name, as: 'caratRangeMasterId',// let: {id: '$caratRangeMasterId'},
                        pipeline: [{$match: {isDeleted: false}}, {$limit: 1}]
                    }}, {$unwind: {path: "$caratRangeMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: colorMasterModel.collection.name, as: 'colorMasterId',
                        pipeline: [{$match: {isDeleted: false}}, {$limit: 1}]
                    }}, {$unwind: {path: "$colorMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: clarityMasterModel.collection.name, as: 'clarityMasterId',
                        pipeline: [{$match: {isDeleted: false}}, {$limit: 1}]
                    }}, {$unwind: {path: "$clarityMasterId", preserveNullAndEmptyArrays: true}},
                ]
            }}, {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},

            {
                $group: {
                    _id: null,
                    priceValue: { "$addToSet": "$price" },
                    priceMin: { "$min": "$price" },
                    priceMax: { "$max": "$price" },
                    effectiveDate: { "$addToSet": "$effectiveDate" },
                    color: { "$addToSet": "$infinityPriceMasterId.colorMasterId.color" },
                    clarity: { "$addToSet": "$infinityPriceMasterId.clarityMasterId.clarity" },
                    fromCarat: { "$addToSet": "$infinityPriceMasterId.caratRangeMasterId.fromCarat" },
                    fromCaratMin: { "$min": "$infinityPriceMasterId.caratRangeMasterId.fromCarat" },
                    toCarat: { "$addToSet": "$infinityPriceMasterId.caratRangeMasterId.toCarat" },
                    toCaratMax: { "$max": "$infinityPriceMasterId.caratRangeMasterId.toCarat" }
                }
            },
            {
                $project: {
                    _id: 0, price: {values: '$priceValue', min: '$priceMin', max: '$priceMax'}, color: 1, clarity: 1, effectiveDate: 1,
                    weight: {values: {$concatArrays: ['$fromCarat', '$toCarat']}, min: '$fromCaratMin', max: '$toCaratMax'}

                }
            }
        ]).then(([data]) => data);
    }

    async aggregateFaceTIndex(cond: {}, agree: any[], sCond: any[], sort: {}, pagenumber: number, pagesize: number, stoneType: skuColorTypeEnum): Promise<any> {
        let hasNextPage = false, totalPage = 0, endIndex = 0, pageSize
        let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
        if(!!pagesize && !!Number(pagesize)) pageSize = Number(pagesize)
        else if(!!pagesize && Number(pagesize) === 0) pageSize = Number(pagesize)
        else pageSize = Constant.DEFAULT_PAGE_SIZE
        let startIndex = (pageNumber - 1) * pageSize;
        // let aggData = [{$match: cond}, {$skip: startIndex}, ...agree, {$sort: sort}, ...sCond, {$limit: pageSize}]
        let aggData = [{$match: cond}, {$skip: startIndex}, ...agree, ...sCond, {$limit: pageSize}]
        const data = await infinityPriceNewModel.aggregate([  //Todo add proper aggregate<T> type...
            {$facet: {
                data: aggData,
                filterCount: [{$match: cond}, ...sCond, {$count: 'filterCount'}],
                totalCount: [{$match: {isDeleted: false, stoneType: stoneType}}, {$count: 'totalCount'}]
            }}
        ])
        let totalCount: number = await data[0]?.totalCount[0]?.totalCount || 0;
        let filterCount: number = await data[0]?.filterCount[0]?.filterCount || 0;
        totalPage = await (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize)
        //@ts-expect-error
        if(Number(filterCount) && filterCount && totalPage=='Infinity') totalPage = 1
        else if(!filterCount && !Number(totalPage)) totalPage = 0
        endIndex = pageNumber * pageSize;
        if (endIndex < filterCount) hasNextPage = true;
        if([0, 1].includes(totalPage)) hasNextPage = false
        return {page: {hasNextPage, totalCount, currentPage: pageNumber, filterCount, totalPage}, data: data[0]?.data || null}
    }

    export = async ({effectiveDate, stoneType, color, clarity, fromCarat, toCarat}: any) => {
        let cond: any = {isDeleted: false, stoneType: stoneType}, sCond: any = {};
        const project: any = {
            price: 1, _id: 0,
            color: '$infinityPriceMasterId.colorMasterId.color',
            clarity: '$infinityPriceMasterId.clarityMasterId.clarity',
            toCarat: '$infinityPriceMasterId.caratRangeMasterId.toCarat',
            fromCarat: '$infinityPriceMasterId.caratRangeMasterId.fromCarat',
        }

        if(effectiveDate && effectiveDate[0] == '{' && effectiveDate[effectiveDate.length-1] == '}') {
            effectiveDate = JSON.parse(effectiveDate)
            cond['effectiveDate'] = {}
            if(effectiveDate?.startDate) cond['effectiveDate']['$gte'] = startOfDay(new Date(effectiveDate?.startDate))
            if(effectiveDate?.endDate) cond['effectiveDate']['$lte'] = endOfDay(new Date(effectiveDate?.endDate))
        }
        // if(stoneType) {
        //     stoneType = JSON.parse(stoneType);
        //     if (stoneType instanceof Array) cond['stoneType'] = {$in: stoneType}
        //     else cond['stoneType'] = stoneType
        // }
        if(color) {
            color = JSON.parse(color);
            if (color instanceof Array) sCond['infinityPriceMasterId.colorMasterId.color'] = {$in: color}
            else sCond['infinityPriceMasterId.colorMasterId.color'] = color
        }
        if(clarity) {
            clarity = JSON.parse(clarity);
            if (clarity instanceof Array) sCond['infinityPriceMasterId.clarityMasterId.toCarat'] = {$in: clarity}
            else sCond['infinityPriceMasterId.clarityMasterId.toCarat'] = clarity
        }
        if(fromCarat) {
            fromCarat = JSON.parse(fromCarat);
            if (fromCarat instanceof Array) sCond['infinityPriceMasterId.caratRangeMasterId.fromCarat'] = {$in: fromCarat}
            else sCond['infinityPriceMasterId.caratRangeMasterId.fromCarat'] = fromCarat
        }
        if(toCarat) {
            toCarat = JSON.parse(toCarat);
            if (toCarat instanceof Array) sCond['infinityPriceMasterId.caratRangeMasterId.toCarat'] = {$in: toCarat}
            else sCond['infinityPriceMasterId.caratRangeMasterId.toCarat'] = toCarat
        }

        const aggregate: any = [
            {$match: cond},
            {$lookup: {
                from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId',
                let: {id: '$infinityPriceMasterId'},
                pipeline: [
                    {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                    {$match: {isDeleted: false}},
                    {$lookup: {
                        from: caratMasterModel.collection.name, as: 'caratRangeMasterId',
                        let: {id: '$caratRangeMasterId'},
                        pipeline: [
                            {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                            {$match: {isDeleted: false}}, {$limit: 1}
                        ]
                    }}, {$unwind: {path: "$caratRangeMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: clarityMasterModel.collection.name, as: 'clarityMasterId',
                        let: {id: '$clarityMasterId'},
                        pipeline: [
                            {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                            {$match: {isDeleted: false}}, {$limit: 1}
                        ]
                    }}, {$unwind: {path: "$clarityMasterId", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: colorMasterModel.collection.name, as: 'colorMasterId',
                        let: {id: '$colorMasterId'},
                        pipeline: [
                            {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                            {$match: {isDeleted: false}}, {$limit: 1}
                        ]
                    }}, {$unwind: {path: "$colorMasterId", preserveNullAndEmptyArrays: true}}
                ]
            }}, {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}}
        ]

        if(stoneType == skuColorTypeEnum.WHITE) {
            const rapPrice = [{$lookup: {
                from: rapPriceModel.collection.name, as: 'rapPrice',
                let: {
                    color: '$infinityPriceMasterId.colorMasterId.color',
                    clarity: '$infinityPriceMasterId.clarityMasterId.clarity',
                    fromWeight: '$infinityPriceMasterId.caratRangeMasterId.fromCarat',
                    toWeight: '$infinityPriceMasterId.caratRangeMasterId.toCarat',
                },
                pipeline: [
                    {$match: {$and: [
                        {$expr: {$eq: ['$isDeleted', false]}}, {$expr: {$eq: ['$color', '$$color']}}, {$expr: {$eq: ['$clarity', '$$clarity']}},
                        {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}}, {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                    ]}},
                    {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                    {$project: {_id: 0}}
                ]
            }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}}]

            const rapNetPrice = [{$lookup: {
                from: rapNetPriceModel.collection.name, as: 'rapNetPrice',
                let: {
                    color: '$infinityPriceMasterId.colorMasterId.color',
                    clarity: '$infinityPriceMasterId.clarityMasterId.clarity',
                    fromWeight: '$infinityPriceMasterId.caratRangeMasterId.fromCarat',
                    toWeight: '$infinityPriceMasterId.caratRangeMasterId.toCarat',
                },
                pipeline: [
                    {$match: {$and: [
                        {$expr: {$eq: ['$isDeleted', false]}}, {$expr: {$eq: ['$color', '$$color']}}, {$expr: {$eq: ['$clarity', '$$clarity']}},
                        {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}}, {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                    ]}},
                    {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                    {$project: {_id: 0}}
                ]
            }}, {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}}]

            const rapPriceProject = {
                rapPriceMin: {$cond: {if: '$rapPrice.min', then: '$rapPrice.min', else: 0}},
                rapPriceMax: {$cond: {if: '$rapPrice.max', then: '$rapPrice.max', else: 0}},
                rapPriceAvg: {$cond: {if: '$rapPrice.avg', then: '$rapPrice.avg', else: 0}}
            }

            const rapNetPriceProject = {
                rapNetPriceMin: {$cond: {if: '$rapNetPrice.min', then: '$rapNetPrice.min', else: 0}},
                rapNetPriceMax: {$cond: {if: '$rapNetPrice.max', then: '$rapNetPrice.max', else: 0}},
                rapNetPriceAvg: {$cond: {if: '$rapNetPrice.avg', then: '$rapNetPrice.avg', else: 0}}
            }

            aggregate.push(...rapPrice)
            aggregate.push(...rapNetPrice)
            aggregate.push({$match: sCond})
            aggregate.push({$project: {...project, ...rapPriceProject, ...rapNetPriceProject}})
        }

        if([skuColorTypeEnum.OFF_WHITE, skuColorTypeEnum.FANCY].includes(stoneType)) {
            const clientPrice = [{$lookup: {
                from: clientPriceModel.collection.name, as: 'clientPrice',
                let: {
                    color: '$infinityPriceMasterId.colorMasterId.color',
                    clarity: '$infinityPriceMasterId.clarityMasterId.clarity',
                    fromWeight: '$infinityPriceMasterId.caratRangeMasterId.fromCarat',
                    toWeight: '$infinityPriceMasterId.caratRangeMasterId.toCarat',
                },
                pipeline: [
                    {$match: {$and: [
                        {$expr: {isDeleted: false}}, {$expr: {$eq: ['$color', '$$color']}}, {$expr: {$eq: ['$clarity', '$$clarity']}},
                        {$expr: {$gte: ['$weight', '$$fromWeight']}}, {$expr: {$lte: ['$weight', '$$toWeight']}}
                    ]}},
                    {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                    {$project: {_id: 0}}
                ]
            }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}}]

            const clientPriceProject = {
                clientPriceMin: {$cond: {if: '$clientPrice.min', then: '$clientPrice.min', else: 0}},
                clientPriceMax: {$cond: {if: '$clientPrice.max', then: '$clientPrice.max', else: 0}},
                clientPriceAvg: {$cond: {if: '$clientPrice.avg', then: '$clientPrice.avg', else: 0}}
            }

            aggregate.push(...clientPrice)
            aggregate.push({$match: sCond})
            aggregate.push({$project: {...project, ...clientPriceProject}})
        }

        if(stoneType == skuColorTypeEnum.WHITE) interface IExportType extends IExport {rapPriceMin: number, rapPriceMax: number, rapPriceAvg: number, rapNetPriceMin: number, rapNetPriceMax: number, rapNetPriceAvg: number}
        if([skuColorTypeEnum.OFF_WHITE, skuColorTypeEnum.FANCY].includes(stoneType)) interface IExportType extends IExport {clientPriceMin: number, clientPriceMax: number, clientPriceAvg: number}

        return infinityPriceNewModel.aggregate<IExportType>(aggregate);
    }
}
