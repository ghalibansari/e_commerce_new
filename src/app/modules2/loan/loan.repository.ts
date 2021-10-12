import {BaseRepository} from "../BaseRepository";
import {ILoan, ILoanGroupByCompanyId} from "./loan.types";
import loanModel from "./loan.model";
import {ICompany} from "../company/company.types";
import mongoose, {Aggregate, ClientSession} from 'mongoose'
import companyModel from "../company/company.model";
import skuModel from "../sku/sku.model";
import {ICond, IIndexFilters, IIndexParam, IIndexProjection} from "../../interfaces/IRepository";
import userModel from "../user/user.model";
import companyClientSettingModel from "../companyClientSetting/companyClientSetting.model";
import {ISku, skuCollateralStatusEnum, skuColorTypeEnum} from "../sku/sku.types";
import clarityMasterModel from "../infinity-price/master/clarity-master/clarity-master.model";
import colorMasterModel from "../infinity-price/master/color-master/color-master.model";
import caratMasterModel from "../infinity-price/master/carat-master/carat-master.model";
import iavModel from "../iav/iav.model";
import clientPriceModel from "../client-price/client-price.model";
import rapPriceModel from "../rap-price/rap-price.model";
import infinityPriceNewModel from "../infinity-price-new/infinity-price-new.model";
import infinityPriceMasterModel from "../infinity-price/master/infinity-price-master/infinty-price-master.model";
import {IUser} from "../user/user.types";
import {Messages, Texts} from "../../constants"
import {Enum} from "../../constants/Enum";
import labModel from "../lab/lab.model";
import commentModel from "../comment/comment.model";
import rfidModel from "../rfid/rfid.model";
import {SkuRepository} from "../sku/sku.repository";
import loanHistoryModel from "../loan-history/loan-history.model";
import {ILoanHistory} from "../loan-history/loan-history.types";


export class LoanRepository extends BaseRepository<ILoan> {
    constructor() {
        super(loanModel);
    }

