import {BaseRepository} from "../BaseRepository";
import {IIndexProjection} from "../../interfaces/IRepository";
import mongoose, {ClientSession} from "mongoose";
import {ICompanyClientSetting} from "./companyClientSetting.types";
import companyClientSettingModel from "./companyClientSetting.model";


export class CompanyClientSettingRepository extends BaseRepository<ICompanyClientSetting> {
    constructor () {
        super(companyClientSettingModel);
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
        };
        let sort:{[x:string]: -1|1} = { updatedAt: -1}, projection: IIndexProjection = {'__v': 0}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            let {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k] : v}
        }

        if(search){ //Todo remove regex from everywhere for searching it is very costly operation...
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'companyId.name': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: any) => {
                if(k === '_id') cond[k] = mongoose.Types.ObjectId(v)
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
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    update = async (cond: object, item: ICompanyClientSetting): Promise<any> => {
        const diamondData = await companyClientSettingModel.findOne(cond)
        if(diamondData) return  companyClientSettingModel.updateOne(cond, item).then(() => companyClientSettingModel.findOne(cond))
        item.createdBy = item.updatedBy
        return companyClientSettingModel.create(item)
    }

    bulkUpdate = async (data: ICompanyClientSetting[], loggedInUserId: string, session: ClientSession): Promise<any> => {
        let companyToCheck: string[] = [], companyObject: {[x: string]: string} = {}, newInsert:any[] = [], update:any[] = []
        data.forEach((data) => companyToCheck.push(data.companyId))
        const companyData = await companyClientSettingModel.find({companyId: {$in: companyToCheck}, isDeleted: false}, 'companyId -_id')

        if(companyData.length) companyData.forEach(({companyId}) => companyObject[companyId] = companyId)
        else {
            data.forEach((data) => data.createdBy = loggedInUserId)
            return await companyClientSettingModel.insertMany(data, {session})
        }

        // const dd = data.map(async(el) => {
        for (const el of data) {
            // if(companyObject[el.companyId]) update.push(companyClientSettingModel.updateOne({companyId: el.companyId}, el, {session}))
            if(companyObject[el.companyId]) await companyClientSettingModel.updateOne({companyId: el.companyId}, el, {session})
            else newInsert.push(el)
        }
        // await Promise.all(dd)
        newInsert.length && await companyClientSettingModel.insertMany(newInsert, {session})
        // await Promise.all([
        //     newInsert.length && companyClientSettingModel.insertMany(newInsert, {session}),
        //     ...update
        // ])
        return companyClientSettingModel.find({companyId: {$in: companyToCheck}, isDeleted: false}).session(session);
    }
}