import {BaseRepository} from "../BaseRepository";
import { IBusiness } from "./business.types";
import BusinessModel from "./business.model";
import userModel from "../user/user.model";
import { IUser } from "../user/user.types";
import {Errors, Messages, Texts} from "../../constants";
import mongoose, {ClientSession, Mongoose} from 'mongoose'
import { ICompany } from "../company/company.types";
import skuModel from "../sku/sku.model";
import { Enum } from "../../constants/Enum";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import alertMasterModel from "../alert-master/alert-master.model";
import alertModel from "../alert/alert.model";
import { IAlert, alertStatusEnum } from "../alert/alert.types";
import { ISku, skuRfIdStatusEnum, skuStoneStatusEnum } from "../sku/sku.types";
import { ErrorCodes } from "../../constants/ErrorCodes";
import { IIndexProjection } from "../../interfaces/IRepository";
import deviceModel from "../device/device.model";
import {devices} from "../../socket"
import { DiamondMatchRuleRepository } from "../diamond-match-rule/diamond-match-rule.repository";
import { DiamondMatchController } from "../diamond-match/diamond-match.controller";
import { DiamondMatchRepository } from "../diamond-match/diamond-match.repository";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import { ICompanyClientSettingIsOpenBusiness } from "../companyClientSetting/companyClientSetting.types";


