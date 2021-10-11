import {BaseController} from "../BaseController"
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import DiamondMatchBusiness from "./diamond-match.business";
import SkuBusiness from "../sku/sku.business";
import lo from "lodash";
import {Messages} from "../../constants/Messages";
import ActivityBusiness from "../activity/activity.business";
import {IActivity} from "../activity/activity.types";
import {ISku} from "../sku/sku.types";
import * as Excel from 'exceljs'
import path from 'path'
import {DiamondMatchRepository} from "./diamond-match.repository";
import {RequestWithTransaction} from "../../interfaces/Request";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {Errors, Texts} from "../../constants";
import {devices} from "../../socket"
import { ErrorCodes } from "../../constants/ErrorCodes";
import deviceModel from "../device/device.model";
import { disPlayConfigindex } from "../../helper/displayConfigData";
import companyModel from "../company/company.model";
import { DiamondMatchValidation } from "./diamond-match.validation";


export class DiamondMatchController extends BaseController<any> {
    constructor() {
        super(new DiamondMatchBusiness(), "diamond-match", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/diamond-match', guard, this.router);
    }

    init() {
        const validation: DiamondMatchValidation = new DiamondMatchValidation()
        const transaction: MongooseTransaction = new MongooseTransaction();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/simulate", TryCatch.tryCatchGlobe(this.simulateDm));
        this.router.post("/", transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        this.router.post("/simulate/create", transaction.startTransaction, TryCatch.tryCatchGlobe(this.simulateCreate))

        this.router.put("/", transaction.startTransaction, TryCatch.tryCatchGlobe(this.update));
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportExcel))
        this.router.get("/count", TryCatch.tryCatchGlobe(this.counterBC));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.get("/not-matched", TryCatch.tryCatchGlobe(this.getUnique))
        this.router.put("/cancel", validation.cancelDiamondMatch, transaction.startTransaction, TryCatch.tryCatchGlobe(this.checkDm));

    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
    //    if(req?.body?.loggedInUser?.roleName !== Texts.SPACECODEADMIN){
    //         //@ts-expect-error
    //         let filters: {}[] = JSON.parse(req.query.filters);
    //         filters.forEach((data:any, i) => {if (data.key === Texts.companyId) data.key = Texts.skuId_companyId})
    //         req.query.filters = JSON.stringify(filters);
    //     }
        const {data, page, header}: any = await new DiamondMatchRepository().index(req.query as any)
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async find(req: Request, res: Response): Promise<void> {
        let populate = [{path: 'skuId', populate: [{path: 'iavId',model: 'Iav', populate:[
            {path: 'rapPriceId',select: "price"},{path: 'clientPriceId',select: "price"}]},{path: 'labsId'},{path: 'rfId',model: 'rfid'}]},{path: "performedBy"}]
        await new DiamondMatchController().findBC(req, res, populate)
    }

    async simulateDm(req: Request, res: Response): Promise<void> {
        let { query, query: { day }, body, body: { companyId, premiumPercent, premiumCycle, randomPercent, regularCycle, threshold, loggedInUser: { _id: loggedInUserId } } } = req
        let company = await companyModel.findOne({_id:companyId, isDeleted: false}).limit(threshold).select('_id');
        if(!company?._id) {
            res.locals = { message: Errors.INVALID_COMPANY_ID }
            return await JsonResponse.jsonError(req, res, `{this.url}.simulate`);
        }
        let skuData = await new DiamondMatchRepository().simulateDm(companyId, threshold)
        if(skuData.length === 0) {
            res.locals = { message: Messages.NOSTONES_IN_COLLATERAL}
            return await JsonResponse.jsonError(req, res, `{this.url}.simulate`);
        }
        let simulateData = await new DiamondMatchController().createSimulate(body, skuData)
        let gridView: any = {}, listView: any = []
        if (day) {
            //@ts-expect-error       
            day = JSON.parse(day)
            //@ts-expect-error
            for (const item of day){ 
                gridView["day" + item] = simulateData.gridView['day' + item]
                listView = listView.concat(simulateData.listView.map((data: any) => { if (data.day === item) return data }).filter(Boolean));
            }
            simulateData.gridView = gridView
            simulateData.listView = listView
        }
        res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data: simulateData }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.simulate`);
    }
   
    async createSimulate(body: any, skuData: ISku[]): Promise<never|any> {
        let {companyId, premiumPercent, premiumCycle , randomPercent, regularCycle, threshold} = body  
        let column = ["_id",'rfId','clientRefId', "stoneRegistration", "companyId", 'iavId', "colorCategory", "weight", "labShape"], data: any = {}, gridView: any = {}, listView: any = []

        skuData = skuData.map((sku: any) => {
            let data: any = {}
            for (let item of column) {
                if(item === "iavId" && sku['iavId']) {
                    data['pwv'] = sku.iavId.pwv;
                    data['drv'] = sku.iavId.drv;
                }
                else if(item === "rfId" && sku['rfId']) data['rfId'] = sku.rfId.rfid           
                else data[item] = sku[item]
            }            
            return data      
        });        
        let pwvCount = 0
        skuData.forEach((sku: any) => {if(sku.pwv)pwvCount += sku.pwv});
        let premiumCount = Math.ceil((skuData.length * premiumPercent)/100); 
        let regularCount = Math.floor(skuData.length - premiumCount );
        let randomCount = Math.ceil((skuData.length * randomPercent)/100)

        skuData = skuData.map((sku: any)=> ({ ...sku, weightage: (sku.pwv/pwvCount) }))
        console.log(pwvCount+ "=======" + premiumCount +"======"+ regularCount + "====="+randomCount); 
        skuData = skuData.sort( (a: any, b: any) => {
            let x = a["weightage"], y = b["weightage"];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0))
        });        
        let pStones = skuData.slice(0, premiumCount);
        let rStones = skuData.slice(premiumCount, skuData.length);
        // let randStones =  regStones.sort(() => Math.random() - Math.random()).slice(0, randomCount) 
        // let randStones =  (regStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(randomCount/2))).concat((preStones.sort(() => Math.random() - Math.random()).slice(0, Math.floor(randomCount/2))))
        // console.log(preStones, "=======randStones"); 
        // let listView = await new DiamondMatchController().getListView(preStones, regStones, randStones) 
        // preStones = preStones.filter(({ _id: id1 }) => !randStones.some(({ _id: id2 }) => id2 === id1));
        // regStones = regStones.filter(({ _id: id1 }) => !randStones.some(({ _id: id2 }) => id2 === id1));

        // let cycleP = Math.ceil(preStones.length/Math.ceil(preStones.length/premiumCycle))
        // let cycleR = Math.ceil(regStones.length/Math.ceil(regStones.length/regularCycle))
        // let cycleRandom = Math.ceil(randStones.length/Math.floor(skuData.length/regularCycle))

        // console.log(cycleP, "====", cycleR, "===", cycleRandom);
        // console.log(preStones, "=======preStones", regStones, "=======regStones");
        // console.log(preStones.length, "===========prelength");
        // console.log(regStones.length, "==========reglength");
        let cycle = (premiumCycle <=  regularCycle)? regularCycle: premiumCycle
        let preStones = pStones; let regStones = rStones; let count = randomCount;

         for(let i=1; i<=cycle; i++) {
            let data1: any = []
            if((preStones.length/premiumCycle) > 1 && (pStones.length/premiumCycle) > 1)gridView['day'+i]= { "premiumStones" : preStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(pStones.length/premiumCycle))}
            else if ((preStones.length / premiumCycle) <= 1 && (pStones.length/premiumCycle) < 1)gridView['day'+i]= { "premiumStones" : preStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(pStones.length/premiumCycle))}
            else gridView['day' + i] = { "premiumStones": preStones.sort(() => Math.random() - Math.random()).slice(0, Math.floor(pStones.length / premiumCycle)) };
            //@ts-expect-error
            preStones = preStones.filter(({ _id: id1 }) => !gridView['day'+i].premiumStones.some(({ _id: id2 }) => id2 === id1));
            //  console.log(gridView['day' + i], "=======before");
             // data1 = lo.concat(data1, gridView['day' + i].premiumStones);
             gridView['day' + i].premiumStones.forEach((item: any) => {
                 let preObj: any = {
                     _id: item._id, rfId: item.rfId, clientRefId: item.clientRefId, stoneRegistration: item.stoneRegistration,
                     companyId: item.companyId, iavId: item.iavId, pwv: item.pwv, drv: item.drv, colorCategory: item.colorCategory, weight: item.weight, labShape: item.labShape, weightage: item.weightage,
                     type: "Premium", day: i
                 }
                 data1.push(preObj)
             });
            // console.log(d);
            // data1.filter((element: any) => { element.type = "Premium"; element.day = i });
            // console.log(gridView['day'+i], "=======after");
            listView = lo.concat(listView, data1)
            if (preStones.length === 0) preStones = pStones
        }

        for (let i = 1; i <= cycle; i++) {
            let data2: any = []
            // console.log((regStones.length / ((regularCycle + 1) - i)), "testing" + i + " " + "regStones" + regStones.length + " " + i);
            if ((regStones.length / regularCycle) >= 1 && gridView['day' + i]) gridView['day' + i].regularStones = regStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(rStones.length / regularCycle))
            // else if ((regStones.length / regularCycle) >= 1 && !gridView['day' + i]) { gridView['day' + i] = { 'regularStones': regStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(rStones.length / regularCycle)) } }
            else if ((regStones.length / regularCycle) < 1 && gridView['day' + i]) gridView['day' + i].regularStones = regStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(regStones.length / ((regularCycle + 1) - i)))
            // else { gridView['day' + i] = { 'regularStones': regStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(regStones.length / ((regularCycle + 1) - i))) } }
            //@ts-expect-error
            regStones = regStones.filter(({ _id: id1 }) => !gridView['day' + i].regularStones.some(({ _id: id2 }) => id2 === id1));
            // data2 = lo.concat(data2, gridView['day' + i].regularStones)
            // data2.forEach((element: any) => { element.type = "Regular"; element.day = i });
            gridView['day' + i].regularStones.forEach((item: any) => {
                let preObj: any = {
                    _id: item._id, rfId: item.rfId, clientRefId: item.clientRefId, stoneRegistration: item.stoneRegistration,
                    companyId: item.companyId, iavId: item.iavId, pwv: item.pwv, drv: item.drv, colorCategory: item.colorCategory, weight: item.weight, labShape: item.labShape, weightage: item.weightage,
                    type: "Regular", day: i
                }
                data2.push(preObj)
            });
            listView = lo.concat(listView, data2)
            if (regStones.length === 0) regStones = rStones
        }

        for (let i = 1; i <= cycle; i++) {
            let data3: any = [], premiumStones: any = []
            if (premiumStones = gridView['day' + i].premiumStones) {
                premiumStones = gridView['day' + i].premiumStones //@ts-expect-error
                premiumStones = pStones.filter(({ _id: id1 }) => !premiumStones.some(({ _id: id2 }) => id2 === id1));
            }
            else premiumStones = pStones
            let regularStones = gridView['day' + i].regularStones //@ts-expect-error
            regularStones = rStones.filter(({ _id: id1 }) => !regularStones.some(({ _id: id2 }) => id2 === id1));
            let randStones = premiumStones.concat(regularStones)
            // console.log(randStones, "========" + i);                 
            if (gridView['day' + i]) {
                gridView['day' + i].randomStones = randStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(count / regularCycle))
                count = count - gridView['day' + i].randomStones.length
            }
            // else {
            //     gridView['day' + i] = { 'randomStones': randStones.sort(() => Math.random() - Math.random()).slice(0, Math.ceil(count / regularCycle)) }
            //     count = count - gridView['day' + i].randomStones.length
            // }
            if (count === 0) count = randomCount
            // data3 = lo.concat(data3, gridView['day' + i].randomStones)
            // data3.forEach((element: any) => { element.type = "Random"; element.day = i });
            gridView['day' + i].randomStones.forEach((item: any) => {
                let preObj: any = {
                    _id: item._id, rfId: item.rfId, clientRefId: item.clientRefId, stoneRegistration: item.stoneRegistration,
                    companyId: item.companyId, iavId: item.iavId, pwv: item.pwv, drv: item.drv, colorCategory: item.colorCategory, weight: item.weight, labShape: item.labShape, weightage: item.weightage,
                    type: "Random", day: i
                }
                data3.push(preObj)
            });
            listView = lo.concat(listView, data3)
        }
        
        
       
        // for(let i = 1; i<=cycleP; i++) {
        //     let data1: any = []
        //     gridView['day'+i]= { "premiumStones" : preStones.slice(((i-1)*Math.ceil(preStones.length/premiumCycle)),(i*Math.ceil(preStones.length/premiumCycle))) }
        //     data1 = lo.concat(data1,gridView['day'+i].premiumStones)
        //     data1.forEach((element: any) => {element.type = "Premium";element.day = i});
        //     listView = lo.concat(listView,data1)    
        // }        
        // for(let i = 1 ; i<=cycleR; i++) {
        //     let data2: any = []
        //     if(gridView['day'+i])gridView['day'+i].regularStones = regStones.slice(((i-1)*Math.ceil(regStones.length/regularCycle)),(i*Math.ceil(regStones.length/regularCycle)))
        //     else {gridView['day'+i]  =  {'regularStones': regStones.slice(((i-1)*Math.ceil(regStones.length/regularCycle)),(i*Math.ceil(regStones.length/regularCycle)))}}
        //     data2 = lo.concat(data2,gridView['day'+i].regularStones)
        //     data2.forEach((element: any) => {element.type = "Regular"; element.day = i});
        //     listView = lo.concat(listView, data2)
        // }
        // for(let i = 1 ; i<=cycleRandom; i++) {
        //     let data3: any = []
        //     if(gridView['day'+i])gridView['day'+i].randomStones = randStones.slice(((i-1)*Math.floor(skuData.length/regularCycle)),(i*Math.floor(skuData.length/regularCycle)))
        //     else {gridView['day'+i]  =  {'randomStones': randStones.slice(((i-1)*Math.floor(skuData.length/regularCycle)),(i*Math.floor(skuData.length/regularCycle)))}}
        //     data3 = lo.concat(data3,gridView['day'+i].randomStones)
        //     data3.forEach((element: any) => {element.type = "Random"; element.day = i});
        //     listView = lo.concat(listView, data3)
        // }
        return {gridView, listView}
    }

    // async create(req: Request, res: Response): Promise<void> {
    //     let {body, body:{skuIds, loggedInUser:{_id:loggedInUserId}}} = req
    //     let dmData: any = [], dm:any = {}
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     let transactionBusinessInstance = new TransactionBusiness()
    //     let transactionId = "DM-" + new Date().toISOString()
    //     let match = {transactionId, "transactionType": "DiamondMatch", status: "Pending"}
    //     let transactionBody = {...match, ...user}
    //     //@ts-expect-error
    //     let transaction: any = await transactionBusinessInstance.createBB(transactionBody)
    //     for (const item of skuIds) {
    //         dm.createdBy = dm.updatedBy = loggedInUserId,
    //         dm.skuId = item
    //         await new SkuBusiness().findOneBB({_id: item}).then(sku => {if(!sku?._id) throw new Error("Invalid skuId")})
    //         dmData.push(dm) 
    //     }
    //     transaction.status = "Completed"
    //     transaction.skuIds = skuIds
    //     await transactionBusinessInstance.updateManyBB({transactionId},transaction)
    //     res.locals.data = await new DiamondMatchBusiness().createBB(dmData);
    //     res.locals.message = Messages.CREATE_SUCCESSFUL;
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    // }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.CREATE_FAILED };
        let { body, mongoSession, body: { skuIds, loggedInUser: { _id: loggedInUserId, companyId } } } = req as RequestWithTransaction
        let transactionBody = { transactionId: "DM-" + new Date().toISOString(), createdBy: loggedInUserId, updatedBy: loggedInUserId }
        res.locals = await new DiamondMatchRepository().create(transactionBody, skuIds, loggedInUserId, mongoSession)
        let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "manually DiamondMatch created", data: null});
        }
        
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    // async update(req: Request, res: Response): Promise<void> {
    //     let {body, body:{skuId,comments, loggedInUser:{_id:loggedInUserId}}} = req
    //     let [skuData , diamondMatchRuleData] = await Promise.all([
    //         new SkuBusiness().findIdByIdBB(body.skuId),
    //         // new DiamondMatchRuleBusiness().findIdByIdBB(body.diamondMatchRuleId)
    //     ])        
    //     if(!skuData?._id) throw new Error("Invalid deviceTypeId")
    //     console.log("SKU__Data",skuData);
        
    //     // if(!diamondMatchRuleData?._id) throw new Error("Invalid companyTypeId")
    //     body.performedBy = body.updatedBy =  loggedInUserId
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     await new DiamondMatchController().createActivity(skuId, user, body)
    //     let data = await new DiamondMatchBusiness().findAndUpdateBB({_id: body._id, skuId:body.skuId, isDeleted: false},body)
    //       console.log("Data.......",data);
          
    //     if(data) res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
    //     else res.locals = {status: false, message: Messages.UPDATE_FAILED}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.update`)
    // }

