import {Application, Request, Response} from 'express';
import {JsonResponse, TryCatch} from '../../helper';
import {guard} from "../../helper/Auth"
import {BaseController} from '../BaseController';
import * as Excel from 'exceljs'
import path from 'path'
import {HeaderData} from '../../constants/ReportHeaders'
//import TransitBusiness from "../transit/transit.business";
import transitModel from '../transit/transit.model';
import companyModel from '../company/company.model'
import diamondMatchModel from '../diamond-match/diamond-match.model'
import {ActivityRepository} from '../activity/activity.repository'
import activityModel from '../activity/activity.model'
import {SkuRepository} from '../sku/sku.repository';
import {DiamondMatchRepository} from '../diamond-match/diamond-match.repository';
import SummaryReportBusiness from "./summary.business"
import {ISummaryReport} from "./summary.types"
import summaryReportModel from "./summary.model"
import {SummaryReportRepository} from './summary.repository';
import {Messages} from "../../constants";
import { ISetting } from '../setting/setting.types';
import settingModel from '../setting/setting.model';
import bcrypt from "bcrypt";
import diamondMatchReportModel from './daimondMatchReport/diamondMatchReport.model';
import dialyMatchReportModel from './dailyMatchReport/dialyMatchReport.model';
import TransporterStorageReportModel from './transporterStorageReport/transporterStorageReport.model';
import CollateralAccountedReportModel from './collateralAccountedReport/collateralAccountedReport.model';
import CollateralUnAccountedReportModel from './collateralUnaccountedReport/collateralUnaccountedReport.model';
import CollateralSoldReportModel from './collateralSoldReport/collateralSoldReport.model';
import CollateralAddedReportModel from './collateralAddedReport/collateralAddedReport.model';
import CollateralInceptionReportModel from './collateralInceptionReport/collateralInceptionReport.model';
import CollateralRemovedReportModel from './collateralRemovedReport/collateralRemovedReport.model';
import CurrentCollateralReportModel from './currentCollateralReport/currentCollateralReport.model';
import { MongooseTransaction } from '../../helper/MongooseTransactions';
import { RequestWithTransaction } from '../../interfaces/Request';
import mongoose, { ClientSession } from "mongoose";
import { skuCollateralStatusEnum, skuStoneStatusEnum } from '../sku/sku.types';

// # of Stones values
let accLength = 0, unAccLength = 0, soldLength = 0, addedLength = 0, removedLength = 0,inceptionLength=0;
export class SummaryController extends BaseController<ISummaryReport> {
  constructor() {
    super(new SummaryReportBusiness(), "summary",true, new SummaryReportRepository());
    //super('', 'summary');
    this.init();
    //this.UserValidation = new UserValidation;
  }

  /**
   * @param express
   */
  public register(express: Application): void {
    express.use('/api/v1/summary', guard, this.router); //guard
  }


  public init() {
    const transaction: MongooseTransaction = new MongooseTransaction();
    this.router.get("/report", TryCatch.tryCatchGlobe(this.exportReport));
    this.router.get("/", TryCatch.tryCatchGlobe(this.find));
    this.router.get("/index", TryCatch.tryCatchGlobe(this.index));
    this.router.get("/row/report", TryCatch.tryCatchGlobe(this.getRowLevelReport));
    this.router.get("/filterCriteria", TryCatch.tryCatchGlobe(this.filter))
    this.router.delete("/power-bi-report", TryCatch.tryCatchGlobe(this.powerBiReportDelete))
    // this.router.get("/dummy", transaction.startTransaction, TryCatch.tryCatchGlobe(this.dummy))
  }

