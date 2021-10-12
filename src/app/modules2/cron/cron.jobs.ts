import CronBusiness from "./cron.business";
import Cron, {CronTime} from "cron";
/*import logger from "../../helper/Logger";*/
import RapPriceBusiness from "../rap-price/rap-price.business";
import {CronRepository} from "./cron.repository";
import {cronName, ICron} from "./cron.types";
import {ActivityHistoryRepository} from "../activity-history/activity-history.repository";
import {startSession} from "mongoose";
import {DiamondMatchRuleRepository} from "../diamond-match-rule/diamond-match-rule.repository";
import {DiamondMatchRepository} from "../diamond-match/diamond-match.repository";
import {RequestWithTransaction} from "../../interfaces/Request";
import {DiamondMatchController} from "../diamond-match/diamond-match.controller";
import loggerModel from "../loggers/logger.model";
import {loggerLevelEnum} from "../loggers/logger.types";
import {modulesEnum} from "../../constants";
import { IavRepository } from "../iav/iav.repository";
import scheduleReportModel from "../schedule-report/schedule-report.model";
import companyModel from "../company/company.model";
import { SummaryReportRepository } from "../summary/summary.repository";
import { company } from "faker";
import cronModel from "./cron.model";
import infinityPriceModel from "../infinity-price/infinity-price.model";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import { ICompanyClientSettingIsOpenBusiness } from "../companyClientSetting/companyClientSetting.types";
import { IDiamondMatchRule } from "../diamond-match-rule/diamond-match-rule.types";


let cronJobFetchPrice: any
let cronJobActivityHistory: any
let cronJobDiamondMatch: any
let cronJobUpdateSku: any
let cronJobPowerBiReport: any

export async function fetchPriceJobs(): Promise<any> {  //Todo create cron and init user in system
    try{
        const cronData = await new CronRepository().findOneBR({name: cronName.FETCH_RAPPORT_PRICE}) as ICron
        cronJobFetchPrice = await new Cron.CronJob(cronData?.time, async function() {
            await Promise.all([
                await new RapPriceBusiness().fetch('Round', 'cron'),
                await new RapPriceBusiness().fetch('Pear', 'cron')
            ])
                .then(() => console.log('*********** Fetch price Cron Run Successful ***********'))
                .catch(err => {
                    console.log('*********** Fetch Price Cron failed', err,' ***********')
                    //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id
                    loggerModel.create({url: cronName.FETCH_RAPPORT_PRICE, message: err.stack, createdBy: '5f2946b1daab791f94cbdebd', updatedBy: '5f2946b1daab791f94cbdebd', level: loggerLevelEnum.cron, module: modulesEnum.cron})
                        .catch((err:any) => console.log('Logging Failed', err))
                })
        }, () => console.log('Fetch price Cron Run Successful'), cronData?.isActive);
    }
    catch (err) {
        //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id
        loggerModel.create({url: cronName.FETCH_RAPPORT_PRICE, message: err.stack, createdBy: '5f2946b1daab791f94cbdebd', updatedBy: '5f2946b1daab791f94cbdebd', level: loggerLevelEnum.cron, module: modulesEnum.cron})
            .catch((err:any) => console.log('Logging Failed', err))
        //logger.error({message: `CRON Error -- ${e}`})
    }
}

export async function activityHistoryJobs(): Promise<void> {
    try{
        const cronData = await new CronRepository().findOneBR({name: cronName.ACTIVITY_HISTORY}) as ICron
        cronJobActivityHistory = await new Cron.CronJob(cronData?.time, async function() {
            const mongoSession = await startSession()
            await mongoSession.startTransaction();
            await new ActivityHistoryRepository().activityHistory(cronData?.days, mongoSession)
                .then(async() => await mongoSession.commitTransaction())
                .then(() => console.log('*********** Activity History price Cron Run Successful ***********'))
                .catch(async(err) => {
                    console.log('*********** Activity History Cron failed', err,' ***********')
                    await mongoSession.abortTransaction();
                    //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id
                    loggerModel.create({url: cronName.ACTIVITY_HISTORY, message: err.stack, createdBy: '5f2946b1daab791f94cbdebd', updatedBy: '5f2946b1daab791f94cbdebd', level: loggerLevelEnum.cron, module: modulesEnum.cron})
                        .catch((err:any) => console.log('Logging Failed', err))
                    })
                .finally(async() => await mongoSession.endSession())
        }, null, cronData?.isActive);
    }
    catch (err) {
        //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id
        loggerModel.create({url: cronName.ACTIVITY_HISTORY, message: err.stack, createdBy: '5f2946b1daab791f94cbdebd', updatedBy: '5f2946b1daab791f94cbdebd', level: loggerLevelEnum.cron, module: modulesEnum.cron})
            .catch((err:any) => console.log('Logging Failed', err))
        //logger.error({message: `CRON Error -- ${e}`})
    }
}

