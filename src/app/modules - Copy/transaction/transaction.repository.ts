import {BaseRepository} from "../BaseRepository";
import { ITransaction } from "./transaction.types";
import transactionModel from "./transaction.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import {IUser, IUserNested} from "../user/user.types";
import mongoose from "mongoose";
import transactionImportModel from "./import/import.model";
import {SkuRepository} from "../sku/sku.repository";
import skuModel from "../sku/sku.model";
import { ISku } from "../sku/sku.types";
import {Messages, Errors} from "../../constants"


export class TransactionRepository extends BaseRepository<ITransaction> {
    constructor(){
        super(transactionModel)
    }

    index = async ({filters, search, sort:sorter, pageNumber, pageSize, column}: IIndexParam): Promise<object> => {
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
            secondCond['$or'] = [{'status': _S}, {'transactionId': _S}, {'companyId.name': _S}]
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
            {$lookup: {from: 'iavs', localField: 'skuIds.iavId', foreignField: '_id', as: 'skuIds.iavId'}},
            {$unwind: {path: "$skuIds.iavId", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
        ]
        const sCond = [{$match: secondCond}, {$project: projection},]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        const [{data, page}, countHeader] = await Promise.all([
            // await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize),
            await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize),
            await transactionModel.aggregate([{$match: cond}, ...aggregate, ...sCond, {$project: {'skuIds.iavId.pwv': 1}}])
        ])
        let header = {totalStone: page.filterCount, totalValue: 0}
        //@ts-expect-error
        countHeader.forEach(({skuIds}: ITransaction) => header.totalValue = header.totalValue + parseFloat(skuIds?.iavId?.pwv ?? 0))
        return {header, page, data}
    }

    findReviewBR = async ({filters, search, sort:sorter, pageNumber, pageSize, column, action, transactionData}: any): Promise<object> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = {};
        if(!transactionData) throw new Error(Errors.INVALID_TRANSACTION_ID)
        
        if(action === "OPEN")transactionData.skuIds = transactionData?.openSkuIds;
        else if(action === "CLOSE")transactionData.skuIds = transactionData?.closeSkuIds; 
        
        cond['_id'] = {$in: transactionData?.skuIds}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            const {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k] : v}
        }
        else sort = {createdAt: 'desc', updatedAt: 'desc'};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'rfId.rfid': _S}, {'labsId.labReportId': _S}, {'clientRefId': _S}, {'infinityRefId': _S}]
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
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
            {$match: cond},
            {$lookup: {from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId'}},
            {$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId'}},
            {$unwind: {path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId'}},
            {$unwind: {path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'rfids', localField: 'rfId', foreignField: '_id', as: 'rfId'}},
            {$unwind: {path: "$rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId'}},
            {$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: 'users', localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            {$match: secondCond},
            {$project: projection},
            {$unset: ["createdBy.password", "updatedBy.password"]}
        ]
        const {data, page} = await new SkuRepository().aggregateIndexBR(aggregate, sort, pageNumber, pageSize, {_id: {$in: transactionData?.skuIds},isDeleted: false})
        let header = {totalStone: page.filterCount, totalCarats: 0, totalValue: 0}
        //@ts-expect-error
        data.forEach(({weight, iavId}: ITransaction) => {header.totalCarats = header.totalCarats + parseFloat(weight ?? 0);header.totalValue = header.totalValue + parseFloat(iavId?.pwv ?? 0)})
        return {header, page, data}
    }

    async filterBR(skuIds: ISku['_id'][]): Promise<any> {
                
        let data = await skuModel.aggregate([
            { $match: {"_id" : {"$in" : skuIds}, "isDeleted": false } },
            { $lookup: { from: 'labs', localField: 'labsId', foreignField: '_id', as: 'labsId' } },
            { $unwind: { path: "$labsId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'companies', localField: 'companyId', foreignField: '_id', as: 'companyId' } },
            { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'devices', localField: 'deviceId', foreignField: '_id', as: 'deviceId' } },
            { $unwind: { path: "$deviceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'iavs', localField: 'iavId', foreignField: '_id', as: 'iavId' } },
            { $unwind: { path: "$iavId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'rapprices', localField: 'iavId.rapPriceId', foreignField: '_id', as: 'rapPriceId' } },
            { $unwind: { path: "$rapPriceId", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'clientprices', localField: 'iavId.clientPriceId', foreignField: '_id', as: 'clientPriceId' } },
            { $unwind: { path: "$clientPriceId", preserveNullAndEmptyArrays: true } },
            { $set: { "iavId.rapPriceId": "$rapPriceId" } },
            { $set: { "iavId.clientPriceId": "$clientPriceId" } },
            { $unset: ["rapPriceId", "clientPriceId"] },
            {$addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$weight" },
                    "color": { "$addToSet": "$colorCategory" },
                    "company": { "$addToSet": "$companyId" },
                    "stoneStatus": { "$addToSet": "$stoneStatus" },
                    "dmStatus": {"$addToSet": "$dmStatus"},
                    "shape": { "$addToSet": "$shape" },
                    "clarity": { "$addToSet": "$clarity" },
                    "colorType": { "$addToSet": "$colorType" },
                    "labs": { "$addToSet": "$labsId" },
                    "uniqueIav": { "$addToSet": "$iavId.iav" },
                    "uniquePwv": { "$addToSet": "$iavId.pwv" },
                    "uniqueDrv": { "$addToSet": "$iavId.drv" },
                    "uniqueRapPrices": { "$addToSet": "$iavId.rapPriceId.price" },
                    "uniqueClientPrices": { "$addToSet": "$iavId.clientPriceId.price" },
                    "devices": { "$addToSet": "$deviceId" },
                    "gemlogistStatus": { "$addToSet": "$gemlogistStatus" }
                }
            },
            {
                $project: {
                    _id: 0, "company.name": 1, "company._id": 1, "company.sorted": 1, "labs.lab": 1, "uniqueWeight": 1, "status": 1,
                    "color": 1, "stoneStatus": 1, "shape": 1, "clarity": 1, "colorType": 1, "uniqueIav": 1, "uniquePwv": 1,
                    "uniqueDrv": 1, "uniqueRapPrices": 1, "uniqueClientPrices": 1, "devices.name": 1, "devices._id": 1,"gemlogistStatus":1
                }
            }
        ]).then(data => data[0])

        return data
    }  
    //@ts-expect-error
    async exportExcel(worksheet, header, data) {
        for (const [index, element] of header.entries()) {      
            worksheet.getColumn(index+1).width = 22
            let valKey = await element.valKey.split(".");

            if (valKey[valKey.length - 1] === "drv"|| valKey[valKey.length - 1] === "infinityPrice" || valKey[valKey.length - 1] === "pwvImport" || valKey[valKey.length - 1] === "price") worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
            else if( valKey[valKey.length - 1] === "pwv" ) worksheet.getColumn(index + 1).numFmt = '$#,##0.00'
            else if(valKey[valKey.length - 1] === "weight") worksheet.getColumn(index + 1).numFmt = '#0.00'
            else if (valKey[valKey.length - 1] === 'iav') worksheet.getColumn(index + 1).numFmt = '#0.00000'
        }    
        //console.log("-->",worksheet);

        const row = worksheet.getRow(1)
        const table = worksheet.addTable({
            name: 'Transaction',
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
        //console.log("-=>",table);
        //@ts-expect-error
        row.eachCell((cell, number) => {

            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                font: { bold: true },
                fgColor: { argb: '404040' },
                bgColor: { argb: '#00FFFF' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

        table.commit()
    }
}