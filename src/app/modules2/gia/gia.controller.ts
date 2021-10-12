import {Application, Request, Response} from "express";
import {Constant, Messages} from "../../constants";
import {JsonResponse, JtDownload, TryCatch} from "../../helper";
import GiaBusiness from "./gia.business";
import {BaseController} from "../BaseController";
import {GiaValidation} from "./gia.validation"
import {guard} from "../../helper/Auth";
import {IGia} from "./gia.types";
import axios from 'axios'
import RapPriceBusiness from "../rap-price/rap-price.business";
import CompanyBusiness from "../company/company.business";
import settingModel from "../setting/setting.model";
import {giaKeyEnum} from "../setting/setting.types";
import {GiaRepository} from "./gia.repository";
import giaModel from "./gia.model";
import * as mongoose from "mongoose";

export class GiaController extends BaseController<IGia> {
    constructor() {
        super(new GiaBusiness(), "gia", true);
        this.init();
    }

    register = (express: Application) => express.use('/api/v1/gia', guard, this.router);

    init() {
        const validation: GiaValidation = new GiaValidation();
        // this.router.get("/", TryCatch.tryCatchGlobe(this.findBC));
        // this.router.post("/", validation.createUser, TryCatch.tryCatchGlobe(this.createBC));
        // this.router.put("/", validation.updateUser, TryCatch.tryCatchGlobe(this.updateBC));
        // this.router.delete("/", TryCatch.tryCatchGlobe(this.deleteBC));
        // this.router.get("/get-by-id", TryCatch.tryCatchGlobe(this.findByIdBC));
        this.router.get("/get-by-reportNumber", validation.getGIAByReportNumber, TryCatch.tryCatchGlobe(this.findByIdReportNumber));
        this.router.post("/get-by-reportNumbers", validation.getGIAByReportNumbers, TryCatch.tryCatchGlobe(this.findByIdReportNumbers));
        // this.router.get("/get-Gia-and-rapprice-by-reportNumbers", validation.getGIAByReportNumbers, TryCatch.tryCatchGlobe(this.findByIdReportNumbersGiaAndRapPrice));
    }

