import {BaseRepository} from "../BaseRepository";
import mongoose, {ClientSession, Types} from "mongoose";
import { IIndexParam, IIndexProjection, ISort } from "../../interfaces/IRepository";
import { IUser } from "../user/user.types";
import userModel from "../user/user.model";
import { Texts } from "../../constants";
import {IInfinityPrice} from "./infinity-price.types";
import infinityPriceModel from "./infinity-price.model";
import stoneTypeMasterModel from "../stone-type-master/stone-type-master.model";
import fluorscenseMasterModel from "./master/fluorescense-master/fluorescense-master.model";
import caratMasterModel from "./master/carat-master/carat-master.model";
import clarityRangeModel from "./master/clarity-range/clarity-range.model";
import colorRangeModel from "./master/color-range/color-range.model";
import companyModel from "../company/company.model";
import addressModel from "../address/address.model";
import roleModel from "../role/role.model";
import verificationModel from "../verification/verification.model";
import clarityMasterModel from "./master/clarity-master/clarity-master.model";
import colorMasterModel from "./master/color-master/color-master.model";
import skuModel from "../sku/sku.model";
import {skuColorTypeEnum, skuStoneStatusEnum} from "../sku/sku.types";
import rapPriceModel from "../rap-price/rap-price.model";
import clientPriceModel from "../client-price/client-price.model";
import rapNetPriceModel from "../rap-net-price/rap-net-price.model";




