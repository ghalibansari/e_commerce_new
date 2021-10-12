import {BaseRepository} from "../../BaseRepository";
import {ITransactionImportReview} from "./import-review.types";
import transactionImportReviewModel from "./import-review.model";
import {ISku} from "../../sku/sku.types";
import mongoose, {ClientSession} from "mongoose";
import skuModel from "../../sku/sku.model";
import {IIndexParam} from "../../../interfaces/IRepository";
import {IUserNested} from "../../user/user.types";

export class TransactionImportReviewRepository extends BaseRepository<ITransactionImportReview> {
    constructor(){
        super(transactionImportReviewModel)
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
            const {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = {createdAt: -1, updatedAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [
                {'transactionId': _S}, {'companyId.name': _S}, {'companyId.contacts.name': _S}, {'companyId.contacts.email': _S}, {'companyId.addressId.address1': _S},
                {'companyId.addressId.address2': _S},{'status':_S}
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

        if(column && column[0]=='[' && column[column.length-1]==']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const aggregate = [
            // {$match: cond},
            {$lookup: {from: 'skus', localField: 'skuIds', foreignField: '_id', as: 'skuIds'}},
            {$unwind: {path: "$skuIds", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'approvedBy', foreignField: '_id', as: 'approvedBy'}},
            {$unwind: {path: "$approvedBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
            // {$unset: ["approvedBy.password", "createdBy.password"]}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["approvedBy.password", "createdBy.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async find(transactionId: any) : Promise<ISku[]|null> {
        let populate = [{path: 'skuId'}];
        let data: ISku[] = []
        await transactionImportReviewModel.find({transactionId},{"skuId":1, _id:0}).populate(populate).then(skuData => {
            //@ts-expect-error
            skuData.filter(sku => data.push(sku.skuId))
        })
        return data   
    }

    async update(body:any, session: ClientSession): Promise<any> {
        let data = await transactionImportReviewModel.findOneAndUpdate({transactionId: body.transactionId,
            skuId: body.skuId}, {approvedBy: body.approvedBy},{new: true, upsert: true, session})
        return data
    }

    async getSkuIds( transactionId: any): Promise<ISku[]> {
        let transactionData: any = await transactionImportReviewModel.findOne({ transactionId: transactionId });
        let populate = [{path: 'iavId', populate: [ { path: 'rapPriceId', model: 'RapPrice'},
            { path: 'clientPriceId', model: 'ClientPrice'}]},{path: 'companyId'}]
        return await skuModel.find({ _id: { $in: transactionData.skuIds } }).populate(populate)
    }

    async create(body:any, session: ClientSession): Promise<any> {
        return transactionImportReviewModel.create([body],{session}).then(data => data[0])
    }
}