    async findByIdReportNumber(req: Request, res: Response){
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const GiaBusinessInstance = new GiaBusiness()
        const {query:{reportNumber}, body:{loggedInUser:{_id:loggedInUserId}}} = req
        let giaPostApi: any
        let giaDetails: IGia
        const gia = await GiaBusinessInstance.findOneBB({reportNumber})

        if(gia){
            giaDetails = gia;
            res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data: giaDetails}
        }
        else{
            let axiosQueryValue = "{ getReport(report_number: '"+reportNumber+"') { report_date report_number report_type results { ... on DiamondGradingReportResults { shape_and_cutting_style carat_weight measurements color_grade clarity_grade cut_grade } }links{pdf} }}"
            axiosQueryValue = axiosQueryValue.replace(/'/g,'"');
            let axiosQuery = {"query": axiosQueryValue};
            const setting = await settingModel.findOne({}, 'giaKey giaProductionKey giaSandBoxKey cdnUrl')
            if(!setting) throw new Error('Invalid Gia Setting...')
            let Authorization = ''
            if(setting.giaKey === giaKeyEnum.PRODUCTION) Authorization = setting.giaProductionKey   //Todo improve this via mongo side fetch according to condition...
            else Authorization = setting.giaSandBoxKey
            giaPostApi = await axios.post(Constant.GiaURL, axiosQuery, {headers: {Authorization}})
            if(giaPostApi.data.errors) res.locals.data = giaPostApi.data.errors;
            else{
                const giaReport = await giaPostApi.data.data.getReport
                if(giaReport!=null) {
                    const url = giaReport.links.pdf;
                    const download = await JtDownload({fileName: `${reportNumber}.pdf`, path: 'download/gia/companyId', url})
                    if (download) {
                        giaPostApi.data.data.getReport.links.pdf = `${setting.cdnUrl}${download.data.url}`
                        //@ts-expect-error
                        let giaData: IGia = await GiaBusinessInstance.createBB({reportNumber,
                            details: giaPostApi.data.data.getReport,
                            createdBy: loggedInUserId,
                            updatedBy: loggedInUserId
                        })
                        let gia = await GiaBusinessInstance.findOneBB({_id: giaData._id})
                        // if(!gia) throw new Error('Invalid Lab Report Number.')
                        if (gia) {
                            giaDetails = gia
                            res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data: giaDetails}
                        }
                    }
                }
            }
        }
        if(!res.locals.data) throw new Error('Invalid Lab Report Number.')
        await JsonResponse.jsonSuccess(req, res, 'findByIdReportNumber')
    }

    async findByIdReportNumberReturn(reportNumber: number, loggedInUserId: string){
        const GiaBusinessInstance = new GiaBusiness()
        let data, giaPostApi: any, giaDetails: IGia
        const gia = await GiaBusinessInstance.findOneBB({reportNumber})
        if(gia){ giaDetails = gia; data= giaDetails }
        // else data = null   //Todo temp line
        else{
            let axiosQueryValue = "{ getReport(report_number: '"+reportNumber+"') { report_date report_number report_type results { ... on DiamondGradingReportResults { shape_and_cutting_style carat_weight measurements color_grade clarity_grade cut_grade } }links{pdf} }}"
            axiosQueryValue = axiosQueryValue.replace(/'/g,'"');
            let axiosQuery = {"query": axiosQueryValue};
            const setting = await settingModel.findOne({}, 'giaKey giaProductionKey giaSandBoxKey cdnUrl')
            if(!setting) throw new Error('Invalid Gia Setting...')
            let Authorization = ''
            if(setting.giaKey === giaKeyEnum.PRODUCTION) Authorization = setting.giaProductionKey   //Todo improve this via mongo side fetch according to condition...
            else Authorization = setting.giaSandBoxKey
            giaPostApi = await axios.post(Constant.GiaURL, axiosQuery, {headers: {Authorization}})
            // giaPostApi = await axios.post(Constant.GiaURL, axiosQuery, { headers: {Authorization: Constant.GiaAuthorizationKey} })
            if(giaPostApi.data.errors) data = giaPostApi.data.errors;
            else{
                const giaReport = await giaPostApi.data.data.getReport
                if(giaReport!=null) {
                    const url = giaReport.links.pdf;
                    const download = await JtDownload({fileName: `${reportNumber}.pdf`, path: 'download/gia/companyId', url})
                    if (download) {
                        giaPostApi.data.data.getReport.links.pdf = `${setting.cdnUrl}${download.data.url}`
                        //@ts-expect-error
                        let giaData: IGia = await GiaBusinessInstance.createBB({reportNumber,
                            details: giaPostApi.data.data.getReport,
                            createdBy: loggedInUserId,
                            updatedBy: loggedInUserId
                        })
                        let gia = await GiaBusinessInstance.findOneBB({_id: giaData._id})
                        if (gia) { giaDetails = gia; data= giaDetails }
                    }
                }
            }
        }
        if(!data) throw new Error('Invalid Lab Report Number.')
        return data
    }

    async findByIdReportNumbers(req: Request, res: Response){
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const GiaBusinessInstance = new GiaBusiness()
        let {body:{reportNumbers, companyId, loggedInUser:{_id:loggedInUserId}}} = req
        let giaPostApi: string[] = [], data: IGia[] = [], newReportNumber:any[] = []
        let giaData = await giaModel.find({reportNumber: {$in: reportNumbers}})
        let giaTempData:any = {}

        giaData.forEach((dd:any) => giaTempData[dd.reportNumber] = dd)

        if(reportNumbers?.length){
            let reportNumbersData = reportNumbers.map(async(reportNumber: string) => {
                if(giaTempData[reportNumber]) data.push(giaTempData[reportNumber])
                else giaPostApi.push(reportNumber)
            })

            const [companyIdData, setting] = await Promise.all([
                await new CompanyBusiness().findOneBB({_id: companyId}),
                await settingModel.findOne({}, 'giaKey giaProductionKey giaSandBoxKey cdnUrl'),
                ...reportNumbersData
            ])

            if(!setting) throw new Error('Invalid Gia Setting...')
            let Authorization = ''
            if(setting.giaKey === giaKeyEnum.PRODUCTION) Authorization = setting.giaProductionKey   //Todo improve this via mongo side fetch according to condition...
            else Authorization = setting.giaSandBoxKey

            let giaPostApiData = await giaPostApi.map(async(reportNumber: string) => {
                let axiosQueryValue = "{ getReport(report_number: '"+reportNumber+"') { report_date report_number report_type results { ... on DiamondGradingReportResults { shape_and_cutting_style carat_weight measurements color_grade clarity_grade cut_grade } }links{pdf} }}"
                axiosQueryValue = axiosQueryValue.replace(/'/g,'"');
                let axiosQuery = {"query": axiosQueryValue};
                let giaPostApi = await axios.post(Constant.GiaURL, axiosQuery, {headers: {Authorization}})
                const giaReport = await giaPostApi.data.data.getReport

                if(giaReport!=null) {
                    const download = await JtDownload({fileName: `${reportNumber}.pdf`, path: 'download/gia/companyId',url: giaReport.links.pdf})
                    // const download = {data: {url: 'download/gia/companyId'}}//await JtDownload({fileName: `${reportNumber}.pdf`, path: 'download/gia/companyId',url: giaReport.links.pdf})
                    if(download) {
                        giaPostApi.data.data.getReport.links.pdf = `${setting.cdnUrl}${download.data.url}`
                        //@ts-expect-error
                        if(giaPostApi?.data?.errors) data.push({reportNumber, error: Messages.FETCH_FAILED, response: giaPostApi.data.errors});
                        else{
                            //@ts-expect-error
                            await GiaBusinessInstance.createBB({reportNumber, details: giaPostApi?.data?.data?.getReport, createdBy: loggedInUserId, updatedBy: loggedInUserId})
                                .then(() => newReportNumber.push(reportNumber))
                        }
                    }
                }
            })
            await Promise.all(giaPostApiData)
            if(newReportNumber.length) {
                let giaData = await giaModel.find({reportNumber: {$in: newReportNumber}})
                await giaData.forEach((dd:any) => data.push(dd))
            }
            res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data:{companyName: companyIdData?.name || null, giaWithReportNumbers: data}}
        }
        await JsonResponse.jsonSuccess(req, res, 'findByIdReportNumber')
    }
//
    async findByIdReportNumbersGiaAndRapPrice(req: Request, res: Response){
        res.locals = {status: false, message: Messages.FETCH_FAILED}
        const GiaBusinessInstance = new GiaBusiness()
        const RapPriceBusinessInstance = new RapPriceBusiness()
        let {query:{reportNumbers}, body:{loggedInUser:{_id:loggedInUserId}}} = req
        //@ts-expect-error
        reportNumbers = await JSON.parse(reportNumbers)
        let giaPostApi: string[] = []
        let data: IGia[] = []
        let dataWithGiaAndRapPrice = []
        if(reportNumbers?.length){
            //@ts-expect-error
            let reportNumbersData = reportNumbers.map(async(reportNumber: string) => {
                let giaTempData = await GiaBusinessInstance.findOneBB({reportNumber})
                if(giaTempData) data.push(giaTempData)
                else giaPostApi.push(reportNumber)
            })
            await Promise.all(reportNumbersData)
            let giaPostApiData = giaPostApi.map(async(reportNumber: string) => {
                let axiosQueryValue = "{ getReport(report_number: '"+reportNumber+"') { report_date report_number report_type results { ... on DiamondGradingReportResults { shape_and_cutting_style carat_weight measurements color_grade clarity_grade cut_grade } } }}"
                axiosQueryValue = axiosQueryValue.replace(/'/g,'"');
                let axiosQuery = {"query": axiosQueryValue};
                const setting = await settingModel.findOne({}, 'giaKey giaProductionKey giaSandBoxKey cdnUrl')
                if(!setting) throw new Error('Invalid Gia Setting...')
                let Authorization = ''
                if(setting.giaKey === giaKeyEnum.PRODUCTION) Authorization = setting.giaProductionKey   //Todo improve this via mongo side fetch according to condition...
                else Authorization = setting.giaSandBoxKey
                let giaPostApi = await axios.post(Constant.GiaURL, axiosQuery, {headers: {Authorization}})
                // let giaPostApi = await axios.post(Constant.GiaURL, axiosQuery, { headers: {Authorization: Constant.GiaAuthorizationKey} })
                //@ts-expect-error
                if(giaPostApi.data.errors) data.push({reportNumber, error: Messages.FETCH_FAILED, response: giaPostApi.data.errors});
                else{
                    //@ts-expect-error
                    let giaData: IGia = await GiaBusinessInstance.createBB({reportNumber, details: giaPostApi.data.data.getReport, createdBy: loggedInUserId, updatedBy: loggedInUserId})
                    let gia = await GiaBusinessInstance.findOneBB({_id: giaData._id})
                    if(gia) data.push(gia)
                }
            })
            await Promise.all(giaPostApiData)
            let rapPriceData = await data.map(async({details}) => {
                //@ts-expect-error
                let {results:{color_grade, clarity_grade}} = details
                let rapPriceData = await RapPriceBusinessInstance.findOneBB({color: color_grade, clarity: clarity_grade})
            })
            res.locals = {status: true, message: Messages.FETCH_SUCCESSFUL, data}
        }
        await JsonResponse.jsonSuccess(req, res, 'findByIdReportNumber')
    }

}