    async update(req: Request, res: Response): Promise<void> {
        let {body, mongoSession, body:{skuId,comments, loggedInUser:{_id:loggedInUserId, companyId}}} = req as RequestWithTransaction
        body.performedBy = body.updatedBy =  loggedInUserId
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
        let data = await new DiamondMatchRepository().update(body, user, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`)
    }

    async createActivity(skuId: any, user :any, body: any): Promise<any|never> { 
        let activity : IActivity
        let skuData: ISku| null = await new SkuBusiness().findOneBB({_id:skuId})
        let activityData: any = {...user}
        activityData.companyId = skuData?.companyId;
        activityData.skuId = skuData?._id;
        activityData.labsId = skuData?.labsId;
        activityData.iavId = skuData?.iavId;
        activityData.userId = user.createdBy;
        activityData.status = body.status;
        activityData.dmId = "5f59cf450cd8132b8cae1c48"
        if(body?.comments) activityData.comments = body.comments
        if(skuData) await new ActivityBusiness().createBB(activityData);
        // return activity._id
    }

    async simulateCreate(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.CREATE_FAILED };
        const DiamondMatchRepositoryInstance = new DiamondMatchRepository()
        let {body, mongoSession, body:{companyId, premiumPercent, premiumCycle , randomPercent, regularCycle, threshold, loggedInUser:{_id:loggedInUserId}}} = req as RequestWithTransaction
        let transactionBody = { transactionId: "DM-" + new Date().toISOString(), companyId, createdBy: loggedInUserId, updatedBy: loggedInUserId }
        let skuData = await DiamondMatchRepositoryInstance.simulateDm(companyId, threshold)
        let simulateData:any = await new DiamondMatchController().createSimulate(body, skuData)
        let data = await DiamondMatchRepositoryInstance.createsimulateData(body, transactionBody, simulateData, mongoSession)
        let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "DiamondMatch simulate created", data: null});
        }
        res.locals = {status: true, message: Messages.SIMULATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.createSimulate`)
    }
    
