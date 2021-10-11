import {Application, Handler, Request, RequestHandler, Response} from "express";
import {BaseController} from "../BaseController";
import {JsonResponse, TryCatch} from "../../helper";
import SkuBusiness from "./sku.business";
import {guard} from "../../helper/Auth";
import {IReqChangeInfinityPrice, ISku, skuCollateralStatusEnum, skuColorTypeEnum, skuDmStatusEnum} from "./sku.types";
import {Constant, Messages, Texts} from "../../constants";
import CompanyBusiness from "../company/company.business";
import {ILab} from "../lab/lab.types";
import LabBusiness from "../lab/lab.business";
import {SkuValidation} from "./sku.validation";
import RapPriceBusiness from "../rap-price/rap-price.business";
import AlertBusiness from "../alert/alert.business";
import ActivityBusiness from "../activity/activity.business";
import faker from 'faker'
import XLSX from 'xlsx';
import FileUploadHistoryBusiness from "../file-upload-history/file-upload-history.business";
import * as Excel from 'exceljs'
import path from 'path'
import IavBusiness from "../iav/iav.business";
import ClientPriceBusiness from "../client-price/client-price.business";
import RfidBusiness from "../rfid/rfid.business";
import TransactionBusiness from "../transaction/transaction.business";
import {SkuRepository} from "./sku.repository";
import {IActivity} from "../activity/activity.types";
import DiamondMatchBusiness from "../diamond-match/diamond-match.business"
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import {ICounter} from "../baseTypes";
import rfidModel from "../rfid/rfid.model";
import deviceModel from "../device/device.model";
import {devices} from "../../socket"
import {ErrorCodes} from "../../constants/ErrorCodes";
import companyModel from "../company/company.model";
import {BaseHelper} from "../BaseHelper";
import { ITransactionImport } from "../transaction/import/import.types";
import skuModel from "./sku.model";
import labModel from "../lab/lab.model";
import iavModel from "../iav/iav.model";
import activityModel from "../activity/activity.model";
import transactionImportModel from "../transaction/import/import.model";
import transactionModel from "../transaction/transaction.model";
import diamondMatchRuleModel from "../diamond-match-rule/diamond-match-rule.model";
import diamondMatchModel from "../diamond-match/diamond-match.model";
import settingModel from "../setting/setting.model";
import bcrypt from "bcrypt";
import {ISetting} from "../setting/setting.types";
import { IComment } from "../comment/comment.types";
import loanModel from "../loan/loan.model";
import { disPlayConfigindex } from "../../helper/displayConfigData";    //Todo fix typo
import lo from "lodash"
import infinityPriceNewModel from "../infinity-price-new/infinity-price-new.model";
import clientPriceModel from "../client-price/client-price.model";
import caratMasterModel from "../infinity-price/master/carat-master/carat-master.model";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import mongoose from 'mongoose';
import clarityMasterModel from "../infinity-price/master/clarity-master/clarity-master.model";
import colorMasterModel from "../infinity-price/master/color-master/color-master.model";
import rapPriceModel from "../rap-price/rap-price.model";
import infinityPriceMasterModel from "../infinity-price/master/infinity-price-master/infinty-price-master.model";
import session from "express-session";
import { TransactionImportRepository } from "../transaction/import/import.repository";
import skuInfinityPriceModel from "../sku-infinity-price/sku-infinity-price.model";

