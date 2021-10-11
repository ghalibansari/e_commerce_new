import {BaseRepository} from "../../BaseRepository";
import {ITransactionImport} from "./import.types";
import transactionImportModel from "./import.model";
import {ISku, skuCollateralStatusEnum, skuDmStatusEnum, skuGemlogistStatusEnum, skuStoneStatusEnum} from "../../sku/sku.types";
import skuModel from "../../sku/sku.model";
import {IIndexFilters, IIndexParam, IIndexProjection} from "../../../interfaces/IRepository";
import mongoose from "mongoose";
import {SkuRepository} from "../../sku/sku.repository";
import {Errors} from "../../../constants";
import {Request, Response} from "express"
import {HeaderData} from '../../../constants/ReportHeaders'
import {IUser} from "app/modules/user/user.types";
import iavModel from "../../iav/iav.model";
import rapPriceModel from "../../rap-price/rap-price.model";
import clientPriceModel from "../../client-price/client-price.model";
import companyModel from "../../company/company.model";
import rfidModel from "../../rfid/rfid.model";
import labModel from "../../lab/lab.model";
import userModel from "../../user/user.model";
import clarityRangeModel from "../../infinity-price/master/clarity-range/clarity-range.model";
import clarityMasterModel from "../../infinity-price/master/clarity-master/clarity-master.model";
import colorRangeModel from "../../infinity-price/master/color-range/color-range.model";
import colorMasterModel from "../../infinity-price/master/color-master/color-master.model";
import caratMasterModel from "../../infinity-price/master/carat-master/carat-master.model";
import stoneTypeMasterModel from "../../stone-type-master/stone-type-master.model";
import commentModel from "../../comment/comment.model";
import lo from "lodash"
import infinityPriceNewModel from "../../infinity-price-new/infinity-price-new.model";
import infinityPriceMasterModel from "../../infinity-price/master/infinity-price-master/infinty-price-master.model";
import skuInfinityPriceModel from '../../sku-infinity-price/sku-infinity-price.model'