    async exportExcel(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        req.query.displayConfig = [{"key":"screen","value":"DiamondMatchAction"}]
        let [diamondMatch, displayconfig] = await Promise.all([
            await new DiamondMatchRepository().index(req.query as any),
            await disPlayConfigindex(req)
        ])

        const headerData: any = [];
        displayconfig[0].config.map((item: any) => { if(item.isActive === true) headerData.push({ name: item.text, filterButton: true, valKey: item.valKey }) });
      
        // let headerData = [{ name: 'DiamondMatchType', filterButton: true }, { name: 'Lab', filterButton: true }, { name: "ClientRefId", filterButton: true }, { name: "InfinityRefId", filterButton: true }, { name: "Weight", filterButton: true }, { name: "Shape", filterButton: true }, { name: "ColorType", filterButton: true }, { name: "Clarity", filterButton: true }, { name: "DmGuid", filterButton: true }, { name: "PwvImport", filterButton: true }, { name: "IAV", filterButton: true }, { name: "DRV", filterButton: true }, { name: "PWV", filterButton: true }, { name: "RFID", filterButton: true }, { name: 'Status', filterButton: true },{ name: "createdAt", filterButton: true }]
        let requiredData = [];
        // let arr: any[] = []
        // for (let i = 0; i < data.length; i++) {
        //     arr = [data[i].dmType,
        //     data[i].skuId?.labsId?.lab, data[i].skuId?.clientRefId, data[i].skuId?.infinityRefId, data[i].skuId?.weight, data[i].skuId?.shape, data[i].skuId?.colorType, data[i].skuId?.clarity, data[i].skuId?.dmGuid, data[i].skuId?.pwvImport, data[i].skuId?.iavId?.iav, data[i].skuId?.iavId?.drv, data[i].skuId?.iavId?.pwv, data[i].skuId?.rfId?.rfid, data[i].status, data[i].createdAt]
        //     requiredData.push(arr);
        // }

        for (const [i, element] of diamondMatch.data.entries()) {
            let arr: any[] = []
            // let vcValue = (data[i].skuId?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
            for (const [j, item] of displayconfig[0].config.entries()) {
                let valKey = item.valKey.split(".");
                if (item.isActive === false) continue

                if (valKey[valKey.length - 1] === "drv" || valKey[valKey.length - 1] === "pwv" || valKey[valKey.length - 1] === "price") (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push(0);
                else if(valKey[valKey.length-1] === "iav") (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push((0.00));
                else (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push('')
            };
            requiredData.push(arr);
        }

        let worksheet = workbook.addWorksheet('DM Export')
        await new DiamondMatchBusiness().createTable(worksheet, headerData, requiredData)
        let fileName = 'DiamondMatchExport.xlsx'
        //console.log("FilePath", path.join(__dirname + "../../../../public/Excels/", `${fileName}`));
        let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new DiamondMatchRepository().filter(loggedInUserId);
        if (data) {
            data.labs = [].concat.apply([], data.labs);
            data.labs = [...new Set(data.labs.map((labData: any) => labData.lab))];
            data.weight = { max: Math.max(...data.uniqueWeight), min: Math.min(...data.uniqueWeight), values: data.uniqueWeight.sort((n1: number, n2: number) => n1 - n2) };
            data.iav = { max: Math.max(...data.uniqueIav), min: Math.min(...data.uniqueIav), values: data.uniqueIav.sort((n1: number, n2: number) => n1 - n2) };
            data.pwv = { max: Math.max(...data.uniquePwv), min: Math.min(...data.uniquePwv), values: data.uniquePwv.sort((n1: number, n2: number) => n1 - n2) };
            data.drv = { max: Math.max(...data.uniqueDrv), min: Math.min(...data.uniqueDrv), values: data.uniqueDrv.sort((n1: number, n2: number) => n1 - n2) };
            let rapPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueRapPrices.sort((n1: number, n2: number) => n1 - n2) };
            data.price = { rapPrice };
            let clientPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueClientPrices.sort((n1: number, n2: number) => n1 - n2) };
            data.price = { ...data.price, clientPrice };
            // data.dmStatus = ["MATCHED", "NOTMATCHED"];
            delete data.uniqueWeight;
            delete data.uniqueIav;
            delete data.uniquePwv;
            delete data.uniqueDrv;
            delete data.uniqueClientPrices;
            delete data.uniqueRapPrices
        }
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    async getUnique(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId, companyId}}} = req;
        let data = await new DiamondMatchRepository().getUnique(companyId)
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

    checkDm = async (req: Request, res: Response): Promise<void> => {
        let {body, mongoSession, body:{skuId,comments, loggedInUser:{_id:loggedInUserId, companyId}}} = req as RequestWithTransaction
        body.performedBy = body.updatedBy =  loggedInUserId
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
        let data = await new DiamondMatchRepository().cancelDm(body, user, mongoSession)
        let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_DIAMOND_MATCH, message: "DiamondMatch with activity", data: null});    
        }
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`)
    }
}
