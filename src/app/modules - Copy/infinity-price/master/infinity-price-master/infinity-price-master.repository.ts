import {BaseRepository} from "../../../BaseRepository";
import infinityPriceMasterModel from "./infinty-price-master.model";
import {IInfinityPriceMaster} from "./infinity-price-master.types";
import {IIndexProjection} from "../../../../interfaces/IRepository";
import mongoose from "mongoose";
import stoneTypeMasterModel from "../../../stone-type-master/stone-type-master.model";
import caratMasterModel from "../carat-master/carat-master.model";
import clarityRangeModel from "../clarity-range/clarity-range.model";
import clarityMasterModel from "../clarity-master/clarity-master.model";
import fluorscenseMasterModel from "../fluorescense-master/fluorescense-master.model";
import colorRangeModel from "../color-range/color-range.model";
import colorMasterModel from "../color-master/color-master.model";
import rapPriceModel from "../../../rap-price/rap-price.model";
import rapNetPriceModel from "../../../rap-net-price/rap-net-price.model";
import userModel from "../../../user/user.model";
import {Constant} from "../../../../constants";

export class InfinityPriceMasterRepository extends BaseRepository<IInfinityPriceMaster> {
    constructor() {
        super(infinityPriceMasterModel);
    }

    index = async ({filters, search, sort: sorter, pageNumber, pageSize, column}: any): Promise<object[]> => {
        let cond: any = {'isDeleted': false}, sort = {},
            projection: IIndexProjection = {'createdBy.password': 0, 'updatedBy.password': 0}
        let secondCond: any = {}    //Todo add isDeleted condition here in every table

        if (sorter?.length && sorter[0] === '{' && sorter[sorter.length - 1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            sort = {[`${sorter.key}`]: `${sorter.value}`}
        } else sort = {createdAt: -1, updatedAt: -1};

        if (search) {
            search = JSON.parse(search)
            const _S: { $regex: string, $options: "i" } = {$regex: search, $options: "i"}
            secondCond['$or'] = [{'skuId.rfId.rfid': _S}, {'skuId.clientRefId': _S}, {'labsId.labReportId': _S}]
        }

        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = await JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if (k === 'labsId.labReportId') secondCond[k] = v
                else if (k === 'weight') cond[k] = {"$gte": v[0], "$lte": v[1]}
                else if (k === 'iavId.drv' || k === 'iavId.iav' || k === 'iavId.pwv') secondCond[k] = {
                    "$gte": v[0],
                    "$lte": v[1]
                }
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

        let aggregate = [
            {$lookup: {
                  from: caratMasterModel.collection.name, as: 'caratRangeMasterId',
                  let: {id: '$caratRangeMasterId'},
                  pipeline: [
                      {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                      {$match: {isDeleted: false}}, {$limit: 1}
                  ]
            }}, {$unwind: {path: "$caratRangeMasterId", preserveNullAndEmptyArrays: true}},

          {$lookup: {
              from: clarityMasterModel.collection.name, as: 'clarityMasterId',
              let: {id: '$clarityMasterId'},
              pipeline: [
                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                {$match: {isDeleted: false}}, {$limit: 1}
              ]
            }}, {$unwind: {path: "$clarityMasterId", preserveNullAndEmptyArrays: true}},

          {$lookup: {
              from: colorMasterModel.collection.name, as: 'colorMasterId',
              let: {id: '$colorMasterId'},
              pipeline: [
                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                {$match: {isDeleted: false}}, {$limit: 1}
              ]
            }}, {$unwind: {path: "$colorMasterId", preserveNullAndEmptyArrays: true}},

          {$lookup: {
              from: userModel.collection.name, as: 'createdBy',
              let: {id: '$createdBy'},
              pipeline: [
                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                {$match: {isDeleted: false}}, {$limit: 1}
              ]
            }}, {$unwind: {path: "$createdBy", preserveNullAndEmptyArrays: true}},

          {$lookup: {
              from: userModel.collection.name, as: 'updatedBy',
              let: {id: '$updatedBy'},
              pipeline: [
                {$match: {$expr: {$eq: ['$_id', '$$id']}}},
                {$match: {isDeleted: false}}, {$limit: 1}
              ]
            }}, {$unwind: {path: "$updatedBy", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                    from: rapPriceModel.collection.name,
                    let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                        fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                    },
                    as: 'rapPrice',
                    pipeline: [
                        {$match: {$and: [
                            {$expr: {isDeleted: false}},
                            {$expr: {$eq: ['$clarity', '$$clarity']}},
                            {$expr: {$eq: ['$color', '$$color']}},
                            {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                            {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                        ]}},
                        {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        {$project: {_id: 0}}
                    ]
                }}, {$unwind: {path: "$rapPrice", preserveNullAndEmptyArrays: true}},

            {$lookup: {
                    from: rapNetPriceModel.collection.name, as: 'rapNetPrice',
                let: {clarity: '$clarityMasterId.clarity', color: '$colorMasterId.color',
                  fromWeight: '$caratRangeMasterId.fromCarat', toWeight: '$caratRangeMasterId.toCarat',
                },
                    pipeline: [
                      {$match: {$and: [
                            {$expr: {isDeleted: false}},
                            {$expr: {$eq: ['$clarity', '$$clarity']}},
                            {$expr: {$eq: ['$color', '$$color']}},
                            {$expr: {$eq: ['$weightRange.fromWeight', '$$fromWeight']}},
                            {$expr: {$eq: ['$weightRange.toWeight', '$$toWeight']}}
                          ]}},
                        {$group: {_id: null, min: {$min: '$price'}, max: {$max: '$price'}, avg: {$avg: '$price'}}},
                        {$project: {_id: 0}}
                    ]
                }}, {$unwind: {path: "$rapNetPrice", preserveNullAndEmptyArrays: true}},
            {$set: {
                'rapPrice.min': {$cond: {if: '$rapPrice.min', then: '$rapPrice.min', else: 0}},
                'rapPrice.max': {$cond: {if: '$rapPrice.max', then: '$rapPrice.max', else: 0}},
                'rapPrice.avg': {$cond: {if: '$rapPrice.avg', then: '$rapPrice.avg', else: 0}},
                'rapNetPrice.min': {$cond: {if: '$rapNetPrice.min', then: '$rapNetPrice.min', else: 0}},
                'rapNetPrice.max': {$cond: {if: '$rapNetPrice.max', then: '$rapNetPrice.max', else: 0}},
                'rapNetPrice.avg': {$cond: {if: '$rapNetPrice.avg', then: '$rapNetPrice.avg', else: 0}}
            }},
            {$unset: ["userId.password", "createdBy.password", "updatedBy.password"]},
        ]
      const sCond = [{$match: secondCond}, {$project: projection}];
      return await this.aggregateFaceTIndexBR(cond, aggregate, sCond, sort, pageNumber, pageSize)
    }

    async aggregateFaceTIndexBR(cond: {}, agree: any[], sCond: any[], sort: {}, pagenumber: number, pagesize: number): Promise<any> {
        let hasNextPage = false, totalPage = 0, endIndex = 0, pageSize
        let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
        if(!!pagesize && !!Number(pagesize)) pageSize = Number(pagesize)
        else if(!!pagesize && Number(pagesize) === 0) pageSize = Number(pagesize)
        else pageSize = Constant.DEFAULT_PAGE_SIZE
        let startIndex = (pageNumber - 1) * pageSize;
        let aggData = [{$match: cond}, {$skip: startIndex}, ...agree, ...sCond, {$limit: pageSize}]
        const data = await infinityPriceMasterModel.aggregate([  //Todo add proper aggregate<T> type...
            {$facet: {
                data: aggData,
                filterCount: [{$match: cond}, ...sCond, {$count: 'filterCount'}],
                totalCount: [{$match: {isDeleted: false}}, {$count: 'totalCount'}]
            }}
        ])
        let totalCount: number = await data[0]?.totalCount[0]?.totalCount || 0;
        let filterCount: number = await data[0]?.filterCount[0]?.filterCount || 0;
        totalPage = await (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize)
        //@ts-expect-error
        if(Number(filterCount) && filterCount && totalPage=='Infinity') totalPage = 1
        else if(!filterCount && !Number(totalPage)) totalPage = 0
        endIndex = pageNumber * pageSize;
        if (endIndex < filterCount) hasNextPage = true;
        if([0, 1].includes(totalPage)) hasNextPage = false
        return {page: {hasNextPage, totalCount, currentPage: pageNumber, filterCount, totalPage}, data: data[0]?.data || null}
    }
}