export class SkuController extends BaseController<ISku> {
    constructor() {
        super(new SkuBusiness(), "sku", true, new SkuRepository());
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/sku', guard, this.router)

    init() {
        const transaction: MongooseTransaction = new MongooseTransaction();
        const validation: SkuValidation = new SkuValidation();
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.post("/", validation.createSku, TryCatch.tryCatchGlobe(this.create));
        this.router.put("/", validation.updateSku, TryCatch.tryCatchGlobe(this.update));
        this.router.put("/sku-lab-update", validation.skuLabUpdate, transaction.startTransaction, TryCatch.tryCatchGlobe(this.skuLabUpdate));  //Todo add validation here.
        this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/count", TryCatch.tryCatchGlobe(this.counterBC));
        this.router.post("/change-dmStatus-completed", validation.changeDmStatus, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.changeDmStatus));
        // this.router.get("/counter", TryCatch.tryCatchGlobe(this.counter));   //Todo fix this and optimize it, running multiple queries.

        // this.router.post("/import", Upload.uploadFile('/uploads/sku/import/excel').single('file'), guard, TryCatch.tryCatchGlobe(this.import));
        this.router.post("/duplicateimport", validation.importSku, TryCatch.tryCatchGlobe(this.duplicateImport));
        this.router.post("/move-to-collateral", validation.moveToCollateralSku, TryCatch.tryCatchGlobe(this.moveToCollateral));
        this.router.put("/status", validation.skuStatusValidation, transaction.startTransaction, TryCatch.tryCatchGlobe(this.updateStatus));
        this.router.get("/faker",TryCatch.tryCatchGlobe(this.generateFaker));
        this.router.delete("/import-drop", validation.importDrop, TryCatch.tryCatchGlobe(this.importDrop));
        this.router.get("/summary",TryCatch.tryCatchGlobe(this.exportReport));
        this.router.delete("/deleteMultipleVerify", transaction.startTransaction, validation.MultipleDeleteVerifyValidation,TryCatch.tryCatchGlobe(this.deleteManyVerify));
        this.router.post("/import", transaction.startTransaction,TryCatch.tryCatchGlobe(this.importData));
        this.router.post("/ledTrigger", transaction.startTransaction, validation.ledTrigger, TryCatch.tryCatchGlobe(this.ledTrigger));
        this.router.delete("/deleteMultiple", transaction.startTransaction, TryCatch.tryCatchGlobe(this.deleteMany));
        this.router.get("/group-by", TryCatch.tryCatchGlobe(this.groupBy));
        this.router.get("/exportExcel",TryCatch.tryCatchGlobe(this.skuExportExcel));
        this.router.get("/assetDetail",TryCatch.tryCatchGlobe(this.skuAssetDetail));
        this.router.get("/unreferenced/assets",TryCatch.tryCatchGlobe(this.unReferencedAssets));
        this.router.post("/update-collateral", validation.updateCollateralValidation, transaction.startTransaction, TryCatch.tryCatchGlobe(this.updateCollateral));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter));
        this.router.put("/4c-update", validation.c4Edit, transaction.startTransaction, TryCatch.tryCatchGlobe(this.c4Edit));
        this.router.get("/get-by-tag", validation.getSkuByTag, TryCatch.tryCatchGlobe(this.getSkuByTag));
        this.router.get("/getSkuByDateAndTime", validation.getSkuFromTime, TryCatch.tryCatchGlobe(this.getSkuFromTime))
        this.router.put("/remove/collateral", transaction.startTransaction, validation.removeCollateral, TryCatch.tryCatchGlobe(this.removeCollateral))
        this.router.put("/updateStatusByTagNo", TryCatch.tryCatchGlobe(this.updateStatusWithTag))
        this.router.get("/count-by-companyId", validation.countByCompanyId, TryCatch.tryCatchGlobe(this.countByCompanyId));
        this.router.post("/send-email", validation.senEmail, TryCatch.tryCatchGlobe(this.sendEmail));
        this.router.put("/updateGemlogistStatus", MongooseTransaction.startTransactionNew, validation.updateGemlogistStatus, TryCatch.tryCatchGlobe(this.updateGemLogistStatus))   //Todo fix typo
        this.router.put("/stoneStatus", validation.updateStoneStatus, transaction.startTransaction, TryCatch.tryCatchGlobe(this.updateStoneStatus));
        this.router.get("/export/template", TryCatch.tryCatchGlobe(this.importTemplate));
        this.router.post('/change-infinity-price', validation.changeInfinityPrice, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.changeInfinityPrice))
        this.router.put('/dmStatus', validation.updateDmStatus, MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.updateDmStatus))
        this.router.put('/dmGuidTransation',  MongooseTransaction.startTransactionNew, TryCatch.tryCatchGlobe(this.updateDmGuidTransaction))

    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {data, page, header}: any = await new SkuRepository().index(req.query);
        res.locals = {status: true, page, header, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
    }

    async changeDmStatus(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {mongoSessionNew: mongoSession, body: {newData, loggedInUser:{_id:loggedInUserId}}} = req as any;
        await mongoSession.withTransaction(async() => await new SkuRepository().changeDmStatus(newData, skuDmStatusEnum.COMPLETED, loggedInUserId, mongoSession))
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.changeDmStatus`);
    }

    async countByCompanyId(req: Request, res: Response): Promise<void> { //Todo create validation companyId required.
        res.locals = {status: false, message: Messages.FETCH_FAILED}   //Todo fix this later temp api and make it permanent
        if (req?.body?.loggedInUser?.roleName !== Texts.SPACECODEADMIN) req.query.companyId = req?.body?.loggedInUser?.companyId
        const {query: {count, companyId}} = req
        let counter: string | ICounter[] = count as string
        if (counter?.length && counter[0] === '[' && counter[counter.length - 1] === ']') {
            counter = counter.replace(/'/g, '"');
            counter = await JSON.parse(counter) as ICounter[]
            //@ts-expect-error
            const data = await new SkuRepository().countByCompanyId(req.query, counter, companyId)
            res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.counterBC`)
    }

    
    changeInfinityPrice: RequestHandler<any, any, IReqChangeInfinityPrice, any> = async(req, res) => {
        //@ts-expect-error
        const {body: {newData, loggedInUser:{_id:loggedInUserId}}, mongoSessionNew: session} = req
        await session.withTransaction(async() => new SkuRepository().changeInfinityPrice(newData, loggedInUserId, session))
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.changeInfinityPrice`);
    }

    async importDrop(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let skuToDelete: string[] = [], labsToDelete: string[] = []
        const {query: {companyId, password}} = req as any;
        const [settingPassword, skus]  = await Promise.all([
            await settingModel.findOne({isDeleted: false}).select('masterPassword').lean(),
            await skuModel.find({companyId}).select('labsId').lean()
        ])
        if(!settingPassword) throw 'Invalid Settings'
        skus.forEach(sku => {
            skuToDelete.push(sku._id)
            labsToDelete.push(...sku.labsId)
        })
        const passwordValid = bcrypt.compareSync(password, settingPassword?.masterPassword!)
        if(!passwordValid) throw 'Invalid Password.'
        if(companyId){
            await Promise.all([
                await skuModel.deleteMany({companyId}), await rfidModel.deleteMany({skuId: {'$in': skuToDelete}}),
                await labModel.deleteMany({_id: {$in: labsToDelete}}), await iavModel.deleteMany({skuId: {'$in': skuToDelete}}),
                await activityModel.deleteMany({companyId}), await transactionImportModel.deleteMany({companyId}),
                await transactionModel.deleteMany({skuIds: skuToDelete}), await diamondMatchRuleModel.deleteMany({companyId}),
                await diamondMatchModel.deleteMany({skuId: {'$in': skuToDelete}}), await loanModel.deleteMany({companyId})
            ])
        }
        else {
            await Promise.all([
                await skuModel.deleteMany({}), await rfidModel.deleteMany({}),
                await labModel.deleteMany({}), await iavModel.deleteMany({}),
                await activityModel.deleteMany({}), await transactionImportModel.deleteMany({}),
                await transactionModel.deleteMany({}), await diamondMatchRuleModel.deleteMany({}),
                await diamondMatchModel.deleteMany({}), await loanModel.deleteMany({})
            ])
        }
        res.locals = {status: true, message: 'Drop Successfully'};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.importDrop`);
    }

    async c4Edit(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        const {body, mongoSession, body: {_id, loggedInUser:{_id:loggedInUserId}}} = req as any;
        body.updatedBy = loggedInUserId
        const data = await new SkuRepository().c4Edit(body, mongoSession);
        res.locals = {status: true, data, message: Messages.UPDATE_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.c4Edit`);
    }

    async groupBy(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        //@ts-expect-error
        let {query: {key, companyId}}: {query: {key: string, companyId: string}} = req;
        key = key.replace(/'/g, '"');
        // @ts-expect-error
        key = await JSON.parse(key) as String[];
        // @ts-expect-error
        const data = await new SkuRepository().groupBy(key, companyId);
        res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.groupBy`);
    }

    counter = async (req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, message: Messages.FETCH_FAILED}
        const {query:{count}} = req
        let counter: string|ICounter[] = count as string
        if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']') {
            counter = counter.replace(/'/g, '"');
            counter = await JSON.parse(counter) as ICounter[]
            const data = await new SkuRepository().counter(counter);
            res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.counterBC`)
    }

    async find(req: Request, res: Response): Promise<any> {   //Todo fix function return Promise.
        /*let {query} = req
        let data = await new SkuRepository().index(query)
        res.locals.data = data
        res.locals.message = Messages.FETCH_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);*/
        const populate = [{path: 'labsId'}, {path: 'companyId'}, {path: 'createdBy'}, {path: 'updatedBy'},
            {path:'iavId',populate: [{path: 'rapPriceId', model: 'RapPrice'},{path: 'clientPriceId', model: 'ClientPrice'}] }];
        await new SkuController().findBC(req, res, populate)
    }

    async create(req: Request, res: Response): Promise<void> {
        const LabBusinessInstance = new LabBusiness();
        //@ts-expect-error
        let {body, body:{comments, labsId, companyId, infinityRefId,  loggedInUser:{_id:loggedInUserId}}} : {body: ISku} = req;
        await new SkuBusiness().findOneBB({infinityRefId}).then((skuInfinityRefIdData => {if(skuInfinityRefIdData) throw new Error("Duplicate infinityRefId")}));
        body.createdBy = body.updatedBy = loggedInUserId;
        comments.forEach(comment => comment.createdBy = loggedInUserId);
        let labsData = labsId.map(labId => LabBusinessInstance.findIdByIdBB(labId));
        await Promise.all(labsData).then(labsData => labsData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) );
        await new CompanyBusiness().findIdByIdBB(companyId).then(companyIdData => {if(!companyIdData?._id) throw new Error("Invalid companyId")});
        //@ts-expect-error
        body.movementStatus = 'INVENTORY';
        res.locals.data = await new SkuBusiness().createBB(body);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }

    async update(req: Request, res: Response): Promise<void> {
        const LabBusinessInstance = new LabBusiness();
        //@ts-expect-error
        let {body, body:{_id, comments, labsId, companyId, loggedInUser:{_id:loggedInUserId}}} : {body: ISku} = req;
        body.updatedBy = loggedInUserId;
        comments.forEach(comment => comment.createdBy = loggedInUserId);
        let labsData = labsId.map(labId => LabBusinessInstance.findIdByIdBB(labId));
        await Promise.all(labsData).then(labsData => labsData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) );
        await new CompanyBusiness().findIdByIdBB(companyId).then(companyIdData => {if(!companyIdData?._id) throw new Error("Invalid companyId")});
        res.locals.data = await new SkuBusiness().findAndUpdateBB({_id}, body);
        res.locals.message = Messages.UPDATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async skuLabUpdate(req: Request, res: Response): Promise<void> {
        const {body, mongoSession} = req as RequestWithTransaction
        const data = await new SkuRepository().skuLabUpdate(body, mongoSession);
        res.locals.data = data
        res.locals.message = Messages.UPDATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.update`);
    }

    async import(req: Request, res: Response): Promise<void> {
        const {_id} = req.body.loggedInUser;
        //@ts-expect-error
        await new FileUploadHistoryBusiness().createBB({fileName: req.file.filename, createdBy: _id, updatedBy: _id});
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        //@ts-expect-error
        let file: any = await new XLSX.readFile(req.file.path);
        console.log(file,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        let sheet = file.Sheets[0];
        // let limit = file.Sheets.sheet['!ref']
        // limit = limit.split(':')
        // const row = limit[1][0]
        // const col = limit[1][1]
        let rowData = [];
        // console.log(file.Sheets.Feuil1, "==================", row, col)
        // console.log(file.Sheets.Feuil1.A1.v, "==================")
        // rowData.push(file.Sheets.Feuil1.A1.v)
        // rowData.push(file.Sheets.Feuil1.B1.v)
        // rowData.push(file.Sheets.Feuil1.C1.v)
        // rowData.push(file.Sheets.Feuil1.D1.v)
        // rowData.push(file.Sheets.Feuil1.E1.v)
        // rowData.push(file.Sheets.Feuil1.F1.v)
        // rowData.push(file.Sheets.Feuil1.G1.v)
        // rowData.push(file.Sheets.Feuil1.H1.v)
        // rowData.push(file.Sheets.Feuil1.I1.v)
        // rowData.push(file.Sheets.Feuil1.J1.v)
        // rowData.push(file.Sheets.Feuil1.K1.v)
        // // rowData.push(file.Sheets.Feuil1.L1.v)
        // // rowData.push(file.Sheets.Feuil1.M1.v)
        // // rowData.push(file.Sheets.Feuil1.N1.v)
        // rowData.push(file.Sheets.Feuil1.O1.v)
        // rowData.push(file.Sheets.Feuil1.P1.v)
        // rowData.push(file.Sheets.Feuil1.Q1.v)
        // rowData.push(file.Sheets.Feuil1.R1.v)
        // rowData.push(file.Sheets.Feuil1.S1.v)
        // rowData.push(file.Sheets.Feuil1.T1.v)
        // console.log(file.Sheets.Feuil1.I1['v'],'>>>>>>>>>>>>>>>')
        let newData = []
        // for(let i=2; i<=col; i++){
        //     // console.log('???????????????????????????')
        //     const create = {
        //         infinity_ref_id: file.Sheets.Feuil1[`A${i}`]?.v,
        //         tag_id: file.Sheets.Feuil1[`B${i}`]?.v,
        //         shape: file.Sheets.Feuil1[`C${i}`]?.v,
        //         measurement: file.Sheets.Feuil1[`D${i}`]?.v,
        //         weight: file.Sheets.Feuil1[`E${i}`]?.v,
        //         color_rapnet: file.Sheets.Feuil1[`F${i}`]?.v,
        //         clarity: file.Sheets.Feuil1[`G${i}`]?.v,
        //         cut: file.Sheets.Feuil1[`H${i}`]?.v,
        //         polish: file.Sheets.Feuil1[`I${i}`]?.v,
        //         symmetry: file.Sheets.Feuil1[`J${i}`]?.v,
        //         fluorescence: file.Sheets.Feuil1[`K${i}`]?.v,
        //         price: file.Sheets.Feuil1[`O${i}`]?.v,
        //         vnc: file.Sheets.Feuil1[`P${i}`]?.v,
        //         discount: file.Sheets.Feuil1[`Q${i}`]?.v,
        //         pwp: file.Sheets.Feuil1[`R${i}`]?.v,
        //         rfid: file.Sheets.Feuil1[`S${i}`]?.v,
        //         total: file.Sheets.Feuil1[`T${i}`]?.v
        //     }
        //     newData.push(create)
        // }
        // console.log(rowData)
        res.locals.data = file;
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
    }

    // async import(req: Request, res: Response): Promise<void> {
    //     const LabBusinessInstance = new LabBusiness();
    //     const SkuBusinessInstance = new SkuBusiness()
    //     const CompanyBusinessInstance = new CompanyBusiness()
    //     const RapPriceBusinessInstance = new RapPriceBusiness()
    //     let {body:{skus, loggedInUser:{_id:loggedInUserId}}} : {body:{skus:ISku[], loggedInUser:any}} = req
    //     let duplicateSkus: ISku[] = [], skusToInsert: ISku[] = [], labsIdData: Promise<ILab|null>[] = []
    //     let skusData = skus.map(async sku => {
    //         const skuInfinityRefIdData = await SkuBusinessInstance.findOneBB({infinityRefId: sku.infinityRefId})
    //         if (skuInfinityRefIdData) duplicateSkus.push(sku)
    //         else {
    //             sku.createdBy = sku.updatedBy = loggedInUserId
    //             sku.comments.forEach(comment => comment.createdBy = loggedInUserId)
    //             sku.labsId.map(labId => labsIdData.push(LabBusinessInstance.findIdByIdBB(labId)))
    //             await CompanyBusinessInstance.findIdByIdBB(sku.companyId).then(company => {if(!company?._id) throw new Error("Invalid companyId")})
    //             skusToInsert.push(sku)
    //         }
    //     })
    //     await Promise.all(skusData)
    //     await Promise.all(labsIdData).then(labsIdData => labsIdData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) )
    //     let data = await SkuBusinessInstance.createBB(skusToInsert)
    //     res.locals.data = {duplicateSkus, data}
    //     res.locals.message = Messages.CREATE_SUCCESSFUL;
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
    // }

    async duplicateImport(req: Request, res: Response): Promise<void> {
        const SkuBusinessInstance = new SkuBusiness();
        const LabBusinessInstance = new LabBusiness();
        const CompanyBusinessInstance = new CompanyBusiness();
        let {body:{skus, loggedInUser:{_id:loggedInUserId}}} : {body:{skus:ISku[], loggedInUser:any}} = req;
        let skusToInsert: Promise<ISku|null>[] = [], labsIdData: Promise<ILab|null>[] = [];
        let skusData = skus.map(async sku => {
            sku.createdBy = sku.updatedBy = loggedInUserId;
            sku.comments.forEach(comment => comment.createdBy = loggedInUserId);
            sku.labsId.map(labId => labsIdData.push(LabBusinessInstance.findIdByIdBB(labId)));
            await CompanyBusinessInstance.findIdByIdBB(sku.companyId).then(company => {if(!company?._id) throw new Error("Invalid companyId")});
            skusToInsert.push(SkuBusinessInstance.updateManyBB({infinityRefId: sku.infinityRefId}, sku))
        });
        await Promise.all(skusData);
        await Promise.all(labsIdData).then(labsIdData => labsIdData.forEach(lab => {if(!lab?._id) throw new Error("Invalid labsId")}) );
        res.locals.data = await Promise.all(skusToInsert);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
    }

    async moveToCollateral(req: Request, res: Response): Promise<void|any> {
        let {body, body:{skuIds, transactionId, loggedInUser:{_id:loggedInUserId, companyId}}} : {body:{skuIds:ISku['_id'][], transactionId: ITransactionImport['transactionId'], loggedInUser:any}} = req
        const SkuBusinessInstance = new SkuBusiness();
        const {mongoSession} = req as RequestWithTransaction
        let populate = [{path: "rfId"}];
        let tagNos: any = []
        const skuIdsData = skuIds.map(SkuId => SkuBusinessInstance.findOneBB({ _id: SkuId }, {}, populate));  //Todo optimize this and use in condition.
        await Promise.all(skuIdsData).then(skuIdsData => skuIdsData.forEach(sku =>
        {
            console.log(sku);
            
            if(!sku?._id) throw new Error("Invalid SkuIds");
            if(sku.collateralStatus === "COLLATERAL IN")
            {
                throw new Error("stones already moved to collateral")
            }
            if(sku.stoneRegistration)
            {
                if(!sku?.dmGuid) throw new Error("stones not yet registered")
            }
            //@ts-expect-error
            tagNos.push(sku?.rfId?.rfid)
        }));
        
        const skuChangeMovementStatus = skuIds.map(async skuId => {
            let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
            let data = await new SkuRepository().createActivity(skuId, user, "COLLATERAL IN", mongoSession);
            await SkuBusinessInstance.findAndUpdateBB({_id:skuId}, {collateralStatus: 'COLLATERAL IN'});
        });
        await Promise.all(skuChangeMovementStatus);
        let skuIdS: any[] = []
        body.skuIds.forEach(skuId => skuIdS.push(mongoose.Types.ObjectId(skuId)))
        const aggregate: any = [
            {$match: {_id: {$in: skuIdS}, isDeleted: false}},
            {$group: {_id: '$companyId'}},

            {$lookup: {
                from: loanModel.collection.name, as: 'loan',
                let: { companyId: '$_id' },
                pipeline: [{ $match: { $and: [{ $expr: { $eq: ['$companyId', '$$companyId'] } }, { isDeleted: false }] } }]
            }},
            //{ $unwind: { path: "$loan", preserveNullAndEmptyArrays: true } },
            {$set: {loanAmount: {$cond: {if: {$sum: '$loan.amount'}, then: {$sum: '$loan.amount'}, else: 0}}}},

            {$lookup: {
                from: companyClientSettingModel.collection.name, as: 'clientCompany',
                let: { companyId: '$_id' },
                pipeline: [{ $match: { $and: [{ $expr: { $eq: ['$companyId', '$$companyId'] } }, { isDeleted: false }] } }]
            }}, { $unwind: { path: "$clientCompany", preserveNullAndEmptyArrays: true } },

            {$lookup: {
                from: skuModel.collection.name, let: { companyId: '$_id', weight: '$weight' }, as: 'sku',
                pipeline: [
                    {$match: {
                        $and: [
                            { $expr: { $eq: ['$companyId', '$$companyId'] } },
                            { isDeleted: false, collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN }
                        ]
                    }},
                    // { $set: { 'noOfStones': 1 } },
                    {$lookup: {
                        from: clarityMasterModel.collection.name,
                        let: { clarity: '$clarity' },
                        as: 'clarityCode',
                        pipeline: [{
                            $match: {$expr: { $eq: ['$clarity', '$$clarity']}, isDeleted: false}
                        }]
                    }}, { $unwind: { path: "$clarityCode", preserveNullAndEmptyArrays: true } },

                    {$lookup: {
                        from: colorMasterModel.collection.name,
                        let: { color: '$colorCategory' }, as: 'colorCode',
                        pipeline: [{
                            $match: {$expr: { $eq: ['$color', '$$color'] }, isDeleted: false}
                        }]
                    }}, { $unwind: { path: "$colorCode", preserveNullAndEmptyArrays: true } },

                    {
                        $lookup: {
                            from: caratMasterModel.collection.name, as: 'weightRangeId',
                            let: { weightRangeId: '$weightRangeId', weight: '$weight' },
                            pipeline: [
                                {
                                    $match: {
                                        $and: [
                                            { $expr: { isDeleted: false } },
                                            { $expr: { $lte: ['$fromCarat', '$$weight'] } },
                                            { $expr: { $gte: ['$toCarat', '$$weight'] } }
                                        ]
                                    }
                                },
                            ]
                        }
                    },
                    { $unwind: { path: "$weightRangeId", preserveNullAndEmptyArrays: true } },
                    { $set: { weightRangeId: '$weightRangeId._id' } },

                    {
                        $lookup: {
                            from: iavModel.collection.name, as: 'iav',
                            let: { iavId: '$iavId' },
                            pipeline: [
                                { $match: { $and: [{ $expr: { $eq: ['$_id', '$$iavId'] } }, { isDeleted: false }] } },
                                {
                                    $lookup: {
                                        from: clientPriceModel.collection.name,
                                        as: 'clientPrice',
                                        let: { clientPriceId: '$clientPriceId' },
                                        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$clientPriceId'] } } }]
                                    }
                                }, { $unwind: { path: "$clientPrice", preserveNullAndEmptyArrays: true } },
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
                    {$set: {
                        clientWeightAndPrice: {
                            $cond: {
                                if: { $multiply: ['$weight', '$iav.clientPrice.price'] },
                                then: { $multiply: ['$weight', '$iav.clientPrice.price'] },
                                else: 0
                            }
                        }
                    }},
                    {$set: {rapPriceStone: {$cond: {if: '$iav.rapPrice.price', then: '$iav.rapPrice.price', else: 0}}}},

                    {
                        $lookup: {
                            from: infinityPriceNewModel.collection.name, as: 'infinity',
                            let: { clarityId: '$clarityCode._id', colorId: '$colorCode._id', weightId: '$weightRangeId' },
                            pipeline: [
                                {
                                    $lookup: {
                                        from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMaster',
                                        let: { id: '$infinityPriceMasterId' },
                                        pipeline: [
                                            { $match: { $and: [{ $expr: { $eq: ['$_id', '$$id'] } }, { $expr: { isDeleted: false } }] } },
                                        ]
                                    }
                                },
                                { $unwind: { path: "$infinityPriceMaster", preserveNullAndEmptyArrays: true } },

                                {
                                    $match: {
                                        $and: [
                                            { $expr: { $eq: ["$infinityPriceMaster.clarityMasterId", "$$clarityId"] } },
                                            { $expr: { $eq: ["$infinityPriceMaster.colorMasterId", "$$colorId"] } },
                                            { $expr: { $eq: ["$infinityPriceMaster.caratRangeMasterId", "$$weightId"] } },
                                            { $expr: { $lte: ["$effectiveDate", new Date()] } }
                                        ]
                                    }
                                },
                                { $sort: { createdAt: -1 } }, { $limit: 1 }
                            ],
                        }
                    },
                    {$unwind: {path: "$infinity", preserveNullAndEmptyArrays: true}},
                    {$set: {infinityWeightAndPrice: {$cond: {
                        if: { $eq: ['$colorType', skuColorTypeEnum.WHITE] },
                        then: { $multiply: ['$weight', { $multiply: ['$rapPriceStone', { $subtract: [1, { $divide: ['$infinity.price', 100] }] }] }] },
                        else: { $multiply: ['$weight', '$infinity.price'] }
                    }}}},
                    {$set: {infinityWeightAndPrice: {$cond: {if: '$infinityWeightAndPrice', then: '$infinityWeightAndPrice', else: 0}}}}
                ]
            }},

            {$project: {
                infinityCollateral: { $sum: '$sku.infinityWeightAndPrice' }, clientCollateral: { $sum: '$sku.iav.pwv' },
                    collateralShortfall:{$subtract: [{ $multiply: [{ $divide: ['$clientCompany.ltv', 100] }, { $sum: '$sku.infinityWeightAndPrice' }] }, '$loanAmount'] }
              /*  collateralShortfall: {$cond: {
                    if: {$divide: [
                        {$subtract: [{ $multiply: [{ $divide: ['$clientCompany.ltv', 100] }, { $sum: '$sku.infinityWeightAndPrice' }] }, '$loanAmount'] },
                        {$cond: { if: { $ne: [{ $divide: ['$clientCompany.ltv', 100] }, 0] }, then: { $divide: ['$clientCompany.ltv', 100] }, else: 1 } }
                    ]},
                    then: {$divide: [
                        {$subtract: [{ $multiply: [{ $divide: ['$clientCompany.ltv', 100] }, { $sum: '$sku.infinityWeightAndPrice' }] }, '$loanAmount'] },
                        {$cond: { if: { $ne: [{ $divide: ['$clientCompany.ltv', 100] }, 0] }, then: { $divide: ['$clientCompany.ltv', 100] }, else: 1 } }
                    ]},
                    else: 0
                }}*/
            }},
        ]
        skuModel.aggregate(aggregate).then(async ([{_id, infinityCollateral, clientCollateral, collateralShortfall}]) => {
            const update = {infinityCollateral, clientCollateral, collateralShortfall, companyId: _id, updatedBy: loggedInUserId, $setOnInsert: {createdBy: loggedInUserId, amount: 0}}
            await loanModel.updateOne({companyId: _id}, update, {session: mongoSession, upsert: true, setDefaultsOnInsert: true})
        })
        let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code : ErrorCodes.REFRESH_INVENTORY, message: "moved to collateral", data: {tagNos}});    
        }
        res.locals.data = skuIds;
        res.locals.message = 'Successfully moved to collateral.';
        await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
    }

    // async updateStatus(req: Request, res: Response): Promise<void> {
    //     let {body, body:{skuIds,status}, body:{loggedInUser:{_id:loggedInUserId}}} = req
    //     body.updatedBy = loggedInUserId     
    //     let iavBusinessInstance = new IavBusiness, activityBusinessInstance = new ActivityBusiness, alertBusinessInstance = new AlertBusiness
    //     let alertData: any = {}, skuId : any= [],transactionId , transactionBody
    //     const transactionBusinessInstance = new TransactionBusiness() 
    //     if(status === "CONSIGNMENT"){
    //         transactionId = "CN-" + new Date().toISOString()
    //         transactionBody = {transactionId, "transactionType": "CONSIGNMENT", status: "Pending"}
    //     } 
    //     else{
    //         transactionId = "SL-" + new Date().toISOString()
    //         transactionBody = {transactionId, "transactionType": "SALE", status: "Pending"}
    //     }
    //     let transaction: any = await new SkuController().createTransaction(req, res, transactionBody)
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     //@ts-expect-error  
    //     await new SkuBusiness().updateManyBB({"_id": skuIds},{"movementStatus":status})        
    //     for (const item of skuIds ) {
    //         let sku = await new SkuBusiness().findIdByIdBB(item)
    //         if(!sku?._id) throw new Error("Invalid SkuId")
    //         // let activityData: any = await activityBusinessInstance.findOneBB({ skuId: item, isDeleted: false }, { _id: -1 })
    //         await new SkuController().createActivity(item, user, body)
    //         // else {
    //         //     delete activityData?._id
    //         //     delete activityData?.createdAt
    //         //     delete activityData?.updatedAt
    //         //     let iavData: any = await iavBusinessInstance.findOneBB({ skuId: item, isDeleted: false }, { _id: -1 })
    //         //     activityData.status = status
    //         //     activityData.iavId = iavData?._id
    //         //     activityData.createdBy = activityData.updatedBy = loggedInUserId
    //         //     await activityBusinessInstance.createBB(activityData)
    //         // }                    
    //         let alertType = await new AlertMasterBusiness().findOneBB({ status }, { createdAt: -1 })// to do alertType as Usergenerated
    //         if (!alertType) continue
    //         alertData.userId = loggedInUserId;
    //         alertData.message = "working good"
    //         alertData.skuId = item
    //         alertData.alertId = alertType?._id
    //         alertData.status = status
    //         alertData.createdBy = alertData.updatedBy = loggedInUserId
    //         await alertBusinessInstance.createBB(alertData)
    //     }  
    //     transaction.status = "Completed"
    //     transaction.skuIds = skuIds
    //     await transactionBusinessInstance.updateManyBB({transactionId},transaction)
    //     res.locals.message = Messages.UPDATE_SUCCESSFUL;
    //     res.locals.data = skuIds.length // Need to Fix
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStatus`);
    // }

    async updateStatus(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, body:{skuIds,status}, body:{loggedInUser:{_id:loggedInUserId, companyId}}, mongoSession} = req as RequestWithTransaction;
        body.updatedBy = loggedInUserId;
        let alertData: any = {}, skuId : any= [], transactionId , transactionBody;
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
        if(body.comments) body.comments = [{comment: body.comments, createdBy: loggedInUserId}]
        // if(status === "CONSIGNMENT")transactionBody = {transactionId: "CN-" + new Date().toISOString(), "transactionType": "CONSIGNMENT", status: "Pending"} 
        // else transactionBody = {transactionId:"SL-" + new Date().toISOString(), "transactionType": "SALE", status: "Pending"}
        let data = await new SkuRepository().updateStatus(body, user, mongoSession);
        res.locals = {status: true, message: Messages.STATUS_UPDATE_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStatus`);
    }

    async generateFaker(req: Request, res: Response): Promise<void> {
        let { body: { loggedInUser: { _id: loggedInUserId } }, query: { numberOfRecordToBeGenerated } } = req;
        let NumberOfRecordToBeGenerated = numberOfRecordToBeGenerated || Constant.NumberOfRecordsToGenerate;   // numberOfRecordToBeGenerated ||
        let SKuFakerData: any = [];
        console.log("-->", NumberOfRecordToBeGenerated);
        let momntStat = ['INVENTORY', 'ALERT', 'IN', 'OUT', 'APPROVED', 'FINGERPRINT', 'ARRIVAL', 'OPENBIZ', 'CLOSEBIZ',
            'SOLD', 'VAULT', 'MISSING', 'RESTART', 'RETURN', 'PING', 'OPERATIONAL', 'STANDBY']; //enums
        let stat = ['INVENTORY', 'IN', 'OUT'];
        //                let MomentSatus = myShows[Math.floor(Math.random() * myShows.length)];
        // console.log("==>",MomentSatus)
        for (let i = 0; i < NumberOfRecordToBeGenerated; i++) {
            SKuFakerData.push({
                infinityRefId: faker.random.alphaNumeric(8),
                infinityShape: faker.random.word(),
                clientShape: faker.random.word(),
                labShape: faker.random.word(),
                //shape: faker.random.word(),
                labsId: ["5f2ce1fbc972140eb7c23d55"],
                weight: faker.random.number({ min: 1, max: 5, precision: 0.01 }),
                movementStatus: momntStat[Math.floor(Math.random() * momntStat.length)],
                status: stat[Math.floor(Math.random() * stat.length)],
                colorCategory: faker.commerce.color(),
                colorSubCategory: faker.commerce.color(),
                gradeReportColor: faker.commerce.color(),
                colorRapnet: faker.commerce.color(),
                clarity: faker.random.word(),
                cut: faker.random.word(),
                measurement: "11,34 x 11,33 x 6,78mm",
                colorType: faker.random.word(),
                comments: [{
                    createdBy: loggedInUserId,
                    comment: faker.lorem.sentence()
                }],
                companyId: "5eeb672016d46f5168f29632",
                polish: faker.random.word(),
                rfid: faker.random.alphaNumeric(5),
                tagId: faker.random.alphaNumeric(5),
                symmetry: faker.random.word(),
                fluorescence: faker.random.word(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                createdBy: loggedInUserId,
                updatedBy: loggedInUserId
            })
        }
        //console.log("======>",SKuFakerData);
        res.locals.data = await new SkuBusiness().createBB(SKuFakerData);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.faker`);
    }

    async exportReport(req: Request, res: Response): Promise<void> {
        let workbook = new Excel.Workbook();
        let populate = [{ path: "skuId" }, { path: "userId", select: '-password' }, { path: "companyId" }, { path: "labsId" }];
        let dbData = await new SkuBusiness().findBB({}, {}, {}, 50, 0, populate);
        let headerData = [{ name: "Line Number" }, { name: 'Status' }, { name: "Carat Weight" }, { name: "Company" }, { name: "Report Date" }, { name: "Reference Number" }, { name: "PWV" }
            , { name: "RFID" }, { name: "Report Type" }, { name: "Report Number" }, { name: "IAV" }, { name: "Shape" }, { name: "Color" }, { name: "Color Type" }, { name: "Grading Shape" }, { name: "Grading Color" },
        { name: "Clarity" }, { name: "V/C" }, { name: "DRV" }, { name: "Last DiamondMatch" }, { name: "Diamond Match" }];
        let requiredData = [];
        let arr: any[] = [];
        requiredData.push(arr);
        for (let i = 0; i < dbData.length; i++) {
            //@ts-expect-error
            arr = [i + 1, dbData[i].status, dbData[i].weight, dbData[i].companyId ?.name, /*dbData[i].Report Date*/,
                //@ts-expect-error
            dbData[i].rfid,/* dbData[i].pwv*/,/* dbData[i].RFID*/, /*dbData[i].Report Type*/, /*dbData[i].Report Number*/, /*dbData[i].iav*/,
            ////@ts-expect-error
            dbData[i].shape, dbData[i].colorCategory, dbData[i].colorType,/*dbData[i].Gradingshape*/,/*dbData[i].Gradingcolor*/, dbData[i].clarity,/*dbData[i].vc*/,
                /*dbData[i].drv*/,/*dbData[i].LastDiamondMatch*/,/*dbData[i].DiaMatch*/];
            requiredData.push(arr);  //TODO map data, set limit
        }
        //res.locals.data = requiredData
        let worksheet = workbook.addWorksheet('SKU Report')
        await new SkuBusiness().createTable(worksheet, headerData, requiredData)
        let fileName = 'SkuReport.xlsx'
        let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
        //res.locals.message = 'File Created'
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
        //await JsonResponse.jsonSuccess(req, res, `{this.url}.export`);
    }

    // async deleteMany(req: Request, res: Response): Promise<void> {
    //     console.log('Delete Many')
    //     res.locals = { status: false, message: Messages.FAILED, data: null };
    //     const verificationBusinessInstance = new VerificationBusiness()
    //     let { body: { loggedInUser: { _id: loggedInUserId, email: loggedInUserEmail, firstName: loggedInUserfirstName, lastName: loggedInUserlastName } }, query: {skuIds} } = req
    //     const ip = req.connection.remoteAddress || req.socket.remoteAddress

    //     console.log(skuIds);
    //     //@ts-expect-error
    //     skuIds = JSON.parse(skuIds)    
    //     // let SkuIdsString = JSON.stringify(skuIds)

    //     const verify = await verificationBusinessInstance.findOneBB({ userId: loggedInUserId, isVerified: false, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds) }, { createdAt: -1 })   //Todo add Ip here        
    //     if (verify && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
    //         res.locals = { status: false, message: Messages.OTP_IS_ALREADY_SENT }
    //     } else {
    //         let otp = Math.floor(100000 + Math.random() * 900000).toString();
    //         if (otp.length < 6) otp = otp + "0";
    //         let lead_mail_body: any = otp
            // await new BaseHelper().emailSend('otp_mail', { LEAD_BODY: lead_mail_body, NAME: `${loggedInUserfirstName} ${loggedInUserlastName}`, OTP: otp }, loggedInUserEmail)
    //         const verifyToBeInserted = { userId: loggedInUserId, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds), otp, ip,createdBy: loggedInUserId, updatedBy: loggedInUserId }
    //         //@ts-expect-error
    //         const verifyData = verificationBusinessInstance.createBB(verifyToBeInserted)
    //         if (verifyData) res.locals = {status:true, message: Messages.OTP_SENT_SUCCESSFULLY }
    //     }
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteMany`);
    // }

    async deleteMany(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.FAILED, data: null };
        let { body: { loggedInUser: { _id: loggedInUserId, email: loggedInUserEmail, firstName: loggedInUserfirstName, lastName: loggedInUserlastName } }, mongoSession, query: {skuIds} } = req as RequestWithTransaction
        const ip = req.connection.remoteAddress || req.socket.remoteAddress;
        //@ts-expect-error
        skuIds = JSON.parse(skuIds);
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        if (otp.length < 6) otp = otp + "0";
        let lead_mail_body: any = otp;
        let verificationMatch = { userId: loggedInUserId, isVerified: false, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds) };
        let sendEmail = { LEAD_BODY: lead_mail_body, NAME: `${loggedInUserfirstName} ${loggedInUserlastName}`, OTP: otp };
        let verifyToBeInserted = { userId: loggedInUserId, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds), otp, ip,createdBy: loggedInUserId, updatedBy: loggedInUserId };
        let response = await new SkuRepository().updateMany( sendEmail, verificationMatch, verifyToBeInserted, loggedInUserEmail, mongoSession );
        res.locals = response;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteMany`);
    }

    /*async deleteManyVerify(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.FAILED };
        const verificationBusinessInstance = new VerificationBusiness()
        let { body: { loggedInUser: { _id: loggedInUserId } }, query: {skuIds, otp} } = req
        //@ts-expect-error
        skuIds = JSON.parse(skuIds)
        const verify = await verificationBusinessInstance.findOneBB({ userId: loggedInUserId, isActive: true, operation: 'deleteMany', module: 'sku', data: JSON.stringify(skuIds) }, { createdAt: -1 })
        if (verify && verify.otp == otp && verify.isActive && !verify.isVerified && Moment(verify.createdAt).add(10, 'minutes').format() > Moment().format()) {
            //@ts-expect-error
            let updatedSkuData:any = await new SkuBusiness().updateManyBB({ "_id": skuIds }, { isDeleted: true, isActive: false })
            if (updatedSkuData.nModified === 0) {
                res.locals = { status: false, message: Messages.DELETE_FAILED }
                await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteManyByVerify`)
            }
            //@ts-expect-error
            await verificationBusinessInstance.updateManyBB({ _id: verify._id }, { updatedBy: loggedInUserId, isVerified: true, isActive: false })
            res.locals.status = true
            res.locals.message = Messages.DELETE_SUCCESSFUL;
            res.locals.data = updatedSkuData
        } else {
            res.locals.message = Messages.INVALID_OTP
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteManyByVerify`)
    }*/

    async deleteManyVerify(req: Request, res: Response): Promise<void> {
        res.locals = { status: false, message: Messages.FAILED };        
        let {query, body: { loggedInUser: { _id: loggedInUserId } }, mongoSession, query: { skuIds, otp } } = req as RequestWithTransaction;
        let verificationMatch ={ userId: loggedInUserId, isActive: true, operation: 'deleteMany', module: 'sku', data: skuIds };
        let updateVerification = { updatedBy: loggedInUserId, isVerified: true, isActive: false };
        let data = await new SkuRepository().deleteManyVerify(query, verificationMatch, updateVerification, mongoSession );
        res.locals = data;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteManyByVerify`)
    }
    
    // async ledTrigger(req: Request, res: Response): Promise<void> {
    //     let {body, body:{skuIds,status,comments}, body:{loggedInUser:{_id:loggedInUserId}}} = req
    //     let iavBusinessInstance = new IavBusiness(), activityBusinessInstance = new ActivityBusiness(), SkuBusinessInstance = new SkuBusiness();
    //     let actvityInsert: any = []
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     for (const item of skuIds) {
    //         // let skuData: ISku = await SkuBusinessInstance.findBB({ skuId: item })
    //         await new SkuController().createActivity(item, user,body)

    //         // let activityData: any = await activityBusinessInstance.findBB({ skuId: item }, {}, { createdAt: -1 }, Constant.limit, Constant.startIndex, [])
    //         // delete activityData[0]?._id
    //         // let iavData: any = await iavBusinessInstance.findBB({ skuId: item }, {}, { createdAt: -1 }, Constant.limit, Constant.startIndex, [])
    //         // activityData[0].status = status
    //         // activityData[0].iavId = iavData[0]?._id
    //         // activityData[0].createdBy = activityData[0].updatedBy = loggedInUserId
    //         // actvityInsert.push(activityData[0])
    //     }
    //     // res.locals.data = await new ActivityBusiness().createBB();
    //     res.locals.message = Messages.CREATE_SUCCESSFUL;
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
    // }

    async ledTrigger(req: Request, res: Response): Promise<void> {
        res.locals = {status:false, message: Messages.CREATE_FAILED};
        const {body, body: {loggedInUser: {_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction;
        const user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
        let data = await new SkuRepository().ledTrigger(body, user, mongoSession);
        res.locals = data // need to add response of data
        await JsonResponse.jsonSuccess(req, res, `{this.url}.ledTrigger`);
    }


    /*async groupBy(req: Request, res: Response): Promise<void>
    {
        let {body, query:{key}, body:{loggedInUser:{_id:loggedInUserId}}} = req
        const aggregrate = [{"$group" : {_id: `$${key}`}}]
        res.locals.data = await new SkuBusiness().aggregateBB(aggregrate);
        res.locals.message = Messages.CREATE_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
    }*/


    // async importData(req: Request, res: Response): Promise<void> {
    //     let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
    //     let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId}
    //     let resultData: any = [],count: number = 0,skuIds: any = []

    //     if(body.length>0)
    //     {
    //         let company = await new CompanyBusiness().findOneBB({_id: body[0].companyId})
    //         if(company===undefined ||company===null)
    //         {
    //             throw new Error(body[0].companyId+" Invalid Company Id")
    //         }
    //     }

    //     const transactionBusinessInstance = new TransactionBusiness()
    //     let transactionId = "IM-" + new Date().toISOString()
    //     let rapaport = await new RapPriceBusiness().findBB({},{},{createdAt: -1},Constant.limit,Constant.startIndex,[])
    //     let transactionMatch = {transactionId, "transactionType": "IMPORT", rapaportDate : rapaport[0].createdAt, status: "Pending"}
    //     let transaction = await new SkuController().createTransaction(req,res, transactionMatch)
          
    //     for (let importData of body) {

    //         let cond={};
    //         //@ts-expect-error
    //         cond['clientRefId'] = importData.ref;
    //         //@ts-expect-error
    //         cond['companyId'] = importData.companyId;

    //         // Need to enable This Validation
    //        let data: any = await new SkuValidation().skuImpoValidation(importData)
    //         if(data) {
    //             importData.error = data;
    //             importData.importStatus="NOTINSERTED";
    //             resultData.push(importData)
    //             continue
    //         }

    //         await new SkuBusiness().findOneBB(cond).then(async (skuInfinityRefIdData) =>
    //         {
    //             if(skuInfinityRefIdData)
    //             {
    //                 importData.importStatus="DUPLICATE";
    //             }
    //             else
    //             {
    //                 importData.stoneType=importData.stoneType.toUpperCase();
    //                 importData.drv=importData.drv.toString();
    //                 importData.pwv=importData.pwv.toString();
    //                 importData.pwvImport=importData.pwv.toString();
    //                 importData.fixedValueCarat=importData.fixedValueCarat.toString();

    //                 importData.caratWeight = Number(importData.caratWeight);
    //                 importData.fixedValueCarat = Number(importData.fixedValueCarat.replace(',',''))
    //                 importData.iav = importData.iav.replace(',','')

    //                 importData.drv = Number(importData.drv.replace(',','')).toFixed(2)
    //                 importData.pwv = Number(importData.pwv.replace(',','')).toFixed(2)
    //                 importData.pwvImport = Number(importData.pwvImport.replace(',','')).toFixed(2)


    //                 if (importData.lab === "GIA") importData = await new SkuController().checkValidation(importData, user)
    //                 if (importData.lab === "GIA" && importData.isCalculationValidated) {
    //                     importData = await new SkuController().createAll(importData, user)
    //                     importData.importStatus="INSERTED";
    //                     skuIds.push(importData.skuId)

    //                 }
    //                 else if (importData.lab === "GIA")
    //                 {
    //                     importData.importStatus="NOTINSERTED";
    //                 }
    //                 else {
    //                     importData.isCalculationValidated = false
    //                     //if (importData.drv !== (importData.caratWeight * importData.fixedValueCarat).toFixed(2)) { notInserted.push(importData); break }
    //                     //if (importData.pwv !== (importData.pwv + (Number(importData.iav) * importData.drv / 100)).toFixed(2)) { notInserted.push(importData); break }
    //                     importData.isCalculationValidated = true
    //                     importData = await new SkuController().createAll(importData, user)
    //                     importData.importStatus="INSERTED";
    //                     skuIds.push(importData.skuId)
    //                 }
    //             }

    //         })

    //         resultData.push(importData)

    //     }
    //     transaction.status = "Completed"
    //     transaction.skuIds = skuIds
    //     await transactionBusinessInstance.updateManyBB({transactionId},transaction)
    //      res.locals.data = resultData;
    //      res.locals.message = Messages.CREATE_SUCCESSFUL;
    //      await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);

    // }

    async importData(req: Request, res: Response): Promise<void> {
        res.locals = { status: true, message: Messages.CREATE_FAILED };
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
        let newData: any[] = [], user = { createdBy: loggedInUserId, updatedBy: loggedInUserId };

        if(!body?.skuData?.length) throw 'Invalid SkuData'
        body.skuData.forEach((obj: any) => {
            obj.drv = obj.drv.toString();
            obj.pwv = obj.pwv.toString();
            obj.pwvImport = obj.pwv.toString();
            obj.iav = obj.iav.toString().replace(/,/gi, '');
            obj.caratWeight = obj.caratWeight.toString();
            obj.stoneType = obj.stoneType.toUpperCase();
            obj.fixedValueCarat = obj.fixedValueCarat.toString().replace(/,/gi, '');
            // obj.fixedValueCarat = Number(obj.fixedValueCarat.replace(/,/gi, ''));
            obj.drv = Number(obj.drv.replace(/,/gi, '')).toFixed(2);
            obj.pwv = Number(obj.pwv.replace(/,/gi, '')).toFixed(2);
            obj.pwvImport = Number(obj.pwvImport.replace(/,/gi, '')).toFixed(2);
            newData.push(obj)
        });
        let data = await new SkuRepository().import(body, newData, user, mongoSession);
        res.locals = { status: true, message: Messages.CREATE_SUCCESSFUL, data };
        await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
    }

    async createAll (importData: any, user: any): Promise<any|never>{        
        let match = {"lab":importData.lab, "labReportId": importData.reportNumber, "labReportPath": importData.pdf , labReportDate : new Date(importData.reportDate), ...user}
        let labData: any = await new LabBusiness().createBB(match);
        importData.labId = labData._id;
        importData.status='ACTIVE';
        importData.movementStatus="IMPORTED";         
        let sku = await new SkuController().createSku(importData, user);
        importData.skuId = sku._id;
        // if(importData.lab !== "GIA") importData.clientPriceId = await new SkuController().createClientPrice(importData, user)
        importData.clientPriceId = await new SkuController().createClientPrice(importData, user);
        importData.iavId = await new SkuController().createIav(importData, user);
        // importData.activityId = await new SkuController().createActivity(importData, user)
        let rfid = await  new SkuController().createRfidTags(importData,user);
        await new SkuBusiness().findAndUpdateBB({_id: importData.skuId} , {iavId: importData.iavId, rfId: rfid});
        return importData
    }

    async createActivity(skuId: any, user :any,body:any): Promise<any|never> { 
        let activity : IActivity;
        let skuData: ISku| null = await new SkuBusiness().findOneBB({_id:skuId});
        let activityData: any = {...user};
        activityData.companyId = skuData?.companyId;
        activityData.skuId = skuData?._id;
        activityData.labsId = skuData?.labsId;
        activityData.iavId = skuData?.iavId;
        activityData.userId = user.createdBy;
        activityData.status = body.status;
        activityData.dmId = "5f59cf450cd8132b8cae1c48";
        if(body?.comments) activityData.comments = body.comments;
        if(skuData) await new ActivityBusiness().createBB(activityData);
        // return activity._id
    }

    async createClientPrice(body: any, user :any): Promise<any|never> { 
        let clientPriceData : any = {...user};
        clientPriceData.companyId = body.companyId;
        clientPriceData.skuId = body.skuId;
        clientPriceData.shape = body.shape;
        clientPriceData.clarity = body.clarity;
        clientPriceData.color = body.color;
        clientPriceData.weight =  body.caratWeight;
        console.log(body.fixedValueCarat);
        clientPriceData.price = Number(body.fixedValueCarat);
        clientPriceData.pwvImport=Number(body.pwvImport);
        let clientPrice: any = await new ClientPriceBusiness().createBB(clientPriceData);
        return clientPrice._id
    }

    async createSku(body: any, user :any): Promise<any|never> {        
        let skuData: any = {...user};

        let populate = [{path: 'addressId'}];
        let company = await new CompanyBusiness().findOneBB({_id: body.companyId}, {}, populate);
        console.log(company);
        // @ts-ignore
        let companyName = company.name.slice(0, 3).toUpperCase();
        console.log(companyName);
        //@ts-expect-error
        let companyLoc = company.addressId.address1.slice(0,3).toUpperCase();
        console.log(companyLoc);
        //@ts-expect-error
        let companyId = company._id.toString().slice(0,6).toUpperCase();
        console.log(companyId);
        let CompanyTotalCount = await new CompanyBusiness().findCountBB()+1;
        let InfinityTotalCount = await new IavBusiness().findCountBB()+1;
        let YYMM = new Date().getFullYear().toString().slice(2,4) + ("0" + new Date().getMonth().toString());
        
        let infinityRefId =  YYMM +"-" + companyId + "-" + companyName+ "-"  + companyLoc + "-" + CompanyTotalCount+ "-"+InfinityTotalCount;
        console.log(infinityRefId);
        
        skuData.labsId = [body.labId];
        skuData.companyId = body.companyId;
        skuData.companyId = body.companyId;
        skuData.clientRefId = body.ref;
        skuData.infinityRefId = infinityRefId;
        skuData.infinityShape = body.shape;
        skuData.clientShape = body.shape;
        skuData.labShape = body.shape;
        //skuData.shape = body.shape;
        skuData.weight = body.caratWeight;
        skuData.colorCategory = body.color;
        skuData.colorSubCategory = body.color;
        skuData.gradeReportColor = body.color;
        skuData.colorRapnet = body.color;
        skuData.clarity = body.clarity;
        skuData.measurement = body.measurement;
        skuData.colorType = body.stoneType;
        skuData.status = body.status;
        skuData.movementStatus = body.movementStatus;
        skuData.pwvImport = body.pwvImport;
        let sku: any = await new SkuBusiness().createBB(skuData);
        return sku
    }

    async checkValidation(body: any, user: any): Promise<any | never> {
        body.isCalculationValidated = true;
        body.caratWeight = Number(body.caratWeight);
        if(body.stoneType=='White')
        {
            if(body.caratWeight > 5) body.caratWeight = 5.00;
            if(body.shape!=='Round')
            {
                body.shape='Pear';
            }
            /* let match = {
                 'weightRange.fromWeight': { '$lte': body.caratWeight }, 'weightRange.toWeight': { '$gte': body.caratWeight },
                 'shape': body.shape, 'clarity': body.clarity, 'color': body.color
             }*/
            /*let price: any = await new RapPriceBusiness().aggregateBB([
                {'$match': {'weightRange.fromWeight': {'$lte': body.caratWeight }, 'weightRange.toWeight': {'$gte': body.caratWeight }, shape, clarity, color}},
                {'$sort': {'_id': -1}}, {'$limit': 1}])*/
            let price: any =await new RapPriceBusiness().aggregateBB([
                {'$match': {'weightRange.fromWeight': {'$lte': body.caratWeight}, 'weightRange.toWeight': {'$gte': body.caratWeight}, 'shape': body.shape, 'clarity': body.clarity, 'color': body.color}},
                {'$sort': {'_id': -1}}, {'$limit': 1}]);

            console.log(body.rap +"=="+ price[0]?.price);
            if (body.rap !== price[0]?.price) return body;
            if (body.drv !== (body.caratWeight * price[0]?.price).toFixed(2)) return body;
            if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) return body;
          //  body.isCalculationValidated = true
            body.priceId = price[0]?._id
        }
        else
        {
            console.log(body.drv +"!=="+(body.caratWeight * body.fixedValueCarat).toFixed(2));
            if (body.drv !== (body.caratWeight * body.fixedValueCarat).toFixed(2)) return body;
            if (body.pwv !== Number(body.drv + (Number(body.iav) * body.drv / 100)).toFixed(2)) return body
            //body.isCalculationValidated = true
        }

        return body
    }

    async createIav(body: any ,user :any): Promise<any|never> {
        let iavData: any = {...user};
        if(body.rapPriceId)iavData.rapPriceId =  body.rapPriceId;
        if(body.clientPriceId)iavData.clientPriceId =  body.clientPriceId;
        iavData.iav = Number(body.iav.replace(',','')).toFixed(5);
        iavData.drv = Number(body.drv.replace(',','')).toFixed(2);
        iavData.pwv = Number(body.pwv.replace(',','')).toFixed(2);
        iavData.skuId = body.skuId;
        iavData.iavAverage = Number(body.iav);
        let iav: any = await new IavBusiness().createBB(iavData);
        return iav._id
    }

    async createRfidTags(body: any ,user :any): Promise<any|never> {
        let rfidData: any = {...user};
        rfidData.skuId = body.skuId;
        rfidData.rfid = body.tag;
        console.log(rfidData);
        let rfId: any = await new RfidBusiness().createBB(rfidData);
        return rfId._id
    }

    async createTransaction(req: Request, res: Response ,match :any): Promise<any|never> {
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req;
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
        let transactionBusinessInstance = new TransactionBusiness();
        let transactionBody = {...match, ...user};
        let transaction: any = await transactionBusinessInstance.createBB(transactionBody);
        //res.locals.data = transaction
       // res.locals.message = Messages.CREATE_SUCCESSFUL;
        //await JsonResponse.jsonSuccess(req, res, `{this.url}.import`);
        return transaction
    }

    async skuExportExcel(req: Request, res: Response): Promise<void> {
        req.query.displayConfig = [{"key":"screen","value":"InventoryInventories"}]
        let [skuData, displayConfig] = await Promise.all([
            await new SkuRepository().index(req.query as any),
            await disPlayConfigindex(req)
        ])
        let headerData: any = [];        
        displayConfig[0].config.map((item: any) => {if(item.isActive === true) headerData.push({ name: item.text, filterButton: true, valKey: item.valKey }) });
        // console.log(displayConfig[0].config,"=========testing");    
        let workbook = new Excel.Workbook();
        
        // let headerData = [{ name: 'Infinity #', filterButton: true }, { name: 'Movement Status', filterButton: true }, { name: "Company", filterButton: true }, { name: "Weight", filterButton: true }, { name: "Shape", filterButton: true }, { name: "ColorType", filterButton: true }, { name: "Clarity", filterButton: true },{ name: "Cut", filterButton: true },{ name: "RFID", filterButton: true }, { name: "Rap price", filterButton: true },{ name: "V/C", filterButton: true }, { name: "DRV", filterButton: true },{ name: "IAV", filterButton: true },{ name: "DmGuid", filterButton: true }, { name: "Tag #", filterButton: true },{ name: "Lab", filterButton: true },{ name: "Lab ReportId", filterButton: true }, { name: 'Pwv', filterButton: true }]
        let requiredData = [];
        //@ts-expect-error
        for (const [i, element] of skuData.data.entries()) {            
            let arr: any[] = []
            for (const item of displayConfig[0].config) {
                let valKey = item.valKey.split(".");
                if(item.isActive === false) continue
                // console.log(valKey,'\\\\\\\\')
                
                // if(valKey[valKey.length-1] === "drv" || valKey[valKey.length-1] === "pwv" || valKey[valKey.length-1] === "price")(lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push(0);
                // if(valKey[valKey.length-1] === "drv" || valKey[valKey.length-1] === "pwv" || valKey[valKey.length-1] === "price") arr.push('');
                if(['drv', 'pwv', 'price', 'PWV Import', 'V/C', 'IAV', 'DRV', 'Created Date'].includes(valKey[valKey.length-1])) {console.log(valKey[valKey.length-1],';;;'); arr.push('')}
                else if(valKey[valKey.length-1] === "iav") (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push((0.00));
                else if(valKey[valKey.length-1] === "stoneRegistration") (element.stoneRegistration)? arr.push("YES"): arr.push("NO");
                else if(valKey[valKey.length-1] === "dmGuid") (element.stoneRegistration)? arr.push(lo.get(element, valKey)) : arr.push("Pending");
                else if(valKey[valKey.length-1] === "pwvImport")(lo.get(element, valKey))? arr.push(Number(lo.get(element, valKey))) : arr.push(0);
                else (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push('')
                // else arr.push('')
            };
            // arr = [
            // data[i].infinityRefId,data[i].movementStatus,data[i].companyId?.name,data[i].weight, data[i].shape, data[i].colorType, data[i].clarity,data[i].cut,data[i].rfId?.rfid,data[i].iavId?.rapPriceId?.price,'$ '+vcValue,data[i].iavId?.drv,data[i].iavId?.iav, data[i].dmGuid,data[i].tagId, data[i].labsId?.lab,data[i].labsId?.labReportId,data[i].iavId?.pwv]
            requiredData.push(arr);
        }

        headerData = [{name: 'holla'}]
        requiredData = [['abc']]

        let worksheet = workbook.addWorksheet('Sku Export')
        // await new SkuBusiness().createTable(worksheet, headerData, requiredData);
        // const table = 
        worksheet.addTable({
            name: 'Sku export1',
            ref: 'A1',
            columns: headerData,
            rows: requiredData
        });
        let fileName = 'SkuExport.xlsx';
        let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`));
        res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

    async skuAssetDetail(req: Request, res: Response): Promise<void> {
        let { query: { _id } } = req;
        let populate = [{ path: 'labsId' }, {path: 'iavId', populate: [{path: 'rapPriceId', model: 'RapPrice'}, {path: 'clientPriceId', model: 'ClientPrice'}]}, { path: 'rfId' }];
        let summaryObj: any = {}, iavHistory: any = {}, lastDMObj: any = {},soldIavData: any ={}
        let skuData: any = await new SkuBusiness().findOneBB({ _id: _id, isDeleted: false }, {}, populate);
        //console.log("===========Sku",skuData);
        if (!skuData) res.locals = { status: false, message: Messages.NO_SKU_DATA };
        else {
            let [alertCount, movementCount, iavHistory, lastDMObj, lastDiamondMatch, collateralAdded, lastInspection, skuInfinityPrices] = await Promise.all([
                new AlertBusiness().findCountBB({ skuId: _id, isDeleted: false }),
                new ActivityBusiness().findCountBB({ skuId: _id, isDeleted: false }),
                new IavBusiness().findBB({ skuId: _id }, {}, { createdAt: -1 }, 5, 0, [{ path: "rapPriceId" }, { path: "clientPriceId" }]),
                new DiamondMatchBusiness().findOneBB({ skuId: _id, isDeleted: false }, { createdAt: -1 }, [], { status: 1, createdAt: 1 }),
                new ActivityBusiness().findOneBB({ skuId: _id, status: "MATCHED", isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 }),
                new ActivityBusiness().findOneBB({ skuId: _id, status: "COLLATERAL_ADDED", isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 }),
                new ActivityBusiness().findOneBB({ skuId: _id, status: "TRANSIT", isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 }),
                //@ts-expect-error
                await skuInfinityPriceModel.find({skuId: _id}, 'price totalPrice')
            ]);
            if (skuData?.movementStatus === 'SOLD') {
                populate = [{path: 'iavId', populate: [{path: 'rapPriceId', model: 'RapPrice'}, {path: 'clientPriceId', model: 'ClientPrice'}]}]
                soldIavData = await new ActivityBusiness().findOneBB({ skuId: _id, isDeleted: false }, { createdAt: -1 }, populate, { iavId: 1, status: 1 })
            }
           // console.log("lastDM==>", lastDMObj);
            skuData.lastDiamondMatch = lastDMObj;
            skuData.summary = { alertCount, movementCount }; //summaryObj
            skuData.priceHistory = iavHistory;
            skuData.currentStatus = { lastDiamondMatch, collateralAdded, lastInspection };
            skuData.soldIavData = soldIavData
            skuData.skuskuInfinityPrices = skuInfinityPrices
            res.locals.data = skuData;
            res.locals.message = Messages.FETCH_SUCCESSFUL;
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.skuAssetDetail`);
    }
    
    async unReferencedAssets(req: Request, res: Response): Promise<void> {
        let data = await new SkuRepository().unReferencedAssets();
        res.locals = {status:true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.unReferencedAssets`);
    }  
    
    async updateCollateral(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, body:{skuIds, isCollateral,loggedInUser:{_id:loggedInUserId}}, mongoSession} = req as RequestWithTransaction;
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
        let updateSku = {"isCollateral": body.isCollateral, updatedBy: loggedInUserId };
        let data = await new SkuRepository().updateCollateral(body, updateSku, user, mongoSession);
        res.locals = {status:true, message: Messages.UPDATE_SUCCESSFUL, data: skuIds.length};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateCollateral`);
    }

    async filter(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let {body: {loggedInUser:{_id: loggedInUserId}}} = req;
        let data = await new SkuRepository().filter(loggedInUserId, req.query);
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
            data.company.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
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

    async getSkuByTag(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let data = await new SkuRepository().getByTag(req.query.tagNo);
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getSkuByTag`);
    }

    async getSkuFromTime(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        let data = await new SkuRepository().getSkuFromTime( req.query.date);
        console.log(data.length);
        res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getSkuFromTime`);
    }

    async removeCollateral(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId, companyId } } } = req as RequestWithTransaction;
        let data = await new SkuRepository().removeCollateral(body, loggedInUserId, mongoSession);
        let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        for (const device of registerDevice) {
            let token = device?.token;
            if(token!=null && devices && devices[token]) devices[token].emit("refresh", {code: ErrorCodes.REFRESH_INVENTORY, message: "removed from collateral", data: {tagNos: body.tags}});    
        }
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.removeCollateral`);
    }

    updateStatusWithTag = async (req: Request, res: Response) : Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let {body, body:{tags,status}, body:{loggedInUser:{_id:loggedInUserId}, companyId}, mongoSession} = req as RequestWithTransaction;
        body.updatedBy = loggedInUserId;
        let alertData: any = {}, skuId : any= [],transactionId , transactionBody;
        let user = {createdBy: loggedInUserId, updatedBy: loggedInUserId};
        body.skuIds = await rfidModel.aggregate([
            {$match: {rfid: {$in : body.tags}, isActive: true}},
            {$group: {_id: null, "skuIds": { "$addToSet": "$skuId" }}}
        ]).then(data1 => data1[0].skuIds)  
        let data = await new SkuRepository().updateStatus(body, user, mongoSession);
        // let registerDevice = await deviceModel.find({companyId, isDeleted: false});
        // for (const device of registerDevice) {
        //     let token = device?.token;
        //     if(token!=null && devices[token]) devices[token].emit("refresh",{code: ErrorCodes.REFRESH_INVENTORY, message: "", data: {tagNos: body.tags}});    
        // }
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStatus`);
    }

    sendEmail = async (req: Request, res: Response) : Promise<void> => {
        res.locals = {status: false, message: Messages.FAILED};
        const {body: {data, loggedInUser:{_id:loggedInUserId, email, companyId}}} = req
        const companyData = await companyModel.findOne({_id: companyId}, 'contacts.email')
        let companyEmail = `${email},`
        companyData?.contacts?.forEach((el) => companyEmail = `${companyEmail}${el.email},`)
        companyEmail = companyEmail.trim()
        let DATA = '<table border="1"><tr><th>Ref Id</th><th>Import Status</th><th>Message</th></tr>';
        data.forEach(({refId, message, importStatus}:any) => DATA = `${DATA}<tr><td>${refId}</td><td>${importStatus}</td><td>${message}</td></tr>`)
        DATA = `${DATA}</table>`;
        await new BaseHelper().emailSend('sku_email', {DATA}, companyEmail)
        res.locals = {status: true, message: Messages.SUCCESS}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.sendEmail`);
    }

    updateGemLogistStatus = async (req: Request, res: Response) : Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let { body, mongoSessionNew: session, body: { loggedInUser: { _id: loggedInUserId } } } = req as any;
        body.comments?.forEach((comment: IComment) => comment.createdBy = loggedInUserId);
        let data: any;
        await session.withTransaction(async() => data = await new SkuRepository().updateGemLogistStatus(body, loggedInUserId, session))
        // let data = await new SkuRepository().updateGemLogistStatus(body, loggedInUserId)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateGemLogistStatus`);
    }

    updateStoneStatus = async (req: Request, res: Response) : Promise<void> => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
        let data = await new SkuRepository().updateStoneStatus(body, loggedInUserId, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStoneStatus`);
    }

    importTemplate = async (req: Request, res: Response) => {   //Todo first check if old file is present that else create new n send and in log error in db...
        // let tableData = [
        //     {'RFID Code': 'xxxxxxxxx', 'Ref#': 'xxxxxxxxx', 'FANCY/FANCY/Fancy': 'xxxxx', 'Shape': 'xx', 'Client color': 'x', 'Weight': 'xxx', 'Clarity': 'xxxx',
        //     'Client $/Ct': 'xxxx', 'Total USD': 'xxxx', 'Lab': 'xxx', 'Certificate': 'xxxxxxxxxx', 'Certificate Date': 'xx-xx-xxxx xx:xx:xx', 'Grading report Shape': '',
        //     'Grading report color': '', 'Measurements': '', 'Ms1': '', 'Ms2': '', 'Ms3': ''}
        // ]

        const tableHeader = ['RFID Code', 'Ref', 'FANCY/FANCY/Fancy', 'Shape', 'Client color', 'Weight', 'Clarity', 'Client $/Ct', 'Total USD', 'Lab', 'Certificate', 'Certificate Date', 'Grading report Shape', 'Grading report color', 'Measurements', 'Ms1', 'Ms2', 'Ms3'];

        // let tableData = ['xxxxxxxxx', 'xxxxxxxxx', 'xxxxx', 'xx', 'x', 'xxx', 'xxxx', 'xxxx', 'xxxx', 'xxx', 'xxxxxxxxxx', 'xx-xx-xxxx xx:xx:xx', '', '', '', '', '', '']
        let tableData1 = [1, 2, 'xxxxx', 'xx', 'x', 'xxx', 'xxxx', 'xxxx', 'xxxx', 'xxx', 'xxxxxxxxxx', 'xx-xx-xxxx xx:xx:xx', '', '', '', '', '', '']
        let tableData2 = [3, 4, 'xxxxx', 'xx', 'x', 'xxx', 'xxxx', 'xxxx', 'xxxx', 'xxx', 'xxxxxxxxxx', 'xx-xx-xxxx xx:xx:xx', '', '', '', '', '', '']
        let tableData3 = [5, 6, 'xxxxx', 'xx', 'x', 'xxx', 'xxxx', 'xxxx', 'xxxx', 'xxx', 'xxxxxxxxxx', 'xx-xx-xxxx xx:xx:xx', '', '', '', '', '', '']

        const data = [tableHeader, tableData1, tableData2, tableData3]

        const fileName = 'skuImportTemplate.xlsx'
        let wb = XLSX.utils.book_new();
        let s1 = XLSX.utils.aoa_to_sheet(data)

        //Column Filter
        s1['!autofilter'] = {ref: 'A1:C1'}

        // s1.C2.f = {
            // "!ref": "A2:C2",
            // A1: { t:'n', v:1 },
            // A2: { t:'n', v:2 },
            // C2: { t:'n', v:66, f:'BESSELJ(A2,B2)' }
        // }

        var formula = "SUM(A2+B2)";

        /* skeleton worksheet */
        var ws = XLSX.utils.aoa_to_sheet([
        ["val1", "val2", "fmla", "array", "cell"],
        [1, 2, formula]
        ]);

        /* D2 array formula {=SUM(A2:B2*A2:B2)} */
        ws["D2"] = { t:'n', f:formula, F:"D2:D2" };
        /* E2 cell formula  =SUM(A2:B2*A2:B2) */
        ws["E2"] = { t:'n', f:"SUM(A1:B1*A1:B1)" };

        ws["!ref"] = "A1:E2";
        ws["!cols"] = ws["!cols"] || [];
        ws["!cols"][2] = {wch: formula.length};

        // var wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        // XLSX.writeFile(wb, "issue1123.xlsx")

        XLSX.utils.book_append_sheet(wb, ws, 'skuImport template');
        XLSX.writeFile(wb, path.join(__dirname, `${fileName}`));

        await res.download(path.join(__dirname, `${fileName}`), (err) => {
            if (err) {
                if (err) { res.status(400).json({ status: 400, success: false, message: err }) }
                console.log("DownloadError", err);
            }
        })
    }

    updateDmStatus = async (req: Request, res: Response) => {
        res.locals = {status: false, message: Messages.UPDATE_FAILED};
        let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
        let data = await new SkuRepository().updateDmStatus(body, loggedInUserId, mongoSession)
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateStoneStatus`);
    }

    updateDmGuidTransaction = async (req: Request, res: Response) => {
        const {body: {newData, loggedInUser:{_id:loggedInUserId}}, mongoSessionNew: session} = req as any
        let transaction = await new TransactionImportRepository().findOneBR({transactionId: req?.query?.transactionId}, {}, [{path: "companyId"}]);
        await session.withTransaction(async() => new SkuRepository().updateDmGuidTransaction(transaction?.skuIds, loggedInUserId, session))
        res.locals = {status: true, message: Messages.UPDATE_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.changeInfinityPrice`);
    }
}