export class InfinityPriceRepository extends BaseRepository<IInfinityPrice> {
    constructor () {
        super(infinityPriceModel);
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0, 'userId.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        // if(search && search[0]=='{' && search[search.length-1]=='}'){
        //     search = JSON.parse(search);
        //     if(search.key === 'rfId') secondCond['rfId.rfid'] = {$regex: search.value, $options: "i"}
        // }
        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if(k === 'labsId.labReportId') secondCond[k] = v
                else if(k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }
        if(sliders && sliders[0]=='{' && sliders[sliders.length-1]=='}') {
            sliders = JSON.parse(sliders)
            if(sliders.weight) cond.weight = {"$gte": sliders.weight[0], "$lte": sliders.weight[1]}
            if(sliders.drv) secondCond['iavId.drv'] = {"$gte": sliders.drv[0], "$lte": sliders.drv[1]}
            if(sliders.iav) secondCond['iavId.iav'] = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
            if(sliders.pwv) secondCond['iavId.pwv'] = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}
            if(sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
            //@ts-expect-error
            if(sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        let aggregate = [
            {$match: cond},
            {$lookup: {from: stoneTypeMasterModel.collection.name, localField: 'stoneTypeId', foreignField: '_id', as: 'stoneTypeId'}},{$unwind: {path: "$stoneTypeId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: caratMasterModel.collection.name, localField: 'weightRangeId', foreignField: '_id', as: 'weightRangeId'}},{$unwind: {path: "$weightRangeId", preserveNullAndEmptyArrays: true}},
            {$lookup: {
                from: clarityRangeModel.collection.name, as: 'clarityRangeId', let: {clarityRangeId: '$clarityRangeId'},
                pipeline: [
                    {$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$_id', '$$clarityRangeId']}}}, {$limit: 1},
                    {$lookup: {
                        from: clarityMasterModel.collection.name, let: {fromClarity: '$fromClarity'}, as: 'fromClarityCode',
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$code', '$$fromClarity']}}}, {$limit: 1}]
                    }}, {$unwind: {path: "$fromClarityCode", preserveNullAndEmptyArrays: true}}, {$set: {fromClarityCode: '$fromClarityCode.code'}},
                    {$lookup: {
                        from: clarityMasterModel.collection.name, let: {toClarity: '$toClarity'}, as: 'toClarityCode',
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$code', '$$toClarity']}}}, {$limit: 1}]
                    }}, {$unwind: {path: "$toClarityCode", preserveNullAndEmptyArrays: true}}, {$set: {toClarityCode: '$toClarityCode.code'}},
                ]
            }}, {$unwind: {path: "$clarityRangeId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clarityMasterModel.collection.name, localField: 'clarityMasterId', foreignField: '_id', as: 'clarity'}},{$unwind: {path: "$clarity", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: fluorscenseMasterModel.collection.name, localField: 'fluorescenseId', foreignField: '_id', as: 'fluorescenseId'}},{$unwind: {path: "$fluorescenseId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clarityMasterModel.collection.name, localField: 'clarityRangeId.fromClarity', foreignField: 'code', as: 'clarityRangeId.fromClarity'}},{$unwind: {path: "$clarityRangeId.fromClarity", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clarityMasterModel.collection.name, localField: 'clarityRangeId.toClarity', foreignField: 'code', as: 'clarityRangeId.toClarity'}},{$unwind: {path: "$clarityRangeId.toClarity", preserveNullAndEmptyArrays: true}},
            {$lookup: {
                from: colorRangeModel.collection.name, let: {colorRangeId: '$colorRangeId'}, as: 'colorRangeId',
                pipeline: [
                    {$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$_id', '$$colorRangeId']}}}, {$limit: 1},
                    {$lookup: {
                        from: colorMasterModel.collection.name, let: {fromColor: '$fromColor'}, as: 'fromColorCode',
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$code', '$$fromColor']}}}]
                    }}, {$unwind: {path: "$fromColorCode", preserveNullAndEmptyArrays: true}}, {$set: {fromColorCode: '$fromColorCode.code'}},
                    {$lookup: {
                        from: colorMasterModel.collection.name, let: {toColor: '$toColor'}, as: 'toColorCode',
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$code', '$$toColor']}}}]
                    }}, {$unwind: {path: "$toColorCode", preserveNullAndEmptyArrays: true}}, {$set: {toColorCode: '$toColorCode.code'}},
                ]
            }},{$unwind: {path: "$colorRangeId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: colorMasterModel.collection.name, localField: 'colorRangeId.fromColor', foreignField: 'code', as: 'colorRangeId.fromColor'}},{$unwind: {path: "$colorRangeId.fromColor", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: colorMasterModel.collection.name, localField: 'colorRangeId.toColor', foreignField: 'code', as: 'colorRangeId.toColor'}},{$unwind: {path: "$colorRangeId.toColor", preserveNullAndEmptyArrays: true}},
            {$addFields: {"clarityRangeId.fromClarity": "$clarityRangeId.fromClarity.clarity"}},{$addFields: {"clarityRangeId.toClarity": "$clarityRangeId.toClarity.clarity"}},
            {$addFields: {"colorRangeId.fromColor": "$colorRangeId.fromColor.color"}},{$addFields: {"colorRangeId.toColor": "$colorRangeId.toColor.color"}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                from: rapPriceModel.collection.name,
                let: {clarity: '$clarity.clarity', fromColorCode: '$colorRangeId.fromColorCode', toColorCode: '$colorRangeId.toColorCode',
                    fromClarityCode: '$clarityRangeId.fromClarityCode', toClarityCode: '$clarityRangeId.toClarityCode',
                    fromWeight: '$weightRangeId.fromCarat', toWeight: '$weightRangeId.toCarat'
                },
                as: 'rapPrice',
                pipeline: [
                    {$match: {isDeleted: false}},
                    {$lookup: {
                        from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'},
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}]
                    }}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}}, {$set: {colorCode: '$colorCode.code'}},

                    {$lookup: {
                        from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'},
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}]
                    }}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}}, {$set: {clarityCode: '$clarityCode.code'}},

                    {$match: {$and: [
                        {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
                        {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
                        {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}}, {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                    ]}},

                    {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                    {$project: {_id: 0}}
                ]
            }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                from: rapNetPriceModel.collection.name, as: 'rapNetPrice',
                let: {clarity: '$clarity.clarity', fromColorCode: '$colorRangeId.fromColorCode', toColorCode: '$colorRangeId.toColorCode',
                    fromClarityCode: '$clarityRangeId.fromClarityCode', toClarityCode: '$clarityRangeId.toClarityCode',
                    fromWeight: '$weightRangeId.fromCarat', toWeight: '$weightRangeId.toCarat'
                },
                pipeline: [
                    {$match: {isDeleted: false}},
                    {$lookup: {
                        from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'},
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}]
                    }}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}}, {$set: {colorCode: '$colorCode.code'}},

                    {$lookup: {
                        from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'},
                        pipeline: [{$match: {isDeleted: false}}, {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}]
                    }}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}}, {$set: {clarityCode: '$clarityCode.code'}},