export async function diamondMatchJobs(): Promise<void> {
    try
    {
        const mongoSession = await startSession()
        mongoSession.startTransaction();
        const cronData = await new CronRepository().findOneBR({name: cronName.DIAMOND_MATCH}) as ICron
        cronJobDiamondMatch = new Cron.CronJob(cronData?.time, async function () {
        const DiamondMatchRepositoryInstance = new DiamondMatchRepository();
        const companyClientSetting = await companyClientSettingModel.aggregate([
            {$match: {isOpenBusiness: ICompanyClientSettingIsOpenBusiness.NO, isDeleted: false}},
            {
                $group: {
                    _id: null,
                    "companyId": { "$addToSet": "$companyId" },
                }
            }
        ]).then(data => data[0]);
        let diamondMatchData : any = []
        if(companyClientSetting?.companyId) diamondMatchData = await new DiamondMatchRuleRepository().findAll({companyId:{$in : companyClientSetting?.companyId}, isActive: true, isDeleted: false});
        //@ts-expect-error
            const runDiamondMatch = diamondMatchData.map(async ({companyId, param: {premiumPercent, premiumCycle, randomPercent, regularCycle, threshold}}) => {
                const body = {companyId, premiumPercent, premiumCycle, randomPercent, regularCycle};
                const transactionBody = {transactionId: "DM-" + Math.random(), companyId}; //Todo remove this hard coded value of updatedBy and createBy, and remove math.Random()
                const skuData = await DiamondMatchRepositoryInstance.simulateDm(companyId, threshold);
                const simulateData: any = await new DiamondMatchController().createSimulate(body, skuData);
                await DiamondMatchRepositoryInstance.createsimulateData(body, transactionBody, simulateData, mongoSession);
            });
            await Promise.all(runDiamondMatch)
            .then(async() => await mongoSession.commitTransaction())
            .then(() => console.log('*********** Diamond Match Cron Run Successful ***********'))
            .catch(async (err) => {
                console.log('*********** Diamond Match Cron failed', err, ' ***********');                
                await mongoSession.abortTransaction();
                //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id and add that user in global variable.
                    loggerModel.create({
                        url: cronName.DIAMOND_MATCH,
                        message: err.stack,
                        createdBy: null,
                        updatedBy: null,
                        level: loggerLevelEnum.cron,
                        module: modulesEnum.cron
                    }).catch((err: any) => console.log('Logging Failed', err));
            })
            .finally(async() => await mongoSession.endSession())
        }, null, cronData?.isActive);
    }
    catch (err) {
        //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id and add that user in global variable.
        loggerModel.create({url: cronName.DIAMOND_MATCH, message: err.stack, createdBy: null, updatedBy: null, level: loggerLevelEnum.cron, module: modulesEnum.cron})
            .catch((err:any) => console.log('Logging Failed', err))
    }
}

export async function updateIavEffectiveDate(): Promise<void> {
    try{
        const cronData = await new CronRepository().findOneBR({name: cronName.UPDATE_SKU}) as ICron
        cronJobUpdateSku = await new Cron.CronJob(cronData?.time, async function() {            
            const mongoSession = await startSession()
            await mongoSession.startTransaction();
            await new IavRepository().updateEffectiveDate(mongoSession)
                .then(async() => await mongoSession.commitTransaction())
                .then(() => console.log('*********** update sku Cron Run Successful ***********'))
                .catch(async(err) => {
                    console.log('*********** update sku Cron failed', err,' ***********')
                    await mongoSession.abortTransaction();
                    //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id and add that user in global variable.
                    loggerModel.create({url: cronName.UPDATE_SKU, message: err.stack, createdBy: null, updatedBy:null, level: loggerLevelEnum.cron, module: modulesEnum.cron})
                        .catch((err:any) => console.log('Logging Failed', err))
                    })
                .finally(async() => await mongoSession.endSession())
        }, null, cronData?.isActive);
    }
    catch (err) {
        //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id and add that user in global variable.
        loggerModel.create({url: cronName.UPDATE_SKU, message: err.stack, createdBy: null, updatedBy: null, level: loggerLevelEnum.cron, module: modulesEnum.cron})
            .catch((err:any) => console.log('Logging Failed', err))
        //logger.error({message: `CRON Error -- ${e}`})
    }
}

export async function powerBiReportGenerate(): Promise<void> {
    try{
        const cronData = await new CronRepository().findOneBR({name: cronName.POWER_BI_REPORT}) as ICron
        cronJobPowerBiReport = await new Cron.CronJob(cronData?.time, async function() {
            const mongoSession = await startSession()
            await mongoSession.startTransaction();
            const companyData = await companyModel.aggregate([
                {$match: {isDeleted: false}},
                {$group: {_id: null, "companyId": {$addToSet : "$_id"} }}
            ]).then(company => company[0])
            // const runPowerBiReport = await companyData.map(async ({_id}) => {
            // })
            // await Promise.all(runPowerBiReport)
            await new SummaryReportRepository().powerBiReport(companyData.companyId, cronData.lastRunTime, mongoSession)
                .then(async() => {
                    await cronModel.findOneAndUpdate({name: cronName.POWER_BI_REPORT }, {lastRunTime: new Date()})
                    await mongoSession.commitTransaction()
                })
                .then(() => console.log('*********** Power Bi Report Cron Run Successful ***********'))
                .catch(async(err) => {
                    console.log('*********** Power Bi Report Cron failed', err,' ***********')
                    await mongoSession.abortTransaction();
                    //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id and add that user in global variable.
                    loggerModel.create({url: cronName.POWER_BI_REPORT, message: err.stack, createdBy: null, updatedBy:null, level: loggerLevelEnum.cron, module: modulesEnum.cron})
                        .catch((err:any) => console.log('Logging Failed', err))
                    })
                .finally(async() => await mongoSession.endSession())
        }, null, cronData?.isActive)
    }
    catch (err) {
        //@ts-ignore    //Todo remove-this-line-ts-ignore  //Todo replace this hard coded user id with dynamic db id and add that user in global variable.
        loggerModel.create({url: cronName.POWER_BI_REPORT, message: err.stack, createdBy: null, updatedBy: null, level: loggerLevelEnum.cron, module: modulesEnum.cron})
            .catch((err:any) => console.log('Logging Failed', err))
        //logger.error({message: `CRON Error -- ${e}`})
    }
}

export {cronJobFetchPrice, cronJobActivityHistory, cronJobDiamondMatch, cronJobUpdateSku, cronJobPowerBiReport}
