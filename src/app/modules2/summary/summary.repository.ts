import {BaseRepository} from "../BaseRepository";
import summaryReportModel from "./summary.model";
import {ISummaryReport} from "./summary.types";
import mongoose, { ClientSession } from "mongoose";
import {IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import * as Excel from 'exceljs'
import path from 'path'
import {HeaderData} from '../../constants/ReportHeaders'
import {Request, Response} from 'express';
import {SummaryController} from './summary.controller'
import {BaseHelper} from "../BaseHelper";
import userModel from "../user/user.model";
import { IUser } from "../user/user.types";
import { Texts } from '../../constants';
import transitModel from "../transit/transit.model";
import { DiamondMatchRepository } from "../diamond-match/diamond-match.repository";
import { SkuRepository } from "../sku/sku.repository";
import { ActivityRepository } from "../activity/activity.repository";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import diamondMatchReportModel from "./daimondMatchReport/diamondMatchReport.model";
import dialyMatchReportModel from "./dailyMatchReport/dialyMatchReport.model";
import TransporterStorageReportModel from "./transporterStorageReport/transporterStorageReport.model";
import CollateralAccountedReportModel from "./collateralAccountedReport/collateralAccountedReport.model";
import CollateralUnAccountedReportModel from "./collateralUnaccountedReport/collateralUnaccountedReport.model";
import CollateralSoldReportModel from "./collateralSoldReport/collateralSoldReport.model";
import CollateralAddedReportModel from "./collateralAddedReport/collateralAddedReport.model";
import CollateralRemovedReportModel from "./collateralRemovedReport/collateralRemovedReport.model";
import CollateralInceptionReportModel from "./collateralInceptionReport/collateralInceptionReport.model";
import CurrentCollateralReportModel from "./currentCollateralReport/currentCollateralReport.model";
import { skuCollateralStatusEnum, skuStoneStatusEnum } from "../sku/sku.types";
import { ICompany } from "../company/company.types";
import labModel from "../lab/lab.model";
import companyModel from "../company/company.model";
import commentModel from "../comment/comment.model";
import iavModel from "../iav/iav.model";
import rapPriceModel from "../rap-price/rap-price.model";
import clientPriceModel from "../client-price/client-price.model";
import rfidModel from "../rfid/rfid.model";
import skuModel from "../sku/sku.model";
import activityModel from "../activity/activity.model";


export class SummaryReportRepository extends BaseRepository<ISummaryReport> {
    constructor() {
        super(summaryReportModel);
    }

    index = async ({ filters, search, sort: sorter, pageNumber, pageSize, column }: any): Promise<object[]> => {
        let cond: any = { 'isDeleted': false };
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
            // 'iavId.isDeleted': false,
            // 'iavId.rapPriceId.isDeleted': false
        };
        let sort = {}, projection: IIndexProjection = { "createdBy.password": 0, "updatedBy.password": 0 }

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            sorter = await JSON.parse(sorter)
            sort = { [sorter.key]: sorter.value }
        }
        else sort = { createdAt: -1, updatedAt: -1 };

        if (search) {
            search = JSON.parse(search)
            const _S = { $regex: search, $options: "i" }
            secondCond['$or'] = [{ 'companyId.name': _S }, { 'companyId.contacts.name': _S }, { 'companyId.contacts.email': _S },
                { 'companyId.addressId.address1': _S }, { 'companyId.addressId.address2': _S }]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({ key: k, value: v }: any) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if (k === '_id') cond[k] = mongoose.Types.ObjectId(v)
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = { $in: v } }
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = { $in: v } }
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".")) v instanceof Array ? secondCond[k] = { $in: v } : secondCond[k] = v
                else v instanceof Array ? cond[k] = { $in: v } : cond[k] = v
            })
        }

        if (column && column[0] == '[' && column[column.length - 1] == ']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for (const col of column) projection[col] = 1
        }

        const aggregate = [
            // { $match: cond },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' } },
            { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy' } },
            { $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true } },
            { $match: secondCond },
            { $project: projection },
            { $unset: ["createdBy.password", "updatedBy.password"] }
        ]
        const sCond = [{ $match: secondCond }, { $project: projection }, { $unset: ["createdBy.password", "updatedBy.password"] }]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

       //For Cron Report generation

       async exportCronReport(req: Request,mailObj:Object, res: Response): Promise<void> {

        // let { body: { loggedInUser: { _id: loggedInUserId } } } = req
         // @ts-expect-error
         let filter = JSON.parse(req.query.filters)
         let reqCompany = filter[0].value
         // var date = new Date();  //for current-month
         // var startDate = new Date(date.getFullYear(), date.getMonth(), 2);
         // var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
         // console.log("\n\n---FromDate->" + startDate, " + == + == + [C U R R E N T M O N T H] + == + == ToDate--->" + endDate + "\n\n");
         // console.log(req.query.filters);
         // let Obj = { "key": "startDate", "value": startDate }, obj2 = { "key": "endDate", "value": endDate }//adding default current-month range
         // //@ts-expect-error
         // req.query.filters = JSON.parse(req.query.filters)
         // //@ts-expect-error
         // req.query.filters.push(Obj, obj2)
         // req.query.filters = JSON.stringify(req.query.filters)
         console.log("--lOg-->",req.query.filters);
         console.log("===  mailObj ===",mailObj);
         
             // // @ts-expect-error
             // cond['createdAt'] = {"$gte": firstDay,"$lte": lastDay};
         const summaryControllerInstance = new SummaryController()
         let workbook = new Excel.Workbook();
         //res.locals.data = requiredData {5:6.7:11.8:9}
         let worksheet1 = workbook.addWorksheet('Daily Report')
         // await summaryControllerInstance.dailyReport(worksheet1,req,res)
         let worksheet2 = workbook.addWorksheet('Diamond Match')
         let worksheet3 = workbook.addWorksheet('Daily Match')
         let worksheet4 = workbook.addWorksheet('Transporter Storage')
         let worksheet5 = workbook.addWorksheet('Collateral accounted for')
         let worksheet6 = workbook.addWorksheet('Collateral unaccounted for')
         let worksheet7 = workbook.addWorksheet('Collateral at inception')
         let worksheet8 = workbook.addWorksheet('Collateral sold')
         let worksheet9 = workbook.addWorksheet('Collateral removed')
         let worksheet10 = workbook.addWorksheet('Collateral added')
         let worksheet11 = workbook.addWorksheet('Current Collateral')
         let isSumFlag = false
          await summaryControllerInstance.createTable(worksheet2, HeaderData.Diamond_match_header, await summaryControllerInstance.daimondMatchSheet(req,res),isSumFlag)
          await summaryControllerInstance.createTable(worksheet3, HeaderData.Daily_match_header, await summaryControllerInstance.dailyMatchSheet(req, res), isSumFlag)
          await summaryControllerInstance.createTable(worksheet4, HeaderData.Transporter_storage_header, await summaryControllerInstance.transporterStorageSheet(req, res),isSumFlag)
         await summaryControllerInstance.createTable(worksheet5, HeaderData.Collateral_accounted_header, await summaryControllerInstance.collateralAccountedSheet(req, res), isSumFlag = true)
         await summaryControllerInstance.createTable(worksheet6, HeaderData.Collateral_accounted_header, await summaryControllerInstance.collateralUnaccountedSheet(req, res), isSumFlag)  //similar header
         await summaryControllerInstance.createTable(worksheet7, HeaderData.Collateral_at_inception_header, await summaryControllerInstance.collateralInceptionSheet(req,res), isSumFlag = true)
         await summaryControllerInstance.createTable(worksheet8, HeaderData.Collateral_sold_header, await summaryControllerInstance.collateralSoldSheet(req, res), isSumFlag)
         await summaryControllerInstance.createTable(worksheet9, HeaderData.Collateral_sold_header, await summaryControllerInstance.collateralRemovedSheet(req, res), isSumFlag)  //similar header  
         await summaryControllerInstance.createTable(worksheet10, HeaderData.Collateral_added_header, await summaryControllerInstance.collateralAddedSheet(req, res), isSumFlag)
         await summaryControllerInstance.createTable(worksheet11, HeaderData.Collateral_at_inception_header,
           await summaryControllerInstance.currentCollateralSheet(req, res), isSumFlag) //similar header
          await summaryControllerInstance.dailyReport(worksheet1, req, res)   
         let fileName = 'SummaryReport_' + new Date().toDateString() + '_' + new Date().toLocaleTimeString().replace(/\:/g, '-') + '.xlsx'
            console.log("\nCron_HIT==============>",reqCompany);
            console.log("===  mailObj ===\n",mailObj);
            // @ts-expect-error
            let to:string = mailObj?.to
            console.log("Dir-path -==== --->", path.join(__dirname + '/../../../public/excel', `${fileName}`));
            
         let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname + '/../../../public/excel', `${fileName}`))
         let attachement =[ {   // file on disk as an attachment
            filename: fileName,
            path: path.join(__dirname + '/../../../public/excel', `${fileName}`) // stream this file
        }]
         await new BaseHelper().emailSend('schedule_report', {COMPANY:reqCompany}, to,'','',attachement)
         console.log("After Mail ...");
         
         //res.locals.message = 'File Created'
         ///    let summaryBody: any = { companyId: reqCompany, filePath: `dist/public/excel/${fileName}`, createdBy: loggedInUserId, updatedBy: loggedInUserId }
       // let summary: any = await summaryReportModel.create([summaryBody])
        //  res.download(path.join(__dirname, `${fileName}`), (err) => {
        //    if (err) {
        //      { res.status(400).json({ status: 400, success: false, message: err }) }
        //      console.log("DownloadError", err);
        //    }
        //  })
         // //await JsonResponse.jsonSuccess(req, res, `{this.url}.export`);
     
       }

       async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        return await summaryReportModel.aggregate([
            {$match: { ...cond, "isDeleted": false } },
            {$lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            {$unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            {$group: {_id: null, "companies": {"$addToSet": "$companyId"}, "device": {"$addToSet": "$reader.serial"}}},
            {$project: {_id: 0, "companies._id": 1, "companies.name":1, "device": 1}}
        ]).then(([data]) => data)
    } 

    async powerBiReport(companyId:any, time: any, session: ClientSession): Promise<any> {
        // let query = {pageSize: 0, search: "", column: "", pageNumber: 1, sort: ""}
        // let diamondMatchQuery: IIndexParam = {filters : JSON.stringify([{"key": "companyId", "value": companyId}]), ...query }
        // let dialyMatchQuery: IIndexParam = {filters: JSON.stringify([{"key":"companyId","value": companyId},{"key":"status","value":["MATCHED","NOTMATCHED"]}]), ...query}
        // let transporterStorageQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"stoneStatus","value":skuStoneStatusEnum.TRANSIT}]), ...query}
        // let collateralAccountedSheetQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"collateralStatus","value":skuCollateralStatusEnum.COLLATERAL_IN}]), ...query}
        // let collateralUnAccountedSheetQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"stoneStatus","value":skuStoneStatusEnum.APPROVED}]), ...query}
        // let collateralInceptionQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"collateralStatus","value":skuCollateralStatusEnum.COLLATERAL_IN},{"key":"stoneStatus","value":"TRANSIT"}]), ...query}
        // let collateralSoldQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"status","value":skuStoneStatusEnum.SOLD}]), ...query}
        // let collateralRemovedQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"status","value":skuStoneStatusEnum.REMOVED}]), ...query}
        // let collateralAddedQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"status","value":skuCollateralStatusEnum.COLLATERAL_IN}]), ...query}
        // let currentCollateralSheetQuery = {filters: JSON.stringify([{"key":"companyId","value":companyId},{"key":"collateralStatus","value":skuCollateralStatusEnum.COLLATERAL_IN}]), ...query}
        let daimondMatchSheetData: any = [], dailyMatchSheetData: any = [], transporterStorageSheetData: any = [], collateralAccountedSheetData: any = [], collateralUnAccountedSheetData: any = [] , collateralInceptionSheetData: any = [],
        collateralSoldSheetData: any = [], collateralRemovedSheetData: any = [], collateralAddedSheetData: any= [], currentCollateralSheetData: any = []

        let collateralAccountedWeight : number = 0, collateralAccountedValue: number = 0, collateralSoldWeight: number = 0, collateralSoldValue: number = 0,
        collateralInceptionWeight: number = 0, collateralInceptionValue: number = 0, collateralAddedWeight: number = 0, collateralAddedValue: number = 0
        const skuAggregate =  [
            {$lookup: {from: labModel.collection.name, localField: 'labsId', foreignField: '_id', as: 'labsId'}}, {$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: commentModel.collection.name, let: { "comments": "$comments" },pipeline: [{ "$match": { "$expr": { "$in": [ "$_id", "$$comments" ] } } },
            {$lookup: {from: userModel.collection.name, localField: 'createdBy',foreignField: '_id',as: 'createdBy'}},{"$unwind":{path: "$createdBy",preserveNullAndEmptyArrays: true}},{$project: {'createdBy._id':1,'createdBy.firstName': 1,'createdBy.lastName': 1, 'comment': 1, "createdAt":1}}], as: 'comments'}},
            {$lookup: {from: iavModel.collection.name, localField: 'iavId', foreignField: '_id', as: 'iavId'} }, {$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rapPriceModel.collection.name, localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId'}}, {$unwind: {path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clientPriceModel.collection.name, localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId'}}, {$unwind: {path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rfidModel.collection.name, localField: 'rfId', foreignField: '_id', as: 'rfId'}}, {$unwind: {path: "$rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
        ];

        const activityAggregate = [
            {$lookup: {from: skuModel.collection.name, localField: 'skuId', foreignField: '_id', as: 'skuId'}},{$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rfidModel.collection.name, localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId'}},{$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'userId', foreignField: '_id', as: 'userId'}},{$unwind: {path: "$userId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},{$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: labModel.collection.name, localField: 'labsId', foreignField: '_id', as: 'labsId'}},{$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: diamondMatchModel.collection.name, localField: 'dmId', foreignField: '_id', as: 'dmId'}},{$unwind: {path: "$dmId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: iavModel.collection.name, localField: 'iavId', foreignField: '_id', as: 'iavId'}},{$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rapPriceModel.collection.name, localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId'}},{$unwind: {path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clientPriceModel.collection.name, localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId'}},{$unwind: {path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},{$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
        ]

        const DiamondMatchAggregate = [
            {$lookup: {from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId'}}, {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'labs', localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' }}, {$unwind: {path: "$skuId.labsId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'skuId.iavId' }}, {$unwind: {path: "$skuId.iavId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'rfids', localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId' }}, {$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true }},
            {$lookup: {from: 'rapprices', localField: 'skuId.iavId.rapPriceId', foreignField: '_id', as: 'skuId.iavId.rapPriceId'}}, {$unwind: {path: "$skuId.iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'clientprices', localField: 'skuId.iavId.clientPriceId', foreignField: '_id', as: 'skuId.iavId.clientPriceId'}}, {$unwind: {path: "$skuId.iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
        ]
        let skuData: any, activityData: any, diamondMatch: any
        console.log(time, "==================");
        
        if(time)[skuData, activityData, diamondMatch] = await Promise.all([
            await skuModel.aggregate([
                {$facet: {
                    transporterStorage : [{$match: {companyId: {$in : companyId},stoneStatus:skuStoneStatusEnum.TRANSIT, isDeleted: false, updatedAt: {$gte : time}}}, ...skuAggregate],
                    collateralAccounted : [{$match: {companyId: {$in: companyId}, collateralStatus:skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false, updatedAt: {$gte : time}}}, ...skuAggregate],
                    collateralUnAccounted : [{$match: {companyId: {$in : companyId},stoneStatus:skuStoneStatusEnum.APPROVED, collateralStatus:skuCollateralStatusEnum.COLLATERAL_OUT, isDeleted: false, updatedAt: {$gte : time}}}, ...skuAggregate],
                    collateralInception : [{$match: {companyId: {$in : companyId},stoneStatus:skuStoneStatusEnum.TRANSIT, collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false, updatedAt: {$gte : time}}}, ...skuAggregate],
                    currentCollateralSheet : [{$match: {companyId , collateralStatus:skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false, updatedAt: {$gte : time}}}, ...skuAggregate]
                }}
            ]).then(skuData => skuData[0]),
            await activityModel.aggregate([
                {$facet: {
                    dailyMatch : [{$match: {companyId: {$in : companyId},status:["MATCHED","NOTMATCHED"], isDeleted: false, createAt: {$gte: time}}}, ...activityAggregate],
                    collateralSoldSheet : [{$match: {companyId: {$in : companyId},status:skuStoneStatusEnum.SOLD, isDeleted: false, createAt: {$gte: time}}}, ...activityAggregate],
                    collateralRemovedSheet : [{$match: {companyId: {$in : companyId},status:skuStoneStatusEnum.REMOVED, isDeleted: false, createAt: {$gte: time}}}, ...activityAggregate],
                    collateralAddedSheet : [{$match: {companyId: {$in : companyId},status:skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false, createAt: {$gte: time}}}, ...activityAggregate],
                }}
            ]).then(activityData => activityData[0]),
            await diamondMatchModel.aggregate([
                 {$match: {isDeleted: false, companyId: {$in: companyId}, updatedAt: {$gte: time}}}, ...DiamondMatchAggregate
            ])
        ])
        else [skuData, activityData, diamondMatch] = await Promise.all([
            await skuModel.aggregate([
                {$facet: {
                    transporterStorage : [{$match: {companyId: {$in : companyId},stoneStatus:skuStoneStatusEnum.TRANSIT, isDeleted: false}}, ...skuAggregate],
                    collateralAccounted : [{$match: {companyId: {$in: companyId}, collateralStatus:skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false}}, ...skuAggregate],
                    collateralUnAccounted : [{$match: {companyId: {$in : companyId},stoneStatus:skuStoneStatusEnum.APPROVED, collateralStatus:skuCollateralStatusEnum.COLLATERAL_OUT, isDeleted: false}}, ...skuAggregate],
                    collateralInception : [{$match: {companyId: {$in : companyId},stoneStatus:skuStoneStatusEnum.TRANSIT, collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false}}, ...skuAggregate],
                    currentCollateralSheet : [{$match: {companyId: {$in : companyId},collateralStatus:skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false}}, ...skuAggregate]
                }}
            ]).then(skuData => skuData[0]),
            await activityModel.aggregate([
                {$facet: {
                    dailyMatch : [{$match: {companyId: {$in : companyId},status:["MATCHED","NOTMATCHED"], isDeleted: false}}, ...activityAggregate],
                    collateralSoldSheet : [{$match: {companyId: {$in : companyId},status:skuStoneStatusEnum.SOLD, isDeleted: false}}, ...activityAggregate],
                    collateralRemovedSheet : [{$match: {companyId: {$in : companyId},status:skuStoneStatusEnum.REMOVED, isDeleted: false}}, ...activityAggregate],
                    collateralAddedSheet : [{$match: {companyId: {$in : companyId},status:skuCollateralStatusEnum.COLLATERAL_IN, isDeleted: false}}, ...activityAggregate],
                }}
            ]).then(activityData => activityData[0]),
            await diamondMatchModel.aggregate([
                 {$match: {isDeleted: false, companyId: {$in: companyId}}}, ...DiamondMatchAggregate
            ])
        ])
        let data: any = Object.assign(skuData, activityData);
        console.log(data.currentCollateralSheet.length, "===============currentcount");
        
        for (const item of diamondMatch) {
            let drv = (item.skuId?.iavId?.drv) ? item.skuId?.iavId?.drv : 0
            daimondMatchSheetData.push({
                "matchDate": new Date(item.createdAt), "companyId": item.companyId?._id, "ref": item?.skuId?.rfId?.rfid, "reportLab": item?.skuId?.labsId?.lab, "reportNumber": item?.skuId?.labsId?.labReportId,
                "caratWeight": item?.skuId?.weight, "shape": item?.skuId?.shape, "colorCategory": item?.skuId?.colorCategory, "colorSubCategory": item?.skuId?.colorSubCategory,
                "gradeReportColor": item?.skuId?.gradeReportColor, "clarity": item?.skuId?.clarity, "cut": item?.skuId?.cut, "value": drv, "typeOfDiamondMatch": item?.dmType,
                "action": item.status, createdAt: item.updatedAt
            })
        }

        for (const item of data.dailyMatch) {
            let drv = (item.skuId?.iavId?.drv) ? item.skuId?.iavId?.drv : 0
            dailyMatchSheetData.push({
                "ref": item?.skuId?.rfId?.rfid, "company": item?.companyId?.name, "companyId": item.companyId?._id, "action": item?.status, "actionDate": new Date(item.createdAt), "reportLab": item?.labsId?.lab,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item?.skuId?.weight, "shape": item?.skuId?.shape, "colorSubCategory": item?.skuId?.colorSubCategory,
                "colorCategory": item?.skuId?.colorCategory, "gradingColor": item?.skuId?.gradeReportColor, "gradingShape": item?.skuId?.gradeReportShape, "clarity": item?.skuId?.clarity,
                "cut": item?.skuId?.cut, "value": drv, createdAt: item.createdAt
            })
        }

        let check = data.transporterStorage.map(async (item: any) => {
            let transResult = await transitModel.findOne({ skuIds: item._id, isDeleted: false }, 'returnTime').sort({ createdAt: -1 })
            let drv = (item.skuId?.iavId?.drv) ? item.skuId?.iavId?.drv : 0
            transporterStorageSheetData.push({
                "ref": item?.skuId?.rfId?.rfid, "transitId": transResult?._id, "companyId": item.companyId?._id, "tagId": item.tagId, "company": item?.companyId?.name, "reportLab": item?.labsId?.lab,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item?.skuId?.weight, "shape": item?.skuId?.shape, "color": item?.skuId?.colorCategory,
                "clarity": item?.skuId?.clarity, "cut": item?.skuId?.cut, "value": drv, "returnDate": transResult?.returnTime, createdAt: item.updatedAt
            })
        })

        for (const item of data.collateralAccounted) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0;
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0;
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0;
            collateralAccountedWeight += item.weight;
            collateralAccountedValue += item.pwv
            collateralAccountedSheetData.push({
                "status": item.stoneStatus, "date": item.createdAt, "company": item?.companyId?.name, "companyId": item.companyId?._id, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item.weight, "shape": item.shape, "colorSubCategory": item.colorSubCategory, createdAt: item.updatedAt,
                "colorCategory": item.colorCategory, "gradingColor": item.gradeReportColor, "gradingShape": item.gradeReportShape, "clarity": item.clarity,
                "cut": item.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, lastDiamondMatch: item.dmId?.createdAt
            })
        }

        for (const item of data.collateralUnAccounted) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0
            collateralUnAccountedSheetData.push({
                "status": item.stoneStatus, "date": item.createdAt, "company": item?.companyId?.name, "companyId": item.companyId?._id, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item.weight, "shape": item.shape, "colorSubCategory": item.colorSubCategory, createdAt: item.updatedAt,
                "colorCategory": item.colorCategory, "gradingColor": item.gradeReportColor, "gradingShape": item.gradeReportShape, "clarity": item.clarity,
                "cut": item.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, lastDiamondMatch: item.dmId?.createdAt
            })
        }

        for (const item of data.collateralInception) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0
            collateralInceptionWeight += item.weight
            collateralInceptionValue += pwv
            collateralInceptionSheetData.push({
                "company": item?.companyId?.name, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab, "companyId": item.companyId?._id,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item.weight, "shape": item.shape, "colorSubCategory": item.colorSubCategory,
                "colorCategory": item.colorCategory, "gradingColor": item.gradeReportColor, "gradingShape": item.gradeReportShape, "clarity": item.clarity, createdAt: item.updatedAt,
                "cut": item.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, "lastDiamondMatch": item.dmId?.createdAt
            })
        }

        for (const item of data.collateralSoldSheet) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0
            collateralSoldWeight += item?.skuId?.weight;
            collateralSoldValue += pwv
            collateralSoldSheetData.push({
                "company": item?.companyId?.name, "date": item.createdAt, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab, "companyId": item.companyId?._id,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item?.skuId?.weight, "shape": item?.skuId?.shape, "colorSubCategory": item?.skuId?.colorSubCategory,
                "colorCategory": item?.skuId?.colorCategory, "gradingColor": item?.skuId?.gradeReportColor, "gradingShape": item?.skuId?.gradeReportShape, "clarity": item?.skuId?.clarity,
                "cut": item?.skuId?.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, "lastDiamondMatch": item.dmId?.createdAt, createdAt: item.createdAt
            })
        }

        for (const item of data.collateralRemovedSheet) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0
            collateralRemovedSheetData.push({
                "company": item?.companyId?.name, "date": item.createdAt, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab, "companyId": item.companyId?._id,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item?.skuId?.weight, "shape": item?.skuId?.shape, "colorSubCategory": item?.skuId?.colorSubCategory,
                "colorCategory": item?.skuId?.colorCategory, "gradingColor": item?.skuId?.gradeReportColor, "gradingShape": item?.skuId?.gradeReportShape, "clarity": item?.skuId?.clarity,
                "cut": item?.skuId?.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, "lastDiamondMatch": item.dmId?.createdAt, createdAt: item.createdAt
            })
        }

        for (const item of data.collateralAddedSheet) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0;
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0;
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0;
            collateralAddedWeight += item?.skuId?.weight;
            collateralAddedValue += pwv;
            collateralAddedSheetData.push({
                "action": item.status, "company": item?.companyId?.name, "date": item.createdAt, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab, "companyId": item.companyId?._id,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item?.skuId?.weight, "shape": item?.skuId?.shape, "colorSubCategory": item?.skuId?.colorSubCategory, createdAt: item.createdAt,
                "colorCategory": item?.skuId?.colorCategory, "gradingColor": item?.skuId?.gradeReportColor, "gradingShape": item?.skuId?.gradeReportShape, "clarity": item?.skuId?.clarity,
                "cut": item?.skuId?.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, "lastDiamondMatch": item.dmId?.createdAt
            })
        }

        for (const item of data.currentCollateralSheet) {
            let drv = (item.iavId?.drv) ? item.iavId?.drv : 0
            let pwv = (item.iavId?.pwv) ? item.iavId?.pwv : 0
            let iav = (item.iavId?.iav) ? item.iavId?.iav : 0
            currentCollateralSheetData.push({
                "company": item?.companyId?.name, "ref": item?.rfId?.rfid, "reportLab": item?.labsId?.lab, "reportDate": item?.labsId?.labReportDate, "companyId": item.companyId?._id,
                "reportNumber": item?.labsId?.labReportId, "caratWeight": item.weight, "shape": item.shape, "colorSubCategory": item.colorSubCategory,
                "colorCategory": item.colorCategory, "gradingColor": item.gradeReportColor, "gradingShape": item.gradeReportShape, "clarity": item.clarity, createdAt: item.updatedAt,
                "cut": item.cut, "vc": (item.colorType == "WHITE") ? item.iavId?.rapPriceId?.price : item.iavId?.clientPriceId?.price, drv, pwv, iav, "lastDiamondMatch": item.dmId?.createdAt
            })
        }
        await Promise.all(check)

        console.log(dailyMatchSheetData.length, "========dailyMatchSheetData=========", daimondMatchSheetData.length, "========daimondMatchSheetData", transporterStorageSheetData.length, "==========transporterStorageSheetData", currentCollateralSheetData.length, "=========currentCollateralSheetData", collateralSoldSheetData.length, "=========collateralSoldSheetData", collateralAddedSheetData.length, "=====collateralAddedSheetData", collateralRemovedSheetData.length, "=======collateralRemovedSheetData", collateralUnAccountedSheetData.length, "====collateralUnAccounted", collateralAccountedSheetData.length, "=======collateralAccounted", collateralInceptionSheetData.length, "=======collateralInceptionSheetData");
        // return currentCollateralSheetData
        await Promise.all([
            await diamondMatchReportModel.insertMany(daimondMatchSheetData, {session}), await dialyMatchReportModel.insertMany(dailyMatchSheetData, {session}),
            await TransporterStorageReportModel.insertMany(transporterStorageSheetData, {session}), await CollateralAccountedReportModel.insertMany(collateralAccountedSheetData, {session}),
            await CollateralUnAccountedReportModel.insertMany(collateralUnAccountedSheetData, {session}), await CollateralSoldReportModel.insertMany(collateralSoldSheetData, {session}),
            await CollateralAddedReportModel.insertMany(collateralAddedSheetData, {session}), await CollateralRemovedReportModel.insertMany(collateralRemovedSheetData, {session}),
            await CollateralInceptionReportModel.insertMany(collateralInceptionSheetData, {session}), await CurrentCollateralReportModel.insertMany(currentCollateralSheetData, {session})
        ])
    }
}