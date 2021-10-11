import { IIndexParam, IIndexProjection, ISort } from "../../interfaces/IRepository";
import { Errors } from "../../constants";
import {BaseRepository} from "../BaseRepository";
import companyTypeModel from "../company-type/company-type.model";
import userModel from "../user/user.model";
import { IUser } from "../user/user.types";
import roleModel from "./role.model";
import {IRole} from "./role.types";
import { RoleValidation } from "./role.validation";
import mongoose, {Types} from "mongoose";
import companyModel from "../company/company.model";


export class RoleRepository extends BaseRepository<IRole> {
    constructor () {
        super(roleModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<object[]> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false, };
        let secondCond: any = {} //Todo add isDeleted condition here in every table
        let sort: ISort = {}, projection: IIndexProjection = {"createdBy.password": 0, "updatedBy.password":0}

        if(search){
            search = JSON.parse(search)
            const _S: {$regex: string, $options: "i"} = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'code': _S}, {"companyTypeId.code": _S} ]
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
            let check = filters.map(async ({key: k, value: v}: IIndexFilters) => {
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                }
                else if(k === "companyId") {
                    let company = await companyModel.findOne({_id: v, isDeleted: false}, 'companyTypeId')
                    if(company?.companyTypeId) cond['companyTypeId'] = company?.companyTypeId
                    cond['shortDescription'] = {$ne: "SPACECODEADMIN" }
                }
                // else if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
            await Promise.all(check)
        }
        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            {$lookup: {from: companyTypeModel.collection.name, localField: 'companyTypeId', foreignField: '_id', as: 'companyTypeId'}},{$unwind: {path: "$companyTypeId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},{$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},{$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
        ]
        const sCond = [{$match: secondCond}, {$project: projection}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    create = async (role: IRole): Promise<IRole> => {
        await this.checkIds(role)
        return await roleModel.create(role)
    }

    update = async (role: IRole): Promise<IRole|null> => {
        await this.checkIds(role)
        return await roleModel.findOneAndUpdate({_id: role._id}, {role}, {new :true})
    }

    delete = async (roleId: IRole['_id'], user: IUser['_id']): Promise<any> => {
        let [role, users] = await Promise.all([
            await roleModel.findById({_id: roleId, isDeleted: false}),
            await userModel.find({roleId, isDeleted: false})
        ]);
        if(users.length > 0) throw Errors.ROLEID_LINKED_WITH_ACTIVE_USER
        else if(!role) throw Errors.INVALID_ID
        else {
            const data = await roleModel.findOneAndUpdate({_id: roleId}, {isDeleted: true, updatedBy: user})
        } 
    }

    async checkIds({companyTypeId}: IRole): Promise<void | never> {
        let companyType = await companyTypeModel.findOne({_id: companyTypeId, isDeleted: false})
        if(!companyType?._id) throw Errors.INVALID_COMPANY_TYPE_ID
    }

    async filter(userId: IUser['_id']): Promise<any> {
        // let user = await userModel.findOne({_id: userId}).populate([{path: 'roleId'}])
        // //need to add these conditions
        // let cond: any = {}
        // // @ts-expect-error
        // if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["_id"] = mongoose.Types.ObjectId(user.companyId as string);

        let data = await roleModel.aggregate([   //Todo remove all sting in from fields in lookup joints.
            {$match: { "isDeleted": false}},
            // { $match: { "isDeleted": false } },
            {$lookup: {from: companyTypeModel.collection.name, localField: 'companyTypeId', foreignField: '_id', as: 'companyTypeId'}},
            {$unwind: {path: "$companyTypeId", preserveNullAndEmptyArrays: true}},
            {
                $group: {
                    _id: null,
                    "companyTypes": {"$addToSet": "$companyTypeId"},
                    "code": {"$addToSet": "$code"},
                }
            },
            {
                $project: {
                    _id: 0,
                    "companyTypes.code": 1,
                    "companyTypes._id": 1,
                    "code": 1
                }
            }
        ]).then(data => data[0])

        return data
    }
}