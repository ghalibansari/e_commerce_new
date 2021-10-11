import {BaseRepository} from "../BaseRepository";

import mongoose, {ClientSession} from 'mongoose'
import addressModel from "../address/address.model";
import {Errors, Messages, Texts} from "../../constants";
import roleModel from "../role/role.model";
import companyModel from "../company/company.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import {ISetting} from "./setting.types";
import settingModel from "./setting.model";
import sessionModel from "../session/session.model";


export class SettingRepository extends BaseRepository<ISetting> {
    constructor () {
        super(settingModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<ISetting[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { };
    
        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            //const {key, value} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1};
    
        // if(search){
        //     search = JSON.parse(search)
        //     const _S = {$regex: search, $options: "i"}
        //     secondCond['$or'] = [
        //         {'firstName': _S}, {'lastName': _S}, {'email': _S}, {'altEmail': _S}, {'phone': _S}, {'contacts.name': _S}, {'addressId.address1': _S},
        //         {'addressId.address2': _S}, {'addressId.city': _S}, {'addressId.state': _S}, {'addressId.country': _S}, {'addressId.zipCode': _S},
        //     ]
        // }
    
        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.splice(filters.findIndex(item => item.field === Texts.companyId), 1)
            console.log(filters);
            
            // for(const {key: k, value: v} of filters) {
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k[k.length-3] === 'I' && k[k.length-2] === 'd' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-3] === 'I' && k[k.length-2] === 'd' && k[k.length-1] === 's') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }
    
        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }
    
        const aggregate: any = []
        const sCond = [{$match: secondCond}, {$project: projection},]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    // create = async (newData: any, session: ClientSession): Promise<ISettings|never> => {
    //     const [duplicate] = await Promise.all([
    //         await settingsModel.findOne().or([{email: newData?.email}, {altEmail: newData?.altEmail}, {phone: newData?.phone}]).select('email altEmail phone'),
    //         await this.checkIds(newData)
    //     ])
    //     if(duplicate) {
    //         if(duplicate.email === newData?.email) throw new Error('Email already Present')
    //         else if(duplicate.altEmail === newData?.altEmail) throw new Error('Alternate Email already Present')
    //         else if(duplicate.phone == newData?.phone) throw new Error('Phone number already Present')
    //     }
    //     await addressModel.create([newData.address], {session}).then(addressData => newData.addressId = addressData[0]._id)
    //     return await settingsModel.create([newData], {session}).then(user => user[0])
    // }

    // findById = async (_id: ISettings['_id']): Promise<ISettings|null> => {
    //     const aggregate = [
    //         {$match: {_id: mongoose.Types.ObjectId(_id), isDeleted: false}},
    //         {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
    //         {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
    //         {$lookup: {from: 'addresses', localField: 'addressId', foreignField: '_id', as: 'addressId'}},
    //         {$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
    //         {$lookup: {from: 'roles', localField: 'roleId', foreignField: '_id', as: 'roleId'}},
    //         {$unwind: {path: "$roleId", preserveNullAndEmptyArrays: true}},
    //        // {$unset: 'password'}
    //     ]
    //     return await userModel.aggregate<ISettings>(aggregate).then(user => user[0] || null)
    // }

    update = async (newData: any): Promise<any> => settingModel.updateOne({_id: newData?._id, isDeleted: false}, newData).then(data => data.nModified)

}