// import {Application, Request, Response} from "express";
// import {BaseController} from "../BaseController";
// import {JsonResponse, TryCatch} from "../../helper";
// import {guard} from "../../helper/Auth";
// import {ISku} from "./sku.types";
// import {Constant, Messages} from "../../constants";
// import CompanyBusiness from "../company/company.business";
// import {ILab} from "../lab/lab.types";
// import LabBusiness from "../lab/lab.business";
// import RapPriceBusiness from "../rap-price/rap-price.business";
// import MovementActivityBusiness from "../movement-activity/movement-activity.business";
// import moment from 'moment'
// import AlertBusiness from "../alert/alert.business";
// import ActivityBusiness from "../activity/activity.business";
// import faker from 'faker'
// import XLSX from 'xlsx';
// import FileUploadHistoryBusiness from "../file-upload-history/file-upload-history.business";
// import * as Excel from 'exceljs'
// import path from 'path'
// import IavBusiness from "../iav/iav.business";
// import ClientPriceBusiness from "../client-price/client-price.business";
// import RfidBusiness from "../rfid/rfid.business";
// import TransactionBusiness from "../transaction/transaction.business";
// import {IActivity} from "../activity/activity.types";
// import DiamondMatchBusiness from "../diamond-match/diamond-match.business"
// import {MongooseTransaction} from "../../helper/MongooseTransactions";
// import {RequestWithTransaction} from "../../interfaces/Request";
// import {SkuHistoryRepository} from "./sku-history.repository";
// import SkuHistoryBusiness from "./sku-history.business";
// import {SkuHistoryValidation} from "./sku-history.validation";
//
// export class SkuHistoryController extends BaseController<ISku> {
//     constructor() {
//         super(new SkuHistoryBusiness(), "sku",true, new SkuHistoryRepository());
//         this.init();
//     }
//
//     register(express: Application) {
//         express.use('/api/v1/sku', guard, this.router);
//     }
//
//     init() {
//         const transaction: MongooseTransaction = new MongooseTransaction();
//         const validation: SkuHistoryValidation = new SkuHistoryValidation();
//         this.router.get("/", TryCatch.tryCatchGlobe(this.find));
//         this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
//         this.router.post("/", validation.createSku, TryCatch.tryCatchGlobe(this.create));
//         this.router.put("/", validation.updateSku, TryCatch.tryCatchGlobe(this.update));
//         this.router.put("/sku-lab-update", transaction.startTransaction, TryCatch.tryCatchGlobe(this.skuLabUpdate));  //Todo add validation here.
//         this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
//         this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
//         this.router.get("/count", TryCatch.tryCatchGlobe(this.counterBC));
//
//         // this.router.post("/import", Upload.uploadFile('/uploads/sku/import/excel').single('file'), guard, TryCatch.tryCatchGlobe(this.import));
//         this.router.post("/duplicateimport", validation.importSku, TryCatch.tryCatchGlobe(this.duplicateImport));
//         this.router.post("/move-to-collateral", validation.moveToCollateralSku, TryCatch.tryCatchGlobe(this.moveToCollateral));
//         this.router.put("/status",transaction.startTransaction, validation.skuStatusValidation, TryCatch.tryCatchGlobe(this.updateStatus));
//         this.router.get("/faker",TryCatch.tryCatchGlobe(this.generateFaker));
//         this.router.get("/summary",TryCatch.tryCatchGlobe(this.exportReport));
//         this.router.delete("/deleteMultipleVerify", transaction.startTransaction, validation.MultipleDeleteVerifyValidation,TryCatch.tryCatchGlobe(this.deleteManyVerify));
//         this.router.post("/import", transaction.startTransaction, TryCatch.tryCatchGlobe(this.importData));
//         this.router.post("/ledTrigger", transaction.startTransaction, validation.ledTrigger, TryCatch.tryCatchGlobe(this.ledTrigger));
//         this.router.delete("/deleteMultiple", transaction.startTransaction, TryCatch.tryCatchGlobe(this.deleteMany));
//         this.router.get("/group-by", TryCatch.tryCatchGlobe(this.groupBy));
//         this.router.get("/exportExcel",TryCatch.tryCatchGlobe(this.skuExportExcel));
//         this.router.get("/assetDetail",TryCatch.tryCatchGlobe(this.skuAssetDetail));
//         this.router.get("/unreferenced/assets",TryCatch.tryCatchGlobe(this.unReferencedAssets));
//         this.router.post("/update-collateral", transaction.startTransaction, validation.updateCollateralValidation, TryCatch.tryCatchGlobe(this.updateCollateral));
//         this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
//         this.router.get("/get-by-tag", validation.getSkuByTag, TryCatch.tryCatchGlobe(this.getSkuByTag));
//         this.router.get("/getSkuByDateAndTime", validation.getSkuFromTime, TryCatch.tryCatchGlobe(this.getSkuFromTime))
//     }
//
//     async index(req: Request, res: Response): Promise<any> {   //Todo fix function return Promise.
//         res.locals = {status: false, message: Messages.FETCH_FAILED};
//         const {data, page, header}: any = await new SkuHistoryRepository().index(req.query);
//         res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
//     }
//
//     async groupBy(req: Request, res: Response): Promise<void> {
//         res.locals = {status: false, message: Messages.FETCH_FAILED};
//         //@ts-expect-error
//         let {query: {key, companyId}}: {query: {key: string, companyId: string}} = req;
//         key = key.replace(/'/g, '"');
//         // @ts-expect-error
//         key = await JSON.parse(key) as String[];
//         // @ts-expect-error
//         const data = await new SkuHistoryRepository().groupBy(key, companyId);
//         res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.groupBy`);
//     }
//
//     async find(req: Request, res: Response): Promise<any> {   //Todo fix function return Promise.
//         /*let {query} = req
//         let data = await new SkuRepository().index(query)
//         res.locals.data = data
//         res.locals.message = Messages.FETCH_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);*/
//         const populate = [{path: 'labsId'}, {path: 'companyId'}, {path: 'createdBy'}, {path: 'updatedBy'},
//             {path:'iavId',populate: [{path: 'rapPriceId', model: 'RapPrice'},{path: 'clientPriceId', model: 'ClientPrice'}] }];
//         await new SkuHistoryController().findBC(req, res, populate)
//     }
//
//     // async create(req: Request, res: Response): Promise<void> {
//     //     const LabBusinessInstance = new LabBusiness();
//     //     //@ts-expect-error
//     //     let {body, body:{comments, labsId, companyId, infinityRefId,  loggedInUser:{_id:loggedInUserId}}} : {body: ISku} = req;
//     //     await new SkuHistoryBusiness().findOneBB({infinityRefId}).then((skuInfinityRefIdData => {if(skuInfinityRefIdData) throw new Error("Duplicate infinityRefId")}));
//     //     body.createdBy = body.updatedBy = loggedInUserId;
//     //     comments.forEach(comment => comment.createdBy = loggedInUserId);
//     //     let labsData = labsId.map(labId => LabBusinessInstance.findIdByIdBB(labId));
//     //     await Promise.all(labsData).then(labsData => labsData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) );
//     //     await new CompanyBusiness().findIdByIdBB(companyId).then(companyIdData => {if(!companyIdData?._id) throw new Error("Invalid companyId")});
//     //     //@ts-expect-error
//     //     body.movementStatus = 'INVENTORY';
//     //     res.locals.data = await new SkuHistoryBusiness().createBB(body);
//     //     res.locals.message = Messages.CREATE_SUCCESSFUL;
//     //     await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
//     // }
//
//     async update(req: Request, res: Response): Promise<void> {
//         const LabBusinessInstance = new LabBusiness();
//         //@ts-expect-error
//         let {body, body:{_id, comments, labsId, companyId, loggedInUser:{_id:loggedInUserId}}} : {body: ISku} = req;
//         body.updatedBy = loggedInUserId;
//         comments.forEach(comment => comment.createdBy = loggedInUserId);
//         let labsData = labsId.map(labId => LabBusinessInstance.findIdByIdBB(labId));
//         await Promise.all(labsData).then(labsData => labsData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) );
//         await new CompanyBusiness().findIdByIdBB(companyId).then(companyIdData => {if(!companyIdData?._id) throw new Error("Invalid companyId")});
//         res.locals.data = await new SkuHistoryBusiness().findAndUpdateBB({_id}, body);
//         res.locals.message = Messages.UPDATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
//     }
//
//     async skuLabUpdate(req: Request, res: Response): Promise<void> {
//         const {body, mongoSession} = req;
//         const data = await new SkuHistoryRepository().skuLabUpdate(body, mongoSession);
//         res.locals.message = Messages.UPDATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
//     }
//
//     async import(req: Request, res: Response): Promise<void> {
//         const {_id} = req.body.loggedInUser;
//         //@ts-expect-error
//         await new FileUploadHistoryBusiness().createBB({fileName: req.file.filename, createdBy: _id, updatedBy: _id});
//         console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
//         //@ts-expect-error
//         let file: any = await new XLSX.readFile(req.file.path);
//         console.log(file,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
//         let sheet = file.Sheets[0];
//         // let limit = file.Sheets.sheet['!ref']
//         // limit = limit.split(':')
//         // const row = limit[1][0]
//         // const col = limit[1][1]
//         let rowData = [];
//         // console.log(file.Sheets.Feuil1, "==================", row, col)
//         // console.log(file.Sheets.Feuil1.A1.v, "==================")
//         // rowData.push(file.Sheets.Feuil1.A1.v)
//         // rowData.push(file.Sheets.Feuil1.B1.v)
//         // rowData.push(file.Sheets.Feuil1.C1.v)
//         // rowData.push(file.Sheets.Feuil1.D1.v)
//         // rowData.push(file.Sheets.Feuil1.E1.v)
//         // rowData.push(file.Sheets.Feuil1.F1.v)
//         // rowData.push(file.Sheets.Feuil1.G1.v)
//         // rowData.push(file.Sheets.Feuil1.H1.v)
//         // rowData.push(file.Sheets.Feuil1.I1.v)
//         // rowData.push(file.Sheets.Feuil1.J1.v)
//         // rowData.push(file.Sheets.Feuil1.K1.v)
//         // // rowData.push(file.Sheets.Feuil1.L1.v)
//         // // rowData.push(file.Sheets.Feuil1.M1.v)
//         // // rowData.push(file.Sheets.Feuil1.N1.v)
//         // rowData.push(file.Sheets.Feuil1.O1.v)
//         // rowData.push(file.Sheets.Feuil1.P1.v)
//         // rowData.push(file.Sheets.Feuil1.Q1.v)
//         // rowData.push(file.Sheets.Feuil1.R1.v)
//         // rowData.push(file.Sheets.Feuil1.S1.v)
//         // rowData.push(file.Sheets.Feuil1.T1.v)
//         // console.log(file.Sheets.Feuil1.I1['v'],'>>>>>>>>>>>>>>>')
//         let newData = []
//         // for(let i=2; i<=col; i++){
//         //     // console.log('???????????????????????????')
//         //     const create = {
//         //         infinity_ref_id: file.Sheets.Feuil1[`A${i}`]?.v,
//         //         tag_id: file.Sheets.Feuil1[`B${i}`]?.v,
//         //         shape: file.Sheets.Feuil1[`C${i}`]?.v,
//         //         measurement: file.Sheets.Feuil1[`D${i}`]?.v,
//         //         weight: file.Sheets.Feuil1[`E${i}`]?.v,
//         //         color_rapnet: file.Sheets.Feuil1[`F${i}`]?.v,
//         //         clarity: file.Sheets.Feuil1[`G${i}`]?.v,
//         //         cut: file.Sheets.Feuil1[`H${i}`]?.v,
//         //         polish: file.Sheets.Feuil1[`I${i}`]?.v,
//         //         symmetry: file.Sheets.Feuil1[`J${i}`]?.v,
//         //         fluorescence: file.Sheets.Feuil1[`K${i}`]?.v,
//         //         price: file.Sheets.Feuil1[`O${i}`]?.v,
//         //         vnc: file.Sheets.Feuil1[`P${i}`]?.v,
//         //         discount: file.Sheets.Feuil1[`Q${i}`]?.v,
//         //         pwp: file.Sheets.Feuil1[`R${i}`]?.v,
//         //         rfid: file.Sheets.Feuil1[`S${i}`]?.v,
//         //         total: file.Sheets.Feuil1[`T${i}`]?.v
//         //     }
//         //     newData.push(create)
//         // }
//         // console.log(rowData)
//         res.locals.data = file;
//         res.locals.message = Messages.CREATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//     }
//
//     // async import(req: Request, res: Response): Promise<void> {
//     //     const LabBusinessInstance = new LabBusiness();
//     //     const SkuBusinessInstance = new SkuBusiness()
//     //     const CompanyBusinessInstance = new CompanyBusiness()
//     //     const RapPriceBusinessInstance = new RapPriceBusiness()
//     //     let {body:{skus, loggedInUser:{_id:loggedInUserId}}} : {body:{skus:ISku[], loggedInUser:any}} = req
//     //     let duplicateSkus: ISku[] = [], skusToInsert: ISku[] = [], labsIdData: Promise<ILab|null>[] = []
//     //     let skusData = skus.map(async sku => {
//     //         const skuInfinityRefIdData = await SkuBusinessInstance.findOneBB({infinityRefId: sku.infinityRefId})
//     //         if (skuInfinityRefIdData) duplicateSkus.push(sku)
//     //         else {
//     //             sku.createdBy = sku.updatedBy = loggedInUserId
//     //             sku.comments.forEach(comment => comment.createdBy = loggedInUserId)
//     //             sku.labsId.map(labId => labsIdData.push(LabBusinessInstance.findIdByIdBB(labId)))
//     //             await CompanyBusinessInstance.findIdByIdBB(sku.companyId).then(company => {if(!company?._id) throw new Error("Invalid companyId")})
//     //             skusToInsert.push(sku)
//     //         }
//     //     })
//     //     await Promise.all(skusData)
//     //     await Promise.all(labsIdData).then(labsIdData => labsIdData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) )
//     //     let data = await SkuBusinessInstance.createBB(skusToInsert)
//     //     res.locals.data = {duplicateSkus, data}
//     //     res.locals.message = Messages.CREATE_SUCCESSFUL;
//     //     await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//     // }
//
//     async duplicateImport(req: Request, res: Response): Promise<void> {
//         const SkuBusinessInstance = new SkuHistoryBusiness();
//         const LabBusinessInstance = new LabBusiness();
//         const CompanyBusinessInstance = new CompanyBusiness();
//         let {body:{skus, loggedInUser:{_id:loggedInUserId}}} : {body:{skus:ISku[], loggedInUser:any}} = req;
//         let skusToInsert: Promise<ISku|null>[] = [], labsIdData: Promise<ILab|null>[] = [];
//         let skusData = skus.map(async sku => {
//             sku.createdBy = sku.updatedBy = loggedInUserId;
//             sku.comments.forEach(comment => comment.createdBy = loggedInUserId);
//             sku.labsId.map(labId => labsIdData.push(LabBusinessInstance.findIdByIdBB(labId)));
//             await CompanyBusinessInstance.findIdByIdBB(sku.companyId).then(company => {if(!company?._id) throw new Error("Invalid companyId")});
//             skusToInsert.push(SkuBusinessInstance.updateManyBB({infinityRefId: sku.infinityRefId}, sku))
//         });
//         await Promise.all(skusData);
//         await Promise.all(labsIdData).then(labsIdData => labsIdData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) );
//         res.locals.data = await Promise.all(skusToInsert);
//         res.locals.message = Messages.CREATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//     }
//
//     async moveToCollateral(req: Request, res: Response): Promise<void> {
//         const SkuBusinessInstance = new SkuHistoryBusiness();
//         const MovementActivityBusinessInstance = new MovementActivityBusiness();
//         let {body:{skuIds, loggedInUser:{_id:loggedInUserId}}} : {body:{skuIds:ISku['_id'][], loggedInUser:any}} = req;
//         // let skuChangeMovementStatus = []
//         const skuIdsData = skuIds.map(SkuId => SkuBusinessInstance.findIdByIdBB(SkuId));
//         await Promise.all(skuIdsData).then(skuIdsData => skuIdsData.forEach(sku => {
//             if(!sku?._id) throw new Error("Invalid SkuIds");
//             if(!sku?.dmGuid) throw new Error("stones not yet registrered")
//         }));
//         console.log('after id check');
//         const skuChangeMovementStatus = skuIds.map(async skuId => {
//
//             //@ts-expect-error
//             await MovementActivityBusinessInstance.updateManyBB({skuId, toDate: null},{toDate: moment().format(), updatedBy: loggedInUserId, actionCloseIp: req.connection.remoteAddress || req.socket.remoteAddress})
//
//             await SkuBusinessInstance.findAndUpdateBB({"_id":skuId}, {movementStatus: 'APPROVED'});
//             //@ts-expect-error
//             await MovementActivityBusinessInstance.createBB({skuId, actionType: 'APPROVED', actionOpenIp: req.connection.remoteAddress || req.socket.remoteAddress, createdBy: loggedInUserId, updatedBy: loggedInUserId})
//         });
//         await Promise.all(skuChangeMovementStatus);
//         res.locals.data = skuIds;
//         res.locals.message = 'Successfully moved to collateral.';
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//     }
//
//     // async updateStatus(req: Request, res: Response): Promise<void> {
//     //     let {body, body:{skuIds,status}, body:{loggedInUser:{_id:loggedInUserId}}} = req
//     //     body.updatedBy = loggedInUserId
//     //     let iavBusinessInstance = new IavBusiness, activityBusinessInstance = new ActivityBusiness, alertBusinessInstance = new AlertBusiness
//     //     let alertData: any = {}, skuId : any= [],transactionId , transactionBody
//     //     const transactionBusinessInstance = new TransactionBusiness()
//     //     if(status === "CONSIGNMENT"){
//     //         transactionId = "CN-" + new Date().toISOString()
//     //         transactionBody = {transactionId, "transactionType": "CONSIGNMENT", status: "Pending"}
//     //     }
//     //     else{
//     //         transactionId = "SL-" + new Date().toISOString()
//     //         transactionBody = {transactionId, "transactionType": "SALE", status: "Pending"}
//     //     }
//     //     let transaction: any = await new SkuController().createTransaction(req, res, transactionBody)
//     //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
//     //     //@ts-expect-error
//     //     await new SkuBusiness().updateManyBB({"_id": skuIds},{"movementStatus":status})
//     //     for (const item of skuIds ) {
//     //         let sku = await new SkuBusiness().findIdByIdBB(item)
//     //         if(!sku?._id) throw new Error("Invalid SkuId")
//     //         // let activityData: any = await activityBusinessInstance.findOneBB({ skuId: item, isDeleted: false }, { _id: -1 })
//     //         await new SkuController().createActivity(item, user, body)
//     //         // else {
//     //         //     delete activityData?._id
//     //         //     delete activityData?.createdAt
//     //         //     delete activityData?.updatedAt
//     //         //     let iavData: any = await iavBusinessInstance.findOneBB({ skuId: item, isDeleted: false }, { _id: -1 })
//     //         //     activityData.status = status
//     //         //     activityData.iavId = iavData?._id
//     //         //     activityData.createdBy = activityData.updatedBy = loggedInUserId
//     //         //     await activityBusinessInstance.createBB(activityData)
//     //         // }
//     //         let alertType = await new AlertMasterBusiness().findOneBB({ status }, { createdAt: -1 })// to do alertType as Usergenerated
//     //         if (!alertType) continue
//     //         alertData.userId = loggedInUserId;
//     //         alertData.message = "working good"
//     //         alertData.skuId = item
//     //         alertData.alertId = alertType?._id
//     //         alertData.status = status
//     //         alertData.createdBy = alertData.updatedBy = loggedInUserId
//     //         await alertBusinessInstance.createBB(alertData)
//     //     }
//     //     transaction.status = "Completed"
//     //     transaction.skuIds = skuIds
//     //     await transactionBusinessInstance.updateManyBB({transactionId},transaction)
//     //     res.locals.message = Messages.UPDATE_SUCCESSFUL;
//     //     res.locals.data = skuIds.length // Need to Fix
//     //     await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStatus`);
//     // }
//
//     async updateStatus(req: Request, res: Response): Promise<void> {
//         res.locals = {status: false, message: Messages.UPDATE_FAILED};
//         let {body, body:{skuIds,status}, body:{loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction;
//         body.updatedBy = loggedInUserId;
//         let alertData: any = {}, skuId : any= [],transactionId , transactionBody;
//         let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
//         // if(status === "CONSIGNMENT")transactionBody = {transactionId: "CN-" + new Date().toISOString(), "transactionType": "CONSIGNMENT", status: "Pending"}
//         // else transactionBody = {transactionId:"SL-" + new Date().toISOString(), "transactionType": "SALE", status: "Pending"}
//         let data = await new SkuHistoryRepository().updateStatus( body, user, mongoSession);
//         res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStatus`);
//     }
//
//     async generateFaker(req: Request, res: Response): Promise<void> {
//         let { body: { loggedInUser: { _id: loggedInUserId } }, query: { numberOfRecordToBeGenerated } } = req;
//         let NumberOfRecordToBeGenerated = numberOfRecordToBeGenerated || Constant.NumberOfRecordsToGenerate;   // numberOfRecordToBeGenerated ||
//         let SKuFakerData: any = [];
//         console.log("-->", NumberOfRecordToBeGenerated);
//         let momntStat = ['INVENTORY', 'ALERT', 'IN', 'OUT', 'APPROVED', 'FINGERPRINT', 'ARRIVAL', 'OPENBIZ', 'CLOSEBIZ',
//             'SOLD', 'VAULT', 'MISSING', 'RESTART', 'RETURN', 'PING', 'OPERATIONAL', 'STANDBY']; //enums
//         let stat = ['INVENTORY', 'IN', 'OUT'];
//         //                let MomentSatus = myShows[Math.floor(Math.random() * myShows.length)];
//         // console.log("==>",MomentSatus)
//         for (let i = 0; i < NumberOfRecordToBeGenerated; i++) {
//             SKuFakerData.push({
//                 infinityRefId: faker.random.alphaNumeric(8),
//                 dmGuid: faker.random.alphaNumeric(8),
//                 infinityShape: faker.random.word(),
//                 clientShape: faker.random.word(),
//                 labShape: faker.random.word(),
//                 //shape: faker.random.word(),
//                 labsId: ["5f2ce1fbc972140eb7c23d55"],
//                 weight: faker.random.number({ min: 1, max: 5, precision: 0.01 }),
//                 movementStatus: momntStat[Math.floor(Math.random() * momntStat.length)],
//                 status: stat[Math.floor(Math.random() * stat.length)],
//                 colorCategory: faker.commerce.color(),
//                 colorSubCategory: faker.commerce.color(),
//                 gradeReportColor: faker.commerce.color(),
//                 colorRapnet: faker.commerce.color(),
//                 clarity: faker.random.word(),
//                 cut: faker.random.word(),
//                 measurement: "11,34 x 11,33 x 6,78mm",
//                 colorType: faker.random.word(),
//                 comments: [{
//                     createdBy: loggedInUserId,
//                     comment: faker.lorem.sentence()
//                 }],
//                 companyId: "5eeb672016d46f5168f29632",
//                 polish: faker.random.word(),
//                 rfid: faker.random.alphaNumeric(5),
//                 tagId: faker.random.alphaNumeric(5),
//                 symmetry: faker.random.word(),
//                 fluorescence: faker.random.word(),
//                 createdAt: Date.now(),
//                 updatedAt: Date.now(),
//                 createdBy: loggedInUserId,
//                 updatedBy: loggedInUserId
//             })
//         }
//         //console.log("======>",SKuFakerData);
//         res.locals.data = await new SkuHistoryBusiness().createBB(SKuFakerData);
//         res.locals.message = Messages.CREATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.faker`);
//     }
//
//     async exportReport(req: Request, res: Response): Promise<void> {
//         let workbook = new Excel.Workbook();
//         let populate = [{ path: "skuId" }, { path: "userId", select: '-password' }, { path: "companyId" }, { path: "labsId" }];
//         let dbData = await new SkuHistoryBusiness().findBB({}, {}, {}, 50, 0, populate);
//         let headerData = [{ name: "Line Number" }, { name: 'Status' }, { name: "Carat Weight" }, { name: "Company" }, { name: "Report Date" }, { name: "Reference Number" }, { name: "PWV" }
//             , { name: "RFID" }, { name: "Report Type" }, { name: "Report Number" }, { name: "IAV" }, { name: "Shape" }, { name: "Color" }, { name: "Color Type" }, { name: "Grading Shape" }, { name: "Grading Color" },
//         { name: "Clarity" }, { name: "V/C" }, { name: "DRV" }, { name: "Last DiamondMatch" }, { name: "Diamond Match" }];
//         let requiredData = [];
//         let arr: any[] = [];
//         requiredData.push(arr);
//         for (let i = 0; i < dbData.length; i++) {
//             //@ts-expect-error
//             arr = [i + 1, dbData[i].status, dbData[i].weight, dbData[i].companyId ?.name, /*dbData[i].Report Date*/,
//             dbData[i].rfid,/* dbData[i].pwv*/,/* dbData[i].RFID*/, /*dbData[i].Report Type*/, /*dbData[i].Report Number*/, /*dbData[i].iav*/,
//             //@ts-expect-error
//             dbData[i].shape, dbData[i].colorCategory, dbData[i].colorType,/*dbData[i].Gradingshape*/,/*dbData[i].Gradingcolor*/, dbData[i].clarity,/*dbData[i].vc*/,
//                 /*dbData[i].drv*/,/*dbData[i].LastDiamondMatch*/,/*dbData[i].DiaMatch*/];
//             requiredData.push(arr);  //TODO map data, set limit
//         }
//         //res.locals.data = requiredData
//         let worksheet = workbook.addWorksheet('SKU Report')
//         await new SkuHistoryBusiness().createTable(worksheet, headerData, requiredData)
//         let fileName = 'SkuReport.xlsx'
//         let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
//         //res.locals.message = 'File Created'
//         res.download(path.join(__dirname, `${fileName}`), (err) => {
//             if (err) {
//                 { res.status(400).json({ status: 400, success: false, message: err }) }
//                 console.log("DownloadError", err);
//             }
//         })
//         //await JsonResponse.jsonSuccess(req, res, `{this.url}.export`);
//     }
//
//     // async deleteMany(req: Request, res: Response): Promise<void> {
//     //     console.log('Delete Many')
//     //     res.locals = { status: false, message: Messages.FAILED, data: null };
//     //     const verificationBusinessInstance = new VerificationBusiness()
//     //     let { body: { loggedInUser: { _id: loggedInUserId, email: loggedInUserEmail, firstName: loggedInUserfirstName, lastName: loggedInUserlastName } }, query: {skuIds} } = req
//     //     const ip = req.connection.remoteAddress || req.socket.remoteAddress
//
//     //     console.log(skuIds);
//     //     //@ts-expect-error
//     //     skuIds = JSON.parse(skuIds)
//     //     // let SkuIdsString = JSON.stringify(skuIds)
//
//     //     const verify = await verificationBusinessInstance.findOneBB({ userId: loggedInUserId, isVerified: false, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds) }, { createdAt: -1 })   //Todo add Ip here
//     //     if (verify && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
//     //         res.locals = { status: false, message: Messages.OTP_IS_ALREADY_SENT }
//     //     } else {
//     //         let otp = Math.floor(100000 + Math.random() * 900000).toString();
//     //         if (otp.length < 6) otp = otp + "0";
//     //         let lead_mail_body: any = otp
//             // await new BaseHelper().emailSend('otp_mail', { LEAD_BODY: lead_mail_body, NAME: `${loggedInUserfirstName} ${loggedInUserlastName}`, OTP: otp }, loggedInUserEmail)
//     //         const verifyToBeInserted = { userId: loggedInUserId, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds), otp, ip,createdBy: loggedInUserId, updatedBy: loggedInUserId }
//     //         //@ts-expect-error
//     //         const verifyData = verificationBusinessInstance.createBB(verifyToBeInserted)
//     //         if (verifyData) res.locals = {status:true, message: Messages.OTP_SENT_SUCCESSFULLY }
//     //     }
//     //     await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteMany`);
//     // }
//
//     async deleteMany(req: Request, res: Response): Promise<void> {
//         res.locals = { status: false, message: Messages.FAILED, data: null };
//         let { body: { loggedInUser: { _id: loggedInUserId, email: loggedInUserEmail, firstName: loggedInUserfirstName, lastName: loggedInUserlastName } }, mongoSession, query: {skuIds} } = req as RequestWithTransaction
//         const ip = req.connection.remoteAddress || req.socket.remoteAddress;
//         //@ts-expect-error
//         skuIds = JSON.parse(skuIds);
//         let otp = Math.floor(100000 + Math.random() * 900000).toString();
//         if (otp.length < 6) otp = otp + "0";
//         let lead_mail_body: any = otp;
//         let verificationMatch = { userId: loggedInUserId, isVerified: false, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds) };
//         let sendEmail = { LEAD_BODY: lead_mail_body, NAME: `${loggedInUserfirstName} ${loggedInUserlastName}`, OTP: otp };
//         let verifyToBeInserted = { userId: loggedInUserId, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds), otp, ip,createdBy: loggedInUserId, updatedBy: loggedInUserId };
//         let response = await new SkuHistoryRepository().updateMany( sendEmail, verificationMatch, verifyToBeInserted, loggedInUserEmail, mongoSession );
//         res.locals = response;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteMany`);
//     }
//
//     /*async deleteManyVerify(req: Request, res: Response): Promise<void> {
//         res.locals = { status: false, message: Messages.FAILED };
//         const verificationBusinessInstance = new VerificationBusiness()
//         let { body: { loggedInUser: { _id: loggedInUserId } }, query: {skuIds, otp} } = req
//         //@ts-expect-error
//         skuIds = JSON.parse(skuIds)
//         const verify = await verificationBusinessInstance.findOneBB({ userId: loggedInUserId, isActive: true, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds) }, { createdAt: -1 })
//         if (verify && verify.otp == otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
//             //@ts-expect-error
//             let updatedSkuData:any = await new SkuBusiness().updateManyBB({ "_id": skuIds }, { isDeleted: true, isActive: false })
//             if (updatedSkuData.nModified === 0) {
//                 res.locals = { status: false, message: Messages.DELETE_FAILED }
//                 await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteManyByVerify`)
//             }
//             //@ts-expect-error
//             await verificationBusinessInstance.updateManyBB({ _id: verify._id }, { updatedBy: loggedInUserId, isVerified: true, isActive: false })
//             res.locals.status = true
//             res.locals.message = Messages.DELETE_SUCCESSFUL;
//             res.locals.data = updatedSkuData
//         } else {
//             res.locals.message = Messages.INVALID_OTP
//         }
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteManyByVerify`)
//     }*/
//
//     async deleteManyVerify(req: Request, res: Response): Promise<void> {
//         res.locals = { status: false, message: Messages.FAILED };
//         let {query, body: { loggedInUser: { _id: loggedInUserId } }, mongoSession, query: { skuIds, otp } } = req as RequestWithTransaction;
//         let verificationMatch ={ userId: loggedInUserId, isActive: true, operation: 'deleteMany', module: 'sku', data: skuIds };
//         let updateVerification = { updatedBy: loggedInUserId, isVerified: true, isActive: false };
//         let data = await new SkuHistoryRepository().deleteManyVerify(query, verificationMatch, updateVerification, mongoSession );
//         res.locals = data;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteManyByVerify`)
//     }
//
//     // async ledTrigger(req: Request, res: Response): Promise<void> {
//     //     let {body, body:{skuIds,status,comments}, body:{loggedInUser:{_id:loggedInUserId}}} = req
//     //     let iavBusinessInstance = new IavBusiness(), activityBusinessInstance = new ActivityBusiness(), SkuBusinessInstance = new SkuBusiness();
//     //     let actvityInsert: any = []
//     //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
//     //     for (const item of skuIds) {
//     //         // let skuData: ISku = await SkuBusinessInstance.findBB({ skuId: item })
//     //         await new SkuController().createActivity(item, user,body)
//
//     //         // let activityData: any = await activityBusinessInstance.findBB({ skuId: item }, {}, { createdAt: -1 }, Constant.limit, Constant.startIndex, [])
//     //         // delete activityData[0]?._id
//     //         // let iavData: any = await iavBusinessInstance.findBB({ skuId: item }, {}, { createdAt: -1 }, Constant.limit, Constant.startIndex, [])
//     //         // activityData[0].status = status
//     //         // activityData[0].iavId = iavData[0]?._id
//     //         // activityData[0].createdBy = activityData[0].updatedBy = loggedInUserId
//     //         // actvityInsert.push(activityData[0])
//     //     }
//     //     // res.locals.data = await new ActivityBusiness().createBB();
//     //     res.locals.message = Messages.CREATE_SUCCESSFUL;
//     //     await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
//     // }
//
//     async ledTrigger(req: Request, res: Response): Promise<void> {
//         res.locals = {status:false, message: Messages.CREATE_FAILED};
//         let {body, body:{loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction;
//         let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
//         let data = await new SkuHistoryRepository().ledTrigger(body, user, mongoSession);
//         res.locals = data // need to add response of data
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
//     }
//
//
//     /*async groupBy(req: Request, res: Response): Promise<void>
//     {
//         let {body, query:{key}, body:{loggedInUser:{_id:loggedInUserId}}} = req
//         const aggregrate = [{"$group" : {_id: `$${key}`}}]
//         res.locals.data = await new SkuBusiness().aggregateBB(aggregrate);
//         res.locals.message = Messages.CREATE_SUCCESSFUL;
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
//     }*/
//
//
//     // async importData(req: Request, res: Response): Promise<void> {
//     //     let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
//     //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
//     //     let resultData: any = [],count: number = 0,skuIds: any = []
//
//     //     if(body.length>0)
//     //     {
//     //         let company = await new CompanyBusiness().findOneBB({_id: body[0].companyId})
//     //         if(company===undefined ||company===null)
//     //         {
//     //             throw new Error(body[0].companyId+" Invalid Company Id")
//     //         }
//     //     }
//
//     //     const transactionBusinessInstance = new TransactionBusiness()
//     //     let transactionId = "IM-" + new Date().toISOString()
//     //     let rapaport = await new RapPriceBusiness().findBB({},{},{createdAt: -1},Constant.limit,Constant.startIndex,[])
//     //     let transactionMatch = {transactionId, "transactionType": "IMPORT", rapaportDate : rapaport[0].createdAt, status: "Pending"}
//     //     let transaction = await new SkuController().createTransaction(req,res, transactionMatch)
//
//     //     for (let importData of body) {
//
//     //         let cond={};
//     //         //@ts-expect-error
//     //         cond['clientRefId'] = importData.ref;
//     //         //@ts-expect-error
//     //         cond['companyId'] = importData.companyId;
//
//     //         // Need to enable This Validation
//     //        let data: any = await new SkuValidation().skuImpoValidation(importData)
//     //         if(data) {
//     //             importData.error = data;
//     //             importData.importStatus="NOTINSERTED";
//     //             resultData.push(importData)
//     //             continue
//     //         }
//
//     //         await new SkuBusiness().findOneBB(cond).then(async (skuInfinityRefIdData) =>
//     //         {
//     //             if(skuInfinityRefIdData)
//     //             {
//     //                 importData.importStatus="DUPLICATE";
//     //             }
//     //             else
//     //             {
//     //                 importData.stoneType=importData.stoneType.toUpperCase();
//     //                 importData.drv=importData.drv.toString();
//     //                 importData.pwv=importData.pwv.toString();
//     //                 importData.pwvImport=importData.pwv.toString();
//     //                 importData.fixedValueCarat=importData.fixedValueCarat.toString();
//
//     //                 importData.caratWeight = Number(importData.caratWeight);
//     //                 importData.fixedValueCarat = Number(importData.fixedValueCarat.replace(',',''))
//     //                 importData.iav = importData.iav.replace(',','')
//
//     //                 importData.drv = Number(importData.drv.replace(',','')).toFixed(2)
//     //                 importData.pwv = Number(importData.pwv.replace(',','')).toFixed(2)
//     //                 importData.pwvImport = Number(importData.pwvImport.replace(',','')).toFixed(2)
//
//
//     //                 if (importData.lab === "GIA") importData = await new SkuController().checkValidation(importData, user)
//     //                 if (importData.lab === "GIA" && importData.isCalculationValidated) {
//     //                     importData = await new SkuController().createAll(importData, user)
//     //                     importData.importStatus="INSERTED";
//     //                     skuIds.push(importData.skuId)
//
//     //                 }
//     //                 else if (importData.lab === "GIA")
//     //                 {
//     //                     importData.importStatus="NOTINSERTED";
//     //                 }
//     //                 else {
//     //                     importData.isCalculationValidated = false
//     //                     //if (importData.drv !== (importData.caratWeight * importData.fixedValueCarat).toFixed(2)) { notInserted.push(importData); break }
//     //                     //if (importData.pwv !== (importData.pwv + (Number(importData.iav) * importData.drv / 100)).toFixed(2)) { notInserted.push(importData); break }
//     //                     importData.isCalculationValidated = true
//     //                     importData = await new SkuController().createAll(importData, user)
//     //                     importData.importStatus="INSERTED";
//     //                     skuIds.push(importData.skuId)
//     //                 }
//     //             }
//
//     //         })
//
//     //         resultData.push(importData)
//
//     //     }
//     //     transaction.status = "Completed"
//     //     transaction.skuIds = skuIds
//     //     await transactionBusinessInstance.updateManyBB({transactionId},transaction)
//     //      res.locals.data = resultData;
//     //      res.locals.message = Messages.CREATE_SUCCESSFUL;
//     //      await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//
//     // }
//
//     async importData(req: Request, res: Response): Promise<void> {
//         res.locals = { status: true, message: Messages.CREATE_FAILED };
//         let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
//         let user = { createdBy: loggedInUserId, updatedBy: loggedInUserId };
//
//         if (body.length > 0) {
//             let company = await new CompanyBusiness().findOneBB({ _id: body[0].companyId });
//             if (company === undefined || company === null) throw new Error(body[0].companyId + " Invalid Company Id")
//         }
//         body = body.map((obj: any) => {
//             obj.stoneType = obj.stoneType.toUpperCase();
//             obj.drv = obj.drv.toString();
//             obj.pwv = obj.pwv.toString();
//             obj.pwvImport = obj.pwv.toString();
//             obj.fixedValueCarat = obj.fixedValueCarat.toString();
//
//             obj.caratWeight = Number(obj.caratWeight);
//             obj.fixedValueCarat = Number(obj.fixedValueCarat.replace(',', ''));
//             obj.iav = obj.iav.replace(',', '');
//
//             obj.drv = Number(obj.drv.replace(',', '')).toFixed(2);
//             obj.pwv = Number(obj.pwv.replace(',', '')).toFixed(2);
//             obj.pwvImport = Number(obj.pwvImport.replace(',', '')).toFixed(2);
//             return obj
//         });
//         let transactionMatch = { transactionId: "IM-" + new Date().toISOString(), companyId: body[0].companyId, status: "Pending", ...user };
//
//         let data = await new SkuHistoryRepository().import(transactionMatch, body, user, mongoSession);
//         res.locals = { status: true, message: Messages.CREATE_SUCCESSFUL, data };
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//     }
//
//     async createAll (importData: any, user: any): Promise<any|never>{
//         let match = {"lab":importData.lab, "labReportId": importData.reportNumber, "labReportPath": importData.pdf , labReportDate : new Date(importData.reportDate), ...user}
//         let labData: any = await new LabBusiness().createBB(match);
//         importData.labId = labData._id;
//         importData.status='ACTIVE';
//         importData.movementStatus="IMPORTED";
//         let sku = await new SkuHistoryController().createSku(importData, user);
//         importData.skuId = sku._id;
//         // if(importData.lab !== "GIA") importData.clientPriceId = await new SkuController().createClientPrice(importData, user)
//         importData.clientPriceId = await new SkuHistoryController().createClientPrice(importData, user);
//         importData.iavId = await new SkuHistoryController().createIav(importData, user);
//         // importData.activityId = await new SkuController().createActivity(importData, user)
//         let rfid = await  new SkuHistoryController().createRfidTags(importData,user);
//         await new SkuHistoryBusiness().findAndUpdateBB({_id: importData.skuId} , {iavId: importData.iavId, rfId: rfid});
//         return importData
//     }
//
//     async createActivity(skuId: any, user :any,body:any): Promise<any|never> {
//         let activity : IActivity;
//         let skuData: ISku| null = await new SkuHistoryBusiness().findOneBB({_id:skuId});
//         let activityData: any = {...user};
//         activityData.companyId = skuData?.companyId;
//         activityData.skuId = skuData?._id;
//         activityData.labsId = skuData?.labsId;
//         activityData.iavId = skuData?.iavId;
//         activityData.userId = user.createdBy;
//         activityData.status = body.status;
//         activityData.dmId = "5f59cf450cd8132b8cae1c48";
//         if(body?.comments) activityData.comments = body.comments;
//         if(skuData) await new ActivityBusiness().createBB(activityData);
//         // return activity._id
//     }
//
//     async createClientPrice(body: any, user :any): Promise<any|never> {
//         let clientPriceData : any = {...user};
//         clientPriceData.companyId = body.companyId;
//         clientPriceData.skuId = body.skuId;
//         clientPriceData.shape = body.shape;
//         clientPriceData.clarity = body.clarity;
//         clientPriceData.color = body.color;
//         clientPriceData.weight =  body.caratWeight;
//         console.log(body.fixedValueCarat);
//         clientPriceData.price = Number(body.fixedValueCarat);
//         clientPriceData.pwvImport=Number(body.pwvImport);
//         let clientPrice: any = await new ClientPriceBusiness().createBB(clientPriceData);
//         return clientPrice._id
//     }
//
//     async createSku(body: any, user :any): Promise<any|never> {
//         let skuData: any = {...user};
//
//         let populate = [{path: 'addressId'}];
//         let company = await new CompanyBusiness().findOneBB({_id: body.companyId}, {}, populate);
//         console.log(company);
//         // @ts-ignore
//         let companyName = company.name.slice(0, 3).toUpperCase();
//         console.log(companyName);
//         //@ts-expect-error
//         let companyLoc = company.addressId.address1.slice(0,3).toUpperCase();
//         console.log(companyLoc);
//         //@ts-expect-error
//         let companyId = company._id.toString().slice(0,6).toUpperCase();
//         console.log(companyId);
//         let CompanyTotalCount = await new CompanyBusiness().findCountBB()+1;
//         let InfinityTotalCount = await new IavBusiness().findCountBB()+1;
//         let YYMM = new Date().getFullYear().toString().slice(2,4) + ("0" + new Date().getMonth().toString());
//
//         let infinityRefId =  YYMM +"-" + companyId + "-" + companyName+ "-"  + companyLoc + "-" + CompanyTotalCount+ "-"+InfinityTotalCount;
//         console.log(infinityRefId);
//
//         skuData.labsId = [body.labId];
//         skuData.companyId = body.companyId;
//         skuData.companyId = body.companyId;
//         skuData.clientRefId = body.ref;
//         skuData.infinityRefId = infinityRefId;
//         skuData.infinityShape = body.shape;
//         skuData.clientShape = body.shape;
//         skuData.labShape = body.shape;
//         //skuData.shape = body.shape;
//         skuData.weight = body.caratWeight;
//         skuData.colorCategory = body.color;
//         skuData.colorSubCategory = body.color;
//         skuData.gradeReportColor = body.color;
//         skuData.colorRapnet = body.color;
//         skuData.clarity = body.clarity;
//         skuData.measurement = body.measurement;
//         skuData.colorType = body.stoneType;
//         skuData.status = body.status;
//         skuData.movementStatus = body.movementStatus;
//         skuData.dmGuid = faker.random.alphaNumeric(5);
//         skuData.pwvImport = body.pwvImport;
//         let sku: any = await new SkuHistoryBusiness().createBB(skuData);
//         return sku
//     }
//
//     async checkValidation(body: any, user: any): Promise<any | never> {
//         body.isCalculationValidated = true;
//         body.caratWeight = Number(body.caratWeight);
//         if(body.stoneType=='White')
//         {
//             if(body.caratWeight > 5) body.caratWeight = 5.00;
//             if(body.shape!=='Round')
//             {
//                 body.shape='Pear';
//             }
//             /* let match = {
//                  'weightRange.fromWeight': { '$lte': body.caratWeight }, 'weightRange.toWeight': { '$gte': body.caratWeight },
//                  'shape': body.shape, 'clarity': body.clarity, 'color': body.color
//              }*/
//             /*let price: any = await new RapPriceBusiness().aggregateBB([
//                 {'$match': {'weightRange.fromWeight': {'$lte': body.caratWeight }, 'weightRange.toWeight': {'$gte': body.caratWeight }, shape, clarity, color}},
//                 {'$sort': {'_id': -1}}, {'$limit': 1}])*/
//             let price: any =await new RapPriceBusiness().aggregateBB([
//                 {'$match': {'weightRange.fromWeight': {'$lte': body.caratWeight}, 'weightRange.toWeight': {'$gte': body.caratWeight}, 'shape': body.shape, 'clarity': body.clarity, 'color': body.color}},
//                 {'$sort': {'_id': -1}}, {'$limit': 1}]);
//
//             console.log(body.rap +"=="+ price[0]?.price);
//             if (body.rap !== price[0]?.price) return body;
//             if (body.drv !== (body.caratWeight * price[0]?.price).toFixed(2)) return body;
//             if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) return body;
//           //  body.isCalculationValidated = true
//             body.priceId = price[0]?._id
//         }
//         else
//         {
//             console.log(body.drv +"!=="+(body.caratWeight * body.fixedValueCarat).toFixed(2));
//             if (body.drv !== (body.caratWeight * body.fixedValueCarat).toFixed(2)) return body;
//             if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) return body
//             //body.isCalculationValidated = true
//         }
//
//         return body
//     }
//
//     async createIav(body: any ,user :any): Promise<any|never> {
//         let iavData: any = {...user};
//         if(body.rapPriceId)iavData.rapPriceId =  body.rapPriceId;
//         if(body.clientPriceId)iavData.clientPriceId =  body.clientPriceId;
//         iavData.iav = Number(body.iav.replace(',','')).toFixed(5);
//         iavData.drv = Number(body.drv.replace(',','')).toFixed(2);
//         iavData.pwv = Number(body.pwv.replace(',','')).toFixed(2);
//         iavData.skuId = body.skuId;
//         iavData.iavAverage = Number(body.iav);
//         let iav: any = await new IavBusiness().createBB(iavData);
//         return iav._id
//     }
//
//     async createRfidTags(body: any ,user :any): Promise<any|never> {
//         let rfidData: any = {...user};
//         rfidData.skuId = body.skuId;
//         rfidData.rfid = body.tag;
//         console.log(rfidData);
//         let rfId: any = await new RfidBusiness().createBB(rfidData);
//         return rfId._id
//     }
//
//     async createTransaction(req: Request, res: Response ,match :any): Promise<any|never> {
//         let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req;
//         let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
//         let transactionBusinessInstance = new TransactionBusiness();
//         let transactionBody = {...match, ...user};
//         let transaction: any = await transactionBusinessInstance.createBB(transactionBody);
//         //res.locals.data = transaction
//        // res.locals.message = Messages.CREATE_SUCCESSFUL;
//         //await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
//         return transaction
//     }
//
//     async skuExportExcel(req: Request, res: Response): Promise<void> {
//         let workbook = new Excel.Workbook();
//         let { data, page }: any = await new SkuHistoryRepository().index(req.query as any)
//         let headerData = [{ name: 'Infinity #', filterButton: true }, { name: 'Movement Status', filterButton: true }, { name: "Company", filterButton: true }, { name: "Weight", filterButton: true }, { name: "Shape", filterButton: true }, { name: "ColorType", filterButton: true }, { name: "Clarity", filterButton: true },{ name: "Cut", filterButton: true },{ name: "RFID", filterButton: true }, { name: "Rap price", filterButton: true },{ name: "V/C", filterButton: true }, { name: "DRV", filterButton: true },{ name: "IAV", filterButton: true },{ name: "DmGuid", filterButton: true }, { name: "Tag #", filterButton: true },{ name: "Lab", filterButton: true },{ name: "Lab ReportId", filterButton: true }, { name: 'Pwv', filterButton: true }]
//         let requiredData = [];
//         let arr: any[] = []
//         for (let i = 0; i < data.length; i++) {
//             let vcValue = (data[i]?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
//             arr = [
//             data[i].infinityRefId,data[i].movementStatus,data[i].companyId?.name,data[i].weight, data[i].shape, data[i].colorType, data[i].clarity,data[i].cut,data[i].rfId?.rfid,data[i].iavId?.rapPriceId?.price,'$ '+vcValue,data[i].iavId?.drv,data[i].iavId?.iav, data[i].dmGuid,data[i].tagId, data[i].labsId?.lab,data[i].labsId?.labReportId,data[i].iavId?.pwv]
//             requiredData.push(arr);
//         }
//
//         let worksheet = workbook.addWorksheet('Sku Export')
//         await new SkuHistoryBusiness().createTable(worksheet, headerData, requiredData);
//         let fileName = 'SkuExport.xlsx';
//         let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`));
//         res.download(path.join(__dirname, `${fileName}`), (err) => {
//             if (err) {
//                 { res.status(400).json({ status: 400, success: false, message: err }) }
//                 console.log("DownloadError", err);
//             }
//         })
//     }
//
//     async skuAssetDetail(req: Request, res: Response): Promise<void> {
//         let { query: { _id } } = req;
//         let populate = [{ path: 'labsId' }, {
//             path: 'iavId', populate: [
//                 {
//                     path: 'rapPriceId',
//                     model: 'RapPrice'
//                 },
//                 {
//                     path: 'clientPriceId',
//                     model: 'ClientPrice'
//                 }]
//         }, { path: 'rfId' }];
//         let summaryObj: any = {}, iavHistory: any = {}, lastDMObj: any = {};
//         let skuData: any = await new SkuHistoryBusiness().findOneBB({ _id: _id, isDeleted: false }, {}, populate);
//         //console.log("===========Sku",skuData);
//         if (!skuData) res.locals = { status: false, message: Messages.NO_SKU_DATA };
//         else {
//             let [alertCount, movementCount, iavHistory, lastDMObj, lastDiamondMatch, collateralAdded, lastInspection] = await Promise.all([
//                 new AlertBusiness().findCountBB({ skuId: _id, isDeleted: false }),
//                 new ActivityBusiness().findCountBB({ skuId: _id, isDeleted: false }),
//                 new IavBusiness().findBB({ skuId: _id }, {}, { createdAt: -1 }, 5, 0, [{ path: "rapPriceId" }, { path: "clientPriceId" }]),
//                 new DiamondMatchBusiness().findOneBB({ skuId: _id, isDeleted: false }, { createdAt: -1 }, [], { status: 1, createdAt: 1 }),
//                 new ActivityBusiness().findOneBB({ skuId: _id, status: "MATCHED", isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 }),
//                 new ActivityBusiness().findOneBB({ skuId: _id, status: "COLLATERAL_ADDED", isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 }),
//                 new ActivityBusiness().findOneBB({ skuId: _id, status: "TRANSIT", isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 }),
//             ]);
//             console.log("lastDM==>", lastDMObj);
//             skuData.lastDiamondMatch = lastDMObj;
//             skuData.summary = { alertCount, movementCount }; //summaryObj
//             skuData.priceHistory = iavHistory;
//             skuData.currentStatus = { lastDiamondMatch, collateralAdded, lastInspection };
//             res.locals.data = skuData;
//             res.locals.message = Messages.FETCH_SUCCESSFUL;
//         }
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.skuAssetDetail`);
//     }
//
//     async unReferencedAssets(req: Request, res: Response): Promise<void> {
//         let data = await new SkuHistoryRepository().unReferencedAssets();
//         res.locals = {status:true, message: Messages.FETCH_SUCCESSFUL, data};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.unReferencedAssets`);
//     }
//
//     async updateCollateral(req: Request, res: Response): Promise<void> {
//         res.locals = {status: false, message: Messages.UPDATE_FAILED};
//         let {body, body:{skuIds, isCollateral,loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction;
//         let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
//         let updateSku = {"isCollateral": body.isCollateral, updatedBy: loggedInUserId };
//         let data = await new SkuHistoryRepository().updateCollateral(body, updateSku, user, mongoSession);
//         res.locals = {status:true, message: Messages.UPDATE_SUCCESSFUL, data: skuIds.length};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.updateCollateral`);
//     }
//
//     async filter(req: Request, res: Response): Promise<void> {
//         res.locals = {status: false, message: Messages.FETCH_FAILED};
//         let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
//         let data = await new SkuHistoryRepository().filter(loggedInUserId);
//         if (data) {
//             data.labs = [].concat.apply([], data.labs);
//             data.labs = [...new Set(data.labs.map((labData: any) => labData.lab))];
//             data.weight = { max: Math.max(...data.uniqueWeight), min: Math.min(...data.uniqueWeight), values: data.uniqueWeight.sort((n1: number, n2: number) => n1 - n2) };
//             data.iav = { max: Math.max(...data.uniqueIav), min: Math.min(...data.uniqueIav), values: data.uniqueIav.sort((n1: number, n2: number) => n1 - n2) };
//             data.pwv = { max: Math.max(...data.uniquePwv), min: Math.min(...data.uniquePwv), values: data.uniquePwv.sort((n1: number, n2: number) => n1 - n2) };
//             data.drv = { max: Math.max(...data.uniqueDrv), min: Math.min(...data.uniqueDrv), values: data.uniqueDrv.sort((n1: number, n2: number) => n1 - n2) };
//             let rapPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueRapPrices.sort((n1: number, n2: number) => n1 - n2) };
//             data.price = { rapPrice };
//             let clientPrice = { max: Math.max(...data.uniqueRapPrices), min: Math.min(...data.uniqueRapPrices), values: data.uniqueClientPrices.sort((n1: number, n2: number) => n1 - n2) };
//             data.price = { ...data.price, clientPrice };
//             data.dmStatus = ["MATCHED", "NOTMATCHED"];
//             delete data.uniqueWeight;
//             delete data.uniqueIav;
//             delete data.uniquePwv;
//             delete data.uniqueDrv;
//             delete data.uniqueClientPrices;
//             delete data.uniqueRapPrices
//         }
//         res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
//     }
//
//     async getSkuByTag(req: Request, res: Response): Promise<void> {
//         res.locals = {status: false, message: Messages.FETCH_FAILED};
//         let data = await new SkuHistoryRepository().getByTag(req.query.tagNo);
//         res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.getSkuByTag`);
//     }
//
//     async getSkuFromTime(req: Request, res: Response): Promise<void> {
//         res.locals = {status: false, message: Messages.FETCH_FAILED};
//         let data = await new SkuHistoryRepository().getSkuFromTime( req.query.date);
//         console.log(data.length);
//         res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
//         await JsonResponse.jsonSuccess(req, res, `{this.url}.getSkuFromTime`);
//     }
// }