//Todo interface
export class BusinessRepository extends BaseRepository<IBusiness> {
    constructor () {
        super(BusinessModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> =>
    {
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
        };
        let sort = {};
        let projection: IIndexProjection 
        // {"_id": 1, "action": 1, "companyId":1, "lastOpenedBy": 1, "lastClosedBy": 1, "lastOpenedAt": 1,
        // "lastClosedAt":1}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        if(search){ //Todo remove regex from everywhere for searching it is very costly operation...
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'lastOpenedBy.firstName': _S}, {'lastClosedBy.firstName': _S}, {'companyId.name': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: any) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
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
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'lastOpenedBy', foreignField: '_id', as: 'lastOpenedBy'}},
            {$unwind: {path: "$lastOpenedBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'lastClosedBy', foreignField: '_id', as: 'lastClosedBy'}},
            {$unwind: {path: "$lastClosedBy", preserveNullAndEmptyArrays: true}},
        ]
        const sCond = [{$match: secondCond}, {$unset: ["lastOpenedBy.password", "lastClosedBy.password"]}]        
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    openBusiness = async (companyId: ICompany['_id'], user: any, session: ClientSession): Promise<any> => {
        const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
        let date = new Date(Math.floor(Date.now() / interval) * interval)

        let[businessData, data, companyClientSetting] = await Promise.all([
            await BusinessModel.findOne({ lastOpenedAt: {$gte: date}, companyId, action: "OPEN" }).sort({ createdAt: -1 }),
            await skuModel.aggregate([
                {
                    $facet: {
                        sku: [
                            {$match: {companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: { $nin: [skuStoneStatusEnum.SOLD, skuStoneStatusEnum.REMOVED] }, 
                                    rfIdStatus: "IN", collateralStatus: Enum.collateralStatus.COLLATERAL_IN}},
                            {$group: {_id: null, "skuIds": {$addToSet: "$_id"}}}
                        ],
                        soldCount: [{ $match: { companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: skuStoneStatusEnum.SOLD } } , { $count: 'filterCount' }],
                        missingCount: [{ $match: { companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: skuStoneStatusEnum.MISSING } } , { $count: 'filterCount' }]
                    }
                }
                // {$match: {companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: { $nin: ["SOLD", "TRANSIT", "REMOVED", "CONSIGNMENT"] }, rfIdStatus: "IN", collateralStatus: Enum.collateralStatus.COLLATERAL_IN}},
                // {$group: {_id: null, "skuIds": {$addToSet: "$_id"}}}
            ]).then(data => {
                let facetData: any = {};
                facetData.skuIds = (data[0]?.sku[0]?.skuIds)? data[0].sku[0]?.skuIds : []
                facetData.soldCount = (data[0]?.soldCount[0]?.filterCount)? data[0].soldCount[0].filterCount: 0;
                facetData.missingCount = (data[0]?.missingCount[0]?.filterCount)? data[0].missingCount[0]?.filterCount : 0
                return facetData
            }),
            await companyClientSettingModel.findOne({ companyId, isDeleted: false }).sort({ createdAt: -1 }),
        ])
        if(!companyClientSetting || companyClientSetting?.isOpenBusiness=== ICompanyClientSettingIsOpenBusiness.NO) throw Messages.OPEN_BUSINESS_FAILED;
        if(companyClientSetting?.isOpenBusiness=== ICompanyClientSettingIsOpenBusiness.DAILY && businessData?.action.includes("CLOSE")) throw Messages.OPEN_BUSINESS_FAILED_FOR_DAILY_WITH_CLOSED;
        if(companyClientSetting?.isOpenBusiness=== ICompanyClientSettingIsOpenBusiness.DAILY && businessData) throw Messages.OPEN_BUSINESS_FAILED_FOR_DAILY;

        if(!businessData) await new BusinessRepository().createDiamondMatch(companyId, user.createdBy, session)
        //@ts-expect-error
        const businessObj: IBusiness[] = { openSkuIds: data?.skuIds, companyId, openColleteralCount: data?.skuIds.length, openMissingCount: data?.missingCount, openSoldCount: data?.soldCount, action: "OPEN", lastOpenedBy: user.createdBy, lastOpenedAt: new Date() };
        const [business, registerDevice] = await Promise.all([
            await BusinessModel.create([businessObj], {session}),
            await deviceModel.find({companyId, isDeleted: false})
        ])
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code : ErrorCodes.OPEN_BUSINESS, message: Messages.OPENED_BUSINESS_SUCCESSFULLY, data: null});
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "DiamondMatch simulate created", data: null});   
        }
        return {status: true, message: Messages.OPENED_BUSINESS_SUCCESSFULLY, data: business}
    }

    closeBusiness = async (companyId: ICompany['_id'], comments: any, user: any): Promise<any> => {
        const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
        let date = new Date(Math.floor(Date.now() / interval) * interval)
        const [openBusiness, companyClientSetting] = await Promise.all([
            await BusinessModel.findOne({ lastOpenedAt: {$gte: date},action: "OPEN", companyId }).sort({ createdAt: -1 }),
            await companyClientSettingModel.findOne({ companyId, isDeleted: false }).sort({ createdAt: -1 })
        ])
        if(!companyClientSetting || companyClientSetting?.isOpenBusiness=== ICompanyClientSettingIsOpenBusiness.NO) throw Messages.CLOSED_BUSINESS_FAILED
        if(!openBusiness) throw Messages.CLOSED_BUSINESS_FAILED_WITH_OPENED;
        if(companyClientSetting?.isOpenBusiness=== ICompanyClientSettingIsOpenBusiness.DAILY && openBusiness?.action.includes("CLOSE")) throw Messages.CLOSED_BUSINESS_FAILED_FOR_DAILY;
        
        const data = await this.skuDetails(companyId, new Date(openBusiness?.lastOpenedAt))           
        const diamondMatchData = await diamondMatchModel.aggregate([
            {$match: {skuId: {$in: openBusiness?.openSkuIds}, status: "NOTMATCHED"}},
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}}, {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId'}}, {$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},
            { $addFields: {"skuId.tagNo": "$skuId.rfId.rfid"}},
            { $project: { "skuId.clientRefId": 1, "skuId.infinityRefId": 1, "skuId.tagNo": 1, "skuId.clarity": 1, "skuId.stoneStatus": 1, "skuId.rfIdStatus": 1, "skuId._id":1 } },
            {$group: {_id: null, "skuIds": {$addToSet: "$skuId"}}} 
        ]).then(data => data[0]);
        
        if(diamondMatchData?.skuIds?.length > 0 && comments ) this.createAlert(diamondMatchData.skuIds, comments, user);
        else if(diamondMatchData?.skuIds?.length>0 && !comments) return { status: false, message: Messages.CLOSED_BUSINESS_FAILED_DIAMOND_MATCH, errorCode: ErrorCodes.DIAMOND_NOT_PERFORMED, data: diamondMatchData.skuIds }

        if (openBusiness?.openSkuIds?.length <= data.inventoryCount + data.movementCount) {
            //@ts-expect-error
            const businessObj: IBusiness[] = { comments, closeSkuIds: data.skuIds, closeColleteralCount: data.skuIds.length, closeSoldCount: data.soldCount, closeMissingCount: data.missingCount, $push: {action: "CLOSE"}, lastClosedBy: user.createdBy, lastClosedAt: new Date() };
            const [business, registerDevice] = await Promise.all([
                await BusinessModel.findOneAndUpdate({_id : openBusiness?._id},businessObj, {new: true}),
                await deviceModel.find({companyId, isDeleted: false})
            ])
            for (const device of registerDevice) {
                let token = device?.token;
                if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.CLOSE_BUSINESS, message: Messages.CLOSED_BUSINESS_SUCCESSFULLY, data: null });    
            }
            return { status: true, message: Messages.CLOSED_BUSINESS_SUCCESSFULLY, data: business}
        }        
        const skuIds = openBusiness?.openSkuIds.filter( (obj: any) => {return data.skuIds.indexOf(obj) == -1;} );        
        
        const missingData = await skuModel.aggregate([
            { $match: { _id:{$in: skuIds} , isDeleted: false, $or: [{rfIdStatus: skuRfIdStatusEnum.OUT}, {stoneStatus : skuStoneStatusEnum.MISSING}] } },
            { $lookup: { from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId' } }, { $unwind: { path: "$rfId", preserveNullAndEmptyArrays: true } },
            { $addFields: { "tagNo": "$rfId.rfid" } },
            { $project: { "clientRefId": 1, "infinityRefId": 1, "tagNo": 1, "clarity": 1, "stoneStatus": 1, "rfIdStatus": 1 } }
        ]);
        if (missingData.length > 0) return { status: false, message: Messages.CLOSED_BUSINESS_FAILED_WITH_STONES_MISSING, errorCode: ErrorCodes.STONES_MISSING, data: missingData }
    }

    skuDetails = async (companyId: ICompany['_id'], date: any) => {
        return await skuModel.aggregate([
            {
                $facet: {
                    skus: [
                        { $match: { companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false,stoneStatus: { $nin: [skuStoneStatusEnum.SOLD, skuStoneStatusEnum.REMOVED] },
                             rfIdStatus: "IN", collateralStatus: Enum.collateralStatus.COLLATERAL_IN } },
                        { $group: { _id: null, "skuIds": { $addToSet: "$_id" } } }
                    ],
                    curInventory: [{ $match: { companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: { $nin: [skuStoneStatusEnum.SOLD, skuStoneStatusEnum.REMOVED] }, 
                            collateralStatus: Enum.collateralStatus.COLLATERAL_IN, rfIdStatus: Enum.rfidStatus.IN } }, { $count: 'filterCount' }],
                    count: [{ $match: { companyId: mongoose.Types.ObjectId(companyId as string), stoneStatus: { $in: [skuStoneStatusEnum.SOLD] }, updatedAt: { $gte: new Date(date) } } }, { $count: 'filterCount' }],
                    soldCount: [{ $match: { companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: skuStoneStatusEnum.SOLD } } , { $count: 'filterCount' }],
                    missingCount: [{ $match: { companyId: mongoose.Types.ObjectId(companyId as string), isDeleted: false, stoneStatus: skuStoneStatusEnum.MISSING } } , { $count: 'filterCount' }]
                }
            }
        ]).then(data => {
            let facetData: any = {};
            facetData.skuIds = (data[0]?.skus[0]?.skuIds)? data[0].skus[0]?.skuIds : [];
            facetData.inventoryCount = (data[0]?.curInventory[0]?.filterCount)? data[0].curInventory[0].filterCount: 0;
            facetData.movementCount = (data[0]?.count[0]?.filterCount)? data[0].count[0]?.filterCount : 0;
            facetData.soldCount = (data[0]?.soldCount[0]?.filterCount)? data[0].soldCount[0].filterCount: 0;
            facetData.missingCount = (data[0]?.missingCount[0]?.filterCount)? data[0].missingCount[0]?.filterCount : 0;
            return facetData
        })
    }

    createAlert = async (skuData: ISku['_id'], comments: any, user: any): Promise<void> => {
        let alertType = await alertMasterModel.findOne({ status: alertStatusEnum.DIAMOND_MATCH_NOT_PERFORMED }, { createdAt: -1 })// to do alertType as Usergenerated
        let alertData: IAlert[] = []
        for (const sku of skuData) {
            //@ts-expect-error
            let alertObj = { userId: user.createdBy, message: comments, skuId: sku._id, alertId: alertType?._id, status: alertStatusEnum.DIAMOND_MATCH_NOT_PERFORMED, ...user }
            alertData.push(alertObj)
        }
        await alertModel.insertMany(alertData)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await BusinessModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    "companies": {"$addToSet": "$companyId"},
                }
            },
            {
                $project: {
                    _id: 0, "companies._id": 1, "companies.name":1, "device": 1               
                }
            }
        ]).then(data => data[0])

        return data
    } 

    getStatus = async (companyId: ICompany['_id']): Promise<any> => {
        let [company, companyClientSetting] = await Promise.all([
            await BusinessModel.findOne({isDeleted: false, companyId}, 'action').sort({createdAt: -1}),
            await companyClientSettingModel.findOne({companyId, isDeleted: false})
        ])

        //if(!company) throw Errors.COMPANY_NOT_YET_OPENED;
        let status="";
        if(company && companyClientSetting?.isOpenBusiness === ICompanyClientSettingIsOpenBusiness.NO) return status = "OPEN"
        if(!company)  return status="CLOSE";
        status = (!company?.action.includes("CLOSE"))? "OPEN" : "CLOSE";
        return status
    }

    createDiamondMatch = async (companyId: ICompany['_id'], user: IUser['_id'], session: ClientSession): Promise<any> => {         
        const DiamondMatchRepositoryInstance = new DiamondMatchRepository();
        const diamondMatchData = await new DiamondMatchRuleRepository().findAll({companyId, isActive: true, isDeleted: false});
        //@ts-expect-error
        const runDiamondMatch = diamondMatchData.map(async ({companyId, param: {premiumPercent, premiumCycle, randomPercent, regularCycle, threshold}}) => {
            const body = {companyId, premiumPercent, premiumCycle, randomPercent, regularCycle};
            const transactionBody = {transactionId: "DM-" + Math.random(), companyId}; //Todo remove this hard coded value of updatedBy and createBy, and remove math.Random()
            const skuData = await DiamondMatchRepositoryInstance.simulateDm(companyId, threshold);
            const simulateData: any = await new DiamondMatchController().createSimulate(body, skuData);
            await DiamondMatchRepositoryInstance.createsimulateData(body, transactionBody, simulateData, session);
        })
        await Promise.all(runDiamondMatch)
    }
}
