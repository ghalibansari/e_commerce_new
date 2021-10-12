import { IIndexParam, IIndexProjection, ISort } from "../../interfaces/IRepository";
import {BaseRepository} from "../BaseRepository";
import alertConfigurationModel from "./alert-configuration.model";
import { IAlertConfiguration } from "./alert-configuration.types";
import mongoose, {Types} from "mongoose";
import { IUser } from "../user/user.types";
import userModel from "../user/user.model";
import { Constant, Errors } from "../../constants";
import { BaseHelper } from "../BaseHelper";
import { string } from "joi";
import companyModel from "../company/company.model";
import { data } from "cypress/types/jquery";
import { ICompany } from "../company/company.types";
import BusinessModel from "../business/business.model";
import Moment from "moment"
import userAlertModel from "../user-alerts/user-alert.model";
import initMB from 'messagebird';
import { any } from "cypress/types/bluebird";
const messageBird = initMB(Constant.MessageBird_Token);
import alertCategoryModel from "./alert-category/alert-category.model";
import alertTypeModel from "./alert-type/alert-type.model";
import alertLevelModel from "./alert-level/alert-level.model";
import alertSubCategoryModel from "./alert-sub-category/alert-sub-category.model";

export class AlertConfigurationRepository extends BaseRepository<IAlertConfiguration> {
    constructor () {
        super(alertConfigurationModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<object[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false};
        let secondCond: any = {} //Todo add isDeleted condition here in every table
        let sort: ISort = {}, projection: IIndexProjection = {"userId.password": 0}

        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'category.category': _S}, ]
        }


        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v}: ISort = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1}

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === "companyId") {}
                else if((k === 'reciever' || k === 'cc') && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k === 'reciever' || k === 'cc') cond[k] =  mongoose.Types.ObjectId(v as string)
                // else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            {$lookup: {from: alertCategoryModel.collection.name, localField: 'category', foreignField: '_id', as: 'category'}},{$unwind: {path: "$category", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: alertSubCategoryModel.collection.name, localField: 'subCategory', foreignField: '_id', as: 'subCategory'}},{$unwind: {path: "$subCategory", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: alertLevelModel.collection.name, localField: 'level', foreignField: '_id', as: 'level'}},{$unwind: {path: "$level", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: alertTypeModel.collection.name, localField: 'type', foreignField: '_id', as: 'type'}},
            {$lookup: {from: userModel.collection.name, localField: 'reciever', foreignField: '_id', as: 'reciever'}},
            {$lookup: {from: userModel.collection.name, localField: 'cc', foreignField: '_id', as: 'cc'}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["userId.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    create = async (alertConfigData: IAlertConfiguration): Promise<IAlertConfiguration> => {
        await this.checkIds(alertConfigData)
        return await alertConfigurationModel.create(alertConfigData)
    }

    update = async (alertConfigData: IAlertConfiguration): Promise<IAlertConfiguration|null> => {
        await this.checkIds(alertConfigData)
        return await alertConfigurationModel.findOneAndUpdate({_id: alertConfigData._id}, {...alertConfigData}, {new: true})
    }

    async checkIds({reciever, cc, category, type, level}:IAlertConfiguration): Promise<void|never> {
        // const user: IUser|IUser[] = await userModel.find({_id: {$in: [reciever, cc]}}, '_id')
        let [user, alertCategory, alertType, alertLevel] = await Promise.all([
            await userModel.aggregate([
                {
                    $facet: {
                        recieverIds: [
                            { $match: {_id: {$in: reciever}} },
                            { $project: { "_id": 1 }}
                        ],
                        ccIds: [
                            { $match: {_id: {$in: cc}} },
                            { $project: { "_id": 1 }}
                        ]
                    }
                }
            ]),
            // await userModel.find({_id: {$in: [...reciever, ...cc]}}, '_id'),
            //@ts-expect-error
            await alertCategoryModel.findOne({_id: category}, '_id'),
            await alertTypeModel.find({_id: {$in: type} }, '_id'),
            await alertLevelModel.findOne({_id: level}, '_id')
        ])
        console.log(alertType, "=========alertType");
        
        if(!alertCategory?._id) throw Errors.INVALID_ALERT_CATEGORY_ID
        if(!alertLevel?._id) throw Errors.INVALID_ALERT_LEVEL_ID
        alertType.forEach(alertTypeObj => {
            if(!type.includes(String(alertTypeObj._id))) throw Errors.INVALID_ALERT_TYPE_ID
        })
        user[0]?.recieverIds.forEach((userObj: any) => {
            if(!reciever.includes(userObj?._id)) throw Errors.INVALID_RECIEVER
        })
        user[0]?.ccIds.forEach((userObj: any) => {
            if(!cc.includes(userObj?._id)) throw Errors.INVALID_CC
        })
        // if(user.length !== 2) {            
        //     if(String(user[0]?._id) !== reciever) throw Errors.INVALID_RECIEVER
        //     if(String(user[0]?._id) !== cc) throw Errors.INVALID_CC
        // }
    }

    alertConfig = async(alertConfigData: IAlertConfiguration[], user: IUser['_id']): Promise<void|never> => {
        let difference
        let check = alertConfigData.map( async alertConfig => {
            // let companyId = await companyModel.find({isDeleted: false, isActive: true}, '_id').then(data => {
            //     //@ts-expect-error
            //     let companyId: [ICompany['_id']] = []
            //     data.forEach((company:ICompany) => companyId.push(company._id));
            //     return companyId;
            // })
            // const business = await BusinessModel.aggregate([
            //     {$match: {companyId: {$in: companyId}, action: ["OPEN"]}},
            //     {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},{$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            // ])
            let business = await companyModel.aggregate([
                {$match: {isDeleted: false, isActive: true}},
                {$lookup : {
                    from: BusinessModel.collection.name,
                    as: 'business',
                    let: { companyId: '$_id' },
                    pipeline: [
                      { $match: { $and: [{ $expr: { $eq: ['$companyId', '$$companyId'] } }] } },
                      { $sort: {lastOpenedAt : -1}},
                      { $limit: 1}
                    ]
                  }
                },
                {$unwind: {path: "$business",preserveNullAndEmptyArrays: true}},
                {$project: {"business.lastOpenedAt":1, "name": 1}}
            ])
            console.log(business, "=================business");
            
            let DATA = '<table border="1"><tr><th>Company</th><th>Last Opened Before</th></tr>';
            let message = ""
            await business.forEach(async businessObj => {
                difference = (businessObj?.business?.lastOpenedAt)? await this.timeDiffCalc(new Date(), new Date(businessObj?.business?.lastOpenedAt)) : "not yet Opened";
                DATA = `${DATA}<tr><td>${businessObj?.name}</td><td>${difference}</td></tr>`
                message = `${message}\n Open Business not done in ${difference} for ${businessObj?.name} company`                
            })
            DATA = `${DATA}</table>`
            //@ts-expect-error
            let ccEmail: any = [], userIds: IUser['_id'][] = [alertConfig?.reciever?._id], phoneNos: IUser['phone'][] = [alertConfig?.reciever?.phone] ;
            //@ts-expect-error
            alertConfig?.cc.forEach(user => {ccEmail.push(user?.email); userIds.push(user._id); phoneNos.push(user.phone)});
            // console.log(ccEmail, "========ccEmail", userIds, "=========userIds", phoneNos, "========phoneNos");
            
            //@ts-expect-error
            // if(alertConfig.type.includes("Email")) await new BaseHelper().emailSend('business_email',{DATA}, alertConfig?.reciever?.email, alertConfig?.cc?.email)
            if(alertConfig.type.includes("Email")) new BaseHelper().emailSend('business_email',{DATA}, alertConfig?.reciever?.email, ccEmail)
            if(alertConfig.type.includes("WEB")) {
                let userAlerts = {message, userIds, level:alertConfig?.level, createdBy:user, updatedBy: user }
                await userAlertModel.create(userAlerts)
            }
            // //@ts-expect-error
            // console.log(alertConfig?.reciever?.phone, "===================phoneNumber");
            
            if(alertConfig.type.includes("OTP")) messageBird.messages.create({
                originator : 'otp',
                recipients : phoneNos,
                body : `${message}`
             }, (error, response) =>{ if(error) throw new Error("message sending failed")})
    
        })
        await Promise.all(check)
    }

    timeDiffCalc =  async(dateFuture: any, dateNow: any) :Promise<String> => {
        let timeDifference = Math.abs(dateFuture - dateNow) / 1000;
        let difference = '';
        // calculate days
        const days = Math.floor(timeDifference / 86400);
        timeDifference -= days * 86400;
        console.log('calculated days', days);
        // calculate hours
        const hours = Math.floor(timeDifference / 3600) % 24;
        timeDifference -= hours * 3600;
        console.log('calculated hours', hours);
        // calculate minutes
        const minutes = Math.floor(timeDifference / 60) % 60;
        timeDifference -= minutes * 60;
        if (days > 0) {
          difference += (days === 1) ? `${days} day, ` : `${days} days, `;
        };
        difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
        difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`; 
        return difference;
      }

      async filter(userId: IUser['_id']): Promise<any> {
        // let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        // let cond: any = {}        
        // //@ts-expect-error
        // if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);
        let data = await alertConfigurationModel.aggregate([
            { $match: { "isDeleted": false } },
            {$lookup: {from: alertCategoryModel.collection.name, localField: 'category', foreignField: '_id', as: 'category'}},{$unwind: {path: "$category", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: alertLevelModel.collection.name, localField: 'level', foreignField: '_id', as: 'level'}},{$unwind: {path: "$level", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: alertTypeModel.collection.name, localField: 'type', foreignField: '_id', as: 'type'}},{$unwind: {path: "$type", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'reciever', foreignField: '_id', as: 'reciever'}},{$unwind: {path: "$reciever", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'cc', foreignField: '_id', as: 'cc'}},{$unwind: {path: "$cc", preserveNullAndEmptyArrays: true}},
            // {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},


            {
                $group: {
                    _id: null,
                    "category": { "$addToSet": "$category.category" },
                    "level": {"$addToSet": "$level.level"},
                    "type": { "$addToSet": "$type.type" },
                    "reciever": { "$addToSet": "$reciever" },
                    "cc": { "$addToSet": "$cc" },
                    // "state": { "$addToSet": "$addressId.state" },
                    // "country": { "$addToSet": "$addressId.country" }
                }
            },
            {
                $project: {
                    _id: 0, "category": 1, "level":1, "type": 1, "reciever._id":1,
                    "reciever.firstName": 1,"cc._id": 1,"cc.firstName": 1
                }
            }
        ]).then(data => data[0])
        return data
    }  
}