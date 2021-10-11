import {BaseController} from "../BaseController";
import {Application, Request, Response} from "express";
import {JsonResponse, TryCatch} from "../../helper";
import {guard} from "../../helper/Auth";
import { IActivity } from "./activity.types";
import ActivityBusiness from "./activity.business";
import { ActivityValidation } from "./activity.validation";
import * as Excel  from 'exceljs'
import path from 'path'
import { cond } from "lodash";
import SkuBusiness from "../sku/sku.business";
import IavBusiness from "../iav/iav.business";
import {Messages, Constant} from "../../constants"
import { ActivityRepository } from "./activity.repository";
import {MongooseTransaction} from "../../helper/MongooseTransactions";
import {RequestWithTransaction} from "../../interfaces/Request";
import { disPlayConfigindex } from "../../helper/displayConfigData";
import { number } from "joi";
import lo from "lodash";

//import * as ExcelJS from 'exceljs/dist/exceljs.min.js';

export class ActivityController extends BaseController<IActivity> {
    constructor() {
        super(new ActivityBusiness(), "activity", true);
        this.init();
    }

    register(express: Application): void {
        express.use('/api/v1/activity', guard, this.router);
    }

    init(): void {   //Todo write validation
        this.router.get("/", TryCatch.tryCatchGlobe(this.find));
        this.router.get("/exportExcel", TryCatch.tryCatchGlobe(this.exportReport));
        this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
        this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
        this.router.post("/group-by", TryCatch.tryCatchGlobe(this.groupByBC))
    }

    async index(req: Request, res: Response): Promise<void> {
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        let {data, page}: any = await new ActivityRepository().index(req.query)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.create`);
    }
    
    async find(req: Request, res: Response): Promise<void> {
        let populate = [{path: "skuId"},{path: "userId", select: '-password'},{path: "companyId"},{path: "labsId"},{path: "dmId"},{path:'iavId',populate:
                [
          {
              path: 'rapPriceId',
              model: 'RapPrice'
          },
          {
              path: 'clientPriceId',
              model: 'ClientPrice'
          }
      ] }, {path: 'createdBy'}, {path: 'updatedBy'}]        
        await new ActivityController().findBC(req, res, populate)
    }


  async exportReport(req: Request, res: Response): Promise<void> {
    let workbook = new Excel.Workbook();
    // let data: any = []
    req.query.displayConfig = [{"key":"screen","value":"Activity"}]
    let [ activity, displayconfig] = await Promise.all([
      await new ActivityRepository().index(req.query),
      await disPlayConfigindex(req)
    ])
    
    const headerData: any = [];
    displayconfig[0].config.map((item: any) => {if(item.isActive === true) headerData.push({ name: item.text, filterButton: true, valKey: item.valKey }) });

    // console.log("---------------DB-----",data);

    // let headerData = [{ name: "Line Number" }, { name: "Status" }, { name: "Company" }, { name: "Reference Number" }, { name: "PWV" }, { name: "RFID" }, { name: "Report Type" }, { name: "Report Number" }, { name: "IAV" }, { name: "Shape" }, { name: "Color" }
    //   , { name: "Color Type" }, { name: "Grading Shape" }, { name: "Grading Color" }, { name: "Clarity" }, { name: "V/C" }, { name: "DRV" }, { name: "Last DiamondMatch" }, { name: "Diamond Match" }]

    let requiredData = [];
    // let arr: any[] = []
    requiredData.push([]);
    // for (let i = 0; i < data.length; i++) {
    //   let vcValue = (data[i].skuId?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
    //   arr = [i + 1, data[i].status, data[i].companyId?.name, data[i].skuId?.infinityRefId, '$  ' + data[i].iavId?.pwv, data[i].skuId?.rfId?.rfid,
    //   data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].iavId?.iav, data[i].skuId?.shape, data[i].skuId?.color, data[i].skuId?.colorType,
    //   data[i].skuId?.gradeReportShape, data[i].skuId?.gradeReportColor, data[i].skuId?.clarity, '$  ' + (vcValue ?? ''),
    //   '$  ' + data[i].iavId?.drv, data[i].dmId?.createdAt, 'xxx'];
    //   requiredData.push(arr);
    // }
    //@ts-expect-error    
    for (const [i, element] of activity.data.entries()) {
      let arr: any[] = []

      for (const item of displayconfig[0].config) {
        let valKey = await item.valKey.split(".");

        if (item.isActive === false) continue
        if (valKey[valKey.length - 1] === "drv" || valKey[valKey.length - 1] === "pwv" || valKey[valKey.length - 1] === "price") (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push(0);
        else if(valKey[valKey.length-1] === "iav") (lo.get(element, valKey))? arr.push(lo.get(element, valKey)) : arr.push((0.00));
        else (lo.get(element, valKey)) ? arr.push(lo.get(element, valKey)) : arr.push('')
      };
      requiredData.push(arr);
    }

    let worksheet = workbook.addWorksheet('Activity Export')
    await new ActivityBusiness().exportExcel(worksheet, headerData, requiredData)
    let fileName = 'ActivityExport.xlsx'
    await workbook.xlsx.writeFile(path.join(__dirname, `${fileName}`))
    res.download(path.join(__dirname, `${fileName}`), (err) => {
      if (err) {
        if (err) { res.status(400).json({ status: 400, success: false, message: err }) }
        console.log("DownloadError", err);
      }
    })
  }

  async filter(req: Request, res: Response): Promise<void> {
    res.locals = { status: false, message: Messages.FETCH_FAILED }
    let { body: { loggedInUser: { _id: loggedInUserId } } } = req
    let data = await new ActivityRepository().filter(loggedInUserId)
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
      data.company.sort((a: any, b: any) => {return  (a.sorted).localeCompare(b.sorted);});
      data.price = { ...data.price, clientPrice };
      data.dmStatus = ["MATCHED", "NOTMATCHED"];
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