  async dummy(req: Request, res: Response): Promise<void> {
    let { body, mongoSession, body: { loggedInUser: { _id: loggedInUserId } } } = req as RequestWithTransaction;
    let time
    // , mongoose.Types.ObjectId('601d2eedbb09fa11872f4368'), mongoose.Types.ObjectId('6034b82071c63567f8ce92a8'), mongoose.Types.ObjectId('60377b6ff0a13b29d9f4cb22')
    let data = await new SummaryReportRepository().powerBiReport([mongoose.Types.ObjectId("5f3e2a9335ebe9003c84b91f"), mongoose.Types.ObjectId("60377b6ff0a13b29d9f4cb22")], time, mongoSession)
    res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL };
    await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);

  }

  async find(req: Request, res: Response): Promise<void> {
    let populate = [{ path: "companyId" }]
    await new SummaryController().findBC(req, res, populate)
  }

  async index(req: Request, res: Response): Promise<void> {
    res.locals = { status: false, message: Messages.FETCH_FAILED };
    const { data, page }: any = await new SummaryReportRepository().index(req.query as any)
    res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL };
    await JsonResponse.jsonSuccess(req, res, `{this.url}.index`);
  }

  async getRowLevelReport(req: Request, res: Response): Promise<void> {
    let { query: { _id } } = req;
    let summaryData: any = await new SummaryReportBusiness().findOneBB({ _id: _id, isDeleted: false }, {});
    if (!summaryData) {
      res.locals = { status: false, message: Messages.NO_SUMMARY_DATA };
      await JsonResponse.jsonError(req, res, `{this.url}.getRowLevelReport`);
    } else {
      console.log(path.join(summaryData?.filePath));

      res.download(path.join(summaryData?.filePath), (err) => {
        if (err) {
          res.locals = { status: false, message: err };
          JsonResponse.jsonError(req, res, `{this.url}.getRowLevelReport`);
          console.log("DownloadError", err);
        }
      })
    }
  }

  //@ts-expect-error
  async dailyReport(worksheet, req: Request, res: Response): Promise<any> {
    // let {query:{filters:{_id, companyId}}} = req
    for (let index = 1; index <= 20; index++) {
      worksheet.getColumn(index).width = 24
    }

    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
   
    let company = await companyModel.findOne({ _id: filter[0].value, isDeleted: false }).sort({ createdAt: -1 }).select({ name: 1 })
    //worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').font = { bold: true }
    worksheet.getCell('A1').value = 'Date : ' + Date()
    worksheet.getCell('A3').font = { bold: true, underline: true }
    worksheet.getCell('A3').value = company?.name //companyName
    worksheet.getCell('A4').font = { bold: true }
    worksheet.getCell('A4').value = "Collateral metrics"
    worksheet.getCell('A5').font = { bold: true }
    worksheet.getCell('A5').value = await new SummaryController().getWeekNumber(new Date())
    worksheet.getCell('A7').font = { bold: true, underline: true, size: 16 }
    worksheet.getCell('A7').value = "Item Tracking"
    worksheet.getCell('A9').font = { bold: true, underline: true }
    worksheet.getCell('A9').value = "SINCE INCEPTION"
    worksheet.getCell('A10').value = "Carat Weight"
    worksheet.getCell('A10').font = { bold: true }
    worksheet.getCell('A11').value = "Value"
    worksheet.getCell('A11').font = { bold: true }
    worksheet.getCell('A12').value = "# of stones"
    worksheet.getCell('A12').font = { bold: true }
    // let Arry = [[`$"{='Collateral accounted for'!G2}"`,'{=K10}',"=IF(C10=0,0,B10/C10)","='Collateral unaccounted for'!C2","=IF(E10=0,'OK','ALERT')"]]
    await new SummaryController().dailyReportTable(worksheet, HeaderData.sinceInception_header, [], 'B9')
    worksheet.getCell('A15').font = { bold: true, underline: true }
    worksheet.getCell('A15').value = "Daily summary"
    worksheet.getCell('A16').value = "Carat Weight"
    worksheet.getCell('A16').font = { bold: true }
    worksheet.getCell('A17').value = "Value"
    worksheet.getCell('A17').font = { bold: true }
    worksheet.getCell('A18').value = "# of stones"
    worksheet.getCell('A18').font = { bold: true }
    await new SummaryController().dailyReportTable(worksheet, HeaderData.sinceInception_header, [], 'B15')
    worksheet.getCell('A20').font = { bold: true, underline: true, size: 16 }
    worksheet.getCell('A20').value = "Diamond Match"
    worksheet.getCell('A23').font = { bold: true }
    worksheet.getCell('A23').value = "Daily Match"
    worksheet.getCell('A24').value = "Carat Weight"
    worksheet.getCell('A24').font = { bold: true }
    worksheet.getCell('A25').value = "Value"
    worksheet.getCell('A25').font = { bold: true }
    worksheet.getCell('A26').value = "# of stones"
    worksheet.getCell('A26').font = { bold: true }
    worksheet.getCell('A27').value = "No of tests"
    worksheet.getCell('A27').font = { bold: true }
    await new SummaryController().dailyReportTable5(worksheet, HeaderData.dailyMatch_header, [], 'B23',req,res)
    worksheet.getCell('A30').font = { bold: true }
    worksheet.getCell('A30').value = "Malca Storage"
    worksheet.getCell('A31').value = "Carat Weight"
    worksheet.getCell('A31').font = { bold: true }
    worksheet.getCell('A32').value = "Value"
    worksheet.getCell('A32').font = { bold: true }
    worksheet.getCell('A33').value = "# of stones"
    worksheet.getCell('A33').font = { bold: true }
    await new SummaryController().dailyReportTable7(worksheet, HeaderData.malcaStorage_header, [], 'B30',req,res)
    //Inception Tab 2 ,3
    await new SummaryController().dailyReportTable2(worksheet, HeaderData.sinceInception_header2, [], 'H9')
    await new SummaryController().dailyReportTable4(worksheet, HeaderData.sinceInception_header3, [], 'H15',req,res)
    //Diamond Match 3,4
    await new SummaryController().dailyReportTable6(worksheet, HeaderData.dailyMatch_header, [], 'I23',req,res)
    await new SummaryController().dailyReportTable8(worksheet, HeaderData.malcaStorage_header, [], 'J30',req,res)
  }

  //@ts-expect-error
  async dailyReportTable(worksheet, header, data, refVal) {
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);

    let row = worksheet.getRow(rowVal)
    // worksheet.getRow(row).outlineLevel =1
    worksheet.getCell('B10').value = { formula: "='Collateral accounted for'!G2" }
    worksheet.getCell('C10').value = { formula: "=K10" }
    worksheet.getCell('D10').value = { formula: "=IF(C10=0,0,B10/C10)" }
    worksheet.getCell('D10').numFmt = '0.00%';
    worksheet.getCell('E10').value = { formula: "='Collateral unaccounted for'!C2" }
    worksheet.getCell('F10').value = { formula: '=IF(E10=0,"OK","ALERT")' }
    worksheet.getCell('F10').style = {alignment : { vertical: 'middle', horizontal: 'center'},font: { bold:true}}

    worksheet.getCell('B11').value = { formula: "='Collateral accounted for'!Q2" }
    worksheet.getCell('B11').numFmt ='$#,##0.00'
    worksheet.getCell('C11').value = { formula: "=K11" }
    worksheet.getCell('C11').numFmt ='$#,##0.00'
    worksheet.getCell('D11').value = { formula: "=IF(C11=0,0,B11/C11)" }
    worksheet.getCell('D11').numFmt = '0.00%';
    worksheet.getCell('E11').value = { formula: "='Collateral unaccounted for'!L2" }
    worksheet.getCell('F11').value = { formula: '=IF(E11=0,"OK","ALERT")' }
    worksheet.getCell('F11').style = {alignment : { vertical: 'middle', horizontal: 'center'},font: { bold:true}}

    worksheet.getCell('B12').value = accLength
    worksheet.getCell('C12').value = { formula: "=K12" }
    worksheet.getCell('D12').value = { formula: "=IF(C12=0,0,B12/C12)" }
    worksheet.getCell('D12').numFmt = '0.00%';
    worksheet.getCell('E12').value = unAccLength 
    //=COUNTIF('Collateral sold'!A3:A4,"*") =COUNTIF('Collateral unaccounted for'!A2:A1048576,"*")
    worksheet.getCell('F12').value = { formula: '=IF(E12=0,"OK","ALERT")' }
    worksheet.getCell('F12').style = {alignment : { vertical: 'middle', horizontal: 'center'},font: { bold:true}}

    worksheet.getCell('B16').value = { formula: "='Collateral accounted for'!G2" }
    worksheet.getCell('C16').value = { formula: "=K16" }
    worksheet.getCell('D16').value = { formula: "=IF(C16=0,0,B16/C16)" }
    worksheet.getCell('D16').numFmt = '0.00%';
    worksheet.getCell('E16').value = { formula: "=C16-B16" }
    worksheet.getCell('F16').value = { formula: '=IF(E16<0.01,"OK","ALERT")' }
    worksheet.getCell('F16').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }

    worksheet.getCell('B17').value = { formula: "='Collateral accounted for'!Q2" }
    worksheet.getCell('B17').numFmt ='$#,##0.00'
    worksheet.getCell('C17').value = { formula: "=K17" }
    worksheet.getCell('C17').numFmt ='$#,##0.00'
    worksheet.getCell('D17').value = { formula: "=IF(C17=0,0,B17/C17)" }
    worksheet.getCell('D17').numFmt = '0.00%';
    worksheet.getCell('E17').value = { formula: "=C17-B17" }
    worksheet.getCell('E17').numFmt ='$#,##0.00'
    worksheet.getCell('F17').value = { formula: '=IF(E17<0.01,"OK","ALERT")' }
    worksheet.getCell('F17').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }

    worksheet.getCell('B18').value = accLength
    worksheet.getCell('C18').value = { formula: "=K18" }
    worksheet.getCell('D18').value = { formula: "=IF(C18=0,0,B18/C18)" }
    worksheet.getCell('D18').numFmt = '0.00%';
    worksheet.getCell('E18').value = { formula: "=C18-B18" }
    worksheet.getCell('F18').value = { formula: '=IF(E18<0.01,"OK","ALERT")' }
    worksheet.getCell('F18').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }

    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: data
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
        // fgColor: { argb: '00FFFF' },
        // bgColor: { argb: '#9A9A21' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
    let cells: any = ['B10', 'B11', 'B12', 'B16', 'B17', 'B18',
      'C10', 'C11', 'C12', 'C16', 'C17', 'C18',
      'D10', 'D11', 'D12', 'D16', 'D17', 'D18',
      'E10', 'E11', 'E12', 'E16', 'E17', 'E18',
      'F10', 'F11', 'F12', 'F16', 'F17', 'F18',]
    await new SummaryController().applyCellBorder(cells, worksheet)
  }

    //@ts-expect-error
  async dailyReportTable2(worksheet, header, data, refVal) {
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);

    let row = worksheet.getRow(rowVal)
    // worksheet.getRow(row).outlineLevel =1
    worksheet.getCell('H10').value = { formula: "='Collateral at inception'!G2" }
    worksheet.getCell('I10').value = { formula: "='Collateral sold'!G2" }
    worksheet.getCell('J10').value = { formula: "='Collateral added'!G2" }
    worksheet.getCell('K10').value = { formula: "=H10-I10+J10" }
    worksheet.getCell('L10').value = { formula: "='Collateral removed'!G2" }

    worksheet.getCell('H11').value = { formula: "='Collateral at inception'!Q2" }
    worksheet.getCell('H11').numFmt ='$#,##0.00'
    worksheet.getCell('I11').value = { formula: "='Collateral sold'!Q2" }
    worksheet.getCell('I11').numFmt ='$#,##0.00'
    worksheet.getCell('J11').value = { formula: "='Collateral added'!Q2" }
    worksheet.getCell('J11').numFmt ='$#,##0.00'
    worksheet.getCell('K11').value = { formula: "=H11-I11+J11" }
    worksheet.getCell('K11').numFmt ='$#,##0.00'
    worksheet.getCell('L11').value = { formula: "='Collateral removed'!Q2" }
    worksheet.getCell('L11').numFmt ='$#,##0.00'

    worksheet.getCell('H12').value = inceptionLength//Col-inception length
    worksheet.getCell('I12').value = soldLength
    worksheet.getCell('J12').value = addedLength
    worksheet.getCell('K12').value = { formula: "=H12-I12+J12" }
    worksheet.getCell('L12').value = removedLength

    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: data
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
    let cells: any = ['H10', 'H11', 'H12', 'I10', 'I11', 'I12', 'J10', 'J11', 'J12', 'K10', 'K11', 'K12', 'L10', 'L11', 'L12',]
    await new SummaryController().applyCellBorder(cells, worksheet)
  }

    //@ts-expect-error
  async dailyReportTable4(worksheet, header, arryData, refVal, req: Request, res: Response) {
    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);
    var start = new Date()
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    console.log("Dateee", start + '-------' + end);

    let row = worksheet.getRow(rowVal)
    let prevDate: any = new Date().setDate(new Date().getDate() - 1);
    //prevDate.setHours(0,0,0,0);
    //worksheet.getCell('H14').value = new Date().toISOString().split('T')[0]
    // console.log(new Date().toISOString()+"Dateeeeeeeeeeeeeeeee");createdAt:new Date(prevDate)

    let cond: any = { status: "IN", isDeleted: false }
    cond["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    //cond['createdAt'] = {"$gte": start,"$lte": end};
    let data = await new SummaryController().dailyActivityAggregate(cond)
    console.log("AGGR....daily4 dataTwo......", data);
    worksheet.getCell('H16').value = data?.totalWeights
    worksheet.getCell('H17').value = data?.totalPwv
    worksheet.getCell('H17').numFmt ='$#,##0.00'
    worksheet.getCell('H18').value = data?.countStones
    

    let condOne: any = { status: "SOLD", isDeleted: false }
    condOne["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataOne = await new SummaryController().dailyActivityAggregate(condOne)
    console.log("AGGR....daily4......", dataOne);
    worksheet.getCell('I16').value = dataOne?.totalWeights
    worksheet.getCell('I17').value = dataOne?.totalPwv
    worksheet.getCell('I17').numFmt ='$#,##0.00'
    worksheet.getCell('I18').value = dataOne?.countStones

    let condTwo: any = { status: "COLLATERAL IN", isDeleted: false }
    condTwo["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataTwo = await new SummaryController().dailyActivityAggregate(condTwo)
    console.log("AGGR....daily4 dataTwo......", dataTwo);
    worksheet.getCell('J16').value = dataTwo?.totalWeights
    worksheet.getCell('J17').value = dataTwo?.totalPwv
    worksheet.getCell('J17').numFmt ='$#,##0.00'
    worksheet.getCell('J18').value = dataTwo?.countStones

    worksheet.getCell('K16').value = { formula: "=H16-I16+J16" }
    worksheet.getCell('K17').value = { formula: "=H17-I17+J17" }
    worksheet.getCell('K17').numFmt ='$#,##0.00'
    worksheet.getCell('K18').value = { formula: "=H18-I18+J18" }
    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: arryData
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
        // fgColor: { argb: '00FFFF' },
        // bgColor: { argb: '#9A9A21' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
    let cells: any = ['H16', 'H17', 'H18', 'I16', 'I17', 'I18', 'J16', 'J17', 'J18', 'K16', 'K17', 'K18']
    await new SummaryController().applyCellBorder(cells, worksheet)
  }

   //@ts-expect-error
   async dailyReportTable5(worksheet, header, arryData, refVal, req: Request, res: Response) {
    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);
    var start = new Date()
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    //console.log("Dateee", start + '-------' + end);

    let row = worksheet.getRow(rowVal)
    let prevDate: any = new Date().setDate(new Date().getDate() - 1);
    //prevDate.setHours(0,0,0,0);
   // worksheet.getCell('H14').value = new Date().toISOString().split('T')[0]
    // console.log(new Date().toISOString()+"Dateeeeeeeeeeeeeeeee");createdAt:new Date(prevDate)

    let cond: any = { status:{'$in': ["MATCHED","NOTMATCHED"]}, isDeleted: false }
    cond["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    //cond['createdAt'] = {"$gte": start,"$lte": end};
    let data = await new SummaryController().dailyDiamondMatchAggregate(cond)
    console.log("AGGR....daily4 data...MN.....NEW aggr......", data);
     worksheet.getCell('B24').value = data?.totalWeights
    worksheet.getCell('B25').value = data?.totalPwv
    worksheet.getCell('B25').numFmt ='$#,##0.00'
    let count = await new SummaryController().dailyDiamondMatchCountAggregate(cond)
    worksheet.getCell('B26').value = count?.totalCount
    worksheet.getCell('B27').value = count?.totalCount  //No.of tests

    let condOne: any = { status: "MATCHED", isDeleted: false }
    condOne["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataOne = await new SummaryController().dailyDiamondMatchAggregate(condOne)
    console.log("AGGR....daily4...M...", dataOne);
    worksheet.getCell('C24').value = dataOne?.totalWeights
    worksheet.getCell('C25').value = dataOne?.totalPwv
    worksheet.getCell('C25').numFmt ='$#,##0.00'
    let countOne = await new SummaryController().dailyDiamondMatchCountAggregate(condOne)
    worksheet.getCell('C26').value = countOne?.totalCount
    worksheet.getCell('C27').value = countOne?.totalCount  //No.of tests

    let condTwo: any = { status: "NOTMATCHED", isDeleted: false }
    condTwo["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataTwo = await new SummaryController().dailyDiamondMatchAggregate(condTwo)
    console.log("AGGR....daily4 dataTwo.NM.....", dataTwo);
    worksheet.getCell('D24').value = dataTwo?.totalWeights
    worksheet.getCell('D25').value = dataTwo?.totalPwv
    worksheet.getCell('D25').numFmt ='$#,##0.00'
    let countTwo = await new SummaryController().dailyDiamondMatchCountAggregate(condTwo)
    worksheet.getCell('D26').value = countTwo?.totalCount
    worksheet.getCell('D27').value = countTwo?.totalCount  //No.of tests

    worksheet.getCell('F24').value = { formula: "=IF(B24 > 0, C24/B24, 1)" }
    worksheet.getCell('F24').numFmt = '0.00%';
    worksheet.getCell('F25').value = { formula: "=IF(B25 > 0, C25/B25, 1)" }
    worksheet.getCell('F25').numFmt = '0.00%';
    worksheet.getCell('F26').value = { formula: "=IF(B26 > 0, C26/B26, 1)" }
    worksheet.getCell('F26').numFmt = '0.00%';
    worksheet.getCell('F27').value = { formula: "=IF(B27 > 0, C27/B27, 1)" }
    worksheet.getCell('F27').numFmt = '0.00%';

    worksheet.getCell('G24').value = { formula: '=IF(F24=1,"OK","ALERT")' }
    worksheet.getCell('G24').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('G25').value = { formula: '=IF(F25=1,"OK","ALERT")' }
    worksheet.getCell('G25').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('G26').value = { formula: '=IF(F26=1,"OK","ALERT")' }
    worksheet.getCell('G26').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('G27').value = { formula: '=IF(F27=1,"OK","ALERT")' }
    worksheet.getCell('G27').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }


    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: arryData
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
        // fgColor: { argb: '00FFFF' },
        // bgColor: { argb: '#9A9A21' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
     let cells: any = ['B24', 'B25', 'B26', 'B27', 'C24', 'C25', 'C26', 'C27', 'D24', 'D25', 'D26', 'D27', ,
       'E24', 'E25', 'E26', 'E27', 'F24', 'F25', 'F26', 'F27', 'G24', 'G25', 'G26', 'G27',]
     await new SummaryController().applyCellBorder(cells, worksheet)
  }

  //@ts-expect-error
  async dailyReportTable6(worksheet, header, arryData, refVal, req: Request, res: Response) {
    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);
    var start = new Date()
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    // console.log("Dateee", start + '-------' + end);

    let row = worksheet.getRow(rowVal)
    let prevDate: any = new Date().setDate(new Date().getDate() - 1);
    //prevDate.setHours(0,0,0,0);
    //worksheet.getCell('H14').value = new Date().toISOString().split('T')[0]
    // console.log(new Date().toISOString()+"Dateeeeeeeeeeeeeeeee");createdAt:new Date(prevDate)

    let cond: any = { status: { '$in': ["MATCHED", "NOTMATCHED"] }, isDeleted: false }
    cond["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    //cond['createdAt'] = {"$gte": start,"$lte": end};
    let data = await new SummaryController().dailyDiamondMatchAggregate(cond)
    console.log("AGGR....daily4 data...MN.....NEW aggr......", data);
    worksheet.getCell('I24').value = data?.totalWeights
    worksheet.getCell('I25').value = data?.totalPwv
    worksheet.getCell('I25').numFmt ='$#,##0.00'
    let count = await new SummaryController().dailyDiamondMatchCountAggregate(cond)
    worksheet.getCell('I26').value = count?.totalCount
    worksheet.getCell('I27').value = count?.totalCount  //No.of tests

    let condOne: any = { status: "MATCHED", isDeleted: false }
    condOne["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataOne = await new SummaryController().dailyDiamondMatchAggregate(condOne)
    console.log("AGGR....daily4...M...", dataOne);
    worksheet.getCell('J24').value = dataOne?.totalWeights
    worksheet.getCell('J25').value = dataOne?.totalPwv
    worksheet.getCell('J25').numFmt ='$#,##0.00'
    let countOne = await new SummaryController().dailyDiamondMatchCountAggregate(condOne)
    worksheet.getCell('J26').value = countOne?.totalCount
    worksheet.getCell('J27').value = countOne?.totalCount  //No.of tests

    let condTwo: any = { status: "NOTMATCHED", isDeleted: false }
    condTwo["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataTwo = await new SummaryController().dailyDiamondMatchAggregate(condTwo)
    console.log("AGGR....daily4 dataTwo.NM.....", dataTwo);
    worksheet.getCell('K24').value = dataTwo?.totalWeights
    worksheet.getCell('K25').value = dataTwo?.totalPwv
    worksheet.getCell('K25').numFmt ='$#,##0.00'
    let countTwo = await new SummaryController().dailyDiamondMatchCountAggregate(condTwo)
    worksheet.getCell('K26').value = countTwo?.totalCount
    worksheet.getCell('K27').value = countTwo?.totalCount  //No.of tests

    worksheet.getCell('M24').value = { formula: "=IF(B24 > 0, C24/B24, 1)" }
    worksheet.getCell('M24').numFmt = '0.00%';
    worksheet.getCell('M25').value = { formula: "=IF(B25 > 0, C25/B25, 1)" }
    worksheet.getCell('M25').numFmt = '0.00%';
    worksheet.getCell('M26').value = { formula: "=IF(B26 > 0, C26/B26, 1)" }
    worksheet.getCell('M26').numFmt = '0.00%';
    worksheet.getCell('M27').value = { formula: "=IF(B27 > 0, C27/B27, 1)" }
    worksheet.getCell('M27').numFmt = '0.00%';

    worksheet.getCell('N24').value = { formula: '=IF(F24=1,"OK","ALERT")' }
    worksheet.getCell('N24').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('N25').value = { formula: '=IF(F25=1,"OK","ALERT")' }
    worksheet.getCell('N25').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('N26').value = { formula: '=IF(F26=1,"OK","ALERT")' }
    worksheet.getCell('N26').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('N27').value = { formula: '=IF(F27=1,"OK","ALERT")' }
    worksheet.getCell('N27').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }


    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: arryData
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
        // fgColor: { argb: '00FFFF' },
        // bgColor: { argb: '#9A9A21' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
    let cells: any = ['I24', 'I25', 'I26', 'I27', 'J24', 'J25', 'J26', 'J27', 'K24', 'K25', 'K26', 'K27', ,
      'L24', 'L25', 'L26', 'L27', 'M24', 'M25', 'M26', 'M27', 'N24', 'N25', 'N26', 'N27',]
    await new SummaryController().applyCellBorder(cells, worksheet)
  }

  // @ts-expect-error
  async dailyReportTable7(worksheet, header, arryData, refVal, req: Request, res: Response) {
    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);
    var start = new Date()
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    // console.log("Dateee", start + '-------' + end);

    let row = worksheet.getRow(rowVal)
    let prevDate: any = new Date().setDate(new Date().getDate() - 1);
    //prevDate.setHours(0,0,0,0);
    // console.log(new Date().toISOString()+"Dateeeeeeeeeeeeeeeee");createdAt:new Date(prevDate)

    let cond: any = { status: { '$in': ["INITIATED", "INPROGRESS"] }, isDeleted: false }
    cond["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    //cond['createdAt'] = {"$gte": start,"$lte": end};
    let data = await new SummaryController().dailyMalcaAggregate(cond)
    console.log("AGGR....MALCA data...I&I...........", data);
    worksheet.getCell('B31').value = data?.totalWeights
    worksheet.getCell('B32').value = data?.totalPwv
    worksheet.getCell('B32').numFmt = '$#,##0.00'
    let count = await new SummaryController().dailyMalcaCountAggregate(cond)
    worksheet.getCell('B33').value = count?.totalCount

    let condOne: any = { status: "INPROGRESS", isDeleted: false }
    condOne["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataOne = await new SummaryController().dailyMalcaAggregate(condOne)
    console.log("AGGR....malca INPROGRESS...M...", dataOne);
    worksheet.getCell('C31').value = dataOne?.totalWeights
    worksheet.getCell('C32').value = dataOne?.totalPwv
    worksheet.getCell('C32').numFmt = '$#,##0.00'
    let countOne = await new SummaryController().dailyMalcaCountAggregate(condOne)
    worksheet.getCell('C33').value = countOne?.totalCount

    // let condTwo: any = { status: "NOTMATCHED", isDeleted: false }
    // condTwo["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    // let dataTwo = await new SummaryController().dailyDiamondMatchAggregate(condTwo)
    // console.log("AGGR....daily4 dataTwo.NM.....", dataTwo);
    // worksheet.getCell('K24').value = dataTwo?.totalWeights
    // worksheet.getCell('K25').value = dataTwo?.totalPwv
    // worksheet.getCell('K25').numFmt ='$#,##0.00'
    // let countTwo = await new SummaryController().dailyDiamondMatchCountAggregate(condTwo)
    // worksheet.getCell('K26').value = countTwo?.totalCount
    // worksheet.getCell('K27').value = countTwo?.totalCount  //No.of tests

    worksheet.getCell('G31').value = { formula: "=IF(B31 > 0, C31/B31, 1)" }
    worksheet.getCell('G31').numFmt = '0.00%';
    worksheet.getCell('G32').value = { formula: "=IF(B32 > 0, C32/B32, 1)" }
    worksheet.getCell('G32').numFmt = '0.00%';
    worksheet.getCell('G33').value = { formula: "=IF(B33 > 0, C33/B33, 1)" }
    worksheet.getCell('G33').numFmt = '0.00%';

    worksheet.getCell('H31').value = { formula: '=IF(G31=1,"OK","ALERT")' }
    worksheet.getCell('H31').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('H32').value = { formula: '=IF(G32=1,"OK","ALERT")' }
    worksheet.getCell('H32').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('H33').value = { formula: '=IF(G33=1,"OK","ALERT")' }
    worksheet.getCell('H33').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: arryData
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
        // fgColor: { argb: '00FFFF' },
        // bgColor: { argb: '#9A9A21' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
    let cells: any = ['B31', 'B32', 'B33', 'C31', 'C32', 'C33', 'D31', 'D32', 'D33', 'E31', 'E32', 'E33', 'F31', 'F32', 'F33', 'G31', 'G32', 'G33', 'H31', 'H32', 'H33']
    await new SummaryController().applyCellBorder(cells, worksheet)
  }

  // @ts-expect-error
  async dailyReportTable8(worksheet, header, arryData, refVal, req: Request, res: Response) {
    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
    for (let index = 1; index <= header.length; index++) {
      worksheet.getColumn(index).width = 15
    }
    //console.log("-->",worksheet);
    let rowVal = refVal.match(/\d+/g).map(Number);
    var start = new Date()
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    // console.log("Dateee", start + '-------' + end);

    let row = worksheet.getRow(rowVal)
    let prevDate: any = new Date().setDate(new Date().getDate() - 1);
    //prevDate.setHours(0,0,0,0);
    // console.log(new Date().toISOString()+"Dateeeeeeeeeeeeeeeee");createdAt:new Date(prevDate)

    let cond: any = { status: { '$in': ["INITIATED", "INPROGRESS"] }, isDeleted: false }
    cond["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    //cond['createdAt'] = {"$gte": start,"$lte": end};
    let data = await new SummaryController().dailyMalcaAggregate(cond)
    console.log("AGGR....MALCA data...I&I...........", data);
    worksheet.getCell('J31').value = data?.totalWeights
    worksheet.getCell('J32').value = data?.totalPwv
    worksheet.getCell('J32').numFmt = '$#,##0.00'
    let count = await new SummaryController().dailyMalcaCountAggregate(cond)
    worksheet.getCell('J33').value = count?.totalCount

    let condOne: any = { status: "INPROGRESS", isDeleted: false }
    condOne["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    let dataOne = await new SummaryController().dailyMalcaAggregate(condOne)
    console.log("AGGR....malca INPROGRESS...M...", dataOne);
    worksheet.getCell('K31').value = dataOne?.totalWeights
    worksheet.getCell('K32').value = dataOne?.totalPwv
    worksheet.getCell('K32').numFmt = '$#,##0.00'
    let countOne = await new SummaryController().dailyMalcaCountAggregate(condOne)
    worksheet.getCell('K33').value = countOne?.totalCount

    // let condTwo: any = { status: "NOTMATCHED", isDeleted: false }
    // condTwo["companyId"] = mongoose.Types.ObjectId(filter[0].value as string)
    // let dataTwo = await new SummaryController().dailyDiamondMatchAggregate(condTwo)
    // console.log("AGGR....daily4 dataTwo.NM.....", dataTwo);
    // worksheet.getCell('K24').value = dataTwo?.totalWeights
    // worksheet.getCell('K25').value = dataTwo?.totalPwv
    // worksheet.getCell('K25').numFmt ='$#,##0.00'
    // let countTwo = await new SummaryController().dailyDiamondMatchCountAggregate(condTwo)
    // worksheet.getCell('K26').value = countTwo?.totalCount
    // worksheet.getCell('K27').value = countTwo?.totalCount  //No.of tests

    worksheet.getCell('O31').value = { formula: "=IF(J31 > 0, K31/J31, 1)" }
    worksheet.getCell('O31').numFmt = '0.00%';
    worksheet.getCell('O32').value = { formula: "=IF(J32 > 0, K32/J32, 1)" }
    worksheet.getCell('O32').numFmt = '0.00%';
    worksheet.getCell('O33').value = { formula: "=IF(J33 > 0, K33/J33, 1)" }
    worksheet.getCell('O33').numFmt = '0.00%';

    worksheet.getCell('P31').value = { formula: '=IF(O31=1,"OK","ALERT")' }
    worksheet.getCell('P31').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('P32').value = { formula: '=IF(O32=1,"OK","ALERT")' }
    worksheet.getCell('P32').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    worksheet.getCell('P33').value = { formula: '=IF(O33=1,"OK","ALERT")' }
    worksheet.getCell('P33').style = { alignment: { vertical: 'middle', horizontal: 'center' }, font: { bold: true } }
    const table = worksheet.addTable({
      //name: 'SummaryReport',
      ref: refVal,
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium20',
        showRowStripes: true
      },
      columns: header,
      rows: arryData
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: 'B5A834' },
        bgColor: { argb: '#00FFFF' }
        // fgColor: { argb: '00FFFF' },
        // bgColor: { argb: '#9A9A21' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
    let cells: any = ['J31', 'J32', 'J33', 'K31', 'K32', 'K33', 'L31', 'L32', 'L33', 'M31', 'M32', 'M33', 'N31', 'N32', 'N33', 'O31', 'O32', 'O33', 'P31', 'P32', 'P33']
    await new SummaryController().applyCellBorder(cells, worksheet)
  }


  //@ts-expect-error
  async createTable(worksheet, header, data, sumFlag) {
    for (const [index, element] of header.entries()) {      
      worksheet.getColumn(index+1).width = 18
      if (element.name === 'PWV') worksheet.getColumn(index+1).numFmt = '$#,##0.00'
      else if (element.name === 'DRV') worksheet.getColumn(index+1).numFmt = '$#,##0.00'
      else if (element.name === 'V/C') worksheet.getColumn(index+1).numFmt = '$#,##0.00'
      else if (element.name === 'Rap Price') worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
      else if (element.name === 'Weight') worksheet.getColumn(index + 1).numFmt = '##.00'
    };
    let row = worksheet.getRow(1)
    if (sumFlag === true) { //=SUMPRODUCT(--SUBSTITUTE(R3:R6,"$ ",""))
      // console.log("--------------------------------------s U M F L A  G  ",sumFlag);
      // console.log("--------------------------------------Data lngth  ",data.length);
     if(data.length>1){
      worksheet.getCell('G2').value = { formula: '=SUM(' + `G3: G${(data.length + 1)}` + ')' }    //SUMIF(R3:R25,"<>#N/A") 
      worksheet.getCell('G2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
      // worksheet.getCell('Q2').value = { formula: '=SUMPRODUCT(--SUBSTITUTE(' + `Q3: Q${(data.length + 1)},"$","")` + ')' }
      worksheet.getCell('Q2').value = { formula: '=SUM(' + `Q3: Q${(data.length + 1)}` + ')' }
      // worksheet.getCell('Q2').numFmt ='$#,##0.00'
      worksheet.getCell('Q2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
    }else{
      worksheet.getCell('G2').value = 0    //SUMIF(R3:R25,"<>#N/A") 
      worksheet.getCell('G2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
      worksheet.getCell('Q2').value = 0
      //worksheet.getCell('Q2').numFmt ='$#,##0.00'
      worksheet.getCell('Q2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C0C0C0' } }
    }
  }
    // let row = worksheet.getRow(1)
    const table = worksheet.addTable({
      name: 'Summary Report',
      ref: 'A1',
      headerRow: { bold: true },
      totalsRow: false,
      style: {
        theme: "TableStyleMedium4",
        showRowStripes: false,
      },
      columns: header,
      rows: data
    });
    //@ts-expect-error
    row.eachCell((cell, number) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        font: { bold: true },
        fgColor: { argb: '808080' },
        bgColor: { argb: '#00FFFF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    table.commit()
  }

  async exportReport(req: Request, res: Response): Promise<void> {

    let { body: { loggedInUser: { _id: loggedInUserId } } } = req
    // @ts-expect-error
    let filter = JSON.parse(req.query.filters)
    let reqCompany = filter[0].value
    // var date = new Date().toISOString() //for current-month
    
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
    await Promise.all([
      await summaryControllerInstance.createTable(worksheet2, HeaderData.Diamond_match_header, await summaryControllerInstance.daimondMatchSheet(req, res), isSumFlag),
      await summaryControllerInstance.createTable(worksheet3, HeaderData.Daily_match_header, await summaryControllerInstance.dailyMatchSheet(req, res), isSumFlag),
      await summaryControllerInstance.createTable(worksheet4, HeaderData.Transporter_storage_header, await summaryControllerInstance.transporterStorageSheet(req, res), isSumFlag),
      await summaryControllerInstance.createTable(worksheet5, HeaderData.Collateral_accounted_header, await summaryControllerInstance.collateralAccountedSheet(req, res), isSumFlag = true),
      await summaryControllerInstance.createTable(worksheet6, HeaderData.Collateral_accounted_header, await summaryControllerInstance.collateralUnaccountedSheet(req, res), isSumFlag = true),  //similar header
      await summaryControllerInstance.createTable(worksheet7, HeaderData.Collateral_at_inception_header, await summaryControllerInstance.collateralInceptionSheet(req, res), isSumFlag = true),
      await summaryControllerInstance.createTable(worksheet8, HeaderData.Collateral_sold_header, await summaryControllerInstance.collateralSoldSheet(req, res), isSumFlag),
      await summaryControllerInstance.createTable(worksheet9, HeaderData.Collateral_sold_header, await summaryControllerInstance.collateralRemovedSheet(req, res), isSumFlag), //similar header  
      await summaryControllerInstance.createTable(worksheet10, HeaderData.Collateral_added_header, await summaryControllerInstance.collateralAddedSheet(req, res), isSumFlag),
      await summaryControllerInstance.createTable(worksheet11, HeaderData.Collateral_at_inception_header,await summaryControllerInstance.currentCollateralSheet(req, res), isSumFlag)      //similar header
    ])
    
    await summaryControllerInstance.dailyReport(worksheet1, req, res) 
    
    let fileName = 'SummaryReport_' + new Date().toDateString() + '_' + new Date().toLocaleTimeString().replace(/\:/g, '-') + '.xlsx'
    console.log("Dir-path -==== --->", path.join(__dirname + '/../../../public/excel', `${fileName}`));
    let fileRespo = await workbook.xlsx.writeFile(path.join(__dirname + '/../../../public/excel', `${fileName}`))

    //res.locals.message = 'File Created'
    let summaryBody: any = { companyId: reqCompany, filePath: `dist/public/excel/${fileName}`, createdBy: loggedInUserId, updatedBy: loggedInUserId }
    let summary: any = await summaryReportModel.create([summaryBody])
    res.download(path.join(__dirname + '/../../../public/excel', `${fileName}`), (err) => {
      if (err) {
        res.locals = { status: false, message: err };
        JsonResponse.jsonError(req, res, `{this.url}.exportReport`);
        console.log("DownloadError", err);
      }
    })
    // //await JsonResponse.jsonSuccess(req, res, `{this.url}.export`);
  }

  async currentCollateralSheet(req: Request, res: Response): Promise<any> {
  
    let Obj = { "key": "collateralStatus", "value": "COLLATERAL IN" }  //checking with boolean flag
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    //let dbData = await new SkuController().exportBC(req, res, populate)
    let {data, page}: any = await new SkuRepository().index(req.query)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {
      let vcValue = (data[i]?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if(!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv)? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv)? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav)? data[i].iavId?.iav : 0

      arr = [
        data[i].companyId?.name, data[i].rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].shape, data[i].colorSubCategory,data[i].weight, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, vcValue, drv, iav,'xxx' , pwv] 
      requiredData.push(arr);
    }
    console.log("Length...Current Col   ==============================>", HeaderData.Collateral_at_inception_header.length, arr.length+'\n\n');
    return requiredData
  }

  async transporterStorageSheet(req: Request, res: Response): Promise<any> {
    let Obj = { "key": "stoneStatus", "value": "TRANSIT" }  //Todo add "TRANSIT"
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj)
    req.query.filters = JSON.stringify(req.query.filters)
   // let dbData = await new SkuController().exportBC(req, res, populate)
    let {data, page}: any = await new SkuRepository().index(req.query)
    req.query.filters = JSON.parse(req.query.filters)
    // @ts-expect-error
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "stoneStatus"), 1) //removing obj to avoid params duplication 
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    for (let i = 0; i < data.length; i++) {
      let transResult = await transitModel.findOne({ skuIds: data[i]._id, isDeleted: false }).sort({ createdAt: -1 }).select({ "returnTime": 1 })
      let drv = (data[i].iavId?.drv)? data[i].iavId?.drv : 0
      //console.log("----->Trans..Res", transResult);
      arr = [
        data[i].rfId?.rfid, transResult?._id, data[i].tagId, data[i].companyId?.name, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].weight, data[i].shape, data[i].colorCategory, data[i].clarity, data[i].cut, drv, "xxx", "xxx", "xxx", transResult?.returnTime]
      requiredData.push(arr);
    }
    console.log("Length...TransportStorage  ==============================>", HeaderData.Transporter_storage_header.length, arr.length+'\n\n');
    return requiredData

  }

  async daimondMatchSheet(req: Request, res: Response): Promise<any> {

    let { data, page }: any = await new DiamondMatchRepository().index(req.query as any)

    let requiredData = [];
    let arr: any[] = []
    console.log("LEN" + data.length);

    for (let i = 0; i < data.length; i++) {
      let drv = (data[i].skuId?.iavId?.drv)? data[i].skuId?.iavId?.drv : 0
      arr = [
        data[i].createdAt, data[i].skuId?.rfId?.rfid, data[i].skuId?.labsId?.lab, data[i].skuId?.labsId?.labReportId, data[i].skuId?.weight, data[i].skuId?.shape, data[i].skuId?.colorCategory, data[i].skuId?.colorSubCategory, data[i].skuId?.gradeReportColor, data[i].skuId?.clarity, data[i].skuId?.cut, drv, data[i].dmType, data[i].status, "xxx", 'xxx', 'xxx']
      requiredData.push(arr);

    }
    console.log("Length...DiamondM  ==============================>", HeaderData.Diamond_match_header.length, arr.length + '\n\n');
    return requiredData
  }

  async dailyMatchSheet(req: Request, res: Response): Promise<any> {
  
    let Obj = { "key": "status", "value": ["MATCHED", "NOTMATCHED"] }
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    let {data, page}: any = await new ActivityRepository().index(req.query)
    req.query.filters = JSON.parse(req.query.filters)
    // @ts-expect-error
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "status"), 1) //removing obj to avoid params duplication 
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    for (let i = 0; i < data.length; i++) {
      let drv = (data[i].iavId?.drv)? data[i].iavId?.drv : 0
      arr = [
        data[i].skuId?.rfId?.rfid, data[i].companyId?.name, data[i].status, data[i].createdAt, 'xxx', 'xxx', 'xxx', data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].skuId?.weight, data[i].skuId?.shape, data[i].skuId?.colorSubCategory, data[i].skuId?.colorCategory, data[i].skuId?.gradeReportColor, data[i].skuId?.gradeReportShape, data[i].skuId?.clarity, data[i].skuId?.cut, drv, 'xxx']
      requiredData.push(arr);
    }
    console.log("Length...dailyM  ==============================>", HeaderData.Daily_match_header.length, arr.length+'\n\n');
    return requiredData
  }

  async collateralSoldSheet(req: Request, res: Response): Promise<any> {
  
    let Obj = { "key": "status", "value": "SOLD" }
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    let {data, page}: any = await new ActivityRepository().index(req.query)
    soldLength = data.length
    req.query.filters = JSON.parse(req.query.filters)
    // @ts-expect-error
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "status"), 1) //removing obj to avoid params duplication 
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {
      //TODO remove BB
      //let lastDm = await new DiamondMatchBusiness().findOneBB({ _id: dbData[i].dmId, isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 })
      let vcValue = (data[i].skuId?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if (!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv) ? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv) ? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav) ? data[i].iavId?.iav : 0

      arr = [
        data[i].companyId?.name, data[i].createdAt, data[i].skuId?.rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].skuId?.shape,data[i].skuId?.weight, data[i].skuId?.colorSubCategory, data[i].skuId?.colorCategory, data[i].skuId?.gradeReportColor, data[i].skuId?.gradeReportShape, data[i].skuId?.clarity, data[i].skuId?.cut,  vcValue,  drv, iav, pwv, data[i].dmId?.createdAt]
      requiredData.push(arr);
    }
    console.log("Length...Col-Sold ==============================>", HeaderData.Collateral_sold_header.length, arr.length + '\n\n');
    return requiredData

  }

  async collateralAddedSheet(req: Request, res: Response): Promise<any> {
  
    let Obj = { "key": "status", "value": "COLLATERAL IN" }
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    let {data, page}: any = await new ActivityRepository().index(req.query)
    addedLength = data.length
    req.query.filters = JSON.parse(req.query.filters)
    // @ts-expect-error
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "status"), 1) //removing obj to avoid params duplication 
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {

      let vcValue = (data[i].skuId?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if (!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv) ? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv) ? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav) ? data[i].iavId?.iav : 0
      arr = [
        data[i].status, data[i].companyId?.name, data[i].createdAt, data[i].skuId?.rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].skuId?.weight, data[i].skuId?.shape, data[i].skuId?.colorSubCategory, data[i].skuId?.colorCategory, data[i].skuId?.gradeReportColor, data[i].skuId?.gradeReportShape, data[i].skuId?.clarity, data[i].skuId?.cut,  vcValue,  drv,  pwv, iav, data[i].dmId?.createdAt]
      requiredData.push(arr);
    }
    console.log("Length...Col-Add ==============================>", HeaderData.Collateral_added_header.length, arr.length + '\n\n');
    return requiredData

  }

  async collateralRemovedSheet(req: Request, res: Response): Promise<any> {

    let Obj = { "key": "status", "value": "REMOVED" } //COLLATERAL_REMOVED
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    let {data, page}: any = await new ActivityRepository().index(req.query)
    removedLength = data.length
    req.query.filters = JSON.parse(req.query.filters)
    // @ts-expect-error
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "status"), 1) //removing obj to avoid params duplication 
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {
  
      let vcValue = (data[i].skuId?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if (!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv) ? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv) ? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav) ? data[i].iavId?.iav : 0

      arr = [
        data[i].companyId?.name, data[i].createdAt, data[i].skuId?.rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId,data[i].skuId?.shape, data[i].skuId?.weight, data[i].skuId?.colorSubCategory, data[i].skuId?.colorCategory, data[i].skuId?.gradeReportColor, data[i].skuId?.gradeReportShape, data[i].skuId?.clarity, data[i].skuId?.cut,  vcValue,  drv, iav,  pwv, data[i].dmId?.createdAt]
      requiredData.push(arr);
    }
    console.log("Length...Col-Removed ==============================>", HeaderData.Collateral_sold_header.length, arr.length + '\n\n');
    return requiredData

  }

  async collateralAccountedSheet(req: Request, res: Response): Promise<any> {
  
    let obj2 = {"key":"collateralStatus","value":"COLLATERAL IN"}
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(obj2)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    let {data, page}: any = await new SkuRepository().index(req.query)
    accLength = data.length
    req.query.filters = JSON.parse(req.query.filters)
     // @ts-expect-error
     req.query.filters.splice(req.query.filters.findIndex(item => item.field === "collateralStatus"), 1) //removing obj to avoid params duplication 
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {
      let vcValue = (data[i].colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if (!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv) ? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv) ? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav) ? data[i].iavId?.iav : 0

      arr = [
        data[i].stoneStatus, data[i].createdAt, data[i].companyId?.name, data[i].rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].weight, data[i].shape, data[i].colorSubCategory, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, vcValue,  drv,  pwv, iav, data[i].dmId?.createdAt]
     // }
     requiredData.push(arr);
    }
    console.log("Length...Col-Accounted ==============================>", HeaderData.Collateral_accounted_header.length, arr.length + '\n\n');
    return requiredData

  }

  async collateralUnaccountedSheet(req: Request, res: Response): Promise<any> {
    let obj2 = [{"key":"stoneStatus","value":skuStoneStatusEnum.APPROVED },{"key":"collateralStatus","value":skuCollateralStatusEnum.COLLATERAL_OUT }]
    // //@ts-expect-error
    console.log("==>req..query...filters", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(...obj2)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    let {data, page}: any = await new SkuRepository().index(req.query)
    unAccLength =data.length
    req.query.filters = JSON.parse(req.query.filters)
    // @ts-expect-error
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "stoneStatus"), 1) //removing obj to avoid params duplication
    //@ts-expect-error 
    req.query.filters.splice(req.query.filters.findIndex(item => item.field === "collateralStatus"), 1) //removing obj to avoid params duplication 
     //// @ts-expect-error
    //req.query.filters.splice(req.query.filters.findIndex(item => item.field === "skuId.isCollateral"), 1)
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {
      //TODO remove BB
      //if (data[i].skuId?.isCollateral === true) {
        //let lastDm = await new DiamondMatchBusiness().findOneBB({ _id: dbData[i].dmId, isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 })
      let vcValue = (data[i].colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if (!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv) ? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv) ? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav) ? data[i].iavId?.iav : 0
      // (2500).toLocaleString('en-US', {
      //   style: 'currency',
      //   currency: 'USD',
      // })
      arr = [
        data[i].stoneStatus, data[i].createdAt, data[i].companyId?.name, data[i].rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].weight, data[i].shape, data[i].colorSubCategory, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, vcValue,  drv,  pwv, iav, data[i].dmId?.createdAt]
        requiredData.push(arr);
     // }
    }
    console.log("Length...Col-UnAccounted ==============================>", HeaderData.Collateral_accounted_header.length, arr.length + '\n\n');
    return requiredData

  }

  async collateralInceptionSheet(req: Request, res: Response): Promise<any> {
   
    let Obj = { "key": "collateralStatus", "value": "COLLATERAL IN" },obj2 ={"key":"stoneStatus","value":"TRANSIT"}
    // //@ts-expect-error
    console.log("==>req..query...filters....", req.query.filters);
    //@ts-expect-error
    req.query.filters = JSON.parse(req.query.filters)
    //@ts-expect-error
    req.query.filters.push(Obj,obj2)
    req.query.filters = JSON.stringify(req.query.filters)
    console.log("==>req..query...filters..Res", req.query.filters)
    //let dbData = await new SkuController().exportBC(req, res, populate)
    let {data, page}: any = await new SkuRepository().index(req.query)
    inceptionLength = data.length
    console.log("Incept..length......\n",inceptionLength);
    
    req.query.filters = JSON.parse(req.query.filters)
     // @ts-expect-error
      req.query.filters.splice(req.query.filters.findIndex(item => item.field === "collateralStatus"), 1) //removing obj to avoid params duplication 
      // @ts-expect-error
     req.query.filters.splice(req.query.filters.findIndex(item => item.field === "stoneStatus"), 1)
    req.query.filters = JSON.stringify(req.query.filters)
    let requiredData = [];
    let arr: any[] = []
    requiredData.push(arr);
    for (let i = 0; i < data.length; i++) {
      //TODO remove BB
      //let lastDm = await new DiamondMatchBusiness().findOneBB({ skuId: dbData[i]._id, isDeleted: false }, { createdAt: -1 }, [], { createdAt: 1 })
      let vcValue = (data[i]?.colorType == "WHITE") ? data[i]?.iavId?.rapPriceId?.price : data[i].iavId?.clientPriceId?.price
      if (!vcValue) vcValue = 0
      let drv = (data[i].iavId?.drv) ? data[i].iavId?.drv : 0
      let pwv = (data[i].iavId?.pwv) ? data[i].iavId?.pwv : 0
      let iav = (data[i].iavId?.iav) ? data[i].iavId?.iav : 0
      arr = [
        data[i].companyId?.name, data[i].rfId?.rfid, data[i].labsId?.lab, data[i].labsId?.labReportId, data[i].shape, data[i].colorSubCategory,data[i].weight, data[i].colorCategory, data[i].gradeReportColor, data[i].gradeReportShape, data[i].clarity, data[i].cut, vcValue,  drv, iav ,'xxx' , pwv]
      requiredData.push(arr);
    }
    console.log("Length...Collateral Inception   ==============================>", HeaderData.Collateral_at_inception_header.length, arr.length+'\n\n');
    return requiredData
  }

  async dailyActivityAggregate(cond: any): Promise<any> {
    // console.log("...cond",cond);
    let countStones = 0
    let data = await activityModel.aggregate([
      { $match: { ...cond, "isDeleted": false } },
      { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
      { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId' } },
      { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          "totalWeights": { "$sum": "$skuId.weight" },
          "totalPwv": { "$sum": "$iavId.pwv" },
        }
      },
      {
        $project: {
          _id: 0, "totalWeights": 1, "totalPwv": 1
        }
      }
    ]).then(data => data[0])  //.estimatedDocumentCount
   // console.log("data....Aggr", data);
    if (data) data.countStones = await activityModel.find(cond).count()
    //console.log("Final.....",data)
    return data
  }

  async getWeekNumber(date: any): Promise<any> {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    let yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    let weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return "Week-" + weekNo + ' ' + date.getUTCFullYear();
  }
 
  async applyCellBorder(cellArray: Array<string>, worksheet: any): Promise<any> {
    // console.log("...cond",cond);
    cellArray.map(key => {
      worksheet.getCell(key).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  async dailyDiamondMatchAggregate(cond: any): Promise<any> {
    console.log("...cond", cond);
    let data = await diamondMatchModel.aggregate([
      { $match: { 'status': cond.status, "isDeleted": false } },
      { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
      { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
      { $match: { 'skuId.companyId': cond.companyId } },
      { $lookup: { from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'iavId' } },
      { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          "totalWeights": { "$sum": "$skuId.weight" },
          "totalPwv": { "$sum": "$iavId.pwv" },
        }
      },
      {
        $project: {
          _id: 0, "totalWeights": 1, "totalPwv": 1
        }
      }
    ]).then(data => data[0])
    // console.log("data....Aggr", data);
    // // if (data)data.countStones = await diamondMatchModel.find(cond).count()
    // console.log("Final.......", data);

    return data
  }

  async dailyDiamondMatchCountAggregate(cond: any): Promise<any> {
    console.log("...cond", cond);
    let totalCount = await diamondMatchModel.aggregate([
      // { $match: { 'status':cond.status,"isDeleted": false } },
      { $lookup: { from: 'skus', localField: 'skuId', foreignField: '_id', as: 'skuId' } },
      { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
      //{ $match:{'skuId.companyId':cond.companyId} },
      { $match: { 'skuId.companyId': cond.companyId, 'status': cond.status, 'isDeleted': false } },
      { $count: 'totalCount' }
    ]).then(totalCount => totalCount[0])
    // console.log("data DM count....Aggr", totalCount);
    // console.log("Final.....count..", totalCount);

    return totalCount
  }

  async dailyMalcaAggregate(cond: any): Promise<any> {
    console.log("...cond", cond);
    let data = await transitModel.aggregate([
      { $match: { 'status': cond.status, "isDeleted": false } },
      { $lookup: { from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuId' } },
      { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
      { $match: { 'skuId.companyId': cond.companyId } },
      { $lookup: { from: 'iavs', localField: 'skuId.iavId', foreignField: '_id', as: 'iavId' } },
      { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          "totalWeights": { "$sum": "$skuId.weight" },
          "totalPwv": { "$sum": "$iavId.pwv" },
        }
      },
      {
        $project: {
          _id: 0, "totalWeights": 1, "totalPwv": 1
        }
      }
    ]).then(data => data[0])
    // console.log("data....Aggr", data);
    // // if (data)data.countStones = await diamondMatchModel.find(cond).count()
    // console.log("Final.......", data);

    return data
  }

  async dailyMalcaCountAggregate(cond: any): Promise<any> {
    console.log("...cond", cond);
    let totalCount = await transitModel.aggregate([
      // { $match: { 'status':cond.status,"isDeleted": false } },
      { $lookup: { from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuId' } },
      { $unwind: { path: "$skuId", preserveNullAndEmptyArrays: true } },
      //{ $match:{'skuId.companyId':cond.companyId} },
      { $match: { 'skuId.companyId': cond.companyId, 'status': cond.status, 'isDeleted': false } },
      { $count: 'totalCount' }
    ]).then(totalCount => totalCount[0])
    // console.log("data DM count....Aggr", totalCount);
    console.log("Final malca.....count..", totalCount);

    return totalCount
  }

  async filter(req: Request, res: Response): Promise<void> {
    res.locals = { status: false, message: Messages.FETCH_FAILED }
    let { body: { loggedInUser: { _id: loggedInUserId } } } = req
    let data = await new SummaryReportRepository().filter(loggedInUserId)
    res.locals = { status: true, message: Messages.FETCH_SUCCESSFUL, data }
    await JsonResponse.jsonSuccess(req, res, `{this.url}.filter`);
  }
  async powerBiReportDelete(req: Request, res: Response): Promise<void> {
    res.locals = { status: false, message: Messages.FETCH_FAILED };
    const { query: { companyId, password } } = req as any;
    const settingPassword: ISetting = await settingModel.findOne({ isDeleted: false }).select('masterPassword').lean();
    const passwordValid = bcrypt.compareSync(password, settingPassword?.masterPassword)
    if (!passwordValid) throw new Error('Invalid Password...')
    if (companyId) {
      await Promise.all([
        await diamondMatchReportModel.deleteMany({companyId}), await dialyMatchReportModel.deleteMany({companyId}),
        await TransporterStorageReportModel.deleteMany({companyId}), await CollateralAccountedReportModel.deleteMany({companyId}),
        await CollateralUnAccountedReportModel.deleteMany({companyId}), await CollateralSoldReportModel.deleteMany({companyId}),
        await CollateralAddedReportModel.deleteMany({companyId}), await CollateralRemovedReportModel.deleteMany({companyId}),
        await CollateralInceptionReportModel.deleteMany({companyId}), await CurrentCollateralReportModel.deleteMany({companyId})
      ])
    }
    else {
      await Promise.all([
        await diamondMatchReportModel.deleteMany({}), await dialyMatchReportModel.deleteMany({}),
        await TransporterStorageReportModel.deleteMany({}), await CollateralAccountedReportModel.deleteMany({}),
        await CollateralUnAccountedReportModel.deleteMany({}), await CollateralSoldReportModel.deleteMany({}),
        await CollateralAddedReportModel.deleteMany({}), await CollateralRemovedReportModel.deleteMany({}),
        await CollateralInceptionReportModel.deleteMany({}), await CurrentCollateralReportModel.deleteMany({})
      ])
    }
    res.locals = { status: true, message: 'Drop Successfully' };
    await JsonResponse.jsonSuccess(req, res, `{this.url}.importDrop`);
  }

}
