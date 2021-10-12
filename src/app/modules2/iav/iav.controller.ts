import {BaseController} from "../BaseController"
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {iavStatusEnum, IIav} from "./iav.types";
import IavBusiness from "./iav.business";
import {Messages, Constant} from "../../constants"
import {skuColorTypeEnum} from "../sku/sku.types";
import {IavValidation } from "./iav.validation"
import moment from "moment"
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import { IavRepository } from "./iav.repository";
import clientPriceModel from "../client-price/client-price.model";
import {UserRepository} from "../user/user.repository";
import { ErrorCodes } from "../../constants/ErrorCodes";
import iavModel from "./iav.model";

export class IavController extends BaseController<IIav> {
    constructor() {
        super(new IavBusiness(), "iav", true)
        this.init()
    }

    register(express: Application) {
        express.use('/api/v1/iav', guard, this.router);
    }

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: IavValidation = new IavValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createIav, transaction.startTransaction, TryCatch.tryCatchGlobe(this.create));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.put("/", TryCatch.tryCatchGlobe(this.update))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new IavRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    // async create (req: Request, res: Response): Promise<void> {
    //     //@ts-expect-error
    //     let {query:{iav, filtersIn, updateCollateral},body:{loggedInUser:{_id:loggedInUserId}}} : {query:{ filtersIn: string, iav: string, updateCollateral}} = req
    //     updateCollateral = (!updateCollateral || updateCollateral == "false")? false : true      
    //     let iavData: any = [], cond:any = {}, skuIds: any = [], resultData = [], iavObj: any =[]
    //     if(filtersIn?.length && filtersIn[0] === '[' && filtersIn[filtersIn.length-1] === ']') {

    //         filtersIn = filtersIn.replace(/'/g, '"');
    //         filtersIn = await JSON.parse(filtersIn)
    //         //@ts-expect-error
    //         filtersIn.forEach(filterIn => {
    //             if(filterIn.key==='fromDate'|| filterIn.key==='toDate')
    //             {
    //                 // @ts-ignore
    //                 var frmdate = filtersIn.find( function(item) { return item.key == 'fromDate' });
    //                 // @ts-ignore
    //                 var todate = filtersIn.find( function(item) { return item.key == 'toDate' });
    //                 var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
    //                 console.log(endOfDay+"")
    //                 // @ts-ignore
    //                 cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
    //             }
    //             else
    //             {
    //                 // @ts-ignore
    //                 cond[filterIn.key] = {$in: filterIn.value.split(",")};
    //             }
    //         });
    //         cond.isDeleted = false
    //     }
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     let transactionBusinessInstance = new TransactionBusiness()
    //     let transactionId = "IAV-" + new Date().toISOString()
    //     let rapaport = await new RapPriceBusiness().findBB({},{},{createdAt: -1},1,0,[])
    //     let transactionBody: any = {transactionId, "transactionType": "IAVPRICE", rapaportDate : rapaport[0].createdAt, status: "Pending",...user}
    //     let transaction: any = await transactionBusinessInstance.createBB(transactionBody)
    //     let skuData = await new SkuBusiness().findBB(cond,{},{},0,0)
    //     console.log("Sku Data="+skuData.length);
    //     for(let sku of skuData){
    //         let data: any = sku            
    //         if(!updateCollateral && data.movementStatus === "COLLATERAL" ) {
    //             data.error = "status is COLLATERAL";
    //             resultData.push(data)
    //             continue
    //         }
    //         /*if (!sku.labShape || !sku.clarity || !sku.colorCategory) {
    //             data.error = "clarity or shape or colorcategory is missing in sku";
    //             resultData.push(data)
    //             continue
    //         }*/
    //         if(sku.colorType === colorTypeEnum.WHITE) data = await new IavController().checkIavRap(sku, iav, user)
    //         else data = await new IavController().checkIavClient(sku, iav, user)
    //         if(data.error) resultData.push(data)
    //         else {skuIds.push(data.skuId);  iavData.push(data)}
    //     }
       
    //     transaction.status = "Completed"
    //     transaction.skuIds = skuIds
    //     await transactionBusinessInstance.updateManyBB({transactionId: transaction.transactionId},transaction)
    //     if(iavData.length) iavObj = await new IavBusiness().createBB(iavData);
    //     await new IavController().updateSku(iavObj)
    //     if (resultData.length) res.locals = {status: false, message: Messages.UPDATE_FAILED,data: resultData }
    //     else {
    //         res.locals.data = iavData.length
    //         res.locals.message = Messages.UPDATE_SUCCESSFUL;
    //     }
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    // }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        //@ts-expect-error
        let {query:{iav, importReview, filters, updateCollateral, effectiveDate}, body:{loggedInUser:{_id:loggedInUserId}}, mongoSession}: {query:{ filters: string, iav: string}} = req as RequestWithTransaction
        let iavData = [], cond:any = {}, skuIds = [], resultData: any = [], colateralData = []
        updateCollateral = (!(!updateCollateral || updateCollateral == "false"))
        
        if (filters?.length && filters[0] === '[' && filters[filters.length - 1] === ']') {
            filters = filters.replace(/'/g, '"');
            filters = await JSON.parse(filters)
            //@ts-expect-error
            filters.forEach((filter: any) => {
                if (filter.key === 'fromDate' || filter.key === 'toDate') {
                    //@ts-expect-error
                    const frmdate = filters.find( (item: any) => { return item.key == 'fromDate' });
                    //@ts-expect-error
                    const todate = filters.find((item: any) => { return item.key == 'toDate' });
                    const endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
                    console.log(endOfDay + "")
                    cond['createdAt'] = { "$gte": new Date(frmdate.value), "$lte": endOfDay };
                }
                else {
                    cond[filter.key] = { $in: filter.value.split(",") };
                }
            });
            cond.isDeleted = false
        } 
        if(cond["_id"] && cond["companyId"]) delete cond["companyId"]
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
        let transactionBody: any = {transactionId: "IAV-" + new Date().toISOString(),...user}
        let data = await new IavRepository().transactionCreate(transactionBody, cond, mongoSession)
        let skuData: any = data.sku
        for (let sku of skuData) {
            let data: any = sku
            console.log("====checking=====");
            
            if (!updateCollateral && data.collateralStatus && data.collateralStatus === 'COLLATERAL IN') {
                data.error = "status is in COLLATERAL";
                colateralData.push(data)
                continue
            }
            if (sku.colorType === skuColorTypeEnum.WHITE && sku.iavId?.rapPriceId) data = await new IavController().checkIavRap(sku, iav, user)
            else data = await new IavController().checkIavClient(sku, iav, user)
            if(data.error) continue          
            // if (data.error == "rap Price missing") {
            //     let skuObj = data._id; rapPriceMissingData.push(skuObj)
            // }
            // else if(data.error == "clientPrice Missing") {
            //     let skuObj = data._id; clientPriceData.push(skuObj)
            // }
            if(importReview) data.status = iavStatusEnum.PENDING
            let iavData1 = iavModel.findOne({skuId: data.skuId}).sort({updatedAt: -1}).select('effectiveDate').lean()
            //@ts-expect-error
            if(iavData1?.effectiveDate > effectiveDate) throw new Error('effectiveDate Cannot be smaller than previous effectiveDate')
            data.effectiveDate = new Date(effectiveDate)
            skuIds.push(data.skuId); iavData.push(data)
        }
        data.transaction.skuIds = skuIds, data.transaction.newIav = iav
        await new IavRepository().update(data.transaction, iavData, mongoSession )
        // console.log(resultData);
        if (colateralData.length) res.locals = {status: false, message: ErrorCodes.COLLATERAL_DATA, data: colateralData }
        else  res.locals = {status: true, message: (updateCollateral)? ErrorCodes.UPDATED_WITH_COLLATERAL: ErrorCodes.UPDATED_WITHOUT_COLLATERAL, data: iavData.length}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    // async updateSku (iav: any):  Promise<void> {
    //     for (const item of iav) {
    //         await new SkuBusiness().findAndUpdateBB({_id: item.skuId}, {iavId: item._id})
    //     }
    // }

    async checkIavRap(sku: any, iav: string, user: any): Promise<any | never> {
        let iavObject: any = {...user}
        let calcWeight: any = (sku.weight >= 5) ? 5 : (sku.weight).toFixed(2);
        calcWeight = Number(calcWeight)
        if (sku.labShape !== 'Round') sku.labShape = 'Pear';
        let data = await new IavRepository().findRap(sku, calcWeight);
        // let price: any = await new RapPriceBusiness().aggregateBB([
        //     { '$match': { 'weightRange.fromWeight': { '$lte': calcWeight }, 'weightRange.toWeight': { '$gte': calcWeight }, 'shape': sku.labShape, 'clarity': sku.clarity, 'color': sku.colorCategory } },
        //     { '$sort': { '_id': -1 } }, { '$limit': 1 }])
        if (data.price && data.price.length == 0) {            
            sku.error = "rapPrice Missing"            
            return sku            
        }
        
        // let clientPrice = await new ClientPriceBusiness().findOneBB({skuId: sku._id})
        // iavObject.clientPriceId = data.clientPrice[0]._id
        iavObject.rapPriceId = data.price[0]?._id;
        iavObject.skuId = sku._id
        let iavAverage: any
        if (await new IavBusiness().findCountBB() > 0) {
            iavAverage = await new IavBusiness().aggregateBB([{ $group: { "_id": null, "iav": { "$avg": "$iav" } } }])
            iavObject.iavAverage = iavAverage[0].iav;
        }
        else iavObject.iavAverage = iav
        iavObject.drv = (calcWeight * data.price[0]?.price)
        iavObject.pwv = (iavObject.drv + (Number(iav) * iavObject.drv / 100))
        iavObject.iav = Number(iav).toFixed(5) , iavObject.drv = Number(iavObject.drv).toFixed(2), iavObject.pwv = Number(iavObject.pwv).toFixed(2)        
        return iavObject
    }

    async checkIavClient(sku: any, iav: string, user: any): Promise<any | never> {
        let iavObject: any = {...user}
        let calcWeight: any = (sku.weight >= 5) ? 5 : (sku.weight).toFixed(2);
        calcWeight = Number(calcWeight)
        let match = { 'weight': calcWeight, 'shape': sku.labShape, 'skuId': sku._id, 'clarity': sku.clarity, 'color': sku.colorCategory }
        let price: any = await clientPriceModel.findOne({skuId: sku._id}).sort({createdAt: -1})
        if (price.length === 0) {
            console.log("====3");        
            sku.error = "clientPrice Missing"            
            return sku
        }
        iavObject.clientPriceId = price?._id;
        iavObject.skuId = sku._id
        iavObject.drv = (calcWeight * price?.price)
        iavObject.pwv = (iavObject.drv + (Number(iav) * iavObject.drv / 100))
        iavObject.iav = Number(iav).toFixed(5) , iavObject.drv = Number(iavObject.drv).toFixed(2), iavObject.pwv = Number(iavObject.pwv).toFixed(2)                
        return iavObject
    }

    // async createTransaction(req: Request, res: Response): Promise<any|never> {
    //     let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     let transactionBusinessInstance = new TransactionBusiness()
    //     let transactionId = "IAV-" + new Date().toISOString()
    //     let rapaport = await new RapPriceBusiness().findBB({},{},{createdAt: -1},1,0,[])
    //     let transactionBody = {transactionId, "transactionType": "IAVPRICE", rapaportDate : rapaport[0].createdAt, status: "Pending",...user}
    //     //@ts-expect-error
    //     let transaction: any = await transactionBusinessInstance.createBB(transactionBody)
    //     // res.locals.data = transaction
    //     // res.locals.message = Messages.CREATE_SUCCESSFUL;
    //     // await JsonResponse.jsonSuccess(req, res, `{this.url}.iavUpdate`);
    //     return transaction
    // }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new IavRepository().filter(loggedInUserId);
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
            data.dmStatus = ["MATCHED", "NOTMATCHED"];
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

    update = async (req: Request, res: Response) => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED}
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        let data = await new IavRepository().updateStatus(body, loggedInUserId)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`)
    }
}
