import {BaseRepository} from "../BaseRepository";
import { IDiamondRegistration } from "./diamond-registration.types";
import diamondRegistrationModel from "./diamond-registration.model";
import { Texts} from "../../constants";
import mongoose, {ClientSession} from "mongoose";
import { IIndexProjection} from "../../interfaces/IRepository";
import {Enum} from "../../constants/Enum";
import skuModel from "../sku/sku.model";
import { ISku } from "../sku/sku.types";
import { LoanRepository } from "../loan/loan.repository";
import iavModel from "../iav/iav.model";
import rapPriceModel from "../rap-price/rap-price.model";
import commentModel from "../comment/comment.model";
import userModel from "../user/user.model";
import clientPriceModel from "../client-price/client-price.model";
import companyModel from "../company/company.model";
import rfidModel from "../rfid/rfid.model";
import labModel from "../lab/lab.model";
import skuInfinityPriceModel from "../sku-infinity-price/sku-infinity-price.model";
import { SkuRepository } from "../sku/sku.repository";
import { IUser } from "../user/user.types";
import labMasterModel from "../lab-master/lab-master.model";

export class DiamondRegistrationRepository extends BaseRepository<IDiamondRegistration> {
    constructor () {
        super(diamondRegistrationModel);
    }

    getErrorDiamondRegistration = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
            // 'iavId.isDeleted': false,
            // 'iavId.rapPriceId.isDeleted': false
        };
        let sort = {}, projection: IIndexProjection = {"createdBy.password": 0, "updatedBy.password": 0}

        /*  if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
              sorter = sorter.replace(/'/g, '"')
              sorter = await JSON.parse(sorter)
              sort = { [`${sorter.key}`] : `${sorter.value}`}
          }*/
        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            //const {key, value} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if (v == 'asc') v = 1;
            if (v == 'desc') v = -1;
            sort = {[k]: v}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [
                 {'skuId.clientRefId': _S}
                //{'contacts.number': {$regex: /^5535/, $options: "i"}}, // ToDo Need to find Solution for Integer search
            ]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: any) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                } else if (k === '_id') cond[k] = mongoose.Types.ObjectId(v)
                else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) {
                    v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val));
                    secondCond[k] = {$in: v}
                } else if (k.includes(".") && k[k.length - 2] === 'I' && k[k.length - 1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd' && v instanceof Array) {
                    v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val));
                    cond[k] = {$in: v}
                } else if (k[k.length - 2] === 'I' && k[k.length - 1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if (k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }

        if (column && column[0] == '[' && column[column.length - 1] == ']') {
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for (const col of column) projection[col] = 1
        }

        const aggregate = [
            {$lookup: {from: skuModel.collection.name, localField: 'skuId', foreignField: '_id', as: 'skuId'}}, {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rfidModel.collection.name, localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId'}},{$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id',as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name,localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            // {$match: secondCond},
            // {$project: projection},
            // {$unset: ["createdBy.password", "updatedBy.password"]};
        ]
        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["createdBy.password", "updatedBy.password"]}]
        // return await super.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let cond: any = {}, secondCond: any = {}
        let user = await userModel.findOne({ _id: userId }).populate([{ path: 'roleId' }])

        // if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
        //     filters = filters.replace(/'/g, '"')
        //     filters = JSON.parse(filters)
        //     filters.forEach(({ key: k, value: v }: any) => {
        //         if (k === 'inventories') {
        //             if (v) cond['stoneStatus'] = { $in: [Enum.stoneStatus.CONSIGNMENT, Enum.stoneStatus.APPROVED, Enum.stoneStatus.MISSING, Enum.stoneStatus.SOLD, Enum.stoneStatus.REMOVED] };
        //             if (v) cond['collateralStatus'] = { $nin: [Enum.collateralStatus.COLLATERAL_IN, Enum.collateralStatus.COLLATERAL_OUT] }
        //         }
        //         else if (k === 'collateralInventories') { if (v) cond['collateralStatus'] = { $in: [Enum.collateralStatus.COLLATERAL_IN] } }
        //     })
        // }
        //@ts-expect-error
        if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        return await diamondRegistrationModel.aggregate([
            { $match: { ...cond, "isDeleted": false } },
            {$lookup: {from: skuModel.collection.name, localField: 'skuId', foreignField: '_id', as: 'skuId'}}, {$unwind: {path: "$skuId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rfidModel.collection.name, localField: 'skuId.rfId', foreignField: '_id', as: 'skuId.rfId'}},{$unwind: {path: "$skuId.rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id',as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name,localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            { $lookup: { from: labModel.collection.name, localField: 'skuId.labsId', foreignField: '_id', as: 'skuId.labsId' } },{$unwind: {path: "$skuId.labsId", preserveNullAndEmptyArrays: true}},
            // { $lookup: { from: iavModel.collection, localField: 'skuId.iavId', foreignField: '_id', as: 'skuId.iavId' } },{ $unwind: { path: "$skuId.iavId", preserveNullAndEmptyArrays: true } },
            // { $lookup: { from: rapPriceModel.collection.name, localField: 'skuId.iavId.rapPriceId', foreignField: '_id', as: 'rapPriceId' } },
            // { $unwind: { path: "$rapPriceId", preserveNullAndEmptyArrays: true } },
            // { $lookup: { from: clientPriceModel.collection.name, localField: 'skuId.iavId.clientPriceId', foreignField: '_id', as: 'clientPriceId' } },{ $unwind: { path: "$clientPriceId", preserveNullAndEmptyArrays: true } },
            // { $set: { "skuId.iavId.rapPriceId": "$rapPriceId" } },
            // { $set: { "skuId.iavId.clientPriceId": "$clientPriceId" } },
            // { $unset: ["rapPriceId", "clientPriceId"] },
            {$addFields: {"companyId.sorted": {$toLower: "$companyId.name"}}},
            {
                $group: {
                    _id: null,
                    "uniqueWeight": { "$addToSet": "$skuId.weight" },
                    "color": { "$addToSet": "$skuId.colorCategory" },
                    "company": { "$addToSet": "$companyId" },
                    "stoneStatus": { "$addToSet": "$skuId.stoneStatus" },
                    "rfidStatus": { "$addToSet": "$skuId.rfidStatus" },
                    "dmStatus": { "$addToSet": "$skuId.dmStatus" },
                    "collateralStatus": { "$addToSet": "$skuId.collateralStatus" },
                    "shape": { "$addToSet": "$skuId.shape" },
                    "clarity": { "$addToSet": "$skuId.clarity" },
                    "colorType": { "$addToSet": "$skuId.colorType" },
                    "labs": { "$addToSet": "$skuId.labsId" },
                    // "uniqueIav": { "$addToSet": "$skuId.iavId.iav" },
                    // "uniquePwv": { "$addToSet": "$skuId.iavId.pwv" },
                    // "uniqueDrv": { "$addToSet": "$skuId.iavId.drv" },
                    // "uniqueRapPrices": { "$addToSet": "$skuId.iavId.rapPriceId.price" },
                    // "uniqueClientPrices": { "$addToSet": "$skuId.iavId.clientPriceId.price" },
                }
            },
            {
                $project: {
                    _id: 0, "company.name": 1, "company._id": 1, "company.sorted": 1, "labs.lab": 1, "color": 1, "dmStatus": 1, "shape": 1, "clarity": 1, "colorType": 1
                    , "stoneStatus": 1, "rfidStatus": 1, "collateralStatus": 1
                }
            }
        ]).then(([data]) => data)
    }

}