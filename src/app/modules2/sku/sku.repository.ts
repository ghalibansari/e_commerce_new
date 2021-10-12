import {BaseRepository} from "../BaseRepository";
import skuModel from "./sku.model";
import {IReqChangeInfinityPrice, ISku, skuCollateralStatusEnum, skuColorTypeEnum, skuDmStatusEnum, skuGemlogistStatusEnum, skuRfIdStatusEnum, skuStoneStatusEnum} from "./sku.types";
import mongoose, {ClientSession} from "mongoose";
import labModel from "../lab/lab.model";
import companyModel from "../company/company.model";
import iavModel from "../iav/iav.model";
import clientPriceModel from "../client-price/client-price.model";
import rfidModel from "../rfid/rfid.model";
import rapPriceModel from "../rap-price/rap-price.model";
import {IIav} from "../iav/iav.types";
import {IClientPrice} from "../client-price/client-price.types";
import {SkuValidation} from "./sku.validation";
import {IRfid, IRfidNested} from "../rfid/rfid.types";
import alertMasterModel from "../alert-master/alert-master.model";
import alertModel from "../alert/alert.model";
import activityModel from "../activity/activity.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import {IActivity} from "../activity/activity.types";
import verificationModel from "../verification/verification.model";
import Moment from 'moment'
import {BaseHelper} from "../BaseHelper";
import {Errors, Messages, Texts} from "../../constants";
import {IEvent} from "../events/events.types";
import rawActivityModel from "../raw-activity/raw-activity.model";
import transactionImportModel from "../transaction/import/import.model";
import {ITransactionImport} from "../transaction/import/import.types";
import transactionImportReviewModel from "../transaction/import-review/import-review.model";
import transactionConsignmentModel from "../transaction/consignment/consignment.model";
import transactionSaleModel from "../transaction/sale/sale.model";
import {ICompany, ICompanyNested} from "../company/company.types";
import {devices} from "../../socket"
import {IUser} from "../user/user.types";
import {ICond, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import userModel from "../user/user.model";
import deviceModel from "../device/device.model";
import labHistoryModel from "../lab-history/lab-history.model";
import {GiaController} from "../gia/gia.controller";
import {ICounter} from "../baseTypes";
import {Enum} from "../../constants/Enum";
import {ErrorCodes} from "../../constants/ErrorCodes";
import {ILedSelection} from "../led-selection/ledSelection.types";
import ledSelectionModel from "../led-selection/led-selection.model";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import commentModel from "../comment/comment.model";
import stoneTypeMasterModel from "../stone-type-master/stone-type-master.model";
import {LoanRepository} from "../loan/loan.repository";
import skuInfinityPriceModel from "../sku-infinity-price/sku-infinity-price.model";
import loanModel from "../loan/loan.model";
import infinityPriceNewModel from "../infinity-price-new/infinity-price-new.model";
import caratMasterModel from "../infinity-price/master/carat-master/carat-master.model";
import colorMasterModel from "../infinity-price/master/color-master/color-master.model";
import clarityMasterModel from "../infinity-price/master/clarity-master/clarity-master.model";
import infinityPriceMasterModel from "../infinity-price/master/infinity-price-master/infinty-price-master.model";
import { alertStatusEnum } from "../alert/alert.types";
import { ILab } from "../lab/lab.types";
import { IColorMaster } from "../infinity-price/master/color-master/color-master.types";
import { IClarityMaster } from "../infinity-price/master/clarity-master/clarity-master.types";
import { ISkuInfinityPrice } from "../sku-infinity-price/sku-infinity-price.types";
import { alertConfig } from "../../helper/alertConfig";


export class SkuRepository extends BaseRepository<ISku> {
    constructor () {
        super(skuModel)
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object> => {
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
        };
        let sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}

        let companyId:string|string[]="";

        /*if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }*/
        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            //const {key: k, value: v} = await JSON.parse(sorter)
            let { key: k, value: v } = await JSON.parse(sorter)
            if (v == 'asc') v = 1;
            if (v == 'desc') v = -1;
            sort = { [k]: v }
        }
        else sort = { createdAt: -1, updatedAt: -1 };

        if (search) {
            search = JSON.parse(search)
            const _S = { $regex: search, $options: "i" }
            secondCond['$or'] = [{ 'rfId.rfid': _S }, { 'labsId.labReportId': _S }, { 'clientRefId': _S }, { 'infinityRefId': _S }]
        }
        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({ key: k, value: v }: any) => {

                if (k === Texts.companyId) {
                    // console.log(k, "================checking companyId");
                    //to do change the logic
                    // if (v instanceof Array && v.length > 0) companyId = v
                    // else companyId = v;
                    companyId = v
                }
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v)
                }
                else if (k === 'stoneRegistered') {
                    if (v === 'REGISTERED') cond['dmGuid'] = { "$ne": null }
                    else cond['dmGuid'] = { "$in": ["", null] }
                }
                else if (k === 'inventories') {
                    if (v) cond['stoneStatus'] = { $in: [Enum.stoneStatus.CONSIGNMENT, Enum.stoneStatus.APPROVED, Enum.stoneStatus.MISSING, Enum.stoneStatus.SOLD, Enum.stoneStatus.REMOVED] };
                    if (v) cond['collateralStatus'] = { $nin: [Enum.collateralStatus.COLLATERAL_IN] }
                }
                else if (k === 'collateralInventories') { if (v) cond['collateralStatus'] = { $in: [Enum.collateralStatus.COLLATERAL_IN] } }
                else if (k === '_id' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = { $in: v } }
                else if (k === 'clientRefId') cond[k] = v
                else if (k === 'labsId.labReportId') secondCond[k] = v
                else if (k === 'weight') cond[k] = { "$gte": v[0], "$lte": v[1] }
                else if (k === 'iavId.drv' || k === 'iavId.iav' || k === 'iavId.pwv') secondCond[k] = { "$gte": v[0], "$lte": v[1] }
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = { $in: v } }
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = { $in: v } }
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".")) v instanceof Array ? secondCond[k] = { $in: v } : secondCond[k] = v
                else v instanceof Array ? cond[k] = { $in: v } : cond[k] = v
            })
        }
        if (sliders && sliders[0] == '{' && sliders[sliders.length - 1] == '}') {  //Todo remove this kind of slider from everywhere.
            sliders = JSON.parse(sliders)
            if (sliders.weight) cond.weight = { "$gte": sliders.weight[0], "$lte": sliders.weight[1] }
            if (sliders.drv) secondCond['iavId.drv'] = { "$gte": sliders.drv[0], "$lte": sliders.drv[1] }
            if (sliders.iav) secondCond['iavId.iav'] = { "$gte": sliders.iav[0], "$lte": sliders.iav[1] }
            if (sliders.pwv) secondCond['iavId.pwv'] = { "$gte": sliders.pwv[0], "$lte": sliders.pwv[1] }
            if (sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
            //@ts-expect-error
            if (sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
        }

        if (column && column[0] == '[' && column[column.length - 1] == ']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for (const col of column) projection[col] = 1
        }

        const aggregate = [
            // {$match: cond},
            { $lookup: { from: labModel.collection.name, localField: 'labsId', foreignField: '_id', as: 'labsId' } }, { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: skuInfinityPriceModel.collection.name, localField: 'skuInfinityPriceId', foreignField: '_id', as: 'skuInfinityPriceId' } }, { $unwind: { path: "$skuInfinityPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId' } }, { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                from: commentModel.collection.name, let: { "comments": "$comments" }, pipeline: [{ "$match": { "$expr": { "$in": ["$_id", "$$comments"] } } },
                { $lookup: { from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy' } }, { "$unwind": { path: "$createdBy", preserveNullAndEmptyArrays: true } }, { $project: { 'createdBy._id': 1, 'createdBy.firstName': 1, 'createdBy.lastName': 1, 'comment': 1, "createdAt": 1 } }], as: 'comments'
            }},
            { $lookup: { from: iavModel.collection.name, localField: 'iavId', foreignField: '_id', as: 'iavId' } }, { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: rapPriceModel.collection.name, localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId' } }, { $unwind: { path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: clientPriceModel.collection.name, localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId' } }, { $unwind: { path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: rfidModel.collection.name, localField: 'rfId', foreignField: '_id', as: 'rfId' } }, { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy' } }, { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy' } }, { $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: deviceModel.collection.name, localField: 'deviceId', foreignField: '_id', as: 'deviceId' } }, { $unwind: { path: "$deviceId", preserveNullAndEmptyArrays: true } },

            // {$project: {'companyId.logoUrl': 0}}    //Todo remove this line tempo.
            // { $lookup: { from: infinityPriceNewModel.collection.name, localField: 'skuInfinityPriceId', foreignField: '_id', as: 'skuInfinityPriceId' } }, { $unwind: { path: "$skuInfinityPriceId", preserveNullAndEmptyArrays: true } },
            // { $lookup: { from: infinityPriceMasterModel.collection.name, localField: 'skuInfinityPriceId.infinityPriceMasterId', foreignField: '_id', as: 'skuInfinityPriceId.infinityPriceMasterId' } }, { $unwind: { path: "$skuInfinityPriceId.infinityPriceMasterId", preserveNullAndEmptyArrays: true } },
        ]

        /*const aggregate2: any = [
            {$match: {isDeleted: false}},

            {$lookup: {
                    from: loanModel.collection.name,
                    let: {companyId: '$companyId'},
                    as: 'loan',
                    pipeline: [{$match: {$expr: {$eq: ['$companyId', '$$companyId']}, isDeleted: false}}]
                }}, {$unwind: {path: "$loan", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                from: companyClientSettingModel.collection.name,
                let: {companyId: '$companyId'},
                as: 'clientCompany',
                pipeline: [{$match: {$expr: {$eq: ['$companyId', '$$companyId']}, isDeleted: false}}]
            }}, {$unwind: {path: "$clientCompany", preserveNullAndEmptyArrays: true}},
            // {$set: {'clarityCode': '$clarityCode.code'}},

            {$lookup: {
                from: clarityMasterModel.collection.name,
                let: {clarity: '$clarity'},
                as: 'clarityCode',
                pipeline: [{$match: {$expr: {$eq: ['$clarity', '$$clarity']}, isDeleted: false}}]
            }}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
            {$set: {'clarityCode': '$clarityCode.code'}},

            {$lookup: {
                from: colorMasterModel.collection.name,
                let: {color: '$colorCategory'},
                as: 'colorCode',
                pipeline: [{$match: {$expr: {$eq: ['$color', '$$color']}, isDeleted: false}}]
            }}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},
            {$set: {'colorCode': '$colorCode.code'}},

            {$lookup: {
                from: infinityPriceModel.collection.name,
                as: 'infinity',
                let: {stoneType: '$colorType', weight: '$weight', clarityCode: '$clarityCode', colorCode: '$colorCode'},
                pipeline: [
                    {$match: {isDeleted: false}},
                    {$lookup: {
                        from: stoneTypeMasterModel.collection.name,
                        as: 'stoneType',
                        let: {stoneTypeId: '$stoneTypeId', stoneType: '$stoneType'},
                        pipeline: [{$match: {$and: [{$expr: {$eq: ['$_id', '$$stoneTypeId']}}, {isDeleted: false}]}}]
                    }}, {$unwind: {path: "$stoneType", preserveNullAndEmptyArrays: true}},
                    {$match: {$expr: {$eq: ['$stoneType.type', '$$stoneType']}}},

                    {$lookup: {
                        from: caratMasterModel.collection.name,
                        let: {weightRangeId: '$weightRangeId'},
                        as: 'carat',
                        pipeline: [{$match :{$and: [{$expr: {$eq: ['$_id', '$$weightRangeId']}}, {isDeleted: false}]}}]
                    }}, {$unwind: {path: "$carat", preserveNullAndEmptyArrays: true}},
                    {$match :{$and: [{$expr: {$lte: ['$carat.fromCarat', '$$weight']}}, {$expr: {$gte: ['$carat.toCarat', '$$weight']}}]}},

                    {$lookup: {
                        from: clarityRangeModel.collection.name,
                        as: 'clarity',
                        let: {clarityRangeId: '$clarityRangeId'},
                        pipeline: [{$match :{$and: [{$expr: {$eq: ['$_id', '$$clarityRangeId']}}, {isDeleted: false}]}}]
                    }}, {$unwind: {path: "$clarity", preserveNullAndEmptyArrays: true}},
                    {$match :{$and: [{$expr: {$lte: ['$clarity.fromClarity', '$$clarityCode']}}, {$expr: {$gte: ['$clarity.toClarity', '$$clarityCode']}}]}},

                    {$lookup: {
                        from: colorRangeModel.collection.name,
                        let: {colorRangeId: '$colorRangeId'},
                        as: 'color',
                        pipeline: [{$match :{$and: [{$expr: {$eq: ['$_id', '$$colorRangeId']}}, {isDeleted: false}]}}]
                    }}, {$unwind: {path: "$color", preserveNullAndEmptyArrays: true}},
                    {$match :{$and: [{$expr: {$lte: ['$color.fromColor', '$$colorCode']}}, {$expr: {$gte: ['color.$toColor', '$$colorCode']}}]}},
                ]
            }}, {$unwind: {path: "$infinity", preserveNullAndEmptyArrays: true}},
            {$set: {infinityWeightAndPrice: {$multiply: ['$weight', '$infinity.price']}}},

            {$lookup: {
                from: iavModel.collection.name,
                as: 'iav',
                let: {iavId: '$iavId'},
                pipeline: [
                    {$match: {$and: [{$expr: {$eq: ['$_id', '$$iavId']}}, {isDeleted: false}]}},
                    {$lookup: {
                        from: clientPriceModel.collection.name,
                        as: 'clientPrice',
                        let: {clientPriceId: '$clientPriceId'},
                        pipeline: [{$match: {$expr: {$eq: ['$_id', '$$clientPriceId']}}}]
                    }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},
                ]
            }}, {$unwind: {path: "$iav", preserveNullAndEmptyArrays: true}},
            {$set: {clientWeightAndPrice: {$multiply: ['$weight', '$iav.clientPrice.price']}}},

            {$set: {loanAmount: {$cond: {if: '$loan.amount', then: '$loan.amount', else: 0}}}},

            {$project: {
                // infinityCollateralValue: {$sum: '$infinityWeightAndPrice'}, clientCollateralValue: {$sum: '$pwv'},
                infinityCollateralValue: {$cond: {if: '$infinityWeightAndPrice', then: '$infinityWeightAndPrice', else: 0}},
                clientCollateralValue: {$cond: {if: '$iav.pwv', then: '$iav.pwv', else: 0}},
            //     borrowingBase: {$multiply: [{$divide: ['$ltv', 100]}, {$sum: '$infinityWeightAndPrice'}]},
            //     loanAmount:1, ltv: '$clientCompany.ltv',
                collateralShortfall: {$divide:[{$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$infinityWeightAndPrice'}]},'$loanAmount']},{$divide: ['$clientCompany.ltv', 100]}]},
            }}
        ]*/

        const sCond = [{ $match: secondCond }, { $project: projection }, { $unset: ["createdBy.password", "updatedBy.password"] }]
        const [{ data, page }, countHeader, [Header1]] = await Promise.all([
            await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize),
            await skuModel.aggregate<ISku>([{ $match: cond }, ...aggregate, { $match: secondCond }, { $project: { weight: 1, 'iavId.pwv': 1 } }]),
            companyId.length > 0 ? await new LoanRepository().getByCollateral(companyId as any) : await new LoanRepository().summaryTotal()
        ])
        //let header = {totalStone: page.filterCount, totalCarats: 0, totalValue: 0, data: Header1};
        let header = { totalStone: page.filterCount, totalCarats: 0, totalValue: 0, ...Header1 };
        //let header = { totalStone: page.filterCount, totalCarats: 0, totalValue: 0};
        //@ts-expect-error
        countHeader.forEach(({ weight, iavId }: ISku) => { header.totalCarats = header.totalCarats + parseFloat(weight ?? 0); header.totalValue = header.totalValue + parseFloat(iavId?.pwv ?? 0) })
        return { header, page, data }
    }

    changeInfinityPrice = async(newData: IReqChangeInfinityPrice['newData'], loggedInUserId: IUser['_id'], session: ClientSession): Promise<void> => {
        const update = newData.map(async (el) => {
            const sku = await skuModel.aggregate<ISku & { rapPriceStone: number; }>([
                { $match: { _id: mongoose.Types.ObjectId(el.skuId), isDeleted: false } },
                {
                    $lookup: {
                        from: iavModel.collection.name, as: 'iav',
                        let: { iavId: '$iavId' },
                        pipeline: [
                            { $match: { $and: [{ $expr: { $eq: ['$_id', '$$iavId'] } }, { isDeleted: false }] } },
                            {
                                $lookup: {
                                    from: rapPriceModel.collection.name,
                                    as: 'rapPrice',
                                    let: { rapPriceId: '$rapPriceId' },
                                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$rapPriceId'] } } }]
                                }
                            }, { $unwind: { path: "$rapPrice", preserveNullAndEmptyArrays: true } },
                        ]
                    }
                }, { $unwind: { path: "$iav", preserveNullAndEmptyArrays: true } },
                { $set: { rapPriceStone: { $cond: { if: '$iav.rapPrice.price', then: '$iav.rapPrice.price', else: 0 } } } }
            ]).then(([R]) => R);

            if (sku) {
                const skuInfinityPriceId = mongoose.Types.ObjectId();
                let totalPrice: number = 0;
                let discount: number = 0;

                if (sku?.colorType === skuColorTypeEnum.FANCY || sku?.colorType === skuColorTypeEnum.OFF_WHITE)
                    totalPrice = el.price * sku.weight;
                else if (sku?.colorType === skuColorTypeEnum.WHITE)
                    totalPrice = (((1+(el.price / 100))) * sku.rapPriceStone)* sku.weight;
                   console.log("Total Price -----------"+totalPrice);
                    //discount=(el.price*sku.rapPriceStone)*sku.weight;
                   //totalPrice=(sku.rapPriceStone*sku.weight)+discount;

                const [updated] = await Promise.all([
                    //@ts-expect-error
                    await skuModel.updateOne({ _id: el.skuId, isDeleted: false }, { skuInfinityPriceId, stoneStatus: skuStoneStatusEnum.PRICE_CHANGED, updatedBy: loggedInUserId }, { session }),
                    await skuInfinityPriceModel.create([{ skuId: sku._id, price: el.price, totalPrice, createdBy: loggedInUserId, updatedBy: loggedInUserId, _id: skuInfinityPriceId }], { session })
                ]);

                if (!updated.nModified)
                    throw `Sku ${el.skuId} not updated`;
            }
            else
                throw `Invalid SKUId ${el.skuId}`;
        })
        await Promise.all(update)
    }

    c4Edit = async (newData: any, session: ClientSession): Promise<any> => {
        const skuData = await skuModel.findOne({ _id: newData._id }).select('-_id colorType labsId').lean()
        if (!skuData) throw new Error('Invalid _id')
        else if (skuData?.colorType === skuColorTypeEnum.WHITE) {
            const data = await new GiaController().findByIdReportNumberReturn(parseInt(newData.labReportId), newData?.updatedBy)
            if (!data?.details?.results) throw new Error(`Invalid labReportId`)
            const { details: { results: { shape_and_cutting_style: shape, carat_weight: weight, clarity_grade: clarity, color_grade: colorCategory } } } = data
            await Promise.all([
                await labModel.findByIdAndUpdate({ _id: skuData.labsId[0] }, { labReportDate: newData?.labReportDate, labReportId: newData.labReportId }, { session }),
                await skuModel.findOneAndUpdate({ _id: newData._id }, { shape, weight: parseFloat(weight), clarity, colorCategory }, { session })
            ])
        }
        else {
            // if(!newData?.labReportDate) throw new Error(`labReportDate ${Errors.INVALID_OR_REQUIRED}`)
            if (!newData?.labShape) throw new Error(`labShape ${Errors.INVALID_OR_REQUIRED}`)
            if (!newData?.weight) throw new Error(`weight ${Errors.INVALID_OR_REQUIRED}`)
            if (!newData?.colorCategory) throw new Error(`colorCategory ${Errors.INVALID_OR_REQUIRED}`)
            if (!newData?.colorType) throw new Error(`colorType ${Errors.INVALID_OR_REQUIRED}`)
            if (!newData?.clarity) throw new Error(`clarity ${Errors.INVALID_OR_REQUIRED}`)
            await Promise.all([
                await labModel.findByIdAndUpdate({ _id: skuData.labsId[0] }, { labReportDate: newData?.labReportDate, labReportId: newData.labReportId }, { session }),
                await skuModel.findOneAndUpdate({ _id: newData._id }, newData, { session })
            ])
        }
        return 1
    }

    countByCompanyId = async ({ filters, search, sort: sorter, pageNumber, pageSize, column }: IIndexParam, counter: ICounter[], companyId: string): Promise<any> => {
        //@ts-expect-error
        let cond: ICond = { isDeleted: false };
        let secondCond: any = {} //Todo add isDeleted condition here in every table

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({ key: k, value: v }: any) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v)
                }
                else if (k === 'stoneRegistered') {
                    if (v === 'REGISTERED') cond['dmGuid'] = { "$ne": null }
                    else cond['dmGuid'] = { "$in": ["", null] }
                }
                else if (k === 'inventories') { if (v) cond['stoneStatus'] = { $in: ['TRANSIT', 'CONSIGNMENT', 'APPROVED', 'MISSING', 'SOLD', 'REMOVED'] } }
                else if (k === 'collateralInventories') { if (v) cond['collateralStatus'] = { $in: ['COLLATERAL IN'] } }
                else if (k === '_id' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = { $in: v } }
                else if (k === 'clientRefId') cond[k] = v
                else if (k === 'labsId.labReportId') secondCond[k] = v
                else if (k === 'weight') cond[k] = { "$gte": v[0], "$lte": v[1] }
                else if (k === 'iavId.drv' || k === 'iavId.iav' || k === 'iavId.pwv') secondCond[k] = { "$gte": v[0], "$lte": v[1] }
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = { $in: v } }
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = { $in: v } }
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".")) v instanceof Array ? secondCond[k] = { $in: v } : secondCond[k] = v
                else v instanceof Array ? cond[k] = { $in: v } : cond[k] = v
            })
        }

        let aggregate = [
            { $match: cond },
            { $lookup: { from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId' } }, { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } }, { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId' } }, { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId' } }, { $unwind: { path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId' } }, { $unwind: { path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId' } }, { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } }, { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy' } }, { $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true } },
            { $match: secondCond },
        ]
        if (companyId) aggregate.push({ $match: { 'companyId._id': mongoose.Types.ObjectId(companyId) } })

        let count: any = {}
        if (!counter.length) await skuModel.countDocuments({ isDeleted: false }).then((value: Number) => count['total'] = value)
        let countMap = counter.map(async counter => {
            await skuModel.aggregate([...aggregate, { $match: { [counter.key]: counter.value } }, { $count: 'count' }])
                .then((value: any) => {
                    if (count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                    count[`${counter.key}`][`${counter.value}`] = value[0]?.count ?? 0
                })
        })
        await Promise.all(countMap)
        return { count }
    }


    counter = async (counter: ICounter[]): Promise<{}> => { //Todo optimize and global counter function...
        let count: any = {}
        if (!counter?.length) await skuModel.countDocuments({ isDeleted: false }).then((value: Number) => count['total'] = value)
        else {
            let countMap = counter.map(async counter => {
                await skuModel.countDocuments({ [`${counter.key}`]: `${counter.value}`, isDeleted: false })
                    .then((value: Number) => {
                        if (count[counter.key] === undefined) count[counter.key] = {}
                        count[counter.key][counter.value] = value
                    })
            })
            await Promise.all(countMap)
        }
        return count
    }

    skuLabUpdate = async (newData: any, session: ClientSession) => {
        const [rfidData, skuData, labsData] = await Promise.all([
            await skuModel.aggregate([
                { $lookup: { from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId' } }, { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
                { $match: { isDeleted: false, 'rfId.rfid': newData.rfid, _id: { $ne: mongoose.Types.ObjectId(newData.skuId) } } }, { $project: { 'rfId.rfid': 1, } }, { $limit: 1 }
            ]).then(data => data[0] ?? null),
            await skuModel.aggregate([
                { $match: { isDeleted: false, _id: mongoose.Types.ObjectId(newData.skuId), labsId: mongoose.Types.ObjectId(newData.labId) } }, { $lookup: { from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId' } },
                { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } }, { $project: { 'rfId.rfid': 1, labsId: 1, colorType: 1 } }
            ]).then(data => data[0] ?? null),
            await labModel.findOne({ _id: newData.labId, isDeleted: false }).lean()
        ])
        if (!skuData) throw new Error('Invalid SkuId, LabsId or rfid')
        else if (rfidData) throw new Error('rfid Present is other Sku.') // check rfid contain by other sku or not, if not then only processed
        else if (!labsData) throw new Error('Invalid labId')
        let labUpdateInsert = { labReportId: newData.labReportId, labReportPath: newData.labReportPath, labReportDate: newData.labReportDate }
        if (skuData.colorType === Texts.WHITE) {
            const rnd = await new GiaController().findByIdReportNumberReturn(parseInt(labsData.labReportId), newData.loggedInUser._id)
            if (!rnd) throw new Error('Failed to Fetch Report Number for Gia')
            labUpdateInsert = { labReportId: rnd.reportNumber, labReportPath: rnd?.details?.links?.pdf, labReportDate: rnd?.details?.report_date }
        }
        const [labHistoryCreate, labUpdate, rfidCreate] = await Promise.all([
            await labHistoryModel.insertMany([labsData], { session }).then((data) => data[0] ?? null),
            await labModel.updateMany({ _id: newData.labId }, labUpdateInsert, { session }).lean(),
            //@ts-expect-error
            await rfidModel.create([{ rfid: newData.rfid, skuId: newData.skuId, createdBy: newData.loggedInUser._id, updatedBy: newData.loggedInUser._id }], { session }).lean().then(data => data[0] ?? null)
        ])
        if (!labHistoryCreate) throw new Error('Failed to Create Lab History')
        else if (!labUpdate?.nModified) throw new Error('Failed to Update Lab')
        else if (!rfidCreate) throw new Error('Failed to Create new Rfid')
        // return {rfidData, skuData, labsData, labHistoryCreate, labUpdate, rfidCreate}
        return;
    }

    /* findBR = async (cond: object = {}, column:object = {}, sortObj: object = {}, limit: number, startIndex: number = 1, populate: object[]=[], sliders = {}): Promise<ISku[]> =>
     {
         let skuCond = Object.assign(cond)
         //@ts-expect-error
         if(sliders?.weight) skuCond.weight = {"$gte": sliders.weight[0],"$lte": sliders.weight[1]}

         console.log("SkU"+skuCond);
         console.log(populate);

         let data=await skuModel.find(skuCond, column).sort(sortObj).limit(limit).skip(startIndex).populate(populate).lean()

         console.log("SkU"+skuCond);
         let result: any[] = []
         let newData: any[] = []
         newData=data.map(async data=> {

                 let iavData: any = {};
                 let rfidData: any = {};

             let iavCon = {skuId: data._id}
             //@ts-expect-error
             if(sliders?.drv) iavCon.drv = {"$gte": sliders.drv[0],"$lte": sliders.drv[1]}
             //@ts-expect-error
             if(sliders?.iav) iavCon.iav = {"$gte": sliders.iav[0],"$lte": sliders.iav[1]}
             //@ts-expect-error
             if(sliders?.pwv) iavCon.pwv = {"$gte": sliders.pwv[0],"$lte": sliders.pwv[1]}

                 let populate = [{path: 'rapPriceId'}, {path: 'clientPriceId'}];

                 iavData = await iavModel.findOne(iavCon).sort({"createdAt": -1}).lean()
                     //@ts-expect-error
                     .then(async (Data:IIav) =>
                     {

                         let Val={}
                         //@ts-expect-error
                         if(sliders?.vc) Val= {"price": {"$gte": sliders.vc[0],"$lte": sliders.vc[1]}}

                         if (data.colorType === colorTypeEnum.WHITE) {
                             //@ts-expect-error
                             Data.price=await rapPriceModel.findOne(Val).sort({"createdAt": -1}).select('price').lean();

                         } else {
                             //@ts-expect-error
                             Data.Price=await clientPriceModel.findOne(Val).sort({"createdAt": -1}).select('price').lean();
                         }

                         return Data;
                     })

                 console.log("Iav Data"+iavData);
                 rfidData = await rfidModel.findOne({skuId: data._id}).sort({"createdAt": -1})

                 if (rfidData != null) {
                     data.rfid = rfidData.rfid;
                 }

                 if (iavData != null) {
                     //data.iav=iavData;
                     data.iav = iavData.iav;
                     //@ts-expect-error
                     data.drv = iavData.drv;
                     //@ts-expect-error
                     data.pwv = iavData.pwv;
                     //@ts-expect-error
                     data.price = iavData?.price?.price;
                 }

             /!*if (iavData != null) {
                 //@ts-expect-error
                 data.iav = iavData;
                 //@ts-expect-error
                 data.price = iavData?.price;
             }*!/


                 // console.log(data);
                 result.push(data);
             }
         );


             /!*let populateData = [{path: 'rapPriceId'},{path:'clientPriceId'}];
             let iavData: IIav[] = await iavModel.find(cond).populate(populateData).sort({"createdAt": -1})
             console.log(iavData.length);
             // console.log(iavData,'??????????????????????????????????????????????');
             let skuIdData: ISku['_id'][] = []
             await iavData.forEach(async (iav) => await skuIdData.push(iav.skuId))
             skuIdData = [...new Set(skuIdData)]
             console.log(skuIdData,'????????????????????????')
             let skuIdResponseData: any[] = []
             skuIdData.map(async (skuId) => {
                 await skuModel.find({_id: skuId}).lean()
                     .then(sku => {
                         console.log('ssssss',sku,'zzzzzzzz')
                         //@ts-except-error
                         skuIdResponseData.push(sku)
                     });
             })
             let zzz = await Promise.all(skuIdData)
             let data=await skuModel.find(cond, column).sort(sortObj).limit(limit).skip(startIndex).populate(populate).lean()

             // console.log('======',zzz,'>>>>>>>>>>',skuIdResponseData)
             let result: any[] = []
             let newData: any[] = []
             newData=data.map(async data=>{

                 let rfidData : any ={};

                 rfidData = await rfidModel.findOne({skuId: data._id}).sort({"createdAt": -1})

                 if(data.colorType === colorTypeEnum.WHITE) {

                     if(iavData!==undefined && iavData!==null)
                     {
                         //@ts-expect-error
                         if(iavData.rapPriceId != null)
                         {
                             //@ts-expect-error
                             data.price=iavData.rapPriceId.price;
                         }
                     }
                 }
                 else
                 {
                     if(iavData!==undefined && iavData!==null) {

                         //@ts-expect-error
                         if(iavData.clientPriceId != null)
                         {  //@ts-expect-error
                             data.price = iavData.clientPriceId.price;
                         }

                     }
                 }

                 if(rfidData!=null)
                 {
                     data.rfid=rfidData.rfid;
                 }

                 if(iavData!=null)
                 {
                     //@ts-expect-error
                     //data.iav=iavData;
                     data.iav=iavData.iav;
                     //@ts-expect-error
                     data.drv=iavData.drv;
                     //@ts-expect-error
                     data.pwv=iavData.pwv;
                 }


                 console.log(data);
                 result.push(data);

             })*!/

             await  Promise.all(newData);
             return result;
     }

     findCountBR = async (cond: object = {}, sliders = {}): Promise<number> => {
         //@ts-expect-error
         if(sliders?.weight) cond.weight = {"$gte": sliders.weight[0],"$lte": sliders.weight[1]}
         return skuModel.countDocuments(cond);
     }*/

    async import(body: any, newData: any[], user: any, session: ClientSession): Promise<any> {
        let resultData: any[] = [], tempData: any[] = [], tempLabObject: any = {}, tempRfidObject: {[x in string]: IRfidNested[]} = {}, tempSkuObject: any = {}, count = 1
        let tempLabReportNumber: any[] = [], tempRfidTag: any[] = [], tempSkuRef: any[] = [], tempSkuCompanyId: any[] = [], skuIds: ISku['_id'][] = []
        let transactionBody = { transactionId: "IM-" + new Date().toISOString(), fileName: body.fileName, companyId: body.skuData[0].companyId, status: "Pending", ...user }
        let tempColor: string[] = [], tempClarity: string[] = [], tempCarat: string[] =[], tempColorObject: any= {}, tempClarityObject: any = {}
        const skuValidationInstance = await new SkuValidation()

        for (const data of newData) {
            let valid = await skuValidationInstance.skuImportValidation(data)
            if (valid) { data.error = valid; data.importStatus = "NOTINSERTED"; resultData.push(data) }
            else {
                tempData.push(data)
                tempSkuRef.push(data.ref)
                tempLabReportNumber.push(data.reportNumber)
                tempRfidTag.push(String(data.tag))
                tempSkuCompanyId.push(data.companyId)
                // tempColor.push(data.color)
                // tempClarity.push(data.clarity)
                // tempCarat.push(data.caratWeight)
            }
        }

        newData = [...tempData]
        // tempColor = [...new Set(tempSkuRef)]
        // tempCarat = [...new Set(tempCarat)]
        // tempClarity = [...new Set(tempClarity)]
        tempSkuRef = [...new Set(tempSkuRef)]
        tempRfidTag = [...new Set(tempRfidTag)]
        tempSkuCompanyId = [...new Set(tempSkuCompanyId)]
        tempLabReportNumber = [...new Set(tempLabReportNumber)]
        if (!newData.length) return resultData

        let [CompanyTotalCount, InfinityTotalCount, registerDevice, diamondMatchRegistration,companyData, tempRfidData,
            tempLabData, skuData, stoneTypeMaster, //colorData, clarityData,
            //caratData
            ]: any[] = await Promise.all([ //Todo convert all parallel read query to faceT...
            await companyModel.countDocuments({}),
            await skuModel.countDocuments({ companyId: body.skuData[0].companyId, isDeleted: false }),
            await deviceModel.find({ companyId: body.skuData[0].companyId, isDeleted: false }).session(session),
            await companyClientSettingModel.findOne({ companyId: body.skuData[0].companyId, isDeleted: false }).select('diamondMatchRegistration').lean(),
            //@ts-expect-error
            await companyModel.findOne({ _id: body.skuData[0].companyId, isDeleted: false }).populate([{ path: 'addressId' }]).lean().session(session) as ICompanyNested,
            await rfidModel.find({ rfid: { $in: tempRfidTag }, isActive: true, isDeleted: false }).populate([{ path: "skuId" }]).session(session),
            await labModel.find({ labReportId: { $in: tempLabReportNumber }, isDeleted: false }).sort({ createdAt: -1 }).session(session),
            await skuModel.find({ clientRefId: { $in: tempSkuRef }, companyId: { $in: tempSkuCompanyId }, isDeleted: false }, { clientRefId: 1, companyId: 1 }).session(session),
            await stoneTypeMasterModel.find().session(session),
            // await colorMasterModel.find({isDeleted: false, color: {$in: tempColor}}).select('color'),
            // await clarityMasterModel.find({isDeleted: false, clarity: {$in: tempClarity}}).select('clarity'),
            // await caratMasterModel.find({isDeleted: false}),
        ])

        const stoneRegistration = diamondMatchRegistration?.diamondMatchRegistration ?? false
        const dmStatus = (stoneRegistration)? skuDmStatusEnum.PENDING : skuDmStatusEnum.NOT_APPLICABLE
        if (!companyData) throw new Error(body.skuData[0].companyId + " Invalid Company Id")
        // colorData.forEach((cl: IColorMaster)=>tempColorObject[cl.color]=cl)
        // clarityData.forEach((clr:IClarityMaster)=>tempClarityObject[clr.clarity]=clr)
        skuData.forEach((sku:ISku) => tempSkuObject[sku.clientRefId] = sku);
        tempLabData.forEach((data:ILab) => tempLabObject[data.labReportId] = data)
        tempRfidData.forEach((data:any) => tempRfidObject[data.rfid] ? tempRfidObject[data.rfid].push(data) : tempRfidObject[data.rfid] = [data])

        const check = newData.map(async (importData: any, i) => {
            let company: String[] = [];
            importData.stoneRegistration = stoneRegistration
            importData.dmStatus = dmStatus
            tempRfidObject[importData.tag]?.forEach((rfId: any) => { rfId?.skuId?.companyId && company.push(String(rfId.skuId.companyId)) })
            importData.stoneTypeId = stoneTypeMaster.find((item:any) => item.type === importData.stoneType)
            // importData.colorMasterId = tempColorObject[importData.color].
            let rfidAndSkuStatus = false
            // tempRfidObject[importData.tag]?.forEach(rfid => {if(rfid.skuId.stoneStatus != (skuStoneStatusEnum.REMOVED || skuStoneStatusEnum.SOLD)) rfidAndSkuStatus = true})
            // await rfidModel.aggregate([
            //     {$match: {isDeleted: false, rfid: importData.tag}},
            //     // {$lookup: {
            //     //     from: skuModel.collection.name, let: {skuId: '$skuId'}, as: 'skuId',
            //     //     pipeline: [
            //     //         // {$match: {$expr: {$eq: ['$_id', '$$skuId']}, isDeleted: false }},
            //     //         {$match: {$and: [
            //     //             {$expr: {$eq: ['$_id', '$$skuId']}},
            //     //             // {$expr: {$eq: ['$isDeleted', false]}},
            //     //             // {$expr: {$ne: ['$stoneStatus', skuStoneStatusEnum.SOLD]}},
            //     //             // {$expr: {$ne: ['$stoneStatus', skuStoneStatusEnum.REMOVED]}}
            //     //         ]}}
            //     //     ]
            //     // }},
            //     // {$unwind: {path: '$skuId', preserveNullAndEmptyArrays: true}}
            // ])
            await rfidModel.findOne({rfid: importData.tag, isDeleted: false }).sort({ createdAt: -1 }).populate({path: 'skuId'}).select('skuId').lean()
            .then((r:any) => {
            
                // if(r?.skuId?.stoneStatus != (skuStoneStatusEnum.REMOVED || skuStoneStatusEnum.SOLD)) rfidAndSkuStatus = true
                if([skuStoneStatusEnum.REMOVED, skuStoneStatusEnum.SOLD].includes(r?.skuId?.stoneStatus)) rfidAndSkuStatus = true
                // console.log(r,'pppppp',rfidAndSkuStatus,'kkkkkkkkkk',r?.skuId?.stoneStatus,!company.includes(importData.companyId))
                // console.log('object.............',r)
            })

            if (tempLabObject[importData.reportNumber] && false) { importData.importStatus = "DUPLICATE"; importData.error = 'Duplicate Lab reportNumber' }
            // else if (tempRfidObject[importData.tag]?.length && !company.includes(importData.companyId) && !rfidAndSkuStatus) { importData.importStatus = "DUPLICATE"; importData.error = "Duplicate tagz" }
            else if(tempRfidObject[importData.tag]?.length && rfidAndSkuStatus) {importData.importStatus = "DUPLICATE"; importData.error = "Duplicate tags"}
            else if (tempSkuObject[importData.ref]?.companyId == importData.companyId) { importData.importStatus = "DUPLICATE"; importData.error = "Duplicate refId" }
            else {
                importData = await this.checkValidation(importData)
                if (importData.isCalculationValidated) {
                    importData = await this.createImport(importData, user, count, InfinityTotalCount + (i + 1), CompanyTotalCount, companyData, session)
                    importData.importStatus = "INSERTED";
                    skuIds.push(importData.skuId)
                    count++
                }
                else importData.importStatus = "NOTINSERTED";
                //    else  {
                //         importData.isCalculationValidated = false
                //         importData.isCalculationValidated = true
                //         importData = await this.createImport(importData, user, count, InfinityTotalCount + (i + 1), CompanyTotalCount, companyData, session)
                //         importData.importStatus = "INSERTED";
                //         skuIds.push(importData.skuId)
                //         count++
                //     }
            }
            resultData.push(importData)
        })
        await Promise.all(check)
        transactionBody = {
            ...transactionBody, fileName: body.fileName, notImportedStones: resultData.length - skuIds.length,
            skuIds, totalStones: resultData.length, importedStones: skuIds.length, status: "Pending"
        }
        // transactionBody.status = "Completed"; transactionBody.skuIds = skuIds
        skuIds.length && await transactionImportModel.create([transactionBody], { session })//.then(transaction => transaction[0])
        let message = `for company ${companyData.name} voucher No ${transactionBody.transactionId} has been imported`
        let DATA: any = `${message}`;
        let socketData = {code:ErrorCodes.REFRESH_INVENTORY, message}
        alertConfig(message, "Inventory", "Import", DATA, user.createdBy, socketData)
        registerDevice.forEach(({ token }: any) => token && devices && devices[token] && devices[token].emit("refresh", {code:ErrorCodes.REFRESH_INVENTORY, message: "imported inventories", data: null}))
        return resultData
    }

    groupBy = async (key: string[], companyId?: ICompany['_id']): Promise<any> => {     //Todo optimize it
        let data: { [key: string]: string }[] = []    //Todo delete this way
        const returnData = key.map(key => {
            let aggregate = []
            if (companyId) aggregate.push({ $match: { companyId: mongoose.Types.ObjectId(companyId) } })
            aggregate.push({ "$group": { _id: `$${key}` } }, { $set: { [key]: '$_id' } }, { $project: { _id: 0 } })
            return skuModel.aggregate(aggregate);
        })
        await Promise.all(returnData).then(async returnData => await returnData.forEach(dot => dot.forEach(dog => data.push(dog))))
        return data;

        // let groupObject: {[p: string]: any} = {_id: null}    //Todo uncomment this to optimize it
        // for(const k of key) groupObject[k] = {'$addToSet': `$${k}`}
        // if(companyId) return skuModel.aggregate([{$match: {companyId: mongoose.Types.ObjectId(companyId)}}, {"$group" : groupObject}, {$project: {_id: 0}}]).then([data] => data || null)
        // return skuModel.aggregate([{"$group" : groupObject}, {$project: {_id: 0}}]).then([data] => data || null)
    };

    async createAll(importData: any, user: any, count: number, session: ClientSession): Promise<any> {
        let labData = await labModel.create([{
            "lab": importData.lab, "labReportId": importData.reportNumber, "labReportPath": (importData.pdf) ? importData.pdf : null,
            labReportDate: (importData.reportDate) ? new Date(importData.reportDate) : null, ...user
        }], { session })
        importData.labId = labData[0]._id;
        importData.stoneStatus = "ARRIVAL";
        importData.skuId = await this.createSku(importData, user, count, session)
        importData.clientPriceId = await this.createClientPrice(importData, user, session)
        let [iavId, rfId] = await Promise.all([
            this.createIav(importData, user, session),
            this.createRfidTags(importData, user, session),
            // this.createImportReview(importData, transaction, user, session )
        ])
        importData = { ...importData, iavId }
        await skuModel.findOneAndUpdate({ _id: importData.skuId }, { iavId, rfId }, { session })
        return importData
    }

    async createImport(importData: any, user: any, count: number, internalInfinityTotalCount: number, CompanyTotalCount: number, company: ICompanyNested, session: ClientSession): Promise<any> {
        const labNewId = mongoose.Types.ObjectId(), skuNewId = mongoose.Types.ObjectId(), clientPriceNewId = mongoose.Types.ObjectId()
        const iavNewId = mongoose.Types.ObjectId(), rfidNewId = mongoose.Types.ObjectId(), skuInfinityPriceId = mongoose.Types.ObjectId()

        const labData = {
            _id: labNewId, labReportId: importData.reportNumber, labReportPath: importData?.pdf || null,
            labReportDate: (importData?.reportDate) ? new Date(importData.reportDate) : null, lab: importData.lab, ...user
        }

        const [colorData, clarityData, caratData] = await Promise.all([
            await colorMasterModel.findOne({isDeleted: false, color: importData.color}).select('color'),
            await clarityMasterModel.findOne({isDeleted: false, clarity: importData.clarity}).select('clarity'),
            await caratMasterModel.findOne({isDeleted: false}).where('fromCarat').lte(importData.caratWeight).where('toCarat').gte(importData.caratWeight),
        ])

        const infinityPriceMaster = await infinityPriceMasterModel.findOne({isDeleted: false, colorMasterId: colorData?._id, clarityMasterId: clarityData?._id, caratRangeMasterId: caratData?._id})
        const infinityPriceNew = await infinityPriceNewModel.findOne({isDeleted: false, infinityPriceMasterId: infinityPriceMaster?._id}).sort('-createdAt')

        console.log("Infinity Price ------------"+infinityPriceNew?.price);
        let totalPrice = 0;
        if(importData?.stoneType === skuColorTypeEnum.FANCY || importData?.stoneType === skuColorTypeEnum.OFF_WHITE) totalPrice = ((infinityPriceNew?.price||0) * importData.caratWeight)
        else if(importData?.stoneType === skuColorTypeEnum.WHITE) {
            const rapePriceData = await rapPriceModel.findOne({isDeleted: false, _id: importData?.rapPriceId})
            // console.log('infinityPriceNew?.price',infinityPriceNew?.price,'rapePriceData?.price',rapePriceData?.price,'importData.weight',importData.weight)
            // totalPrice = ((((infinityPriceNew?.price||1)/100)-1)*(rapePriceData?.price||0))*importData.weight
            // console.log('ref',importData?.ref, 'importData?.rapPriceId',importData?.rapPriceId)
            if(infinityPriceNew?.price) {
                totalPrice = ((1 + ((infinityPriceNew?.price) / 100)) * (rapePriceData?.price || 0)) * importData.caratWeight
                console.log("Total Price -----------"+totalPrice);
            }
            // console.log('infinityPriceNew?.price', infinityPriceNew?.price, 'rapePriceData?.price',rapePriceData?.price, 'importData.caratWeight', importData.caratWeight, 'totalPrice', totalPrice)
        }
        // console.log('importData?.stoneType',importData?.stoneType,'totalPrice',totalPrice,'infinityPriceNew?.price',infinityPriceNew?.price,'importData.caratWeight',importData.caratWeight,'importData?.rapPriceId',importData?.rapPriceId)
        // console.log('importData?.stoneType', importData?.stoneType)
        // console.log('+++++++++',importData.color,colorData?.color,' color ', clarityData?.clarity, " clarity ", caratData?.fromCarat, caratData?.toCarat, ' carat ', infinityPriceMaster?._id, ' infinityPriceMaster ', infinityPriceNew?.price, ' price ', totalPrice, ' totalPrice ', importData.caratWeight, ' weight ','---------', 'importData.rapriceId', importData.rapPriceId)
        const skuInfinityDatoToInsert: ISkuInfinityPrice = {_id: skuInfinityPriceId, price: infinityPriceNew?.price||0, totalPrice, skuId: skuNewId, ...user}

        importData.stoneStatus = skuStoneStatusEnum.ARRIVAL;
        importData.labId = labNewId;
        importData.skuId = skuNewId
        importData.iavId = iavNewId
        importData.clientPriceId = clientPriceNewId

        const companyName = company?.name?.slice(0, 3).toUpperCase();
        const companyLoc = company?.addressId?.address1?.slice(0, 3).toUpperCase();
        const companyId = company._id.toString().slice(0, 6).toUpperCase();
        const YYMM = new Date().getFullYear().toString().slice(2, 4) + ("0" + new Date().getMonth().toString());
        const infinityRefId = `${YYMM}-${companyId}-${companyName}-${companyLoc}-${CompanyTotalCount}-${internalInfinityTotalCount}`;
        // console.log(infinityRefId, '+++', internalInfinityTotalCount, '...........................................................');

        const skuData: ISku = {
            _id: skuNewId, labsId: [importData.labId], companyId: importData.companyId, clientRefId: importData.ref, infinityShape: importData.shape,
            clientShape: importData.shape, labShape: importData.shape, shape: importData.shape, weight: Number(importData.caratWeight), colorCategory: importData.color,
            colorSubCategory: importData.color, gradeReportColor: importData.color, colorRapnet: importData.color, clarity: importData.clarity, infinityRefId,
            measurement: importData.measurement, colorType: importData.stoneType, stoneStatus: importData.stoneStatus, pwvImport: importData.pwvImport,
            stoneRegistration: importData.stoneRegistration, dmStatus: importData.dmStatus, skuInfinityPriceId, ...user
        }

        const clientPriceData = {
            _id: clientPriceNewId, companyId: importData.companyId, skuId: importData.skuId, shape: importData.shape,
            clarity: importData.clarity, color: importData.color, weight: Number(importData.caratWeight), price: Number(importData.fixedValueCarat),
            pwvImport: Number(importData.pwvImport), status: "APPROVED", ...user, stoneTypeId: importData.stoneTypeId?._id
        }

        let iavData: any = { _id: iavNewId, ...user }
        if (importData.rapPriceId) iavData.rapPriceId = importData.rapPriceId;
        if (importData.clientPriceId) iavData.clientPriceId = importData.clientPriceId;
        iavData.iav = Number(importData.iav.replace(',', '')).toFixed(5);
        iavData.drv = Number(importData.drv.replace(',', '')).toFixed(2);
        iavData.pwv = Number(importData.pwv.replace(',', '')).toFixed(2);
        iavData.iavAverage = Number(importData.iav);
        iavData.skuId = importData.skuId;

        const rfidData: IRfid = { _id: rfidNewId, skuId: importData.skuId, rfid: importData.tag, ...user }

        // console.log('sku._id', skuData?._id,  'sku.skuInfinityPriceId', skuData.skuInfinityPriceId, 'skuInfinityDatoToInsert._id', skuInfinityDatoToInsert._id) //Todo remove this line.

        //Todo can be more optimized instead of writing data multiple times, create data object of array and insert in one short.
        //Todo find a way update multiple data by multiple condition.
        await Promise.all([
            await iavModel.insertMany([iavData], { session }),
            await labModel.insertMany([labData], { session }),
            await skuModel.insertMany([skuData], { session }),
            await rfidModel.insertMany([rfidData], { session }),
            await clientPriceModel.insertMany([clientPriceData], { session }),
            await skuInfinityPriceModel.insertMany([skuInfinityDatoToInsert], {session})
        ])

        //@ts-expect-error
        await skuModel.updateOne({ _id: importData.skuId }, { iavId: importData.iavId, rfId: rfidNewId }, { session })
        return importData
    }

    async createImportReview(body: any, transaction: ITransactionImport, user: any, session: ClientSession): Promise<void> {
        let transactionImportReviewData = { transactionId: transaction.transactionId, skuId: body.skuId, status: "IMPORTED", ...user }
        await transactionImportReviewModel.create([transactionImportReviewData], { session })
    }

    async createSku(body: any, user: any, count: number, session: ClientSession): Promise<ISku['_id']> {
        let populate = [{ path: 'addressId' }];
        let company = await companyModel.findOne({ _id: body.companyId }).populate(populate); //Todo use aggregate instead of populate...
        //@ts-expect-error
        let companyName = company.name.slice(0, 3).toUpperCase();
        console.log(companyName);
        //@ts-expect-error
        let companyLoc = company.addressId.address1.slice(0, 3).toUpperCase();
        console.log(companyLoc);
        //@ts-expect-error
        let companyId = company._id.toString().slice(0, 6).toUpperCase();
        console.log(companyId);
        let CompanyTotalCount = await companyModel.countDocuments({}) + 1;
        let InfinityTotalCount = await skuModel.countDocuments({ companyId }) + 1;
        let YYMM = new Date().getFullYear().toString().slice(2, 4) + ("0" + new Date().getMonth().toString());
        let infinityRefId = YYMM + "-" + companyId + "-" + companyName + "-" + companyLoc + "-" + CompanyTotalCount + "-" + InfinityTotalCount + "-" + new Date().getTime();  //ToDo Needs to Check

        let skuData = {
            labsId: [body.labId], companyId: body.companyId, clientRefId: body.ref, infinityShape: body.shape,
            clientShape: body.shape, labShape: body.shape, shape: body.shape, weight: body.caratWeight,
            colorCategory: body.color, colorSubCategory: body.color, gradeReportColor: body.color,
            colorRapnet: body.color, clarity: body.clarity, measurement: body.measurement, colorType: body.stoneType,
            stoneStatus: body.stoneStatus, pwvImport: body.pwvImport, infinityRefId, ...user
        }
        let sku = await skuModel.create([skuData], { session })
        return sku[0]._id
    }

    async createClientPrice(body: any, user: any, session: ClientSession): Promise<IClientPrice['_id']> {
        let clientPriceData = {
            companyId: body.companyId, skuId: body.skuId, shape: body.shape,
            clarity: body.clarity, color: body.color, weight: body.caratWeight, price: Number(body.fixedValueCarat),
            pwvImport: Number(body.pwvImport), status: "APPROVED", ...user
        }
        return await clientPriceModel.create([clientPriceData], { session }).then(([{ _id }]) => _id)
    }

    async changeDmStatus(data: Pick<ISku, '_id' | 'dmGuid'>[], dmStatus: ISku['dmStatus'], loggedInUserId: IUser['_id'], session: ClientSession): Promise<void> {
        let dmGuid: any = [];
        (data as unknown as ISku[]).forEach((data: Pick<ISku, '_id'|'dmGuid'|'dmStatus'|'updatedBy'>) => {data.dmStatus = dmStatus, data.updatedBy = loggedInUserId; dmGuid.push(data.dmGuid)})
        let skuData = await skuModel.find({dmGuid: {$in : dmGuid}, isDeleted: false}, '_id dmGuid')
        if(skuData.length > 0) throw Messages.DMGUID_IS_ALREADY_PRESENT;
        const updateData = data.map(async(data) => await skuModel.findOneAndUpdate({_id: data._id}, data, {session}))
        await Promise.all(updateData);
    }

    async createIav(body: any, user: any, session: ClientSession): Promise<IIav['_id']> {
        let iavData: any = { ...user }
        if (body.rapPriceId) iavData.rapPriceId = body.rapPriceId;
        if (body.clientPriceId) iavData.clientPriceId = body.clientPriceId;
        iavData.iav = Number(body.iav.replace(',', '')).toFixed(5);
        iavData.drv = Number(body.drv.replace(',', '')).toFixed(2);
        iavData.pwv = Number(body.pwv.replace(',', '')).toFixed(2);
        iavData.skuId = body.skuId;
        iavData.iavAverage = Number(body.iav);
        return await iavModel.create([iavData], { session }).then(([{ _id }]) => _id)
    }

    async createRfidTags(body: any, user: any, session: ClientSession): Promise<IRfid['_id']> {
        let rfidData = { skuId: body.skuId, rfid: body.tag, ...user }
        return await rfidModel.create([rfidData], { session }).then(([{ _id }]) => _id)
    }

    async checkValidation(body: any): Promise<any> {
        // body.caratWeight = Number(body.caratWeight)
        if (body.stoneType === 'WHITE') {
            // console.log("=========stoneisWhite==========");

            if (body.caratWeight > 5) body.caratWeight = 5.00;
            // if (body.shape !== 'Round') body.shape = 'Pear';
            let shape = body.shape !== 'Round' ? 'Pear' : body.shape

            let [price]: any = await rapPriceModel.aggregate([
                { '$match': { 'weightRange.fromWeight': { '$lte': Number(body.caratWeight) }, 'weightRange.toWeight': { '$gte': Number(body.caratWeight) }, 'shape': shape, 'clarity': body.clarity, 'color': body.color } },
                { '$sort': { '_id': -1 } }, { '$limit': 1 }, { $project: { price: 1, _id: 1 } }])

            // if (body.rap !== price?.price) return body
            // if (body.drv !== (body.caratWeight * price?.price).toFixed(2)) {body.error = "drv validation failed"; return body} 
            // if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) {body.error = "pwv validation failed"; return body} 
            body.rapPriceId = price?._id
            body.isCalculationValidated = true;
        }
        else {
            // console.log(body.drv +"!=="+(body.caratWeight * body.fixedValueCarat).toFixed(2));
            // if (body.drv !== (body.caratWeight * body.fixedValueCarat).toFixed(2)) {body.error = "drv validation failed"; return body} 
            // if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) {body.error = "pwv validation failed"; return body} 
            body.isCalculationValidated = true;
        }
        return body
    }

    async updateStatus(body: any, user: any, session: ClientSession): Promise<Number> { //Todo optimize this function. for just updating 2 sku's it is making 14 calls to db
        let transactionId, companyId, tagNos:any = [], skuId
        const alert = await alertMasterModel.findOne({alertType: 'USERGENERATED', priority: 'LOW', isDeleted: false})
        if (body.status === "CONSIGNMENT") transactionId = "CN-" + new Date().toISOString()
        else if (body.status === "APPROVED" || body.status === "REJECTED") transactionId = "IM-" + new Date().toISOString()
        else transactionId = "SL-" + new Date().toISOString()
        body?.skuIds.forEach((sku: any, index: number) => body.skuIds[index] = (mongoose.Types.ObjectId(sku)));
        const [skuData, diamondMatchData] = await Promise.all([
            await skuModel.aggregate([
                {$match: { _id: {$in: body.skuIds}, isDeleted: false }},
                { $lookup: { from: rfidModel.collection.name, localField: 'rfId', foreignField: '_id', as: 'rfId' } }, { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
            ]),
            await diamondMatchModel.aggregate([
                {$match: { skuId: {$in: body.skuIds}, status: "NOTMATCHED", isDeleted: false }},
                {$group: { _id: null, "diamondMatchIds": { "$addToSet": "$_id" }}}
            ]).then(data => data[0])
            // let transaction = await transactionModel.create([transactionBody], {session}).then(transaction => transaction[0])
    
        ])
        
        for (const sku of skuData) {
            // let sku = await skuModel.aggre({ _id: skuId }).lean()
            // let sku = await skuModel.aggregate([
            //     {$match: { _id: mongoose.Types.ObjectId(skuId), isDeleted: false }},
            //     { $lookup: { from: rfidModel.collection.name, localField: 'rfId', foreignField: '_id', as: 'rfId' } }, { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
            // ]).then(data=> data[0])
            tagNos.push(sku?.rfId?.rfid)
            skuId = sku._id
            if (!sku?._id) throw new Error("Invalid SkuId")
            else if (sku?.stoneStatus === 'SOLD' && body.status === "CONSIGNMENT") throw new Error("SOLD / REMOVE stone cannot be put in CONSIGNMENT")
            companyId = sku?.companyId
            let status = (body.status === "SOLD" && sku.collateralStatus === "COLLATERAL IN") ? "SOLD" : body.status;
            let activity = await this.createActivity(skuId, user, status, session)
            if (["IN", "OUT", "SOLD", "MISSING", "CONSIGNMENT"].includes(body.status)) {
                let alertType = await alertMasterModel.findOne({ status: body.status }, { createdAt: -1 })// to do alertType as Usergenerated
                if (!alertType) continue
                const alertData = { userId: user.createdBy, message: "working good", skuId, alertId: alertType?._id, status: body.status, ...user }
                await alertModel.create([alertData], { session })
            }
            else if(body.status === 'ARRIVAL' && body.stoneRegistration === true) {
                await alertModel.create([{skuId, companyId: sku?.companyId, message: 'working good', alertId: alert?._id, status: alertStatusEnum.DIAMOND_MATCH_REGISTRATION, ...user}], {session})
            }
            else if(body.status === 'ARRIVAL' && body.stoneRegistration === false) {
                alertModel.updateOne({skuId}, {isDeleted: true}, {session})
            }
            /*  else if(body.status === "APPROVED")
              {
                  if(sku.stoneRegistration)
                  {
                      await skuModel.updateOne({_id: sku._id, isDeleted: false}, {stoneStatus: "APPROVED", updatedBy: user.createdBy}, {session});
                  }
                  else
                  {
                      await skuModel.updateOne({_id: sku._id, isDeleted: false}, {stoneStatus: "COLLATERAL READY", updatedBy: user.createdBy}, {session});
                  }
              }*/
        }
        if([skuStoneStatusEnum.REMOVED, skuStoneStatusEnum.REJECTED, skuStoneStatusEnum.CONSIGNMENT, skuStoneStatusEnum.TRANSIT, skuStoneStatusEnum.SOLD].includes(body.status) && diamondMatchData?.diamondMatchIds?.length > 0) await diamondMatchModel.updateMany({_id: {$in: diamondMatchData.diamondMatchIds}}, {status: "CANCELLED", comments: body.status, updatedBy:user.createdBy }, { session })
        // transaction.status = "Completed",transaction.skuIds = body.skuIds
        let transactionBody = { transactionId, companyId, status: "Completed", skuIds: body.skuIds, ...user }
        if (['IN', 'OUT', 'INSTOCK'].includes(body.status)) {
            if (body.stoneRegistration) await skuModel.updateMany({ "_id": body.skuIds }, { "rfIdStatus": body.status, "stoneRegistration": body.stoneRegistration, updatedBy: user.createdBy, "dmStatus": skuDmStatusEnum.PENDING }, { session })
            else if (body.stoneRegistration === false) await skuModel.updateMany({ "_id": body.skuIds }, { "rfIdStatus": body.status, "stoneRegistration": body.stoneRegistration, updatedBy: user.createdBy, "dmStatus": skuDmStatusEnum.NOT_APPLICABLE }, { session })
            else await skuModel.updateMany({ "_id": body.skuIds }, { "rfIdStatus": body.status, updatedBy: user.createdBy }, { session })
        }
        else if (body.comments && body.status === skuStoneStatusEnum.REJECTED) {
            let comment: any = await commentModel.create(body.comments, { session })
            let comments: any = [];
            for (const data of comment) comments.push(data._id)
            if (body.stoneRegistration) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, $push: { comments }, "stoneRegistration": body.stoneRegistration, updatedBy: user.createdBy, "dmStatus": skuDmStatusEnum.PENDING }, { session })
            else if (body.stoneRegistration === false) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, $push: { comments }, "stoneRegistration": body.stoneRegistration, updatedBy: user.createdBy, "dmStatus": skuDmStatusEnum.NOT_APPLICABLE }, { session })
            else await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, $push: { comments }, updatedBy: user.createdBy }, { session })
        }
        /*else if(body.status === "APPROVED" && !body.stoneRegistration) {
             let companyClientSetting = await companyClientSettingModel.findOne({companyId}).select({"companyId":1, "diamondMatchRegistration": 1})
             if(companyClientSetting?.diamondMatchRegistration) await skuModel.updateMany({_id: body.skuIds, isDeleted: false}, {stoneStatus: "APPROVED", stoneRegistration: true, updatedBy: user.createdBy}, {session})
             else await skuModel.updateMany({_id: body.skuIds, isDeleted: false}, {stoneStatus: "COLLATERAL READY", stoneRegistration: false, updatedBy: user.createdBy}, {session})
         }*/
        /* else if(body.status !== "APPROVED")
         {
             await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status,"stoneRegistration":body.stoneRegistration }, { session })
         }*/
        else if (body.status === "CONSIGNMENT") {
            if (body.stoneRegistration) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, "stoneRegistration": body.stoneRegistration, dmStatus: skuDmStatusEnum.PENDING, updatedBy: user.createdBy }, { session })
            else if (body.stoneRegistration === false) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, "stoneRegistration": body.stoneRegistration, dmStatus: skuDmStatusEnum.NOT_APPLICABLE, updatedBy: user.createdBy }, { session })
            else await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, "stoneRegistration": body.stoneRegistration, updatedBy: user.createdBy }, { session })
            await transactionConsignmentModel.create([transactionBody], { session })
        }
        /* else if (body.status === "APPROVED" || body.status === "REJECTED") {
             transactionBody = { transactionId, companyId, status: body.status, approvedBy: user.createdBy, skuIds: body.skuIds, ...user }
             await transactionImportReviewModel.create([transactionBody], { session })
             // await this.transtionCount(body, session);
         }*/
        /*   else if (body.status === "REMOVED")
           {
               // @ts-expect-error
               await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status,"collateralStatus":"COLLATERAL OUT", updatedBy: user.createdBy}, { session })
               //await transactionConsignmentModel.create([transactionBody], { session })
           }*/
        else if (body.status === "SOLD") {
            // @ts-expect-error
            await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, "collateralStatus": "COLLATERAL OUT", updatedBy: user.createdBy }, { session })
            await transactionSaleModel.create([transactionBody], { session })
        }
       
        else if (body.status === skuStoneStatusEnum.REVIEW_AGAIN) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, "gemlogistStatus": skuGemlogistStatusEnum.NO_ACTION, updatedBy: user.createdBy }, { session })
        
        // else if(body.status === "ARRIVAL"|| body.status === "APPROVED")
        // {
        //     await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, stoneRegistration: body.stoneRegistration, updatedBy: user.createdBy}, { session })
        // }
        else {
            // (body.stoneRegistration=== true || body.stoneRegistration=== false)? await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, stoneRegistration: body.stoneRegistration, updatedBy: user.createdBy}, { session }) :
            //         await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, updatedBy: user.createdBy}, { session })
            if (body.stoneRegistration) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, stoneRegistration: body.stoneRegistration, dmStatus: skuDmStatusEnum.PENDING, updatedBy: user.createdBy }, { session })
            else if (body.stoneRegistration === false) await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, stoneRegistration: body.stoneRegistration, dmStatus: skuDmStatusEnum.NOT_APPLICABLE, updatedBy: user.createdBy }, { session })
            else await skuModel.updateMany({ "_id": body.skuIds }, { "stoneStatus": body.status, updatedBy: user.createdBy }, { session })
        }
        let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code : ErrorCodes.REFRESH_INVENTORY, message: "stoneStatus updated", data: {tagNos}});    
        }
        // if (body.status === skuCollateralStatusEnum.COLLATERAL_IN) {
            
        // }
        return body.skuIds.length
    }

    async createActivity(skuId: ISku['_id'], user: any, status: any, session: ClientSession, comments?: any): Promise<IActivity | null> {
        let skuData: ISku | null = await skuModel.findOne({ _id: skuId })
        let dmId: any = await diamondMatchModel.findOne({ skuId, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
        if (!dmId) dmId = null
        let activityData = {
            companyId: skuData?.companyId, skuId, labsId: skuData?.labsId, iavId: skuData?.iavId,
            userId: user.createdBy, dmId, status: status, ...user
        }
        if (comments) activityData = { ...activityData, comments: comments }
        return await activityModel.create([activityData], { session }).then(([activity]) => activity)
    }

    // async ledTrigger(body: any, user: any, session: ClientSession): Promise<IActivity[]> {
    //     let activity: any = []
    //     for (const skuId of body.skuIds) {activity.push(await this.createActivity(skuId, user, body.status, session, body.comments)) }        
    //     let data = await this.getComplete(activity)
    //     if(data.registerDevice && data.registerDevice.token && devices){
    //         let token = data.registerDevice.token  
    //         if(token && devices[token]) devices[token].emit("triggerLed", data.activityData)
    //     }
    //     return activity
    // }

    async ledTrigger(body: any, user: any, session: ClientSession): Promise<any> {
        let activityData: any = [], tagInfo: any = {}, serialNumber, registerDevice, ledSelection: ILedSelection[] = []
        let populate = [{ path: "rfId" }];
        let socketData: any = [], companyIds: any = []
        let skuData = await skuModel.find({ _id: body.skuIds }).populate(populate)
        for (const sku of skuData) {
            let data: any = {};
            // if(sku.rfIdStatus !== skuRfIdStatusEnum.IN) throw Errors.SKU_NOT_IN_CABINET;
            if (!companyIds.includes(String(sku.companyId))) {
                companyIds.push(String(sku.companyId))
                let ledSelectionObj = { companyId: String(sku.companyId), comments: body.comments, skuIds: [sku._id], ...user }
                ledSelectionObj.lifeTime = (body.lifeTime) ? body.lifeTime : null
                ledSelection.push(ledSelectionObj)
            }
            else ledSelection.map((item: any) => { if (item.companyId === String(sku.companyId)) item.skuIds.push(sku._id) })

            let dmId: any = await diamondMatchModel.findOne({ skuId: sku._id, $or: [{ status: "MATCHED" }, { status: "NOTMATCHED" }] }).sort({ createdAt: -1 }).select('_id').lean()
            if (!dmId) dmId = null
            let activity = {
                companyId: sku.companyId, skuId: sku._id, labsId: sku.labsId, iavId: sku.iavId,
                userId: user.createdBy, dmId, status: "LED TRIGGER", ...user
            }
            if (body.comments) activity = { ...activity, comments: body.comments }
            activityData.push(activity)
            serialNumber = sku.reader?.serial;
            //@ts-expect-error
            data = { serialNumber: sku.reader?.serial, tag: sku.rfId?.rfid, comments: body.comments, drawer: sku.reader?.drawer }
            socketData.push(data)
        }
        ledSelection.forEach((ledObj: any) => ledObj.tagCount = ledObj.skuIds.length)
        await ledSelectionModel.create(ledSelection); //need to check session
        await activityModel.create(activityData); //need to check session
        let deviceDetails = await deviceModel.find({ companyId: { $in: companyIds }, isDeleted: false })
        // await deviceModel.find({ companyId: { $in: companyIds }, isDeleted: false });
        for (const device of deviceDetails) {
            let token = device?.token;
            if (token != null && devices && devices[token]) await devices[token].emit("refresh", {code: ErrorCodes.REFRESH_LED_SELECTION, message: "created Led Selection", data: null});
        }
        console.log(await ledSelectionModel.countDocuments({companyId:{ $in: companyIds }, isDeleted: false}));    

        // registerDevice = await deviceModel.findOne({ serialNumber });
        // let token = registerDevice?.token;
        // if (token != null && devices && devices[token]) devices[token].emit("triggerLed", socketData);
        return { status: true, message: Messages.LED_TRIGGERED_SUCCESSFULLY }
    }

    async getComplete(activity: any): Promise<any> {
        let activityData: any = [], serialNumber, registerDevice
        for (const item of activity) {
            let sku = await skuModel.findOne({ _id: item.skuId }, 'rfId').populate([{ path: 'rfId' }])
            //@ts-expect-error       
            let rawActivity: any = await rawActivityModel.findOne({ "events.EventType": "IN", "events.stones": sku?.rfId.rfid }, { reader: 1, _id: 0 }).sort({ createdAt: -1 })
            if (rawActivity) {
                serialNumber = rawActivity?.reader.serial
                //@ts-expect-error        
                rawActivity = { ...rawActivity?.reader, "tag": sku?.rfId.rfid }
                delete rawActivity.$init
                delete rawActivity.serial
                activityData.push(rawActivity)
            }
        }
        if (serialNumber) registerDevice = await deviceModel.findOne({ serialNumber })
        return { activityData, registerDevice }
    }

    async updateMany(sendEmail: any, verificationMatch: any, verifyToBeInserted: any, loggedInUserEmail: string, session: ClientSession): Promise<any> {
        const verify: any = await verificationModel.findOne(verificationMatch).sort({ createdAt: -1 })   //Todo add Ip here  
        console.log(verify);
        if (verify && Moment(verify?.createdAt).add(10, 'minutes').format() > Moment().format()) return { status: true, message: Messages.OTP_IS_ALREADY_SENT }
        await new BaseHelper().emailSend('otp_mail', sendEmail, loggedInUserEmail)
        const verifyData = await verificationModel.create([verifyToBeInserted], { session }).then(verifyData => verifyData[0])
        if (verifyData) return { status: true, message: Messages.OTP_SENT_SUCCESSFULLY }
    }

    async deleteManyVerify(query: any, verificationMatch: any, updateVerification: any, session: ClientSession): Promise<any> {
        let skuIds = JSON.parse(query.skuIds)
        const verify = await verificationModel.findOne(verificationMatch).sort({ updatedAt: -1 })

        if (verify && verify.otp == query.otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
            let updatedSkuData = await skuModel.updateMany({ "_id": skuIds }, { isDeleted: true, isActive: false }, { new: true, session })
            if (updatedSkuData.nModified === 0) return { status: false, message: Messages.UPDATE_FAILED }
            await verificationModel.updateMany({ _id: verify._id }, updateVerification, { session })
            return { status: true, message: Messages.UPDATE_SUCCESSFUL, data: updatedSkuData }
        } else return { status: false, message: Messages.INVALID_OTP }
    }

    async unReferencedAssets(): Promise<any> {
        let unReferencedAssets = [], sku: ISku | null = null, unReferencedAssetsObj: any = {}
        let rawActivityData = await rawActivityModel.findOne({}).sort({ createdAt: -1 })
        const eventInventory = rawActivityData?.events.find((item: IEvent) => { return item.EventType === "INVENTORY" });
        //@ts-expect-error
        for (const stone of eventInventory?.stones) {
            let rfids = await rfidModel.findOne({ rfid: stone, isDeleted: false }).sort({ createdAt: -1 })
            // if(rfid) sku = await skuModel.findOne({rfId: rfid?._id, isDeleted: false})
            if (!rfids) {
                let reader = await rawActivityModel.findOne({ "events.EventType": "IN", "events.stones": stone }, { reader: 1, _id: 0 }).sort({ createdAt: -1 });
                unReferencedAssetsObj = { ...reader?.reader, stone }
                delete unReferencedAssetsObj.$init
                unReferencedAssets.push(unReferencedAssetsObj)
            }
        }
        return unReferencedAssets
    }

    async updateCollateral(body: any, update: any, user: any, session: ClientSession): Promise<void> {
        let status = (body.isCollateral) ? "COLLATERAL_ADDED" : "COLLATERAL_REMOVED"
        let skuData = await skuModel.find({ _id: { "$in": body.skuIds } })
        for (const sku of skuData) {
            if (body.stoneRegisteration && (!sku?.dmGuid || sku?.dmGuid === "")) throw new Error("stones not yet registrered")
            await skuModel.findOneAndUpdate({ "_id": sku._id, isDeleted: false }, update, { session })
            await this.createActivity(sku._id, user, status, session)
        }
    }

    async filter(userId: IUser['_id'], { filters }: any): Promise<any> {
        let cond: any = {}, secondCond: any = {}
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({ key: k, value: v }: any) => {
                if (k === 'inventories') {
                    if (v) cond['stoneStatus'] = { $in: [Enum.stoneStatus.CONSIGNMENT, Enum.stoneStatus.APPROVED, Enum.stoneStatus.MISSING, Enum.stoneStatus.SOLD, Enum.stoneStatus.REMOVED] };
                    if (v) cond['collateralStatus'] = { $nin: [Enum.collateralStatus.COLLATERAL_IN, Enum.collateralStatus.COLLATERAL_OUT] }
                }
                else if (k === 'collateralInventories') { if (v) cond['collateralStatus'] = { $in: [Enum.collateralStatus.COLLATERAL_IN] } }
            })
        }
        //@ts-expect-error
        if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        return await skuModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $match: { "isDeleted": false } },
            { $lookup: { from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId' } },
            { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'devices', localField: 'deviceId', foreignField: '_id', as: 'deviceId' } },
            { $unwind: { path: "$deviceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId' } },
            { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'rapPriceId' } },
            { $unwind: { path: "$rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'clientPriceId' } },
            { $unwind: { path: "$clientPriceId", preserveNullAndEmptyArrays: true } },
            { $set: { "iavId.rapPriceId": "$rapPriceId" } },
            { $set: { "iavId.clientPriceId": "$clientPriceId" } },
            { $unset: ["rapPriceId", "clientPriceId"] },
            {$addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$weight" },
                    "color": { "$addToSet": "$colorCategory" },
                    "company": { "$addToSet": "$companyId" },
                    "stoneStatus": { "$addToSet": "$stoneStatus" },
                    "rfIdStatus": { "$addToSet": "$rfIdStatus" },
                    "dmStatus": { "$addToSet": "$dmStatus" },
                    "collateralStatus": { "$addToSet": "$collateralStatus" },
                    "shape": { "$addToSet": "$shape" },
                    "clarity": { "$addToSet": "$clarity" },
                    "colorType": { "$addToSet": "$colorType" },
                    "labs": { "$addToSet": "$labsId" },
                    "uniqueIav": { "$addToSet": "$iavId.iav" },
                    "uniquePwv": { "$addToSet": "$iavId.pwv" },
                    "uniqueDrv": { "$addToSet": "$iavId.drv" },
                    "uniqueRapPrices": { "$addToSet": "$iavId.rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$iavId.clientPriceId.price" },
                    "devices": { "$addToSet": "$deviceId" }
                }
            },
            {
                $project: {
                    _id: 0, "company._id": 1, "company.name":1,"company.sorted":1, "labs.lab": 1, "uniqueWeight": 1,
                    "color": 1, "dmStatus": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "devices.name": 1, "devices._id": 1, "stoneStatus": 1, "rfIdStatus": 1, "collateralStatus": 1
                }
            }
        ]).then(([data]) => data)
    }

    async getByTag(tagNo: any): Promise<ISku[]> {
        tagNo = tagNo.replace(/'/g, '"')
        tagNo = JSON.parse(tagNo)

        let rfId = await rfidModel.find({ rfid: { "$in": tagNo } }).select('_id')
        //@ts-expect-error
        rfId = rfId.map(rfid => rfid._id)
        console.log(rfId);

        return skuModel.aggregate([
            { $match: { rfId: { "$in": rfId }, "isDeleted": false } },
            { $lookup: { from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId' } },
            { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId' } },
            { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
            //{$project: { "deviceId": 0, "labsId": 0, "iavId": 0, "companyId": 0, } }
        ])
    }

    async getSkuFromTime(date: any): Promise<any> {
        if (date) {
            date = date.replace(/'/g, '"')
            let cond = { createdAt: { "$gt": new Date(date) }, isDeleted: false }
            return skuModel.aggregate([
                { $match: cond },
                { $project: { "deviceId": 0, "labsId": 0, "iavId": 0, "companyId": 0 } }
            ]);
        }
        return skuModel.aggregate([{ $project: { "deviceId": 0, "labsId": 0, "iavId": 0, "companyId": 0 } }])
    }

    async removeCollateral(body: any, user: IUser['_id'], session: ClientSession): Promise<any> {
        let sku = await rfidModel.aggregate([
            { $match: { rfid: { $in: body.tags }, isActive: true } },
            { $group: { _id: null, "skuIds": { "$addToSet": "$skuId" } } }
        ]).then(data1 => data1[0])
        if (!sku) return null

        let data = sku.skuIds.map(async (skuId: ISku['_id']) => {
            await Promise.all([
                await this.createActivity(skuId, { createdBy: user, updatedBy: user }, 'REMOVED', session),
                await skuModel.updateMany({ "_id": skuId }, { "stoneStatus": skuStoneStatusEnum.REMOVED, "collateralStatus": skuCollateralStatusEnum.COLLATERAL_OUT, updatedBy: user }, { session })
            ])
        })
        await Promise.all(data)
        return sku.skuIds.length
    }

    transtionCount = async (body: any, session: ClientSession) => {
        let transaction = await transactionImportModel.findOne({ transactionId: body.transactionId, isDeleted: false }).select({ 'skuIds': 1 })
        let counts = await skuModel.aggregate([
            { $match: { _id: { $in: transaction?.skuIds }, isDeleted: false } },
            {
                $group: {
                    _id: null,
                    "rejectedStones": { $sum: { $cond: [{ $eq: ["$stoneStatus", "REJECTED"] }, 1, 0] } },
                    "collateralStones": {
                        $sum: {
                            $cond: [{
                                $and: [{ $eq: ["$collateralStatus", "COLLATERAL IN"] },
                                { $ne: ["$stoneStatus", "REJECTED"] }
                                ]
                            }, 1, 0]
                        }
                    },
                    "pendingReviewStones": {
                        $sum: {
                            $cond: [{
                                $and: [{ $ne: ["$collateralStatus", "COLLATERAL IN"] },
                                { $eq: ["$stoneStatus", "ARRIVAL"] }
                                ]
                            }, 1, 0]
                        }
                    },
                    "priceChangedStones": {
                        $sum: {
                            $cond: [{
                                $and: [{ $ne: ["$collateralStatus", "COLLATERAL IN"] },
                                { $eq: ["$stoneStatus", "PRICE CHANGED"] }
                                ]
                            }, 1, 0]
                        }
                    },
                    "readyCollateralStones": {
                        $sum: {
                            $cond: [{
                                $and: [{ $ne: ["$collateralStatus", "COLLATERAL IN"] },
                                { $eq: ["$stoneStatus", "COLLATERAL READY"] }
                                ]
                            }, 1, 0]
                        }
                    }
                }
            },
            { $project: { "_id": 0 } }
        ]).then(data => data[0])
        await transactionImportModel.findOneAndUpdate({ transactionId: body.transactionId }, counts, { session })

    }

    updateGemLogistStatus = async (body: any, user: IUser['_id'], session: ClientSession): Promise<any> => {
        let sku, comment: any, comments: any = [], transaction;
        if(body.comments) {
            comment = await commentModel.create(body.comments, {session})
            for (const data of comment) comments.push(data._id)
        }

        if(body.skuId ){
            sku = (body.comments)? await skuModel.findOneAndUpdate({ _id: body.skuId, isDeleted: false }, { gemlogistStatus: body.status, $push: { comments }, updatedBy: user }, { new : true, session}) : 
                await skuModel.findOneAndUpdate({ _id: body?.skuId, isDeleted: false }, { gemlogistStatus: body.status, updatedBy: user },{ new : true, session});
            return sku
        } 
        else if(body.skuIds ) {
            sku = (body.comments)? await skuModel.updateMany({ _id: body.skuIds, isDeleted: false }, { gemlogistStatus: body.status, $push: { comments }, updatedBy: user }, {session}) : 
                await skuModel.updateMany({ _id: {$in : body?.skuIds}, isDeleted: false }, { gemlogistStatus: body.status, updatedBy: user }, {session})
             return sku.nModified        
        } 
        else {
            transaction = await transactionImportModel.findOne({transactionId: body.transactionId})
            sku = (body.comments)? await skuModel.updateMany({ _id: {$in : transaction?.skuIds}, isDeleted: false }, { gemlogistStatus: body.status, $push: { comments }, updatedBy: user }) :
                await skuModel.updateMany({ _id: {$in : transaction?.skuIds}, isDeleted: false }, { gemlogistStatus: body.status, updatedBy: user }, {session})
            return sku.nModified        
        }

        // if (body.comments) {
        //     comment = await commentModel.create(body.comments)
        //     let comments: any = []
        //     for (const data of comment) comments.push(data._id)
        //     sku = await skuModel.findOneAndUpdate({ _id: body.skuId, isDeleted: false }, { gemlogistStatus: body.status, $push: { comments }, updatedBy: user })
        // }
        // else sku = await skuModel.findOneAndUpdate({ _id: body.skuId, isDeleted: false }, { gemlogistStatus: body.status, updatedBy: user })

        // let sku = (body.comments)? await skuModel.findOneAndUpdate({_id: body.skuId, isDeleted: false}, {gemlogistStatus: body.status, $push: {comments: body.comments}, updatedBy: user}) :
        //     await skuModel.findOneAndUpdate({_id: body.skuId, isDeleted: false}, {gemlogistStatus: body.status, updatedBy: user})
        // return sku
    }

    updateStoneStatus = async (body: any, user: IUser['_id'], session: ClientSession): Promise<ISku['_id'][] | null> => {
        let skuIds: ISku['_id'][] = []
        console.log(body, "=====checking");

        const check = body.skuData.map(async (sku: any) => {
            if (sku.stoneRegistration === true || sku.stoneRegistration === false) await skuModel.findOneAndUpdate({ "_id": sku.skuId, isDeleted: false }, { "stoneStatus": sku.status, stoneRegistration: sku.stoneRegistration, updatedBy: user }, { session });
            else await skuModel.findOneAndUpdate({ "_id": sku.skuId, isDeleted: false }, { "stoneStatus": sku.skuId, updatedBy: user }, { session });
            skuIds.push(sku.skuId)
        })
        await Promise.all(check);
        return skuIds
    }

    updateDmStatus = async(body: any, user: IUser['_id'], session: ClientSession ) : Promise<any> => {
        // let data = await rfidModel.aggregate([
        //     {$match: { rfid: { $in: body.tagNos }}},
        //     {$lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
        //     {$unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
        //     {$group: {_id: null,"skuIds": { "$addToSet": "$skuId._id" }}},
        //     {$project: {_id: 0,skuIds:1 }} 
        // ]).then(data => data[0])
        // console.log(data, "==================checking");
        
        await skuModel.updateMany({_id: {$in: body.skuIds}}, { $unset: { dmGuid: 1 }, updatedBy: user, dmStatus: skuDmStatusEnum.PENDING }, { session})
        return body.skuIds
    }

    updateDmGuidTransaction = async(skuIds: any, user: IUser['_id'], session: ClientSession ) : Promise<any> => {
        const check = skuIds.map(async (_id: any) => {
            let dmGuid = Math.random().toString(36).replace('0.', '') + "-" +  Math.floor(1000 + Math.random() * 9000).toString() + "-" + Math.floor(1000 + Math.random() * 9000).toString() + "-" + Math.floor(1000 + Math.random() * 9000).toString() + "-" + Math.random().toString(36).replace('0.', '');
            let data = { dmStatus : skuDmStatusEnum.COMPLETED, updatedBy : user, dmGuid}
            await skuModel.findOneAndUpdate({_id, stoneRegistration: true}, data, {session})
        })
        await Promise.all(check);
    }
}