    index = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: IIndexParam): Promise<Aggregate<ILoanGroupByCompanyId[]>> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            let {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k]: v}
        } else sort = {createdAt: -1, updatedAt: -1};

        // if(search){
        //     search = JSON.parse(search)
        //     const _S = {$regex: search, $options: "i"}
        //     secondCond['$or'] = [
        //         {'firstName': _S}, {'lastName': _S}, {'email': _S}, {'altEmail': _S}, {'phone': _S}, {'contacts.name': _S}, {'addressId.address1': _S},
        //         {'addressId.address2': _S}, {'addressId.city': _S}, {'addressId.state': _S}, {'addressId.country': _S}, {'addressId.zipCode': _S},
        //     ]
        // }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            // for(const {key: k, value: v} of filters) {
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                } else if (k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
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
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}},
            {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}},
            {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}},
            {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            {$unset: ['createdBy.password', 'updatedBy.password']}
        ]
        const sCond = [{$match: secondCond}, {$project: projection}]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    add = async (data: Partial<ILoan>, loggedInUserId: string, session: ClientSession) => {
        data.updatedBy = loggedInUserId
        const [loan] = await Promise.all([
            loanModel.findOne({companyId: data.companyId, isDeleted: false}),   //Todo implement proper upsert method.
            loanHistoryModel.insertMany([{...data, createdBy: loggedInUserId} as ILoan], {session})
        ])
        if(loan)
        {
            // @ts-ignore
            data.amount=parseFloat(data.amount)+parseFloat(loan.amount);
            return loanModel.updateOne({_id: loan._id}, data, {session}).then(result => result.nModified)
        }
        return loanModel.insertMany([{...data, createdBy: loggedInUserId} as ILoan], {session}).then(_ => 1)
    }

    edit = async (data: Partial<ILoan>, loggedInUserId: string, session: ClientSession) => {
        return await Promise.all([
            loanModel.updateOne({_id: data._id}, {...data, updatedBy: loggedInUserId}, {session}),
            loanHistoryModel.insertMany([{...data, createdBy: loggedInUserId, updatedBy: loggedInUserId} as ILoanHistory], {session})
        ]).then(([loan]) => {
            if(loan.nModified) return 1
            else throw Messages.UPDATE_FAILED
        })
    }

    detail = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize, column, companyId}: any): Promise<object> => {
        if(!companyId) throw new Error('CompanyId is Required.')
        let cond: any = {'isDeleted': false};
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'labsId.isDeleted': false,
            // 'companyId.isDeleted': false,
        };
        let sort = {}, projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}

        /*if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }*/
        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            //const {key: k, value: v} = await JSON.parse(sorter)
            let {key: k, value: v} = await JSON.parse(sorter)
            if(v=='asc') v=1;
            if(v=='desc') v=-1;
            sort = {[k] : v}
        }
        else sort = { createdAt: -1, updatedAt: -1};

        if(search){
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'rfId.rfid': _S}, {'labsId.labReportId': _S}, {'clientRefId': _S}, {'infinityRefId': _S}]
        }
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            filters.forEach(({key: k, value: v}: any) => {

                if(k===Texts.companyId) {
                    // console.log(k, "================checking companyId");
                    //to do change the logic
                    if(v instanceof Array && v.length> 0) companyId = v[0]
                    else companyId=v;
                }
                if(k === 'startDate' || k === 'endDate') {
                    if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v)
                    if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v)
                }
                else if(k==='stoneRegistered') {
                    if(v ==='REGISTERED') cond['dmGuid'] = {"$ne": null}
                    else cond['dmGuid'] = {"$in": ["",null]}
                }
                else if(k==='inventories') {
                    if(v) cond['stoneStatus'] = {$in: [Enum.stoneStatus.CONSIGNMENT,  Enum.stoneStatus.APPROVED,  Enum.stoneStatus.MISSING,  Enum.stoneStatus.SOLD,  Enum.stoneStatus.REMOVED]};
                    if(v) cond['collateralStatus'] = {$nin: [ Enum.collateralStatus.COLLATERAL_IN]}
                }
                else if(k==='collateralInventories') {if(v) cond['collateralStatus'] = {$in: [ Enum.collateralStatus.COLLATERAL_IN]}}
                else if (k === '_id' && v instanceof Array) { v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = { $in: v } }
                else if(k==='clientRefId') cond[k] = v
                else if(k==='labsId.labReportId') secondCond[k] = v
                else if(k==='weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k==='iavId.drv' || k==='iavId.iav' || k==='iavId.pwv') secondCond[k] = {"$gte": v[0], "$lte": v[1]}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); secondCond[k] = {$in: v}}
                else if(k.includes(".") && k[k.length-2] === 'I' && k[k.length-1] === 'd') secondCond[k] = mongoose.Types.ObjectId(v as string)
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else if(k.includes(".")) v instanceof Array ? secondCond[k] = {$in: v} : secondCond[k] = v
                else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
            })
        }
        if(sliders && sliders[0]=='{' && sliders[sliders.length-1]=='}') {  //Todo remove this kind of slider from everywhere.
            sliders = JSON.parse(sliders)
            if(sliders.weight) cond.weight = {"$gte": sliders.weight[0], "$lte": sliders.weight[1]}
            if(sliders.drv) secondCond['iavId.drv'] = {"$gte": sliders.drv[0], "$lte": sliders.drv[1]}
            if(sliders.iav) secondCond['iavId.iav'] = {"$gte": sliders.iav[0], "$lte": sliders.iav[1]}
            if(sliders.pwv) secondCond['iavId.pwv'] = {"$gte": sliders.pwv[0], "$lte": sliders.pwv[1]}
            if(sliders.labReportId) secondCond['labsId.labReportId'] = sliders.labReportId
            //@ts-expect-error
            if(sliders.parentId) secondCond['companyId.parentId'] = mongoose.ObjectId(sliders.parentId)
        }

        if(column && column[0]=='[' && column[column.length-1]==']'){
            column = column.replace(/'/g, '"')
            column = JSON.parse(column)
            projection = {}
            for(const col of column) projection[col] = 1
        }

        const [Header1] = await this.getByCollateral(companyId)

        const aggregate = [
            // {$match: cond},
            {$match: {companyId: mongoose.Types.ObjectId(companyId)}},
            {$lookup: {from: labModel.collection.name, localField: 'labsId', foreignField: '_id', as: 'labsId'}}, {$unwind: {path: "$labsId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: companyModel.collection.name, localField: 'companyId', foreignField: '_id', as: 'companyId'}}, {$unwind: {path: "$companyId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: commentModel.collection.name, let: { "comments": "$comments" },pipeline: [{ "$match": { "$expr": { "$in": [ "$_id", "$$comments" ] } } },
            {$lookup: {from: userModel.collection.name, localField: 'createdBy',foreignField: '_id',as: 'createdBy'}},{"$unwind":{path: "$createdBy",preserveNullAndEmptyArrays: true}},{$project: {'createdBy._id':1,'createdBy.firstName': 1,'createdBy.lastName': 1, 'comment': 1, "createdAt":1}}], as: 'comments'}},
            {$lookup: {from: iavModel.collection.name, localField: 'iavId', foreignField: '_id', as: 'iavId'} }, {$unwind: {path: "$iavId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rapPriceModel.collection.name, localField: 'iavId.rapPriceId', foreignField: '_id', as: 'iavId.rapPriceId'}}, {$unwind: {path: "$iavId.rapPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: clientPriceModel.collection.name, localField: 'iavId.clientPriceId', foreignField: '_id', as: 'iavId.clientPriceId'}}, {$unwind: {path: "$iavId.clientPriceId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: rfidModel.collection.name, localField: 'rfId', foreignField: '_id', as: 'rfId'}}, {$unwind: {path: "$rfId", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'createdBy', foreignField: '_id', as: 'createdBy'}}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},
            {$lookup: {from: userModel.collection.name, localField: 'updatedBy', foreignField: '_id', as: 'updatedBy'}}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},
            // {$project: {'companyId.logoUrl': 0}},    //Todo remove this line tempo.
            {$lookup: {
                from: infinityPriceNewModel.collection.name, as: 'infinity',
                let: {clarity: '$clarity', color: '$colorCategory', weight: '$weight'},
                pipeline: [
                    {$lookup: {
                        from: infinityPriceMasterModel.collection.name,
                        as: 'infinityPriceMasterId',
                        let: {id: '$infinityPriceMasterId'},
                        pipeline: [
                            {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},

                            {$lookup: {
                                from: clarityMasterModel.collection.name, as: 'clarity', let: {id: '$clarityMasterId'},
                                pipeline: [
                                    {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                    {$project: {clarity: 1}}
                                ]
                            }},
                            {$unwind: {path: "$clarity", preserveNullAndEmptyArrays: true}},

                            {$lookup: {
                                from: colorMasterModel.collection.name, as: 'color', let: {id: '$colorMasterId'},
                                pipeline: [
                                    {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                    {$project: {color: 1}}
                                ]
                            }},
                            {$unwind: {path: "$color", preserveNullAndEmptyArrays: true}},

                            {$lookup: {
                                from: caratMasterModel.collection.name, as: 'carat', let: {id: '$caratRangeMasterId'},
                                pipeline: [
                                    {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                    {$project: {fromCarat: 1, toCarat: 1}}
                                ]
                            }},
                            {$unwind: {path: "$carat", preserveNullAndEmptyArrays: true}}
                        ]
                    }},
                    {$unwind: {path: "$infinityPriceMasterId", preserveNullAndEmptyArrays: true}},

                    {$match: {$and: [
                        {$expr: {$eq: ["$infinityPriceMasterId.clarity.clarity", "$$clarity"]}},
                        {$expr: {$eq: ["$infinityPriceMasterId.color.color", "$$color"]}},
                        {$expr: {$gte: ["$infinityPriceMasterId.carat.toCarat", "$$weight"]}},
                        {$expr: {$lte: ["$infinityPriceMasterId.carat.fromCarat", "$$weight"]}},
                        {$expr: {$lte: ["$effectiveDate", new Date()]}}
                    ]}},
                    {$sort: {createdAt: -1}}, {$limit: 1},
                ],
            }},
            {$unwind: {path: "$infinity", preserveNullAndEmptyArrays: true}},
            {$set: {rapPriceStone: {$cond: {if: {$ne: [{$type: '$iavId.rapPriceId.price'}, 'missing']}, then: '$iavId.rapPriceId.price', else: 0}}}},
            {$set: {'infinity.price': {$cond: {if: {$ne: [{$type: '$infinity.price'}, 'missing']}, then: '$infinity.price', else: 0}}}},
            // {$set: {contribution: {$cond:{
            //     if: {$eq: ['$colorType', skuColorTypeEnum.WHITE]},
            //     then: {$multiply: [100, {$divide: ['$infinity.price', Header1?.infinityCollateralValue || 1]}]},
            //     else: '$infinity.price'
            // ////(infnityprice / infinitycollectralvalue)*100 = contribution // need contribution infinityprice color
            // }}}}
        ]

        const sCond = [{$match: secondCond}, {$project: projection}, {$unset: ["createdBy.password", "updatedBy.password"]}]
        const [{data, page}, countHeader] = await Promise.all([
            await new SkuRepository().aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize),
            await skuModel.aggregate<ISku>([{$match: cond}, ...aggregate, {$match: secondCond}, {$project: {weight: 1, 'iavId.pwv': 1}}]),
        ])
        let header = {totalStone: page.filterCount, totalCarats: 0, totalValue: 0, ...Header1};
        //@ts-expect-error
        countHeader.forEach(({weight, iavId}: ISku) => {header.totalCarats = header.totalCarats + parseFloat(weight ?? 0); header.totalValue = header.totalValue + parseFloat(iavId?.pwv ?? 0)})
        return {header, page, data}
    }

    //Todo implement Aggregate type in every index function Promise<Aggregate<ILoan[]>>...
    summary = async ({filters, search, sort: sorter, pageNumber, pageSize, column, companyId}: any): Promise<Aggregate<ILoanGroupByCompanyId[]>> => {
        //@ts-expect-error
        let cond: ICond = {'isDeleted': false}, sort = {}, projection: IIndexProjection = {password: 0}
        let secondCond: any = { //Todo add isDeleted condition here in every table
            // 'companyId.isDeleted': false,
            // 'rfId.isDeleted': false,
        };
        let searchKey: any = {};

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"')
            let {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k]: v}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S = {$regex: search, $options: "i"}
            searchKey = {'company.name': _S}
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            // for(const {key: k, value: v} of filters) {
            filters.forEach(({key: k, value: v}: IIndexFilters) => {
                if (k === 'startDate' || k === 'endDate') {
                    if (!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
                    if (k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
                    if (k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
                } else if (k === '_id') cond[k] = mongoose.Types.ObjectId(v as string)
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
        let aggregate: any = []
        companyId && aggregate.push({$match: {companyId: mongoose.Types.ObjectId(companyId)}})
        aggregate = [...aggregate, ...this.summaryAggregate]
        aggregate.splice((aggregate.length - 1), 0, {$match: searchKey});
        const sCond = [{$match: secondCond}, {$project: projection}]
        return await super.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }   //Todo move all queries to separate file.

    summaryAggregate = [
        {$group: {_id: '$companyId', loanAmount: {$sum: '$amount'}}},

        {$lookup: {
            from: companyClientSettingModel.collection.name, as: 'clientCompany',
            let: {companyId: '$_id'},
            pipeline: [{$match: {$and: [{$expr: {$eq: ['$companyId', '$$companyId']}}, {isDeleted: false}]}}]
        }}, {$unwind: {path: "$clientCompany", preserveNullAndEmptyArrays: true}},

        {$lookup: {
            from: companyModel.collection.name, as: 'company',
            let: {companyId: '$_id'},
            pipeline: [{$match: {$and: [{$expr: {$eq: ['$_id', '$$companyId']}}, {isDeleted: false}]}}, {$project: {logoUrl: 0}}]
        }}, {$unwind: {path: "$company", preserveNullAndEmptyArrays: true}},

        {$lookup: {
                from: skuModel.collection.name, let: {companyId: '$_id', weight: '$weight'}, as: 'sku',
                pipeline: [
                    {$match: {
                            $and: [
                                {$expr: {$eq: ['$companyId', '$$companyId']}},
                                {isDeleted: false, collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN}
                            ]
                        }},
                    {$set: {'noOfStones': 1}},
                    {$lookup: {
                        from: clarityMasterModel.collection.name,
                        let: {clarity: '$clarity'},
                        as: 'clarityCode',
                        pipeline: [{
                            $match: {
                                $expr: {$eq: ['$clarity', '$$clarity']},
                                isDeleted: false
                            }
                        }]
                    }}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: colorMasterModel.collection.name,
                        let: {color: '$colorCategory'},
                        as: 'colorCode',
                        pipeline: [{
                            $match: {
                                $expr: {$eq: ['$color', '$$color']},
                                isDeleted: false
                            }
                        }]
                    }}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: caratMasterModel.collection.name, as: 'weightRangeId',
                        let: {weightRangeId: '$weightRangeId', weight: '$weight'},
                        pipeline: [
                            {$match :{$and: [
                                {$expr: {isDeleted: false}},
                                {$expr: {$lte: ['$fromCarat', '$$weight']}},
                                {$expr: {$gte: ['$toCarat', '$$weight']}}
                            ]}},
                        ]
                    }},
                    {$unwind: {path: "$weightRangeId", preserveNullAndEmptyArrays: true}},
                    {$set: {weightRangeId: '$weightRangeId._id'}},

                    {$lookup: {
                        from: iavModel.collection.name, as: 'iav',
                        let: {iavId: '$iavId'},
                        pipeline: [
                            {$match: {$and: [{$expr: {$eq: ['$_id', '$$iavId']}}, {isDeleted: false}]}},
                            {$lookup: {
                                from: clientPriceModel.collection.name,
                                as: 'clientPrice',
                                let: {clientPriceId: '$clientPriceId'},
                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$clientPriceId']}}}]
                            }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},
                            {$lookup: {
                                from: rapPriceModel.collection.name,
                                as: 'rapPrice',
                                let: {rapPriceId: '$rapPriceId'},
                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$rapPriceId']}}}]
                            }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},
                        ]
                    }}, {$unwind: {path: "$iav", preserveNullAndEmptyArrays: true}},
                    {$set: {clientWeightAndPrice: {$cond: {
                        if: {$multiply: ['$weight', '$iav.clientPrice.price']},
                        then: {$multiply: ['$weight', '$iav.clientPrice.price']},
                        else: 0
                    }}}},
                    {$set: {rapPriceStone: {$cond: {if: '$iav.rapPrice.price', then: '$iav.rapPrice.price', else: 0}}}},

                    {$lookup: {
                        from: infinityPriceNewModel.collection.name, as: 'infinity',
                        let: {clarityId: '$clarityCode._id', colorId: '$colorCode._id', weightId: '$weightRangeId'},
                        pipeline: [
                            {$lookup: {
                                from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMaster',
                                let: {id: '$infinityPriceMasterId'},
                                pipeline: [{$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}}]
                            }},
                            {$unwind: {path: "$infinityPriceMaster", preserveNullAndEmptyArrays: true}},

                            {$match: {$and: [
                                {$expr: {$eq: ["$infinityPriceMaster.clarityMasterId","$$clarityId"]}},
                                {$expr: {$eq: ["$infinityPriceMaster.colorMasterId","$$colorId"]}},
                                {$expr: {$eq: ["$infinityPriceMaster.caratRangeMasterId","$$weightId"]}},
                                {$expr: {$lte: ["$effectiveDate", new Date()]}}
                            ]}},
                            {$sort: {createdAt: -1}}, {$limit: 1}
                        ],
                    }},
                    {$unwind: {path: "$infinity", preserveNullAndEmptyArrays: true}},
                    {$set: {infinityWeightAndPrice: {$cond: {
                        if: {$eq: ['$colorType', skuColorTypeEnum.WHITE]},
                        then: {$multiply: ['$weight', {$multiply: ['$rapPriceStone', {$subtract: [1, {$divide: ['$infinity.price', 100]}]}]}]},
                        else: {$multiply: ['$weight', '$infinity.price']}
                    }}}},
                    {$set: {infinityWeightAndPrice: {$cond: {if: '$infinityWeightAndPrice', then: '$infinityWeightAndPrice', else: 0}}}}
                ]
            }}, //{$unwind: {path: "$sku", preserveNullAndEmptyArrays: true}},

        {$project: {
            infinityCollateralValue: {$sum: '$sku.infinityWeightAndPrice'}, ltv: '$clientCompany.ltv',
            clientCollateralValue: {$sum: '$sku.iav.pwv'}, companyName: '$company.name',
            loanAmount: 1, stones: {$sum: '$sku.noOfStones'}, company: '$company',
            borrowingBase: {$cond: {
                if: {$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]},
                then: {$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]},
                else: 0
            }},
                collateralShortfall: {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]}, '$loanAmount']},
           /* collateralShortfall: {$cond: {
                if: {$divide: [
                    {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]}, '$loanAmount']},
                    {$cond: {if: {$ne: [{$divide: ['$clientCompany.ltv', 100]}, 0]}, then: {$divide: ['$clientCompany.ltv', 100]}, else: 1}}
                ]},
                then: {$divide: [
                    {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]}, '$loanAmount']},
                    {$cond: {if: {$ne: [{$divide: ['$clientCompany.ltv', 100]}, 0]}, then: {$divide: ['$clientCompany.ltv', 100]}, else: 1}}
                ]},
                else: 0
            }},*/
        }}
    ]

    summaryTotal = async (companyId?: ICompany['_id']): Promise<Aggregate<ILoanGroupByCompanyId[]>> => {
        let aggregate: any = [{$match: {isDeleted: false}}]
        companyId && aggregate.push({$match: {companyId: mongoose.Types.ObjectId(companyId)}})
        aggregate.push(
            {$group: {_id: '$companyId', loanAmount: {$sum: '$amount'}}},
            {$lookup: {
                from: companyClientSettingModel.collection.name, as: 'clientCompany',
                let: {companyId: '$_id'},
                pipeline: [{$match: {$and: [{$expr: {$eq: ['$companyId', '$$companyId']}}, {isDeleted: false}]}}]
            }}, {$unwind: {path: "$clientCompany", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                from: companyModel.collection.name, as: 'company',
                let: {companyId: '$_id'},
                pipeline: [{$match: {$and: [{$expr: {$eq: ['$_id', '$$companyId']}}, {isDeleted: false}]}}]
            }}, {$unwind: {path: "$company", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                from: skuModel.collection.name, let: {companyId: '$_id', weight: '$weight'}, as: 'sku',
                pipeline: [
                    {$match: {
                        $and: [
                            {$expr: {$eq: ['$companyId', '$$companyId']}},
                            {isDeleted: false, collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN}
                        ]
                    }},
                    {$set: {'noOfStones': 1}},
                    {$lookup: {
                        from: clarityMasterModel.collection.name,
                        let: {clarity: '$clarity'},
                        as: 'clarityCode',
                        pipeline: [{
                            $match: {
                                $expr: {$eq: ['$clarity', '$$clarity']},
                                isDeleted: false
                            }
                        }]
                    }}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: colorMasterModel.collection.name,
                        let: {color: '$colorCategory'},
                        as: 'colorCode',
                        pipeline: [{
                            $match: {
                                $expr: {$eq: ['$color', '$$color']},
                                isDeleted: false
                            }
                        }]
                    }}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},

                    {$lookup: {
                        from: caratMasterModel.collection.name, as: 'weightRangeId',
                        let: {weightRangeId: '$weightRangeId', weight: '$weight'},
                        pipeline: [
                            {$match :{$and: [
                                {$expr: {isDeleted: false}},
                                {$expr: {$lte: ['$fromCarat', '$$weight']}},
                                {$expr: {$gte: ['$toCarat', '$$weight']}}
                            ]}},
                        ]
                    }},
                    {$unwind: {path: "$weightRangeId", preserveNullAndEmptyArrays: true}},
                    {$set: {weightRangeId: '$weightRangeId._id'}},

                    {$lookup: {
                        from: iavModel.collection.name, as: 'iav',
                        let: {iavId: '$iavId'},
                        pipeline: [
                            {$match: {$and: [{$expr: {$eq: ['$_id', '$$iavId']}}, {isDeleted: false}]}},
                            {$lookup: {
                                from: clientPriceModel.collection.name,
                                as: 'clientPrice',
                                let: {clientPriceId: '$clientPriceId'},
                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$clientPriceId']}}}]
                            }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},
                            {$lookup: {
                                from: rapPriceModel.collection.name,
                                as: 'rapPrice',
                                let: {rapPriceId: '$rapPriceId'},
                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$rapPriceId']}}}]
                            }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},
                        ]
                    }}, {$unwind: {path: "$iav", preserveNullAndEmptyArrays: true}},
                    {$set: {clientWeightAndPrice: {$cond: {
                        if: {$multiply: ['$weight', '$iav.clientPrice.price']},
                        then: {$multiply: ['$weight', '$iav.clientPrice.price']},
                        else: 0
                    }}}},
                    {$set: {rapPriceStone: {$cond: {if: '$iav.rapPrice.price', then: '$iav.rapPrice.price', else: 0}}}},

                    {$lookup: {
                        from: infinityPriceNewModel.collection.name, as: 'infinity',
                        let: {clarityId: '$clarityCode._id', colorId: '$colorCode._id', weightId: '$weightRangeId'},
                        pipeline: [
                            {$lookup: {
                                from: infinityPriceMasterModel.collection.name, as: 'infinityPriceMaster',
                                let: {id: '$infinityPriceMasterId'},
                                pipeline: [
                                    {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                ]
                            }},
                            {$unwind: {path: "$infinityPriceMaster", preserveNullAndEmptyArrays: true}},

                            {$match: {
                                $and: [
                                    {$expr: {$eq: ["$infinityPriceMaster.clarityMasterId","$$clarityId"]}},
                                    {$expr: {$eq: ["$infinityPriceMaster.colorMasterId","$$colorId"]}},
                                    {$expr: {$eq: ["$infinityPriceMaster.caratRangeMasterId","$$weightId"]}},
                                    {$expr: {$lte: ["$effectiveDate", new Date()]}}
                                ]
                            }},
                            {$sort: {createdAt: -1}}, {$limit: 1}
                        ],
                    }},
                    {$unwind: {path: "$infinity", preserveNullAndEmptyArrays: true}},
                    {$set: {infinityWeightAndPrice: {$cond: {
                        if: {$eq: ['$colorType', skuColorTypeEnum.WHITE]},
                        then: {$multiply: ['$weight', {$multiply: ['$rapPriceStone', {$subtract: [1, {$divide: ['$infinity.price', 100]}]}]}]},
                        else: {$multiply: ['$weight', '$infinity.price']}
                    }}}},
                    {$set: {infinityWeightAndPrice: {$cond: {if: '$infinityWeightAndPrice', then: '$infinityWeightAndPrice', else: 0}}}}
                ]
            }}, //{$unwind: {path: "$sku", preserveNullAndEmptyArrays: true}},

            {$project: {
                infinityCollateralValue: {$sum: '$sku.infinityWeightAndPrice'}, ltv: '$clientCompany.ltv',
                clientCollateralValue: {$sum: '$sku.iav.pwv'}, companyName: '$company.name',
                loanAmount: 1, stones: {$sum: '$sku.noOfStones'},
                borrowingBase: {$cond: {
                    if: {$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]},
                    then: {$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]},
                    else: 0
                }},
                collateralShortfall: {$cond: {
                    if: {$divide: [
                        {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]}, '$loanAmount']},
                        {$cond: {if: {$ne: [{$divide: ['$clientCompany.ltv', 100]}, 0]}, then: {$divide: ['$clientCompany.ltv', 100]}, else: 1}}
                    ]},
                    then: {$divide: [
                        {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$sku.infinityWeightAndPrice'}]}, '$loanAmount']},
                        {$cond: {if: {$ne: [{$divide: ['$clientCompany.ltv', 100]}, 0]}, then: {$divide: ['$clientCompany.ltv', 100]}, else: 1}}
                    ]},
                    else: 0
                }},
            }},
            {$group: {
                _id: null,
                loanAmount: {$sum: '$loanAmount'},
                infinityCollateralValue: {$sum: '$infinityCollateralValue'},
                clientCollateralValue: {$sum: '$clientCollateralValue'},
                borrowingBase: {$sum: '$borrowingBase'},
                collateralShortfall: {$sum: '$collateralShortfall'},
                ltv: {$sum: '$ltv'},
                stones: {$sum: '$stones'}
            }}
        )
        return loanModel.aggregate(aggregate)
    }

    getByCollateral = async (companyId: ICompany['_id'][]): Promise<any> => {
        let aggregate: any = [{$match: {isDeleted: false}}]
        if(companyId?.length){
            if (companyId && companyId[0] == '[' && companyId[companyId.length - 1] == ']') {
                console.log("If")
                // @ts-ignore
                companyId = companyId.replace(/'/g, '"')
                // @ts-ignore
                companyId = JSON.parse(companyId)
                let companyIds: any[] = []
                companyId.forEach(id => companyIds.push(mongoose.Types.ObjectId(id)))
                aggregate.push({$match: {companyId: {$in: companyIds}}});
            }
            else if(typeof companyId == 'string')
            {
                console.log("Else")
                // @ts-ignore
                companyId = mongoose.Types.ObjectId(companyId)
                aggregate.push({$match: {companyId: {$eq: companyId}}});
                console.log(companyId);
            }
            else if(companyId instanceof Array){
                console.log('object,,,, in else if')
                let companyIds: any[] = []
                companyId.forEach(id => companyIds.push(mongoose.Types.ObjectId(id)))
                aggregate.push({$match: {companyId: {$in: companyIds}}});
            }
        }
        aggregate.push(
            {$group: {_id: '$companyId', loanAmount: {$sum: '$amount'}}},

            {
                $lookup: {
                    from: companyClientSettingModel.collection.name,
                    as: 'clientCompany',
                    let: {companyId: '$_id'},
                    pipeline: [
                        {$match: {$and: [{$expr: {$eq: ['$companyId', '$$companyId']}}, {isDeleted: false}]}},
                        // {$limit: 1}, //Todo remove this line.

                        {
                            $lookup: {
                                from: skuModel.collection.name,
                                let: {companyId: '$companyId', weight: '$weight'},
                                as: 'sku',
                                pipeline: [
                                    {$match: {$and: [{$expr: {$eq: ['$companyId', '$$companyId']}},
                                        {
                                            isDeleted: false,
                                            collateralStatus: skuCollateralStatusEnum.COLLATERAL_IN
                                        }]
                                    }},

                                    {$lookup: {
                                        from: clarityMasterModel.collection.name,
                                        let: {clarity: '$clarity'},
                                        as: 'clarityCode',
                                        pipeline: [{
                                            $match: {
                                                $expr: {$eq: ['$clarity', '$$clarity']},
                                                isDeleted: false
                                            }
                                        }]
                                    }}, {$unwind: {path: "$clarityCode", preserveNullAndEmptyArrays: true}},
                                    {$set: {'clarityCode': '$clarityCode.code'}},

                                    {$lookup: {
                                        from: colorMasterModel.collection.name,
                                        let: {color: '$colorCategory'},
                                        as: 'colorCode',
                                        pipeline: [{
                                            $match: {
                                                $expr: {$eq: ['$color', '$$color']},
                                                isDeleted: false
                                            }
                                        }]
                                    }}, {$unwind: {path: "$colorCode", preserveNullAndEmptyArrays: true}},
                                    {$set: {'colorCode': '$colorCode.code'}},

                                    {$lookup: {
                                        from: iavModel.collection.name,
                                        as: 'iav',
                                        let: {iavId: '$iavId'},
                                        pipeline: [
                                            {$match: {$and: [{$expr: {$eq: ['$_id', '$$iavId']}}, {isDeleted: false}]}},
                                            {$lookup: {
                                                from: clientPriceModel.collection.name,
                                                as: 'clientPrice',
                                                let: {clientPriceId: '$clientPriceId'},
                                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$clientPriceId']}}}]
                                            }}, {$unwind: {path: "$clientPrice", preserveNullAndEmptyArrays: true}},
                                            {$lookup: {
                                                from: rapPriceModel.collection.name,
                                                as: 'rapPrice',
                                                let: {rapPriceId: '$rapPriceId'},
                                                pipeline: [{$match: {$expr: {$eq: ['$_id', '$$rapPriceId']}}}]
                                            }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},
                                        ]
                                    }}, {$unwind: {path: "$iav", preserveNullAndEmptyArrays: true}},
                                    {$set: {clientWeightAndPrice: {$multiply: ['$weight', '$iav.clientPrice.price']}}},
                                    {$set: {rapPriceStone: '$iav.rapPrice.price'}},

                                    {
                                        $lookup: {
                                            from: infinityPriceNewModel.collection.name, as: 'infinity',
                                            let: {clarity: '$clarity', color: '$colorCategory', weight: '$weight'},
                                            pipeline: [
                                                {
                                                    $lookup: {
                                                        from: infinityPriceMasterModel.collection.name,
                                                        as: 'infinityPriceMasterId',
                                                        let: {id: '$infinityPriceMasterId'},
                                                        pipeline: [
                                                            {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},

                                                            {
                                                                $lookup: {
                                                                    from: clarityMasterModel.collection.name,
                                                                    as: 'clarity',
                                                                    let: {id: '$clarityMasterId'},
                                                                    pipeline: [
                                                                        {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                                                        {$project: {clarity: 1}}
                                                                    ]
                                                                }
                                                            }, {
                                                                $unwind: {
                                                                    path: "$clarity",
                                                                    preserveNullAndEmptyArrays: true
                                                                }
                                                            },

                                                            {
                                                                $lookup: {
                                                                    from: colorMasterModel.collection.name,
                                                                    as: 'color',
                                                                    let: {id: '$colorMasterId'},
                                                                    pipeline: [
                                                                        {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                                                        {$project: {color: 1}}
                                                                    ]
                                                                }
                                                            }, {
                                                                $unwind: {
                                                                    path: "$color",
                                                                    preserveNullAndEmptyArrays: true
                                                                }
                                                            },

                                                            {
                                                                $lookup: {
                                                                    from: caratMasterModel.collection.name,
                                                                    as: 'carat',
                                                                    let: {id: '$caratRangeMasterId'},
                                                                    pipeline: [
                                                                        {$match: {$and: [{$expr: {$eq: ['$_id', '$$id']}}, {$expr: {isDeleted: false}}]}},
                                                                        {$project: {fromCarat: 1, toCarat: 1}}
                                                                    ]
                                                                }
                                                            }, {
                                                                $unwind: {
                                                                    path: "$carat",
                                                                    preserveNullAndEmptyArrays: true
                                                                }
                                                            },
                                                        ]
                                                    }
                                                },
                                                {
                                                    $unwind: {
                                                        path: "$infinityPriceMasterId",
                                                        preserveNullAndEmptyArrays: true
                                                    }
                                                },

                                                {
                                                    $match: {
                                                        $and: [
                                                            {$expr: {$eq: ["$infinityPriceMasterId.clarity.clarity", "$$clarity"]}},
                                                            {$expr: {$eq: ["$infinityPriceMasterId.color.color", "$$color"]}},
                                                            {$expr: {$gte: ["$infinityPriceMasterId.carat.toCarat", "$$weight"]}},
                                                            {$expr: {$lte: ["$infinityPriceMasterId.carat.fromCarat", "$$weight"]}},
                                                            {$expr: {$lte: ["$effectiveDate", new Date()]}}
                                                        ]
                                                    }
                                                },
                                                {$sort: {createdAt: -1}}, {$limit: 1}
                                            ],
                                        }
                                    },
                                    {$unwind: {path: "$infinity", preserveNullAndEmptyArrays: true}},
                                    // {$set: {infinityWeightAndPrice: {$multiply: ['$weight', {$multiply: ['$rapPriceStone',{$subtract:[1,{$divide: ['$infinity.price', 100]}]}]}]}}},
                                    {
                                        $set: {
                                            infinityWeightAndPrice: {
                                                $cond: {
                                                    if: {$eq: ['$colorType', skuColorTypeEnum.WHITE]},
                                                    then: {$multiply: ['$weight', {$multiply: ['$rapPriceStone', {$subtract: [1, {$divide: ['$infinity.price', 100]}]}]}]},
                                                    else: {$multiply: ['$weight', '$infinity.price']}
                                                }
                                            }
                                        }
                                    },
                                ]
                            }
                        },
                    ]
                }
            },
            {$unwind: {path: "$clientCompany", preserveNullAndEmptyArrays: true}},
            {$project: {
                infinityCollateralValue: {$sum: '$clientCompany.sku.infinityWeightAndPrice'}, loanAmount: 1,
                clientCollateralValue: {$sum: '$clientCompany.sku.iav.pwv'}, ltv: '$clientCompany.ltv',
                borrowingBase: {$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$clientCompany.sku.infinityWeightAndPrice'}]},
                // collateralShortfall: {$divide: [{$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$clientCompany.sku.infinityWeightAndPrice'}]}, '$loanAmount']}, {$divide: ['$clientCompany.ltv', 100]}]}
                /*collateralShortfall: {$divide: [
                    {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$clientCompany.sku.infinityWeightAndPrice'}]}, '$loanAmount']},
                    {$cond: {if: {$ne: [{$divide: ['$clientCompany.ltv', 100]}, 0]}, then: {$divide: ['$clientCompany.ltv', 100]}, else: 1}}
                ]},*/
                collateralShortfall: {$subtract: [{$multiply: [{$divide: ['$clientCompany.ltv', 100]}, {$sum: '$clientCompany.sku.infinityWeightAndPrice'}]}, '$loanAmount']},
            }},
            {$group: {_id: null, infinityCollateralValue: {$sum: '$infinityCollateralValue'}, clientCollateralValue: {$sum: '$clientCollateralValue'},
            borrowingBase: {$sum: '$borrowingBase'}, collateralShortfall: {$sum: '$collateralShortfall'}, ltv: {$sum: '$ltv'}, loanAmount: {$sum: '$loanAmount'}}}
        )
        return loanModel.aggregate(aggregate)
    }

    async filter(userId: IUser['_id']): Promise<any> {
        let cond: any = {}
        let user = await userModel.findOne({_id: userId}).populate([{path: 'roleId'}])

        //@ts-expect-error
        if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let aggregate: any = [{
            $group: {
                _id: null,
                "company": {"$addToSet": "$company"},
                "ltv": {"$addToSet": "$ltv"},
                "loanAmount": {"$addToSet": "$loanAmount"}
            }
        }, {
            $project: {
                _id: 0, "company._id": 1, "company.name": 1, "ltv": 1, "loanAmount": 1
            }
        }]

        aggregate = [...this.summaryAggregate, ...aggregate]
        aggregate.splice(0, 0, {$match: {"isDeleted": false, ...cond}});
        return loanModel.aggregate(aggregate).then(data => data[0])
    }

    async getCollateral(companyId: ICompany['_id'][]): Promise<any> {
        // let cond: any = {}
        // let user = await userModel.findOne({_id: userId}).populate([{path: 'roleId'}])

        // //@ts-expect-error
        // if (user.roleId?.shortDescription != Texts.SPACECODEADMIN) cond["companyId"] = mongoose.Types.ObjectId(user.companyId as string);

        let aggregate: any[] = [{$match: {isDeleted: false}}]
        if(companyId?.length && companyId[0]=='[' && companyId[companyId.length-1]==']') {
            companyId = JSON.parse(companyId as unknown as string)
            aggregate.push({$match: {companyId: {$in: companyId.map(id => mongoose.Types.ObjectId(id))}}})
        }
        aggregate.push({$group: {
            _id: null,
            clientCollateral: {$sum: '$clientCollateral'},
            infinityCollateral: {$sum: '$infinityCollateral'},
            collateralShortfall: {$sum: '$collateralShortfall'}
        }}, {$project: {_id: 0}})

        return loanModel.aggregate(aggregate).then(data => data[0])
    }
}
