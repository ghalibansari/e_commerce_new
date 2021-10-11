import {BaseRepository} from "../BaseRepository";
import deviceModel from "./device.model";
import {IDevice} from "./device.types";
import {ClientSession, Types} from "mongoose";
import {IIndexProjection} from "../../interfaces/IRepository";
import registerDeviceModel from "../register-device/register-device.model";
import jwt from "jsonwebtoken";
import {AES} from "crypto-js";
import {Constant, Texts, Messages} from '../../constants';
import mongoose from 'mongoose'
import { IUser } from "../user/user.types";
import userModel from "../user/user.model";
import companyModel from "../company/company.model";
import deviceTypeModel from "../device-type/device-type.model";


export class DeviceRepository extends BaseRepository<IDevice> {
    constructor () {
        super(deviceModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
        };
        let sort = {}, projection: IIndexProjection = {'__v': 0, "createdBy.password": 0, "userIds.password": 0}

       /* if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }*/
        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            //const {key, value} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        if(search){ //Todo remove regex from everywhere for searching it is very costly operation...
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'deviceTypeId.code': _S}, {'serialNumber': _S}, {'name': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: any) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
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
            // {$match: cond},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},{$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'userIds', foreignField: '_id', as: 'userIds'}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: deviceTypeModel.collection.name, localField: 'deviceTypeId', foreignField: '_id', as: 'deviceTypeId'}},{$unwind: {path: "$deviceTypeId", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async registerDevice(body: any, session: ClientSession): Promise<any> {
        let token;
        let device = await deviceModel.findOne({serialNumber: body.serialNumber, isDeleted: false}).sort({createdAt:-1});
      //  if(device?._id && device?.token) return {status: true, message: Messages.DEVICE_ALREADY_REGISTERED, data: device}
        if(device?._id && device?.companyId ) {
            //@ts-expect-error
            const jwt_token_encrypt = await jwt.sign({_id: device.companyId?._id, firstName:device.companyId?.name}, Constant.jwt_key);
            const jwt_token = await AES.encrypt(jwt_token_encrypt, Constant.secret_key).toString();
            token = jwt_token
        }
        else throw new Error("Invalid serialNumber");
        let sort = {createdAt: -1};
        let data = await deviceModel.findOneAndUpdate({serialNumber: body.serialNumber},{token:token}, {new: true, sort, session});
        return {status: true, message: Messages.DEVICE_REGISTERED_SUCCESSFULLY, data: {event_id: body.event_id, body: data}}
    }

    async accessDevice(body: any, loggedInUserId: IUser["_id"]): Promise<any> {  
        let deviceData = await deviceModel.findOne({_id: body._id, userIds: body.userIds, isDeleted: false})        
        if(!deviceData) {
            let data = await deviceModel.findOneAndUpdate({_id: body._id, isDeleted: false}, {$push: {userIds: body.userIds}, updatedBy: loggedInUserId}, {new:true})
            return {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        }        
        else  return {status: false, message: Messages.DEVICE_ACCESS_ALREADY_THERE}
    } 

    async removeAccessDevice(body: any, loggedInUserId: IUser["_id"]): Promise<any> {
        let deviceData = await deviceModel.findOne({_id: body._id, userIds: body.userIds, isDeleted: false})        
        if(deviceData) {
            let data = await deviceModel.findOneAndUpdate({_id: body._id, isDeleted: false}, { $pull: { userIds: body.userIds }, updatedBy: loggedInUserId }, {new:true})
            return {status: true, message: Messages.UPDATE_SUCCESSFUL, data}
        }        
        else  return {status: false, message: Messages.DEVICE_ACCESS_NOT_THERE}
    } 

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        // @ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await deviceModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'devicetypes', localField: 'deviceTypeId', foreignField: '_id', as: 'deviceTypeId' } },
            { $unwind: { path: "$deviceTypeId", preserveNullAndEmptyArrays: true } },
            {$addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "name": {$addToSet: "$name"},
                    "serialNumber": {$addToSet: "$serialNumber"},
                    "companies": {$addToSet: "$companyId"},
                    "deviceTypes": {$addToSet: "$deviceTypeId"}
                }
            },
            {
                $project: {
                    _id: 0, "companies._id": 1, "companies.name":1, "companies.sorted":1, "name": 1, "serialNumber":1, "deviceTypes._id": 1, "deviceTypes.code": 1            
                }
            }
        ]).then(data => data[0])

        return data 
    }
}