export class TransactionImportRepository extends BaseRepository<ITransactionImport> {
    constructor(){
        super(transactionImportModel)
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<ITransactionImport[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = {createdAt: -1, updatedAt: -1};

         if(search){
             search = JSON.parse(search)
             const _S = {$regex: search, $options: "i"}
             secondCond['$or'] = [
                 {'transactionId': _S}, {'companyId.name': _S}, {'companyId.contacts.name': _S}, {'companyId.contacts.email': _S},
                 {'companyId.addressId.address1': _S}, {'companyId.addressId.address2': _S},{'status':_S}
            ]
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
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if(column && column[0]=='[' && column[column.length-1]==']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            // {$match: cond},
            { $lookup: { from: skuModel.collection.name, localField: 'skuIds', foreignField: '_id', as: 'skuIds' } },
            { $unwind: { path: "$skuIds", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
            { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy' } },
            { $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    "transactionId": { $first: "$transactionId" },
                    "fileName": { $first: "$fileName" },
                    "companyId": { $first: "$companyId" },
                    "createdBy": { $first: "$createdBy" },
                    "updatedBy": { $first: "$updatedBy" },
                    "createdAt": { $first: "$createdAt" },
                    "updatedAt": { $first: "$updatedAt" },
                    "status": { $first: "$status" },
                    "importedStones": { $first: "$importedStones" },
                    "notImportedStones": { $first: "$notImportedStones" },
                    "totalStones": { $first: "$totalStones" },
                    "rejectedStones": { $sum: { $cond: [{ $eq: ["$skuIds.stoneStatus", "REJECTED"] }, 1, 0] } },
                    "pendingReviewStones": { $sum: { $cond: [
                        {$or: [
                            { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.ARRIVAL] },
                            {$eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.REVIEW_AGAIN] }
                        ]}, 1, 0] } },
                    "collateralStones": { $sum: { $cond: [{ $eq: ["$skuIds.collateralStatus", "COLLATERAL IN"] }, 1, 0] } },
                    // "priceChangedStones": { $sum: { $cond: [{ $eq: ["$skuIds.stoneStatus", "PRICE CHANGED"] }, 1, 0] } },
                    // "readyCollateralStones": { $sum: { $cond: [{ $eq: ["$skuIds.stoneStatus", "COLLATERAL READY"] }, 1, 0] } },
                    "readyCollateralStones1": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.APPROVED] },
                            {$eq: ["$skuIds.dmStatus", skuDmStatusEnum.COMPLETED] },
                            { $ne: ["$skuIds.collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "readyCollateralStones2": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.APPROVED] },
                            {$eq: ["$skuIds.dmStatus", skuDmStatusEnum.NOT_APPLICABLE] },
                            { $ne: ["$skuIds.collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "priceChangedStones1": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] },
                            {$eq: ["$skuIds.dmStatus", skuDmStatusEnum.COMPLETED] },
                            { $ne: ["$skuIds.collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "priceChangedStones2": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] },
                            {$eq: ["$skuIds.dmStatus", skuDmStatusEnum.NOT_APPLICABLE] },
                            { $ne: ["$skuIds.collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "stoneRegistration": {$sum: {$cond: [
                        {$and: [
                            {$or: [
                                { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] },
                                { $eq: ["$skuIds.stoneStatus", skuStoneStatusEnum.APPROVED] },
                            ]},
                            // { $eq: ["$skuIds.stoneStatus", [skuStoneStatusEnum.PRICE_CHANGED, skuStoneStatusEnum.APPROVED]] },
                            { $eq: ["$skuIds.dmStatus", skuDmStatusEnum.PENDING] }
                        ]}, 1, 0]}},
                }
            },
            { $addFields: {"readyCollateralStones" : {$add: [ '$readyCollateralStones1', '$readyCollateralStones2' ]}}},
            { $addFields: {"priceChangedStones" : {$add: [ '$priceChangedStones1', '$priceChangedStones2' ]}}},
            // {$match: secondCond},
            // {$project: projection},
            // {$unset: ["createdBy.password", "updatedBy.password"]}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["createdBy.password", "updatedBy.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async getSkuIds( transactionId: any): Promise<ISku[]> {
        const transactionData: any = await transactionImportModel.findOne({ transactionId: transactionId });
        const populate = [{path: 'iavId', populate: [ { path: 'rapPriceId', model: 'RapPrice'},
            { path: 'clientPriceId', model: 'ClientPrice'}]},{path: 'companyId'}, {path: 'rfId'},{path: 'labsId'}]
        return skuModel.find({_id: {$in: transactionData.skuIds}}).populate(populate);
    }

    findReviewBR = async ({filters, search, sort:sorter, pageNumber, pageSize, column, action, transactionData}: any): Promise<object> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = {};
        if(!transactionData) throw new Error(Errors.INVALID_TRANSACTION_ID)
        cond['_id'] = {$in: transactionData?.skuIds}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = {createdAt: 'desc', updatedAt: 'desc'};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'rfId.rfid': _S}, {'labsId.labReportId': _S}, {'clientRefId': _S}, {'infinityRefId': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === 'weight' && v instanceof Array && v?.length == 2) {
                    if(!(cond[k] instanceof Object)) cond[k] = {}
                    cond[k]['$gte'] = v[0]
                    cond[k]['$lte'] = v[1]
                }
                else if(k === 'dmRegistrationApproved' && v) {
                    cond['stoneStatus'] = {"$eq": "APPROVED"};
                    cond['stoneRegistration'] = {"$eq": true};
                }
                else if(k === 'dmRegistrationPriceChanged' && v) {
                    cond['stoneStatus'] = {"$eq": "PRICE CHANGED"};
                    cond['stoneRegistration'] = {"$eq": true};
                }
                else if(k === "stoneStatus" && v === "COLLATERAL READY") { cond['stoneStatus'] = v; cond['collateralStatus'] = {"$ne": "COLLATERAL IN"}}
                else if(k === '_id' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                //@ts-expect-error
                else if(k=== 'stoneStatus' && v instanceof Array) { if(v.includes('COLLATERAL READY')) cond['collateralStatus'] = {"$ne": "COLLATERAL IN"}; cond[k] = {$in: v}}
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if(column && column[0]=='[' && column[column.length-1]==']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            {$match: cond},
            {$lookup: {from: commentModel.collection.name, let: { "comments": "$comments" },pipeline: [{ "$match": { "$expr": { "$in": [ "$_id", "$$comments" ] } } },
            {$lookup: {from: userModel.collection.name,localField: 'createdBy',foreignField: '_id',as: 'createdBy'}},
            {$unwind: {path: "$createdBy",preserveNullAndEmptyArrays: true}},{$unset: ["createdBy.password"]}], as: 'comments'}},
            {$lookup: {from: iavModel.collection.name, localField: 'iavId', foreignField: '_id', as: 'iavId'}},
            {$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rapPriceModel.collection.name, localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId'}},
            {$unwind: {path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clientPriceModel.collection.name, localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId'}},
            {$unwind: {path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            // {$project: {'companyId.logoUrl': 0}},   //Todo remove this line
            {$lookup: {from: rfidModel.collection.name, localField: 'rfId', foreignField: '_id', as: 'rfId'}},
            {$unwind: {path: "$rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: labModel.collection.name, localField: 'labsId', foreignField: '_id', as: 'labsId'}},
            {$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            { $lookup: { from: skuInfinityPriceModel.collection.name, localField: 'skuInfinityPriceId', foreignField: '_id', as: 'skuInfinityPriceId' } },
            { $unwind: { path: "$skuInfinityPriceId", preserveNullAndEmptyArrays: true } },

            /*{$lookup: {from: clarityMasterModel.collection.name, let: {clarity: '$clarity'}, as: 'clarityCode', pipeline: [
                {$match: {isDeleted: false}}, {$match: {$expr: {eq: ['$clarity', '$$clarity']}}}
            ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
            {$set: {clarityId: '$clarityCode._id'}},*/

            {$lookup: {from: clarityMasterModel.collection.name, localField: 'clarity', foreignField: 'clarity', as: 'clarityCode'}},
            {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
            {$set: {clarityId: '$clarityCode._id'}},

            {$lookup: {from: colorMasterModel.collection.name, localField: 'colorCategory', foreignField: 'color', as: 'colorCategoryCode'}},
            {$unwind: {path: "$colorCategoryCode", preserveNullAndEmptyArrays: true}},
            {$set: {colorId: '$colorCategoryCode._id'}},

            {$lookup: {
                from: caratMasterModel.collection.name, as: 'weightRangeId',
                let: {weightRangeId: '$weightRangeId', weight: '$weight'},
                pipeline: [
                    {$match :{$and: [
                       // {$expr: {$eq: ['$_id', '$$weightRangeId']}},
                        {$expr: {isDeleted: false}},
                        {$expr: {$lte: ['$fromCarat', '$$weight']}},
                        {$expr: {$gte: ['$toCarat', '$$weight']}}
                    ]}},
                ]
            }},
            {$unwind: {path: "$weightRangeId", preserveNullAndEmptyArrays: true}},
            {$set: {weightRangeId: '$weightRangeId._id'}},

            // {$lookup: {
            //     from: stoneTypeMasterModel.collection.name, as: 'stoneTypeId',
            //     let: {stoneTypeId: '$stoneTypeId', colorType: '$colorType'},
            //     pipeline: [{$match :{$and: [{$expr: {$eq: ['$type', '$$colorType']}}, {$expr: {isDeleted: false}}]}}]
            // }},
            // {$unwind: {path: "$stoneTypeId", preserveNullAndEmptyArrays: true}},
            // {$set: {stoneTypeId: '$stoneTypeId._id'}},

            {$lookup: {
                    from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId',
                    let: {weightRangeId: '$weightRangeId', clarityId: '$clarityId',colorId: '$colorId'},
                    pipeline: [
                        {$match: {$and: [
                            {$expr: {$eq: ["$clarityMasterId","$$clarityId"]}},
                            {$expr: {$eq: ["$colorMasterId","$$colorId"]}},
                            {$expr: {$eq: ["$caratRangeMasterId","$$weightRangeId"]}},
                            {$expr: {$lte: ["$effectiveDate", new Date()]}}
                        ]}},
                        {$sort: {createdAt : -1}}, {$limit:1}
                    ]
                }},
            {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},
            {$set: {infinityPriceMasterId: '$infinityPriceMasterId._id'}},
            // {$lookup: {from: infinityPriceNewModel.collection.name, localField: 'infinityPriceMasterId', foreignField: 'infinityPriceMasterId', as: 'infinityPrice'}},
            {$lookup: {from: infinityPriceNewModel.collection.name, let: {infinityPriceMasterId: '$infinityPriceMasterId'}, as: 'infinityPrice', pipeline: [    //Todo implement isDeleted every where in evry query and in every pipeline aggregatiopn.
                {$match: {$and: [
                    {$expr: {$eq: ['$infinityPriceMasterId', '$$infinityPriceMasterId']}},
                    {$expr: {$lte: ["$effectiveDate", new Date()]}}
                ]}},
                {$sort: {createdAt : -1}}, {$limit:1}
            ]}},
            {$unwind: {path: "$infinityPrice", preserveNullAndEmptyArrays: true}},
            {$set: {infinityPrice: '$infinityPrice.price'}},
            {$match: secondCond},

            /*{$lookup: {
                from: infinityPriceNewModel.collection.name, as: 'infinityPrice',
                pipeline: [
                    {$lookup: {
                        from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMasterId',
                        let: {id: '$infinityPriceMasterId'},
                        pipeline: [
                            //{$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                            {$match: {$and: [
                                        {$expr: {$eq: ["$infinityPriceMasterId.clarityMasterId","$clarityId"]}},
                                        {$expr: {$eq: ["$infinityPriceMasterId.colorMasterId","$colorId"]}},
                                        {$expr: {$gte: ["$infinityPriceMasterId.caratRangeMasterId","$weightRangeId"]}},
                                        {$expr: {$lte: ["$effectiveDate", new Date()]}}
                                    ]}},
                            {$sort: {createdAt : -1}}, {$limit:1}
                        ]
                    }},
                    {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},
                ],
            }},
            {$unwind: {path: "$infinityPrice", preserveNullAndEmptyArrays: true}},*/

            /*{$project: projection},*/ {$unset: ["createdBy.password", "updatedBy.password"]}
        ];

        let aggregate2 = [
            // {$match: cond},
            {$match: {_id: {$in: transactionData?.skuIds}}},
            {
                $group: {
                    _id: null,
                    "rejectedStones": {$sum: {$cond: [{$eq: ["$stoneStatus", skuStoneStatusEnum.REJECTED] }, 1, 0]}},
                    // "approvedStones": {
                    //     $sum: {
                    //         $cond: [{
                    //             $and: [{ $eq: ["$stoneStatus", skuStoneStatusEnum.APPROVED] },
                    //             {$ne: ["$collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN]},
                    //             {$ne: ["$collateralStatus", "COLLATERAL SOLD"]}]
                    //         }, 1, 0]
                    //     }
                    // },
                    "pendingReviewStones": { $sum: { $cond: [
                        {$or: [
                            { $eq: ["$stoneStatus", skuStoneStatusEnum.ARRIVAL] },
                            {$eq: ["$stoneStatus", skuStoneStatusEnum.REVIEW_AGAIN] }
                        ]}, 1, 0] } },
                    "collateralStones": { $sum: { $cond: [{ $eq: ["$collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }, 1, 0] } },
                    // "priceChangedStones": { $sum: { $cond: [{ $eq: ["$stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] }, 1, 0] } },
                    "priceChangedStones1": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] },
                            {$eq: ["$dmStatus", skuDmStatusEnum.COMPLETED] },
                            { $ne: ["$collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "priceChangedStones2": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] },
                            {$eq: ["$dmStatus", skuDmStatusEnum.NOT_APPLICABLE] },
                            { $ne: ["$collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "gemlogistStatusCount": {
                        $sum: {
                            $cond: [{
                                $or: [{ $eq: ["$gemlogistStatus", skuGemlogistStatusEnum.APPROVE] },
                                    { $eq: ["$gemlogistStatus", skuGemlogistStatusEnum.REJECT] },
                                    { $eq: ["$gemlogistStatus", skuGemlogistStatusEnum.PRICE_CHANGE] }]
                            }, 1, 0]
                        }
                    },
                    "readyCollateralStones1": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$stoneStatus", skuStoneStatusEnum.APPROVED] },
                            {$eq: ["$dmStatus", skuDmStatusEnum.COMPLETED] },
                            { $ne: ["$collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    "readyCollateralStones2": {$sum: {$cond: [
                        {$and: [
                            { $eq: ["$stoneStatus", skuStoneStatusEnum.APPROVED] },
                            {$eq: ["$dmStatus", skuDmStatusEnum.NOT_APPLICABLE] },
                            { $ne: ["$collateralStatus", skuCollateralStatusEnum.COLLATERAL_IN] }
                        ]}, 1, 0]}
                    },
                    // "readyCollateralStones": { $sum: { $cond: [{ $eq: ["$stoneStatus", "COLLATERAL READY"], $ne: ["$collateralStatus", "COLLATERAL IN"] }, 1, 0] } },
                    // "readyCollateralStones": {
                    //     $sum: {
                    //         $cond: [{
                    //             $and: [{ $eq: ["$stoneStatus", "COLLATERAL READY"] },
                    //             { $ne: ["$collateralStatus", "COLLATERAL IN"] }]
                    //         }, 1, 0]
                    //     }
                    // },
                    "dmRegistrationApproved": {
                        $sum: {
                            $cond: [{
                                $and: [{ $eq: ["$stoneStatus", skuStoneStatusEnum.APPROVED] },
                                    { $eq: ["$stoneRegistration", true] },
                                    { $eq: ["$dmStatus", skuDmStatusEnum.PENDING] 
                                }]
                            }, 1, 0]
                        }
                    },
                    "dmRegistrationPriceChanged": {
                        $sum: {
                            $cond: [{
                                $and: [{ $eq: ["$stoneStatus", skuStoneStatusEnum.PRICE_CHANGED] },
                                    { $eq: ["$stoneRegistration", true] },
                                    { $eq: ["$dmStatus", skuDmStatusEnum.PENDING] }
                                ]
                            }, 1, 0]
                        }
                    },
                }
            },
            { $addFields: {"approvedStones" : {$add: [ '$readyCollateralStones1', '$readyCollateralStones2' ]}}},
            { $addFields: {"priceChangedStones" : {$add: [ '$priceChangedStones1', '$priceChangedStones2' ]}}},
            { $project: {"_id": 0}}
        ]

        let [{data, page}, header] = await Promise.all([
            await new SkuRepository().aggregateIndexBR(aggregate, sort, pageNumber, pageSize, {_id: {$in: transactionData?.skuIds},isDeleted: false}),
            await skuModel.aggregate(aggregate2).then(count => count[0])
        ]);   
        if(!header) header = { rejectedStones: 0, approvedStones:0, pendingReviewStones: 0, collateralStones: 0, priceChangedStones: 0, stoneRegistration: 0, dmRegistrationPriceChanged: 0,dmRegistrationApproved: 0}
        header = {...header, totalStones: transactionData?.totalStones, importedStones: transactionData?.importedStones, notImportedStones: transactionData?.notImportedStones,
                company: transactionData?.companyId?.name}
        // let header = {totalStone: page.filterCount, totalCarats: 0, totalValue: 0}
        // data.forEach(({weight, iavId}: ITransaction) => {header.totalCarats = header.totalCarats + parseFloat(weight ?? 0);header.totalValue = header.totalValue + parseFloat(iavId?.pwv ?? 0)})
        return {header, page, data}
    }

    async importData(req: Request, res: Response, displayConfig: any, condObj: any): Promise<any> {
        //@ts-expect-error
        req.query.filters = (req.query.filters)? JSON.parse(req.query.filters): [] ;
        //@ts-expect-error
        req.query.filters = [...req.query.filters, ...condObj];
        req.query.filters = JSON.stringify(req.query.filters)
        console.log("==>req..query...filters..Res", req.query.filters)
        let { data, page }: any = await new TransactionImportRepository().findReviewBR(req.query as any)
        req.query.filters = JSON.parse(req.query.filters)
        // @ts-expect-error
        req.query.filters.splice(req.query.filters.findIndex(item => item.field === "stoneStatus"), 1) //removing obj to avoid params duplication 
        req.query.filters = JSON.stringify(req.query.filters)
        let requiredData = [];
        for (const [i, element] of data.entries()) {
            let arr: any[] = []
            for (const item of displayConfig) {
                let valKey = item.valKey.split(".");        
                if(item.isActive === false) continue
                
                if(valKey[valKey.length-1] === "drv" || valKey[valKey.length-1] === "pwv" || valKey[valKey.length-1] === "price")(lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push(0);
                else if(valKey[valKey.length-1] === "iav") (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push((0.00));
                else if(valKey[valKey.length-1] === "stoneRegistration") (element.stoneRegistration)? arr.push("YES"): arr.push("NO");
                else if(valKey[valKey.length-1] === "dmGuid") (element.dmGuid)? arr.push("completed") : arr.push("Pending");
                else if(valKey[valKey.length-1] === "pwvImport")(lo.get(element, valKey))? arr.push(Number(lo.get(element, valKey))) : arr.push(0);
                else if(valKey[valKey.length-1] === "infinityPrice")(lo.get(element, valKey))? arr.push(Number(lo.get(element, valKey))) : arr.push(0);
                else (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push('')                       
            }
            // arr = [data[i].rfId?.rfid, data[i].stoneStatus, data[i].companyId?.name, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].collateralStatus, data[i].gemlogistStatus, data[i].shape, data[i].colorSubCategory, data[i].weight, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, data[i].iavId?.drv, data[i].iavId?.iav, data[i].iavId?.pwv];
            requiredData.push(arr);
        }
        console.log("Length...importData  =============================>", HeaderData.transImport_header.length, data.length + '\n');
        return requiredData
    }

    updateReviewStatus = async({transactionId, skuIds}: {transactionId: ITransactionImport['transactionId'], skuIds: ISku['_id'][]|undefined}, user: IUser['_id']): Promise<ISku['_id'][]|undefined> => {
        if(!skuIds || skuIds.length === 0) return await this.updateAllSkus(transactionId, user)
        let skus: ISku["_id"][] = []
        let skuData = await skuModel.find({_id: {$in: skuIds}}, {"stoneStatus":1, "gemlogistStatus": 1 })
        // console.log(skuData, "======vnjn========");
        const disableAllButtons = skuData.map((ele: ISku) => (ele.gemlogistStatus==="NO ACTION"))
        if(!disableAllButtons.includes(false)) throw new Error(Errors.NO_ACTION)
           
        let check = skuData.map(async(sku: ISku) => {            
            if(sku.gemlogistStatus === "APPROVE" && sku.stoneStatus !== skuStoneStatusEnum.APPROVED) {
                skus.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.APPROVED})
            }
            else if(sku.gemlogistStatus === "NO ACTION" && sku.stoneStatus !== skuStoneStatusEnum.ARRIVAL ) {
                skus.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.ARRIVAL})
            }
            else if(sku.gemlogistStatus === "PRICE CHANGE" && sku.stoneStatus !== skuStoneStatusEnum.PRICE_CHANGED) {
                skus.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.PRICE_CHANGED})
            }
            else if(sku.gemlogistStatus === "REJECT" && skuStoneStatusEnum.REJECTED) {
                skus.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.REJECTED})
            }
        })
        await Promise.all(check)
        return skus
    }

    updateAllSkus = async(transactionId: ITransactionImport['transactionId'], user: IUser['_id']): Promise<ISku['_id'][]|undefined> => {
        let skuIds: ISku["_id"][] = []
        let data = await transactionImportModel.aggregate([
            {$match: {transactionId, isDeleted: false}},
            { $lookup: { from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuIds' } },{ $unwind: { path: "$skuIds", preserveNullAndEmptyArrays: true } },
            {$group: {_id: null,"skuData": { $addToSet: "$skuIds" }}},
            { $project: {"_id": 0, "skuData.stoneStatus":1,"skuData._id": 1, "skuData.gemlogistStatus": 1}}
        ]).then(data => data[0])
        
        if(!data) throw new Error(Errors.INVALID_TRANSACTION_ID)
        const disableAllButtons = data.skuData.map((ele: ISku) => (ele.gemlogistStatus==="NO ACTION"))        
        if(!disableAllButtons.includes(false)) throw new Error(Errors.NO_ACTION)
        
        let check = data.skuData.map(async(sku: ISku) => {
            if(sku.gemlogistStatus === "APPROVE" && sku.stoneStatus !== skuStoneStatusEnum.APPROVED) {
                skuIds.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.APPROVED, updatedBy: user})
            }
            else if(sku.gemlogistStatus === "NO ACTION" && sku.stoneStatus !== skuStoneStatusEnum.ARRIVAL ) {
                skuIds.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.ARRIVAL,updatedBy: user})
            }
            else if(sku.gemlogistStatus === "PRICE CHANGE" && sku.stoneStatus !== skuStoneStatusEnum.PRICE_CHANGED) {
                skuIds.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.PRICE_CHANGED,updatedBy: user})
            }
            else if(sku.gemlogistStatus === "REJECT" && sku.stoneStatus !== skuStoneStatusEnum.REJECTED) {
                skuIds.push(sku._id)
                await skuModel.findOneAndUpdate({_id:sku._id, isDeleted: false}, {stoneStatus: skuStoneStatusEnum.REJECTED,updatedBy: user})
            }
        });
        await Promise.all(check);
        if(skuIds.length > 0) return skuIds
    }
}