                    {$match: {$and: [
                        {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
                        {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
                        {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}}, {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                    ]}},

                    {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                    {$project: {_id: 0}}
                ]
            }}, {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},
            {$set: {
                'rapPrice.min': {$cond: {if: '$rapPrice.min', then: '$rapPrice.min', else: 0}},
                'rapPrice.max': {$cond: {if: '$rapPrice.max', then: '$rapPrice.max', else: 0}},
                'rapPrice.avg': {$cond: {if: '$rapPrice.avg', then: '$rapPrice.avg', else: 0}},
                'rapNetPrice.min': {$cond: {if: '$rapNetPrice.min', then: '$rapNetPrice.min', else: 0}},
                'rapNetPrice.max': {$cond: {if: '$rapNetPrice.max', then: '$rapNetPrice.max', else: 0}},
                'rapNetPrice.avg': {$cond: {if: '$rapNetPrice.avg', then: '$rapNetPrice.avg', else: 0}}
            }},
            {$match: secondCond},
            {$project: projection},
            {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]}
        ]
        return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        //@ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);
        let data = await infinityPriceModel.aggregate([
            { $match: { "isDeleted": false } },
            {
                $group: {
                    _id: null,
                    "shapes": { "$addToSet": "$shape" },
                    "colors": {"$addToSet": "$color"},
                    "shapeCodes": { "$addToSet": "$shapeCode" },
                    "clarity": { "$addToSet": "$clarity" },
                    "prices": { "$addToSet": "$price" },
                }
            },
            {
                $project: {
                    _id: 0, "shapes":1, "colors": 1, "shapeCodes": 1, "clarity": 1, "prices": 1
                }
            }
        ]).then(data => data[0])
        return data
    }  

    combinationArray = async() => {
        let [stoneTypeData, caratRange, clarityRange, colorRange] = await Promise.all([
            await stoneTypeMasterModel.aggregate([{$match: {isDeleted: false}},{$group: {_id: null,"stoneType": { "$addToSet": "$type" }}},
                {$project: {_id: 0, stoneType: 1}}
            ]).then(data => data[0].stoneType),
          /*  await fluorscenseMasterModel.aggregate([{$match: {isDeleted: false}},{$group: {_id: null,"fluorescense": { "$addToSet": "$fluorescense" }}},
                {$project: {_id: 0, fluorescense: 1}}
            ]).then(data => data[0].fluorescense),*/
            await caratMasterModel.aggregate([{$match: {isDeleted: false}},{$project: {_id: 0, fromCarat: 1, toCarat: 1}}]),
            await clarityRangeModel.aggregate([{$match: {isDeleted: false}},
                {$lookup: {from: 'claritymasters', localField: 'fromClarity', foreignField: 'code', as: 'fromClarity'}},{$unwind: {path: "$fromClarity", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'claritymasters', localField: 'toClarity', foreignField: 'code', as: 'toClarity'}},{$unwind: {path: "$toClarity", preserveNullAndEmptyArrays: true}},
                {$addFields: {"fromClarity": "$fromClarity.clarity"}},{$addFields: {"toClarity": "$toClarity.clarity"}},
                {$project: {_id: 0, fromClarity: 1, toClarity: 1}}
            ]),
            await colorRangeModel.aggregate([{$match: {isDeleted: false}},
                {$lookup: {from: 'colormasters', localField: 'fromColor', foreignField: 'code', as: 'fromColor'}},{$unwind: {path: "$fromColor", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: 'colormasters', localField: 'toColor', foreignField: 'code', as: 'toColor'}},{$unwind: {path: "$toColor", preserveNullAndEmptyArrays: true}},
                {$addFields: {"fromColor": "$fromColor.color"}},{$addFields: {"toColor": "$toColor.color"}},
                {$project: {_id: 0, fromColor: 1, toColor: 1}}
            ])
        ])
        // console.log(stoneTypeData, "========", fluorescenseData, "=====", caratRange, "=======", clarityRange, "========", colorRange);
        return {stoneTypeData, caratRange, colorRange, clarityRange}
    }

    combination = async (data: any) => {
        let data1: any = []
         for(let i= 0; i<data.stoneTypeData.length; i++) {
             for(let j= 0; j< data.fluorescenseData.length; j++){
                for(let k= 0; k< data.caratRange.length; k++){
                    for(let l= 0; l< data.clarityRange.length; l++){
                        for(let m= 0; m< data.clarityRange.length; m++){
                            // console.log(data.stoneTypeData[i], "========", data.fluorescenseData[j], "=====", data.caratRange[k], "=======", data.clarityRange[l], "========", );
                            data1.push({stoneType: data.stoneTypeData[i], fluorescence: data.fluorescenseData[j], caratRange: data.caratRange[k],
                             clarityRange: data.clarityRange[l], colorRange: data.colorRange[m] })
                        }
                    }
                }               
             }
         }
         // console.log(data1.length);
         return data1
    }

    create = async(infinityPriceData: IInfinityPrice[], session: ClientSession): Promise<any> => {
        let validInfinityPrice: IInfinityPrice[] = [];
        const check = infinityPriceData.map(async (infinityPrice: any,i) => {
            const [weightRange, clarityRange, colorRange] = await Promise.all([
                await caratMasterModel.findOne({ _id: infinityPrice.weightRangeId, isDeleted: false }),
                await clarityRangeModel.findOne({ _id: infinityPrice.clarityRangeId, isDeleted: false }),
                await colorRangeModel.findOne({ _id: infinityPrice.colorRangeId, isDeleted: false })
            ])
            if (!weightRange?._id) throw new Error("Invalid weightRangeId")
            if (!clarityRange?._id) throw new Error("Invalid clarityRangeId")
            if (!colorRange?._id) throw new Error("Invalid colorRangeId")
            validInfinityPrice.push(infinityPrice)
        })
        await Promise.all(check)
        let Return: any
        //@ts-expect=-error
        await session.withTransaction(async () => {
            Return = await infinityPriceModel.create(validInfinityPrice, {session})})
        return Return
    }

    combinationArrayIndexWhite = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any) => {    //Todo execute parallel query...
        let cond: any = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0, 'userId.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        // if(search && search[0]=='{' && search[search.length-1]=='}'){
        //     search = JSON.parse(search);
        //     if(search.key === 'rfId') secondCond['rfId.rfid'] = {$regex: search.value, $options: "i"}
        // }
        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if(k === 'labsId.labReportId') secondCond[k] = v
                else if(k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }
        if(sliders && sliders[0]=='{' && sliders[sliders.length-1]=='}') {
            sliders = JSON.parse(sliders)
            if(sliders.weight) cond.weight = {"$gte": sliders.weight[0], "$lte": sliders.weight[1]}
            if(sliders.drv) secondCond['iavId.drv'] = {"$gte": sliders.drv[0], "$lte": sliders.drv[1]}
            if(sliders.iav) secondCond['iavId.iav'] = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
            if(sliders.pwv) secondCond['iavId.pwv'] = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}
            if(sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
            //@ts-expect-error
            if(sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            {$limit: 1}, {$project: {_id: 1}},
           /* {$lookup: {from: fluorscenseMasterModel.collection.name, as: 'fluorescense', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fluorescense: 1}},
                        // {$limit: 1} //Todo remove this line
            ]}}, {$unwind: {path: "$fluorescense", preserveNullAndEmptyArrays: true}},*/

            {$lookup: {from: caratMasterModel.collection.name, as: 'caratRange', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fromCarat: 1, toCarat: 1}},
                        // {$limit: 1} //Todo remove this line
            ]}}, {$unwind: {path: "$caratRange", preserveNullAndEmptyArrays: true}},

            {$lookup: {from: clarityRangeModel.collection.name, as: 'clarityRange', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fromClarity: 1, toClarity: 1}},
                {$lookup: {from: clarityMasterModel.collection.name, let: {fromClarity: '$fromClarity'}, as: 'fromCode', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$fromClarity']}}}, {$limit: 1}
                ]}},
                {$unwind: {path: "$fromCode", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: clarityMasterModel.collection.name, let: {toClarity: '$toClarity'}, as: 'toCode', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$toClarity']}}}, {$limit: 1}
                ]}},
                {$unwind: {path: "$toCode", preserveNullAndEmptyArrays: true}},
                {$project: {fromClarity: '$fromCode.clarity', toClarity: '$toCode.clarity', fromClarityCode: '$fromCode.code', toClarityCode: "$toCode.code"}}
            ]}}, {$unwind: {path: "$clarityRange", preserveNullAndEmptyArrays: true}},

            {$lookup: {from: colorRangeModel.collection.name, as: 'colorRange', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fromColor: 1, toColor: 1}},
                {$lookup: {from: colorMasterModel.collection.name, let: {fromColor: '$fromColor'}, as: 'fromColor', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$fromColor']}}}, {$limit: 1}
                ]}},
                {$unwind: {path: "$fromColor", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: colorMasterModel.collection.name, let: {toColor: '$toColor'}, as: 'toColor', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$toColor']}}}, {$limit: 1}
                ]}},
                {$unwind: {path: "$toColor", preserveNullAndEmptyArrays: true}},
                {$project: {fromColor: '$fromColor.color', toColor: '$toColor.color', fromColorCode: '$fromColor.code', toColorCode: '$toColor.code'}}
            ]}}, {$unwind: {path: "$colorRange", preserveNullAndEmptyArrays: true}},

            {$lookup: {from: stoneTypeMasterModel.collection.name, as: 'stoneType', pipeline: [
                {$match: {isDeleted: false, type: skuColorTypeEnum.WHITE}}, {$project: {type: 1}},
            ]}}, {$unwind: {path: "$stoneType", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                from: rapPriceModel.collection.name,
                as: 'rapPrice',
                let: {fromWeight: '$caratRange.fromCarat', toWeight: '$caratRange.toCarat',
                    fromClarityCode: '$clarityRange.fromClarityCode', toClarityCode: '$clarityRange.toClarityCode',
                    fromColorCode: '$colorRange.fromColorCode', toColorCode: '$colorRange.toColorCode'
                },
                pipeline: [
                    {$project: {weightRange: 1, price: 1, clarity: 1, color: 1}},
                    {$lookup: {from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'}, pipeline: [
                        {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
                    ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},

                    {$lookup: {from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'}, pipeline: [
                        {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
                    ]}}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},

                    {$project: {weightRange: 1, price: 1, clarity: 1, clarityCode: '$clarityCode.code', colorCode: '$colorCode.code'}},
                    {$match: {$and: [
                        {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}, {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                        {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
                        {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
                    ]}},

                    // {$limit: 1}, //Todo remove this line
                    {$project: {price: 1}},
                    {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                    {$project: {_id: 0}}
                ]
            }},
            {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                    from: rapNetPriceModel.collection.name,
                    as: 'rapNetPrice',
                    let: {fromWeight: '$caratRange.fromCarat', toWeight: '$caratRange.toCarat',
                        fromClarityCode: '$clarityRange.fromClarityCode', toClarityCode: '$clarityRange.toClarityCode',
                        fromColorCode: '$colorRange.fromColorCode', toColorCode: '$colorRange.toColorCode'
                    },
                    pipeline: [
                        {$project: {weightRange: 1, price: 1, clarity: 1, color: 1}},
                        {$lookup: {from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'}, pipeline: [
                            {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
                        ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},

                        {$lookup: {from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'}, pipeline: [
                            {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
                        ]}}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},

                        {$project: {weightRange: 1, price: 1, clarity: 1, clarityCode: '$clarityCode.code', colorCode: '$colorCode.code'}},
                        {$match: {$and: [
                            {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}, {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                            {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
                            {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
                        ]}},

                        // {$limit: 1}, //Todo remove this line
                        {$project: {price: 1}},
                        {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        {$project: {_id: 0}}
                    ]
                }},
            {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},

            // {$lookup: {
            //         from: clientPriceModel.collection.name,
            //         as: 'clientPrice',
            //         let: {fromWeight: '$caratRange.fromCarat', toWeight: '$caratRange.toCarat',
            //             fromClarityCode: '$clarityRange.fromClarityCode', toClarityCode: '$clarityRange.toClarityCode',
            //             fromColorCode: '$colorRange.fromColorCode', toColorCode: '$colorRange.toColorCode'
            //         },
            //         pipeline: [
            //             {$project: {weight: 1, price: 1, clarity: 1, color: 1}},
            //             {$lookup: {from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'}, pipeline: [
            //                 {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
            //             ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
            //
            //             {$lookup: {from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'}, pipeline: [
            //                 {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
            //             ]}}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},
            //
            //             {$project: {weight: 1, price: 1, clarity: 1, clarityCode: '$clarityCode.code', colorCode: '$colorCode.code'}},
            //             {$match: {$and: [
            //                 {$expr: {$gte: ['$weight', '$$fromWeight']}}, {$expr: {$lte: ['$weight', '$$toWeight']}},
            //                 {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
            //                 {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
            //             ]}},
            //
            //             {$limit: 1},    //remove this line
                        // {$project: {price: 1}},
                        // {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        // {$project: {_id: 0}}
                    // ]
                // }},
            // {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},


            {$project: {_id: 0, stoneType: 1, fluorescense: 1, caratRange: 1, clarityRange: 1, colorRange: 1, //rapPrice: 1, rapNetPrice: 1,
                // rapPrice: {
                //     min: {$cond: {if: {$type: '$rapPrice.min'}, then: '$rapPrice.min', else: 0}},
                //     max: {$cond: {if: {$type: '$rapPrice.max'}, then: '$rapPrice.max', else: 0}},
                //     avg: {$cond: {if: {$type: '$rapPrice.avg'}, then: '$rapPrice.avg', else: 0}}
                    // avg: {$cond: {if: {$ne: [{$type: '$rapPrice.avg'}, 'missing']}, then: '$rapPrice.avg', else: 0}}
                // },
                rapPrice: {$cond: {if: {$ne: [{$type: '$rapPrice'}, 'missing']}, then: '$rapPrice', else: {min: 0, max: 0, avg: 0}}},
                rapNetPrice: {$cond: {if: {$ne: [{$type: '$rapNetPrice'}, 'missing']}, then: '$rapNetPrice', else: {min: 0, max: 0, avg: 0}}},
                // rapNetPrice: {$cond: {if: {$exists: '$rapNetPrice'}, then: '$rapNetPrice', else: null}},
                // clientPrice: {$cond: {if: {$ne: ['$stoneType.type', skuColorTypeEnum.WHITE]}, then: '$clientPrice', else: null}}
            }}
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    combinationArrayIndexFancy = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column, stoneType}: any) => {
        let cond: any = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0, 'userId.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        // if(search && search[0]=='{' && search[search.length-1]=='}'){
        //     search = JSON.parse(search);
        //     if(search.key === 'rfId') secondCond['rfId.rfid'] = {$regex: search.value, $options: "i"}
        // }
        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if(k === 'labsId.labReportId') secondCond[k] = v
                else if(k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }
        if(sliders && sliders[0]=='{' && sliders[sliders.length-1]=='}') {
            sliders = JSON.parse(sliders)
            if(sliders.weight) cond.weight = {"$gte": sliders.weight[0], "$lte": sliders.weight[1]}
            if(sliders.drv) secondCond['iavId.drv'] = {"$gte": sliders.drv[0], "$lte": sliders.drv[1]}
            if(sliders.iav) secondCond['iavId.iav'] = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
            if(sliders.pwv) secondCond['iavId.pwv'] = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}
            if(sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
            //@ts-expect-error
            if(sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            {$limit: 1}, {$project: {_id: 1}},
           /* {$lookup: {from: fluorscenseMasterModel.collection.name, as: 'fluorescense', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fluorescense: 1}},
                // {$limit: 1} //Todo remove this line
            ]}}, {$unwind: {path: "$fluorescense", preserveNullAndEmptyArrays: true}},*/

            {$lookup: {from: caratMasterModel.collection.name, as: 'caratRange', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fromCarat: 1, toCarat: 1}},
                // {$limit: 1} //Todo remove this line
            ]}}, {$unwind: {path: "$caratRange", preserveNullAndEmptyArrays: true}},

            {$lookup: {from: clarityRangeModel.collection.name, as: 'clarityRange', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fromClarity: 1, toClarity: 1}},
                {$lookup: {from: clarityMasterModel.collection.name, let: {fromClarity: '$fromClarity'}, as: 'fromCode', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$fromClarity']}}}, {$limit: 1}
                ]}}, {$unwind: {path: "$fromCode", preserveNullAndEmptyArrays: true}},

                {$lookup: {from: clarityMasterModel.collection.name, let: {toClarity: '$toClarity'}, as: 'toCode', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$toClarity']}}}, {$limit: 1}
                ]}}, {$unwind: {path: "$toCode", preserveNullAndEmptyArrays: true}},
                {$project: {fromClarity: '$fromCode.clarity', toClarity: '$toCode.clarity', fromClarityCode: '$fromCode.code', toClarityCode: "$toCode.code"}}
            ]}}, {$unwind: {path: "$clarityRange", preserveNullAndEmptyArrays: true}},

            {$lookup: {from: colorRangeModel.collection.name, as: 'colorRange', pipeline: [
                {$match: {isDeleted: false}}, {$project: {fromColor: 1, toColor: 1}},
                {$lookup: {from: colorMasterModel.collection.name, let: {fromColor: '$fromColor'}, as: 'fromColor', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$fromColor']}}}, {$limit: 1}
                ]}}, {$unwind: {path: "$fromColor", preserveNullAndEmptyArrays: true}},

                {$lookup: {from: colorMasterModel.collection.name, let: {toColor: '$toColor'}, as: 'toColor', pipeline: [
                    {$match: {$expr: {$eq: ['$code', '$$toColor']}}}, {$limit: 1}
                ]}}, {$unwind: {path: "$toColor", preserveNullAndEmptyArrays: true}},
                {$project: {fromColor: '$fromColor.color', toColor: '$toColor.color', fromColorCode: '$fromColor.code', toColorCode: '$toColor.code'}}
            ]}}, {$unwind: {path: "$colorRange", preserveNullAndEmptyArrays: true}},

            {$lookup: {from: stoneTypeMasterModel.collection.name, as: 'stoneType', pipeline: [
                {$match: {isDeleted: false, type: stoneType}}, {$project: {type: 1}},
            ]}}, {$unwind: {path: "$stoneType", preserveNullAndEmptyArrays: true}},

            // {$lookup: {
            //         from: rapPriceModel.collection.name,
            //         as: 'rapPrice',
            //         let: {fromWeight: '$caratRange.fromCarat', toWeight: '$caratRange.toCarat',
            //             fromClarityCode: '$clarityRange.fromClarityCode', toClarityCode: '$clarityRange.toClarityCode',
            //             fromColorCode: '$colorRange.fromColorCode', toColorCode: '$colorRange.toColorCode'
            //         },
            //         pipeline: [
            //             {$project: {weightRange: 1, price: 1, clarity: 1, color: 1}},
            //             {$lookup: {from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'}, pipeline: [
            //                         {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
            //                     ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
            //
            //             {$lookup: {from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'}, pipeline: [
            //                         {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
            //                     ]}}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},
            //
            //             {$project: {weightRange: 1, price: 1, clarity: 1, clarityCode: '$clarityCode.code', colorCode: '$colorCode.code'}},
            //             {$match: {$and: [
            //                         {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}, {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
            //                         {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
            //                         {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
            //                     ]}},
            //
            //             // {$limit: 1}, //Todo remove this line
            //             {$project: {price: 1}},
            //             {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
            //             {$project: {_id: 0}}
            //         ]
            //     }},
            // {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},
            //
            // {$lookup: {
            //         from: rapNetPriceModel.collection.name,
            //         as: 'rapNetPrice',
            //         let: {fromWeight: '$caratRange.fromCarat', toWeight: '$caratRange.toCarat',
            //             fromClarityCode: '$clarityRange.fromClarityCode', toClarityCode: '$clarityRange.toClarityCode',
            //             fromColorCode: '$colorRange.fromColorCode', toColorCode: '$colorRange.toColorCode'
            //         },
            //         pipeline: [
            //             {$project: {weightRange: 1, price: 1, clarity: 1, color: 1}},
            //             {$lookup: {from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'}, pipeline: [
            //                         {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
            //                     ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
            //
            //             {$lookup: {from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'}, pipeline: [
            //                         {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
            //                     ]}}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},
            //
            //             {$project: {weightRange: 1, price: 1, clarity: 1, clarityCode: '$clarityCode.code', colorCode: '$colorCode.code'}},
            //             {$match: {$and: [
            //                         {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}, {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
            //                         {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
            //                         {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
            //                     ]}},
            //
            //             // {$limit: 1}, //Todo remove this line
            //             {$project: {price: 1}},
            //             {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
            //             {$project: {_id: 0}}
            //         ]
            //     }},
            // {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                    from: clientPriceModel.collection.name,
                    as: 'clientPrice',
                    let: {fromWeight: '$caratRange.fromCarat', toWeight: '$caratRange.toCarat',
                        fromClarityCode: '$clarityRange.fromClarityCode', toClarityCode: '$clarityRange.toClarityCode',
                        fromColorCode: '$colorRange.fromColorCode', toColorCode: '$colorRange.toColorCode'
                    },
                    pipeline: [
                        {$project: {weight: 1, price: 1, clarity: 1, color: 1}},
                        {$lookup: {from: clarityMasterModel.collection.name, as: 'clarityCode', let: {clarity: '$clarity'}, pipeline: [
                            {$match: {$expr: {$eq: ['$clarity', '$$clarity']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
                        ]}}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},

                        {$lookup: {from: colorMasterModel.collection.name, as: 'colorCode', let: {color: '$color'}, pipeline: [
                            {$match: {$expr: {$eq: ['$color', '$$color']}}}, {$limit: 1}, {$project: {_id: 0, code: 1}}
                        ]}}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},

                        {$project: {weight: 1, price: 1, clarity: 1, clarityCode: '$clarityCode.code', colorCode: '$colorCode.code'}},
                        {$match: {$and: [
                            {$expr: {$gte: ['$weight', '$$fromWeight']}}, {$expr: {$lte: ['$weight', '$$toWeight']}},
                            {$expr: {$gte: ['$clarityCode', '$$fromClarityCode']}}, {$expr: {$lte: ['$clarityCode', '$$toClarityCode']}},
                            {$expr: {$gte: ['$colorCode', '$$fromColorCode']}}, {$expr: {$lte: ['$colorCode', '$$toColorCode']}},
                        ]}},

                        // {$limit: 1},    //remove this line
                        {$project: {price: 1}},
                        {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        {$project: {_id: 0}}
                    ]
                }},
            {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},

            //rap price- rap net table, client -clientprice table, rap net trading price rap net trading module.
            {$project: {_id: 0, stoneType: 1, fluorescense: 1, caratRange: 1, clarityRange: 1, colorRange: 1, //clientPrice: 1
                    clientPrice: {$cond: {if: {$ne: [{$type: '$clientPrice'}, 'missing']}, then: '$clientPrice', else: {min: 0, max: 0, avg: 0}}},
                    // rapPrice: {$cond: {if: {$eq: ['$stoneType.type', skuColorTypeEnum.WHITE]}, then: '$rapPrice', else: null}},
                    // rapNetPrice: {$cond: {if: {$eq: ['$stoneType.type', skuColorTypeEnum.WHITE]}, then: '$rapNetPrice', else: null}},
                    // clientPrice: {$cond: {if: {$exists: '$clientPrice'}, then: '$clientPrice', else: null}}
                }}
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }
}
