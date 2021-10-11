import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import {Constant, Messages} from "../../constants";
import lo from "lodash"
import RawActivityBusiness from "./raw-activity.business";
import {RawActivityValidation} from "./raw-activity.validation";
import {IRawActivity} from "./raw-activity.types";
import {IEvent} from "../events/events.types";
import {RawActivityRepository} from "./raw-activity.repository";
import rfidModel from "../rfid/rfid.model";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import {SkuRepository} from "../sku/sku.repository";
import * as Excel from 'exceljs'
import path from 'path'

export class RawActivityController extends BaseController<IRawActivity> {
    constructor() {
        super(new RawActivityBusiness(), "raw-activity", true);
        this.init();
    }

    register(express: Application): void {
        express.use('/api/v1/raw-activity', guard, this.router);
    }

    init(): void {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: RawActivityValidation = new RawActivityValidation()
        this.router.get("/", TryCatch.tryCatchGlobe(this.find))
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.post("/", transaction.startTransaction, validation.createRawActivity, TryCatch.tryCatchGlobe(this.create));
        this.router.get("/detail", TryCatch.tryCatchGlobe(this.detailInfo))
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportExcel))
        this.router.get('/filterCriteria', TryCatch.tryCatchGlobe(this.filter))
        this.router.get('/detail/filterCriteria', TryCatch.tryCatchGlobe(this.detailFilter))

    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page}: any = await new RawActivityRepository().index(req.query as any)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async detailInfo(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.FETCH_FAILED };
        const { data, page }: any = await new RawActivityRepository().detailInfoIndex(req.query as any)
        res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.detail`);
    }

    /*async create(req: Request, res: Response): Promise<void> {
        let { body, body: { loggedInUser: { _id: loggedInUserId } } } = req
        body.isTagValidated = true, body.isCountChecked = false
        let match = { "reader.serial": body.reader.serial, "reader.drawer": body.reader.drawer, isDeleted: false }
        let sort = { timestamp: -1 }, totalStones = []
        body.createdBy = body.updatedBy = loggedInUserId
        body.transactionId = "SCMA-" + new Date().toISOString()
        let previous_data = await new RawActivityBusiness().findBB(match, {}, sort, Constant.limit, Constant.startIndex)        
        const eventIn = body.events.find((item: IEvent) => { return item.EventType === "IN" });
        const eventOut = body.events.find((item: IEvent) => { return item.EventType === "OUT" });
        const eventInventory = body.events.find((item: IEvent) => { return item.EventType === "INVENTORY" });
        let oldInventory = (previous_data[0]?.events) ? previous_data[0].events?.find((item: IEvent) => { return item.EventType === "INVENTORY" }) : { EventType: "INVENTORY", stones: [] }        
        totalStones.push(eventIn.stones); totalStones.push(oldInventory?.stones);
        totalStones = totalStones.filter(item => eventOut.stones.indexOf(item) == -1);        
        if (eventInventory.stones.length === oldInventory?.stones.length + eventIn.stones.length - eventOut.stones.length) body.isCountChecked = true
        if (!lo.differenceBy(totalStones, eventInventory.stones)) body.isTagValidated = false
        else {            
            let count = await new SkuBusiness().findCountBB({ 'tagId': { $in: eventInventory.stones } })
            if (count !== eventInventory.stones.length) body.isTagValidated = false
        }
        await new RawActivityController().createActivity(eventIn,eventOut,body)
        let device_data = await new DeviceBusiness().findOneBB({ "serialNumber": body.reader.serial, "isDeleted": false })
        body.deviceId = device_data?._id
        res.locals.data = await new RawActivityBusiness().createBB(body);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    async createActivity(eventIn:Event,eventOut:IEvent,body: IRawActivity): Promise<void> {
        //@ts-expect-error
        let createIn = await this.createActivityData(eventIn, body)
        let createOut = await this.createActivityData(eventOut, body)        
        let createAlert = lo.concat(createIn.createAlertData, createOut.createAlertData)
        let createActivity = lo.concat(createIn.createManyActivities, createOut.createManyActivities)        
        await new ActivityBusiness().createBB(createActivity)
        await new AlertBusiness().createBB(createAlert)
    }

    async createActivityData(events: IEvent, body: IRawActivity): Promise<any> {
        let _id = body.user
        let createManyActivities = [], createAlertData = [], data: object        

        for (const item of events.stones) {
            let rfid = await new RfidBusiness().findOneBB({rfid: item},{createdAt: -1})
            let sku_data = await new SkuBusiness().findAndUpdateBB({ _id: rfid?.skuId }, { 'movementStatus': events.EventType })            
            let user_data = await new UserBusiness().findOneBB({ _id })

            if (sku_data && user_data) {
                let activityInsert = await this.createActivityObj(sku_data, user_data, body, events)
                let alertInsert: IAlert = await this.createAlertObj(events, sku_data, user_data, body)
                createManyActivities.push(activityInsert)
                createAlertData.push(alertInsert)
            }
        }
        data = { createManyActivities, createAlertData }
        return data;
    }

    async createActivityObj(sku_data: ISku, user_data: IUser, body: IRawActivity, events: IEvent): Promise<any | never> {
        return {
            "skuId": sku_data?._id,
            "labsId": sku_data?.labsId,
            "userId": user_data?._id,
            "companyId": user_data?.companyId,
            "iavId": sku_data.iavId,
            // "iav": `${Math.floor(Math.random() * 100)}`,
            // "drv": `${Math.floor(Math.random() * 100)}`,
            // "VC": Math.floor(Math.random() * 10000),
            // "pwv": `${Math.floor(Math.random() * 100)}`,
            "dmId": "5f2a5b6d9bfd9e0d7c929750",
            "status": events.EventType,
            "createdBy": body.createdBy,
            "updatedBy": body.updatedBy
        }
    }

    async createAlertObj(events:IEvent , sku_data: ISku, user_data: IUser, body: IRawActivity): Promise<any | never> {
        let priority = (events.EventType === "IN") ? "LOW" : "HIGH"
        let alertId = await new AlertMasterBusiness().findOneBB({ "status": events.EventType, alertType: "USERGENERATED", priority: priority })
        return {
            "skuId": sku_data._id,
            "userId": user_data._id,
            "alertId": alertId?._id,
            "message": alertId?.description,
            "status": alertId?.status,
            "readStatus": "NOTVIEWED",
            "createdBy": body.createdBy,
            "updatedBy": body.updatedBy
        }
    }*/

    async find(req: Request, res: Response): Promise<void> {
        let populate = [{ path: "deviceId" }, { path: "user" }]
        await new RawActivityController().findBC(req, res, populate)
    }

//  detailInfoIndex=  async (query:any): Promise<any> => {
//      let { _id, column, filters, sort: sorter, pageSize: pagesize, pageNumber: pagenumber, search: searchData, count: counter } = query
//         ////@ts-expect-error
//         // let { query: { _id, column, filters, sort: sorter, pageSize: pagesize, pageNumber: pagenumber, search: searchData, count: counter } }:{ query: { _id: string, filters: string, sort: string, pageSize: number, pageNumber: number } } = query
//         let populate = [{ path: "deviceId" }, { path: "user", select: { password: 0 } }]
//         let data: any = await new RawActivityBusiness().findOneBB({ _id, isDeleted: false }, { createdAt: -1 }, populate)
//         if(!data) throw new Error("Invalid id")
//         let events = data.events, cond = {}, count: any = {}
//         let filterCount = 0, startIndex = 0, endIndex = 0
//         let hasNextPage: boolean = false, totalPage = 0
//         let totalCount: number;
//         let sort = { createdAt: -1 }
//         let populate1 = [{ path: "skuId", populate: [{ path: 'iavId', populate: [{ path: 'rapPriceId', model: 'RapPrice' }, { path: 'clientPriceId', model: 'ClientPrice' }] }] }]
//         let dataList: any = [];
//         if (events) {
//             for (const item of events) {
//                 let stoneDetails = await rfidModel.find({ rfid: { "$in": item.stones, "$exists":true}  })
//                 console.log(stoneDetails);
                
//                 for (const stones of item.stones) {
//                     let detailData: any = {}
//                     detailData.event = item.EventType
//                     // detailData.tagId = await new RfidBusiness().findOneBB({rfid: stones, isDeleted: false}, sort, populate1)
//                     let tag = stoneDetails.find(item => {if(item['rfid'] == stones) return item})
//                     if(tag) detailData.tagId = tag.rfid
//                     else detailData.tagId = null
//                     detailData.reader = data.reader
//                     detailData.user = data.user ;
//                     detailData.isTagValidated = data.isTagValidated;
//                     detailData.isCountChecked = data.isCountChecked;
//                     detailData.createdBy = data.createdBy;
//                     detailData.updatedBy = data.updatedBy;
//                     detailData.deviceId = data.deviceId
//                     detailData.transactionId = data.transactionId
//                     detailData.isActive = data.isActive
//                     detailData.isDeleted = data.isDeleted
//                     detailData.createdAt = data.createdAt
//                     detailData.updatedAt = data.updatedAt
//                     detailData._id = data._id
//                     detailData.timestamp = data.timestamp
//                     dataList.push(detailData)
//                 }
//             }
//         }

//         let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
//         let pageSize = (pagesize !== undefined && Number(pagesize) !== NaN)? Number(pagesize) : Constant.DEFAULT_PAGE_SIZE
//         totalCount = dataList.length
//         filterCount = totalCount
//         startIndex = (pageNumber - 1) * pageSize;
//         endIndex = pageNumber * pageSize;

//         if(filters?.length && filters[0] === '[' && filters[filters.length-1] === ']') {
//             filters = filters.replace(/'/g, '"');
//             filters = await JSON.parse(filters)
//             //@ts-expect-error
//             filters.forEach(filter => cond[filter.key] = filter.value)
//             dataList = dataList.filter((itm: any) => { if(lo.isMatch(itm, cond)) return itm })
//             filterCount = dataList.length
//             if (pageSize != 0) {
//                 totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
//                 if (endIndex < filterCount) hasNextPage = true
//             }
//         }
//         else if(searchData?.length && searchData[0] === '{' && searchData[searchData.length-1] === '}') {
//             searchData = searchData.replace(/'/g, '"');
//             searchData = await JSON.parse(searchData)
//             let filterArray = []
//             for (var i = 0; i < dataList.length; i++) {
//                 var patt = new RegExp(searchData.value, "i");
//                 if (patt.test(dataList[i][searchData.key])) filterArray.push(dataList[i])
//             }
//             dataList = filterArray
//             filterCount = dataList.length
//             if (pageSize != 0) {
//                 totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
//                 if (endIndex < filterCount) hasNextPage = true
//             }
//         }
//         else {
//             if (pageSize!=0) {totalPage = (totalCount % pageSize === 0) ? totalCount / pageSize : Math.ceil(totalCount / pageSize);
//             if (endIndex < totalCount) hasNextPage = true
//             }
//         }
//      if (pageSize != 0) {dataList = dataList.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)}
//         if (column?.length && column[0] === '[' && column[column.length - 1] === ']') {
//             column = column.replace(/'/g, '"');
//             column = await JSON.parse(column)
//             dataList = dataList.map((dataObj: any) => {
//                 let data: any = {}
//                 for (let item of column) data[item] = dataObj[item]
//                 return data
//             });
//         }
//         if (counter?.length && counter[0] === '[' && counter[counter.length - 1] === ']') {
//             counter = counter.replace(/'/g, '"');
//             counter = await JSON.parse(counter)
//             for (let item of counter) count[item.key] = {}
//             for (let item of counter) count[item.key][item.value] = dataList.filter((obj: any) => obj[item.key] === item.value).length;
//         }
//         if (sorter) {
//             sorter = sorter.replace(/'/g, '"');
//             sorter = await JSON.parse(sorter)
//             dataList = await new RawActivityController().sortByKey(dataList, sorter)
//         }
//      let page = { hasNextPage, totalCount, filterCount, currentPage: pageNumber, totalPage, count }
//      return { dataList, page }
//     }

    async sortByKey(array: Array<object>, sort: string): Promise<any | never> {        
        return array.sort(function(a, b) {
            // @ts-expect-error
            let x = a[sort.key], y = b[sort.key];
            // @ts-expect-error
            if(sort.value === "asc")return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            else return ((x < y) ? 1 : ((x > y) ? -1 : 0))
        });
    }

    async create(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.CREATE_FAILED}
        let { body, body: { loggedInUser: { _id: loggedInUserId, companyId } }, mongoSession } = req as RequestWithTransaction
        body.isTagValidated = true, body.isCountChecked = false
        body.createdBy = body.updatedBy = loggedInUserId
        body.timestamp = new Date(Number(body.timestamp));
        body.transactionId = "SCMA-" + new Date().toISOString();
        body.companyId = companyId
        await new RawActivityRepository().checkDevice(body);
        let totalStones = [];
        let match = { "reader.serial": body.reader.serial, "reader.drawer": body.reader.drawer, isDeleted: false }
        const eventIn = body.events.find((item: IEvent) => { return item.EventType === "IN" });
        const eventOut = body.events.find((item: IEvent) => { return item.EventType === "OUT" });
        const eventInventory = body.events.find((item: IEvent) => { return item.EventType === "INVENTORY" });
        let previous_data =  await new RawActivityRepository().findPrevious(match)
        let oldInventory = (previous_data?.events) ? previous_data.events?.find((item: IEvent) => { return item.EventType === "INVENTORY" }) : { EventType: "INVENTORY", stones: [] }        
        totalStones.push(eventIn.stones); totalStones.push(oldInventory?.stones);
        if (eventInventory.stones.length === oldInventory?.stones.length + eventIn.stones.length - eventOut.stones.length) body.isCountChecked = true
        if (!lo.differenceBy(totalStones, eventInventory.stones)) body.isTagValidated = false
        else {            
            let count = await new SkuRepository().findCountBR({ 'tagId': { $in: eventInventory.stones } })
            if (count !== eventInventory.stones.length) body.isTagValidated = false
        }
        totalStones = totalStones.filter((item:any) => eventOut.stones.indexOf(item) == -1);        
        await new RawActivityRepository().create(eventIn,eventOut,eventInventory,body, mongoSession)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data:{inventory_id: body.inventory_id}}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`)
    }

    async exportExcel(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        let { dataList, page }: any = await new RawActivityRepository().detailInfoIndex(req.query as any)
        let headerData = [{ name: 'TransactionId', filterButton: true }, { name: 'Event', filterButton: true }, { name: "Tag Id", filterButton: true }, { name: "Serial No.", filterButton: true }, { name: "Drawer", filterButton: true }, { name: "User", filterButton: true }, { name: "Device Name", filterButton: true }, { name: "Timestamp", filterButton: true }, { name: "Created At", filterButton: true }]
        let requiredData = [];
        let arr: any[] = []
        let data = dataList
        for (let i = 0; i < data.length; i++) {
            arr = [data[i].transactionId,
            data[i].event, data[i].tagId, data[i].reader?.serial, data[i].reader?.drawer, data[i].user?.firstName, data[i].deviceId?.name, data[i].timestamp, data[i].createdAt]
            requiredData.push(arr);
        }

        let worksheet = workbook.addWorksheet('Device-Activity Export')
        await new RawActivityBusiness().createTable(worksheet, headerData, requiredData)
        let fileName = 'DeviceActivityExport.xlsx'
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
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new RawActivityRepository().filter(loggedInUserId)
        data.companies.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }

     detailFilter = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED}   
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req
        let data = await new RawActivityRepository().detailFilter(loggedInUserId, req?.query?._id)
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
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
    }
}