import {BaseRepository} from "../BaseRepository";
import userModel from "./user.model";
import {IUser, IUserNested} from "./user.types";
import mongoose, {ClientSession} from 'mongoose'
import addressModel from "../address/address.model";
import {Errors, Messages, Texts} from "../../constants";
import roleModel from "../role/role.model";
import companyModel from "../company/company.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import verificationModel from "../verification/verification.model";


export class UserRepository extends BaseRepository<IUser> {
    constructor () {
        super(userModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<IUserNested[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            //const {key, value} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [
                {'firstName': _S}, {'lastName': _S}, {'email': _S}, {'altEmail': _S}, {'phone': _S}, {'contacts.name': _S}, {'addressId.address1': _S},
                {'addressId.address2': _S}, {'addressId.city': _S}, {'addressId.state': _S}, {'addressId.country': _S}, {'addressId.zipCode': _S},
            ]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            // for(const {key: k, value: v} of filters) {
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
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

        const aggregate = [ //Todo replace all from string to model.collection.name...
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: addressModel.collection.name, localField: 'addressId', foreignField: '_id', as: 'addressId'}},
            {$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: roleModel.collection.name, localField: 'roleId', foreignField: '_id', as: 'roleId'}},
            {$unwind: {path: "$roleId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: verificationModel.collection.name, let: {userId: '$_id'}, pipeline: [{$match: {$expr: {$eq: ['$userId', '$$userId']}, isVerified: true, isActive: false, isDeleted: false}}, {$sort: {updatedAt: -1}}, {$project: {updatedAt: 1, _id: 0}}, {$limit: 1}], as: 'verifications'}},
            {$unwind: {path: "$verifications", preserveNullAndEmptyArrays: true}},
            {$set: {lastLogin: '$verifications.updatedAt'}},
            {$unset: 'verifications'}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    create = async (newData: any, session: ClientSession): Promise<IUser|never> => { //Todo optimize this. write operation.
        const [duplicate] = await Promise.all([
            await userModel.findOne().or([{email: newData?.email}, {altEmail: newData?.altEmail}, { phone: newData?.phone}]).select('email altEmail phone interNationalCode isDeleted'),
            await this.checkIds(newData)
        ])        
        if(duplicate) {
            if(duplicate.email === newData?.email && !duplicate.isDeleted) throw Errors.EMAIL_PRESENT;
            else if(duplicate.altEmail && duplicate.altEmail === newData?.altEmail && !duplicate.isDeleted) throw Errors.ALTERNATE_EMAIL_PRESENT;
            else if(duplicate.phone === newData?.phone && !duplicate.isDeleted ) throw Errors.PHONE_NUMBER_PRESENT;
            else if(duplicate.isDeleted === true) throw Errors.UPER_IS_ALREADY_DELETED;
        }
        if(newData?.address)await addressModel.create([newData.address], {session}).then(addressData => newData.addressId = addressData[0]._id)
        return await userModel.create([newData], {session}).then(user => user[0])
    }

    findById = async (_id: IUser['_id']): Promise<IUser|null> => {
        const aggregate = [
            {$match: {_id: mongoose.Types.ObjectId(_id), isDeleted: false}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'addresses', localField: 'addressId', foreignField: '_id', as: 'addressId'}},
            {$unwind: {path: "$addressId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'roles', localField: 'roleId', foreignField: '_id', as: 'roleId'}},
            {$unwind: {path: "$roleId", preserveNullAndEmptyArrays: true}},
           // {$unset: 'password'}
        ]
        return await userModel.aggregate<IUser>(aggregate).then(([user]) => user || null)
    }

    update = async (newData: any, session: ClientSession): Promise<any> => {
        // {_id: {$nin: newData._id }}
        const [duplicate, user] = await Promise.all([
            await userModel.findOne({_id: {$nin: newData._id }}).or([{email: newData?.email}, {altEmail: newData?.altEmail}, { phone: newData?.phone}]).select('email altEmail phone interNationalCode'),
            await userModel.findOne({_id: newData._id, isDeleted: false}),
            await this.checkIds(newData)
        ])        
        if(duplicate) {
            if(duplicate.email === newData?.email) throw Errors.EMAIL_PRESENT;
            else if(duplicate.altEmail && duplicate.altEmail === newData?.altEmail) throw Errors.ALTERNATE_EMAIL_PRESENT;
            else if(duplicate.phone === newData?.phone ) throw Errors.PHONE_NUMBER_PRESENT;
        }
        if(!newData?.address && !user?.addressId){
            let userUpdate = await userModel.updateOne({_id: newData._id}, newData, {new: true}).session(session)
            //@ts-expect-error
            return userUpdate?.nModified;
        } 
        else if(newData.address && !user?.addressId) {
            newData.address.createdBy = newData.address.updatedBy = newData.updatedBy
            let [addressUpdate, userUpdate] = await Promise.all([
                await addressModel.create([newData.address], {session}).then(addressData => newData.addressId = addressData[0]._id),
                await userModel.updateOne({_id: newData._id}, newData, {new: true}).session(session)
            ])
            //@ts-expect-error
            return userUpdate?.nModified;
        }
        else{
            newData.address.updatedBy = newData.updatedBy
            let [addressUpdate, userUpdate] = await Promise.all([
                await addressModel.findByIdAndUpdate(user?.addressId, newData.address).session(session),
                await userModel.updateOne({_id: newData._id}, newData, {new: true}).session(session)
            ])
            //@ts-expect-error
            return userUpdate?.nModified;
        }
    }

    // update = async (newData: any, session: ClientSession): Promise<any> => {    //Todo optimize this function using aggregate...
    //     const [user] = await Promise.all([await userModel.findOne({_id: newData._id, isDeleted: false}), await this.checkIds(newData)])
    //     let duplicateCheck: any = []        
    //     if(newData?.email !== user?.email) duplicateCheck.push({email: newData?.email})
    //     if(newData?.altEmail !== user?.altEmail) duplicateCheck.push({altEmail: newData?.altEmail})
    //     if(newData?.phone !== user?.phone) duplicateCheck.push({phone: newData?.phone})

    //     let duplicate, AddressData
    //     if(duplicateCheck.length > 0)[ duplicate, AddressData] = await Promise.all([
    //         await userModel.findOne().or(duplicateCheck).select('email altEmail phone'),
    //         await addressModel.findOne({_id: user?.addressId, isDeleted: false})
    //     ])
    //     else AddressData = await addressModel.findOne({_id: user?.addressId, isDeleted: false})
    //     if(duplicate) {
    //         if(duplicate.email === newData?.email) throw new Error('Email already Present')
    //         else if(duplicate.altEmail === newData?.altEmail) throw new Error('Alternate Email already Present')
    //         else if(duplicate.phone === newData?.phone) throw new Error('Phone number already Present')
    //     }
    //     if(user && AddressData) {
    //         let [addressUpdate, userUpdate] = await Promise.all([
    //             await addressModel.findByIdAndUpdate(user?.addressId, newData.address).session(session),
    //             await userModel.updateOne({_id: newData._id}, newData, {new: true}).session(session)
    //         ])
    //         if(!addressUpdate || !userUpdate?.nModified) throw new Error(Messages.UPDATE_FAILED)
    //         return userUpdate?.nModified;
    //     }
    //     else throw new Error(Messages.UPDATE_FAILED)
    // }

    async checkIds({roleId, companyId}:IUser): Promise<void|never> {
        const [roleIdData, companyIdData] = await Promise.all([
            await roleModel.findOne({_id: roleId, isDeleted: false}, '_id'),
            await companyModel.findOne({_id: companyId, isDeleted: false}, '_id')
        ])
        if(!roleIdData?._id) throw new Error(Errors.INVALID_ROLE_ID)
        if(!companyIdData?._id) throw new Error(Errors.INVALID_COMPANY_ID)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])
        let cond: any = {}        
        //@ts-expect-error
        if(user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);
        let data = await userModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'roles', localField: 'roleId', foreignField: '_id', as: 'roleId' } },
            { $unwind: { path: "$roleId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companytypes', localField: 'companyId.companyTypeId', foreignField: '_id', as: 'companyTypeId' } },
            { $unwind: { path: "$companyTypeId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companysubtypes', localField: 'companyId.companySubTypeId', foreignField: '_id', as: 'companySubTypeId' } },
            { $unwind: { path: "$companySubTypeId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'addresses', localField: 'addressId', foreignField: '_id', as: 'addressId' } },
            { $unwind: { path: "$addressId", preserveNullAndEmptyArrays: true } },
            { $set: { "companyId.companyTypeId": "$companyTypeId" } },
            { $set: { "companyId.companySubTypeId": "$companySubTypeId" } },
            // { $set: { "companyId.addressId": "$addressId" } },
            { $unset: ["companyTypeId", "companySubTypeId"] },
            {$addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "roles": { "$addToSet": "$roleId" },
                    "companies": {"$addToSet": "$companyId"},
                    "companyTypes": { "$addToSet": "$companyId.companyTypeId" },
                    "companySubTypes": { "$addToSet": "$companyId.companySubTypeId" },
                    "city": { "$addToSet": "$addressId.city" },
                    "state": { "$addToSet": "$addressId.state" },
                    "country": { "$addToSet": "$addressId.country" }
                }
            },
            {
                $project: {
                    _id: 0, "roles._id": 1, "roles.shortDescription":1, "companies._id": 1, "companies.name":1,"companies.sorted":1,
                    "companyTypes._id": 1,"companyTypes.shortDescription": 1,"companySubTypes._id": 1,"companySubTypes.shortDescription": 1,
                    "city": 1, "state": 1, "country": 1
                }
            }
        ]).then(data => data[0])
        return data
    }  

    verficationMethod = async(userIds: [IUser['_id']], verificationMethod: any, loggedInUser: IUser['_id']) => {
        //@ts-expect-error
        userIds.forEach((user: IUser['_id'], i: number) => userIds[i] = mongoose.Types.ObjectId(user))
        let validUsers = await userModel.aggregate([
            { $match: { _id: {"$in" : userIds}, isDeleted: false } },
            {$group: {
                _id: null,
                "validUserIds": { "$addToSet": "$_id" },
            }}
        ]).then(data => data[0].validUserIds)
        await userModel.updateMany({_id: {$in : validUsers}, isDeleted: false}, {verificationMethod, updatedBy: loggedInUser})
        return validUsers
    }

}