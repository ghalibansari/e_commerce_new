import {Application, Request, Response, Router} from 'express'
import {Messages, Constant} from "../constants"
import {JsonResponse} from "../helper/JsonResponse"
import {BaseValidation} from "./BaseValidation";
import AclBusiness from "./acl/acl.business";
import moment from 'moment';
import lo from "lodash"
import {IDisplayConfiguration} from "./display-configuration/diaplay-configuration.types";
import {IUser} from "./user/user.types";
import SkuBusiness from "./sku/sku.business";
import {ICounter} from "./baseTypes";
import {I_S, ICond, IIndexBC, IIndexFilters, IIndexProjection, ISort} from "../interfaces/IRepository";
import mongoose from "mongoose";

export abstract class BaseController<T> {

    protected router: Router
    protected business: any
    protected repo: any
    protected url: string
    protected isDeleted: boolean
    protected searchTerm: string[]     //Todo any

    abstract register(express: Application): void
    abstract init(): void

    // protected queryParam: string
    // protected createdBy: any
    // protected updateBy: any;
    // protected softDelete: any;

    // protected constructor(model: any = '',
    //                       url: string = '',
    //                       query_param: string = '',){
    //                       //create_detail: string[] = ['created_by', 'updated_by'],
    //                       //soft_delete: any = false) {
    //     this.modelRepo = model;
    //     this.url = url;
    //     this.queryParam = query_param;
    //    // this.createdBy = create_detail[0];
    //    // this.updateBy = create_detail[1];
    //    // this.softDelete = soft_delete;
    //
    //     this.router = Router();
    // }

    protected constructor(business: any, url: string, isDeleted: boolean = false, repo?: any, searchTerm?: any[]) {
        this.searchTerm = searchTerm || []
        this.business = business
        this.repo = repo || this.business.repo
        this.url = url
        this.isDeleted = isDeleted
        this.router = Router();
    }

    findBC = async (req: Request, res: Response, populate: object[] = []): Promise<void> => {
        await new BaseValidation().findBC(req, res)
        // @ts-expect-error
        let {query:{sliders, column, filters, filtersIn,rangeFilters,sort:sorter,search:searchData, pageSize:pagesize, pageNumber: pagenumber, count:counter}} : {query:{column: string, filters: string,filtersIn:string,rangeFilters:string, sort: string,search:string, pageSize: number, pageNumber: number, count: string}} = req

        if(!sliders) sliders = {}
        //access rights here.
        let access = {}
        let {body:{loggedInUser:{_id, companyId}}} = req
        let accessData = await new AclBusiness().findOneBB({userId: _id, companyId, module: this.url, isDeleted: false})
        if(accessData){
            //@ts-expect-error
            delete accessData._id
            //@ts-expect-error
            delete accessData.companyId
            //@ts-expect-error
            delete accessData.userId
            //@ts-expect-error
            delete accessData.module
            //@ts-expect-error
            delete accessData.url
            //@ts-expect-error
            delete accessData.isDelete
            //@ts-expect-error
            delete accessData.updatedBy
            //@ts-expect-error
            delete accessData.updatedAt
            //@ts-expect-error
            delete accessData.createdBy
            //@ts-expect-error
            delete accessData.createdAt
            delete accessData.__v
            access = accessData
        }

        //Pagination here.
        let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
        let pageSize: number;
        let filterCount = 0, startIndex = 0, endIndex = 0
        let hasNextPage: boolean = false, totalPage: number;
        let sort = {}, count: any = {}, cond = {}, columnFields = {}
        let search={};
        let totalCount: number;

        if(pagesize !== undefined && Number(pagesize) !== NaN) pageSize = Number(pagesize)
        else pageSize = Constant.DEFAULT_PAGE_SIZE

        if(this.isDeleted) totalCount = await this.business.findCountBB({isDeleted: false})
        else totalCount = await this.business.findCountBB()

        console.log("Populate ="+populate);

        if(column?.length && column[0] === '[' && column[column.length-1] === ']'){
            column = column.replace(/'/g, '"');
            column =  await JSON.parse(column)
            let temppopulate: any = []
            //@ts-expect-error
            column.forEach(col => {
                //@ts-expect-error
                columnFields[col] = 1

                populate.forEach(pop =>
                {
                    //@ts-expect-error
                    if(pop.path == col) temppopulate.push(pop)
                });
            })

            populate = temppopulate
        }

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            //@ts-expect-error
            console.log(sorter.key+" "+sorter.value);
            //@ts-expect-error
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }
        else sort = { updatedAt: 'desc', createdAt: 'desc'}

        if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']')
        {
            counter = counter.replace(/'/g, '"');
            counter =  await JSON.parse(counter)
            //@ts-expect-error
            let countMap = counter.map(async counter => {
                let counterData: Promise<number>
                if(this.isDeleted){
                    counterData = await this.business.findCountBB({ [`${counter.key}`] : `${counter.value}`, isDeleted: false })
                        .then((value: Number) => {
                            if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                            count[`${counter.key}`][`${counter.value}`] = value
                        })
                }
                else {
                    counterData = await this.business.findCountBB({ [`${counter.key}`] : `${counter.value}`} )
                        .then((value: Number) => {
                            if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                            count[`${counter.key}`][`${counter.value}`] = value
                        })
                }
                // if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                // count[`${counter.key}`][`${counter.counterData}`] = await counterData
            })
            await Promise.all(countMap)
        }


        if(filtersIn?.length && filtersIn[0] === '[' && filtersIn[filtersIn.length-1] === ']') {

            filtersIn = filtersIn.replace(/'/g, '"');
            filtersIn = await JSON.parse(filtersIn)
            console.log(filtersIn);
            //@ts-expect-error
            filtersIn.forEach(filterIn => {

                if(filterIn.key==='fromDate'|| filterIn.key==='toDate')
                {
                    // @ts-ignore
                    var frmdate = filtersIn.find( function(item) { return item.key == 'fromDate' });
                    // @ts-ignore
                    var todate = filtersIn.find( function(item) { return item.key == 'toDate' });
                    var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
                    console.log(endOfDay+"")
                    // @ts-ignore
                    cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
                }
                else
                {
                    // @ts-ignore
                    cond[filterIn.key] = {$in: filterIn.value.split(",")};
                }

            });
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            startIndex = (pageNumber - 1) * pageSize;
            endIndex = pageNumber * pageSize;
            if (endIndex < filterCount) hasNextPage = true

        }
        else if(filters?.length && filters[0] === '[' && filters[filters.length-1] === ']') {
            filters = filters.replace(/'/g, '"');
            filters = await JSON.parse(filters)
            console.log(filters);
            //@ts-expect-error
            filters.forEach(filter => {

                if(filter.key==='fromDate'|| filter.key==='toDate')
                {
                    // @ts-ignore
                    var frmdate = filters.find( function(item) { return item.key == 'fromDate' });
                    // @ts-ignore
                    var todate = filters.find( function(item) { return item.key == 'toDate' });
                    var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
                    console.log(endOfDay+"")
                    // @ts-ignore
                    cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
                }
                else
                {
                    // @ts-ignore
                    cond[filter.key] = filter.value;
                }

            });
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            startIndex = (pageNumber - 1) * pageSize;
            endIndex = pageNumber * pageSize;
            if (endIndex < filterCount) hasNextPage = true
        }
        else{
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = totalCount
            totalPage = (totalCount % pageSize === 0) ? totalCount / pageSize : Math.ceil(totalCount / pageSize);
            startIndex = (pageNumber - 1) * pageSize;
            endIndex = pageNumber * pageSize;
            if (endIndex < totalCount) hasNextPage = true
        }

       if(rangeFilters?.length && rangeFilters[0] === '[' && rangeFilters[rangeFilters.length-1] === ']') {
           rangeFilters = rangeFilters.replace(/'/g, '"');
           rangeFilters = await JSON.parse(rangeFilters)
            console.log(rangeFilters);
            //@ts-expect-error
           rangeFilters.forEach(filter => {

               if(filter.value.length>0)
               {
                   //@ts-expect-error
                   cond[filter.key] = {"$gte": filter.value[0],"$lte": filter.value[1]};

                   console.log(filter.key+" "+filter.value[0]+" "+filter.value[1]);
               }

            });
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            startIndex = (pageNumber - 1) * pageSize;
            endIndex = pageNumber * pageSize;
            if (endIndex < filterCount) hasNextPage = true
        }

        if(searchData?.length && searchData[0] === '{' && searchData[searchData.length-1] === '}') {
            searchData = searchData.replace(/'/g, '"');
            searchData = await JSON.parse(searchData)
            //@ts-expect-error
            cond[`${searchData.key}`] = {$regex: searchData.value, $options: "i"};//${searchData.value
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            startIndex = (pageNumber - 1) * pageSize;
            endIndex = pageNumber * pageSize;
            if (endIndex < filterCount) hasNextPage = true
        }

        if(sliders && Object.keys(sliders).length > 0) {
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            startIndex = (pageNumber - 1) * pageSize;
            endIndex = pageNumber * pageSize;
            if (endIndex < filterCount) hasNextPage = true
        }

        // console.log(cond);
        res.locals.page = { hasNextPage, totalCount, filterCount, currentPage: pageNumber, totalPage, count, access}
        console.log("Populate ="+populate.toString());
        console.log("Populate ="+columnFields.toString());
        res.locals.data = await this.business.findBB(cond, columnFields, sort, pageSize, startIndex, populate, sliders)
        res.locals.message = Messages.FETCH_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findB`);
    }

    exportBC = async (req: Request, res: Response, populate: object[] = []): Promise<any> => {
        await new BaseValidation().findBC(req, res)
        // @ts-expect-error
        let {query:{sliders, column, filters, filtersIn,rangeFilters,sort:sorter,search:searchData, count:counter}} : {query:{column: string, filters: string,filtersIn:string,rangeFilters:string, sort: string,search:string, pageSize: number, pageNumber: number, count: string}} = req

        if(!sliders) sliders = {}
        //access rights here.
        let access = {}
        let {body:{loggedInUser:{_id, companyId}}} = req
        let accessData = await new AclBusiness().findOneBB({userId: _id, companyId, module: this.url, isDeleted: false})
        if(accessData){
            //@ts-expect-error
            delete accessData._id
            //@ts-expect-error
            delete accessData.companyId
            //@ts-expect-error
            delete accessData.userId
            //@ts-expect-error
            delete accessData.module
            //@ts-expect-error
            delete accessData.url
            //@ts-expect-error
            delete accessData.isDelete
            //@ts-expect-error
            delete accessData.updatedBy
            //@ts-expect-error
            delete accessData.updatedAt
            //@ts-expect-error
            delete accessData.createdBy
            //@ts-expect-error
            delete accessData.createdAt
            delete accessData.__v
            access = accessData
        }



        let filterCount = 0, startIndex = 0, endIndex = 0
        let hasNextPage: boolean = false, totalPage: number;
        let sort = {}, count: any = {}, cond = {}, columnFields = {}
        let search={};
        let totalCount: number;


        if(this.isDeleted) totalCount = await this.business.findCountBB({isDeleted: false})
        else totalCount = await this.business.findCountBB()

        console.log("Populate ="+populate);

        if(column?.length && column[0] === '[' && column[column.length-1] === ']'){
            column = column.replace(/'/g, '"');
            column =  await JSON.parse(column)
            let temppopulate: any = []
            //@ts-expect-error
            column.forEach(col => {
                //@ts-expect-error
                columnFields[col] = 1

                populate.forEach(pop =>
                {
                    //@ts-expect-error
                    if(pop.path == col) temppopulate.push(pop)
                });
            })

            populate = temppopulate
        }

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            //@ts-expect-error
            console.log(sorter.key+" "+sorter.value);
            //@ts-expect-error
            sort = { [`${sorter.key}`] : `${sorter.value}`}
        }
        else sort = { updatedAt: 'desc', createdAt: 'desc'}

        if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']')
        {
            counter = counter.replace(/'/g, '"');
            counter =  await JSON.parse(counter)
            //@ts-expect-error
            let countMap = counter.map(async counter => {
                let counterData: Promise<number>
                if(this.isDeleted){
                    counterData = await this.business.findCountBB({ [`${counter.key}`] : `${counter.value}`, isDeleted: false })
                        .then((value: Number) => {
                            if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                            count[`${counter.key}`][`${counter.value}`] = value
                        })
                }
                else {
                    counterData = await this.business.findCountBB({ [`${counter.key}`] : `${counter.value}`} )
                        .then((value: Number) => {
                            if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                            count[`${counter.key}`][`${counter.value}`] = value
                        })
                }
                // if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
                // count[`${counter.key}`][`${counter.counterData}`] = await counterData
            })
            await Promise.all(countMap)
        }


        if(filtersIn?.length && filtersIn[0] === '[' && filtersIn[filtersIn.length-1] === ']') {

            filtersIn = filtersIn.replace(/'/g, '"');
            filtersIn = await JSON.parse(filtersIn)
            console.log(filtersIn);
            //@ts-expect-error
            filtersIn.forEach(filterIn => {

                if(filterIn.key==='fromDate'|| filterIn.key==='toDate')
                {
                    // @ts-ignore
                    var frmdate = filtersIn.find( function(item) { return item.key == 'fromDate' });
                    // @ts-ignore
                    var todate = filtersIn.find( function(item) { return item.key == 'toDate' });
                    var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
                    console.log(endOfDay+"")
                    // @ts-ignore
                    cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
                }
                else
                {
                    // @ts-ignore
                    cond[filterIn.key] = {$in: filterIn.value.split(",")};
                }

            });
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            if (endIndex < filterCount) hasNextPage = true

        }
        else if(filters?.length && filters[0] === '[' && filters[filters.length-1] === ']') {
            filters = filters.replace(/'/g, '"');
            filters = await JSON.parse(filters)
            console.log(filters);
            //@ts-expect-error
            filters.forEach(filter => {

                if(filter.key==='fromDate'|| filter.key==='toDate')
                {
                    // @ts-ignore
                    var frmdate = filters.find( function(item) { return item.key == 'fromDate' });
                    // @ts-ignore
                    var todate = filters.find( function(item) { return item.key == 'toDate' });
                    var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
                    console.log(endOfDay+"")
                    // @ts-ignore
                    cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
                }
                else
                {
        //             var date = new Date();  //for current-month
        // var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
        // var lastDay = new Date(date.getFullYear(), date.getMonth()+1, 1);
        // console.log("FromDate->"+firstDay," - - - - - - - - -   [CURRENT M O N T H] - - - -- - - - - - -  ToDate->",lastDay);
        // // @ts-expect-error
        // cond['createdAt'] = {"$gte": firstDay,"$lte": lastDay};

                    // @ts-ignore
                    cond[filter.key] = filter.value;
                }

            });
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            if (endIndex < filterCount) hasNextPage = true
        }
        else{
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = totalCount
            if (endIndex < totalCount) hasNextPage = true
        }

        if(rangeFilters?.length && rangeFilters[0] === '[' && rangeFilters[rangeFilters.length-1] === ']') {
            rangeFilters = rangeFilters.replace(/'/g, '"');
            rangeFilters = await JSON.parse(rangeFilters)
            console.log(rangeFilters);
            //@ts-expect-error
            rangeFilters.forEach(filter => {

                if(filter.value.length>0)
                {
                    //@ts-expect-error
                    cond[filter.key] = {"$gte": filter.value[0],"$lte": filter.value[1]};

                    console.log(filter.key+" "+filter.value[0]+" "+filter.value[1]);
                }

            });
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            if (endIndex < filterCount) hasNextPage = true
        }

        if(searchData?.length && searchData[0] === '{' && searchData[searchData.length-1] === '}') {
            searchData = searchData.replace(/'/g, '"');
            searchData = await JSON.parse(searchData)
            //@ts-expect-error
            cond[`${searchData.key}`] = {$regex: searchData.value, $options: "i"};//${searchData.value
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            if (endIndex < filterCount) hasNextPage = true
        }

        if(sliders && Object.keys(sliders).length > 0) {
            //@ts-expect-error
            if(this.isDeleted) cond.isDeleted = false
            filterCount = await this.business.findCountBB(cond, sliders)
            if (endIndex < filterCount) hasNextPage = true
        }

        console.log('Condition = '+cond);
        res.locals.page = { hasNextPage, totalCount, filterCount, count, access}

        return  await this.business.findBB(cond, columnFields, sort, filterCount, startIndex, populate, sliders)
    }

    createBC = async (req: Request, res: Response): Promise<void> => {
        let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
        body.createdBy = body.updatedBy = loggedInUserId
        let data = await this.business.createBB(body);
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
    }

    createMultipleBC = async (req: Request, res: Response): Promise<void> => {
        let {body, body:{newData, loggedInUser:{_id:loggedInUserId}}} = req
        let dataToBeInserted: T[] = []
        //@ts-expect-error
        newData.forEach((data: T) => {data.createdBy = data.updatedBy = loggedInUserId; dataToBeInserted.push(data)} )
        const data = await this.business.createBB(dataToBeInserted)
        res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
    }

    updateBC = async (req: Request, res: Response): Promise<void> => {
        let {body, body:{_id}, body:{loggedInUser:{_id:loggedInUserId}}} = req
        body.updatedBy = loggedInUserId
        const isDeleted = await this.business.findOneBB({_id, isDeleted: false})
        if(isDeleted){
            const data = await this.business.findAndUpdateBB({_id}, body)
            if(data) { res.locals.status = true;res.locals.data = 1; res.locals.message = Messages.UPDATE_SUCCESSFUL}
            else { res.locals.status = false;res.locals.data = 0; res.locals.message = Messages.UPDATE_FAILED}
        }
        else {res.locals.status = false; res.locals.data = 0; res.locals.message = Messages.UPDATE_FAILED}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.updateBC`);
    }

    deleteBC = async (req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, data: 0, message: Messages.DELETE_FAILED}
        //@ts-expect-error
        const {query:{_id}, body:{loggedInUser:{_id:updatedBy}}} : {query:{_id:string}} = req
        let isDeleted: any
        if(this.isDeleted){
            isDeleted = await this.business.findOneBB({_id, isDeleted: false})
            if(isDeleted) {
                const data = await this.business.findAndUpdateBB({_id}, {isDeleted: true, updatedBy})
                if(data) res.locals = { status: true, data: 1, message: Messages.DELETE_SUCCESSFUL}
            }
        }
        /*else {
            isDeleted = await this.business.findByIdAndDeleteBB(_id)
            if(isDeleted) res.locals = { status: true, data: 1, message: Messages.DELETE_SUCCESSFUL}
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteBC`);
        }*/
        await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteBC`);
    }

    findByIdBC = async (req: Request, res: Response, populate: object[] = []): Promise<void> => {
        res.locals = { status: false, data: 0, message: Messages.FETCH_FAILED}
        const {query:{_id}} = req
        let data: Promise<T>
        data = await this.business.findOneBB({_id, isDeleted: false},{},populate)
        if(await data) res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    }

    // upsertBC = async (req: Request, res: Response, populate: object[] = []): Promise<void> => {
    //     res.locals = { status: false, data: 0, message: Messages.FETCH_FAILED}
    //     const {query:{_id}} = req
    //     let data: Promise<T>
    //     data = await this.business.findOneBB({_id, isDeleted: false},{},populate)
    //     if(data) res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    // }

    groupByBC= async(req: Request, res: Response): Promise<void> =>  {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        // await new BaseValidation().groupByBC(req, res)   //Todo add validation
        //@ts-expect-error
        let {query: {key, companyId}}: {query: {key: string, companyId: string}} = req
        key = key.replace(/'/g, '"')
        // @ts-expect-error
        key = await JSON.parse(key) as String[]
        const data = await this.repo.groupBy(key);
        res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.groupByBC`);
    }

    paginationOfAnArray = async (req: Request, res: Response, dataList: any): Promise<void> => {
        //@ts-expect-error
        let {query: {_id, column, filters, sort: sorter, pageSize: pagesize, pageNumber: pagenumber, search: searchData, count: counter}}: {query: {filters: string, sort: string, pageSize: number, pageNumber: number}} = req
        let cond:any = {}, count: any = {}
        let filterCount = 0, startIndex = 0, endIndex = 0
        let hasNextPage: boolean = false, totalPage: number;
        let totalCount: number;
        let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
        let pageSize = (pagesize !== undefined && Number(pagesize) !== NaN) ? Number(pagesize) : Constant.DEFAULT_PAGE_SIZE
        totalCount = dataList.length
        startIndex = (pageNumber - 1) * pageSize;
        endIndex = pageNumber * pageSize;

        if (filters?.length && filters[0] === '[' && filters[filters.length - 1] === ']') {
            filters = filters.replace(/'/g, '"');
            filters = await JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(filter => {
                let item: any
                if(filter.key.includes(".") ) {
                    item = filter.key.split(".")
                    cond[item[0]] = {}
                    cond[item[0]][item[1]] = filter.value
                }
                else if(filter.key === "companyId") cond["companyId"] = {"_id": mongoose.Types.ObjectId(filter.value as string)} 
                else cond[filter.key] = filter.value
            })
            dataList = dataList.filter((itm: any) => { if (lo.isMatch(itm, cond)) return itm })
            filterCount = dataList.length
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            if (endIndex < filterCount) hasNextPage = true
        }
        // else if (searchData?.length && searchData[0] === '{' && searchData[searchData.length - 1] === '}') {
        else if(searchData) {
            searchData = await JSON.parse(searchData)
            let filterArray = []
            for (var i = 0; i < dataList.length; i++) {
                var patt = new RegExp(searchData, "i");
                // if(searchData.key === "companyId" && dataList[i]["companyId"]){if (patt.test(dataList[i]["companyId"]["name"])) filterArray.push(dataList[i])}
                // else if(searchData.key === "lastOpenedBy" && dataList[i]["lastOpenedBy"]){if (patt.test(dataList[i]["lastOpenedBy"]["firstName"])) filterArray.push(dataList[i])}
                // else if(searchData.key === "lastClosedBy" && dataList[i]["lastClosedBy"]){if (patt.test(dataList[i]["lastClosedBy"]["firstName"])) filterArray.push(dataList[i])}
                // else{if (patt.test(dataList[i][searchData.key])) filterArray.push(dataList[i])}
                if (patt.test(dataList[i]["companyId"]["name"]) || patt.test(dataList[i]["lastOpenedBy"]["firstName"]) || patt.test(dataList[i]["lastOpenedBy"]["firstName"]) || patt.test(dataList[i]["action"])) filterArray.push(dataList[i])
            }
            dataList = filterArray
            filterCount = dataList.length
            totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
            if (endIndex < filterCount) hasNextPage = true
        }
        else {
            totalPage = (totalCount % pageSize === 0) ? totalCount / pageSize : Math.ceil(totalCount / pageSize);
            if (endIndex < totalCount) hasNextPage = true
        }
        dataList = dataList.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
        if (column?.length && column[0] === '[' && column[column.length - 1] === ']') {
            column = column.replace(/'/g, '"');
            column = await JSON.parse(column)
            dataList = dataList.map((dataObj: any) => {
                let data: any = {}
                for (let item of column) {
                    if(item.includes(".") ) {
                        item = item.split(".");
                        data[item[0]] = {};
                        data[item[0]][item[1]] = dataObj[item[0]][item[1]]
                    }
                    else data[item] = dataObj[item]
                }
                return data
            });
        }
        if (counter?.length && counter[0] === '[' && counter[counter.length - 1] === ']') {
            counter = counter.replace(/'/g, '"');
            counter = await JSON.parse(counter)
            for (let item of counter) count[item.key] = {}
            for (let item of counter) count[item.key][item.value] = dataList.filter((obj: any) => obj[item.key] === item.value).length;
        }
        if (sorter) {
            sorter = sorter.replace(/'/g, '"');
            sorter = await JSON.parse(sorter)
            dataList = await this.sortByKey(dataList, sorter)
        }
        if(filterCount === 0) filterCount = dataList.length
        res.locals.page = { hasNextPage, totalCount, filterCount, currentPage: pageNumber, totalPage, count }
        res.locals.data = dataList
        res.locals.message = Messages.FETCH_SUCCESSFUL;
        await JsonResponse.jsonSuccess(req, res, `{this.url}.detail`);
    }

    async sortByKey(array: Array<object>, sort: string): Promise<any | never> {
        return array.sort(function (a, b) {
            // @ts-expect-error
            let x = a[sort.key], y = b[sort.key];
            // @ts-expect-error
            if (sort.value === "asc") return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            else return ((x < y) ? 1 : ((x > y) ? -1 : 0))
        });
    }

    getListBC = async (req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, message: Messages.FETCH_FAILED}
        const {data, page} = await this.repo.getListBR(req.query)
        res.locals = {status: true, data, page, message: Messages.FETCH_SUCCESSFUL}
        await JsonResponse.jsonSuccess(req, res, `{this.url}.getListBC`)
    }

    counterBC = async (req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, message: Messages.FETCH_FAILED}
        const {query:{count}} = req
        let counter: string|ICounter[] = count as string
        if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']') {
            counter = counter.replace(/'/g, '"');
            counter = await JSON.parse(counter) as ICounter[]
            const data = await this.repo.counterBR(counter)
            res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
        }
        await JsonResponse.jsonSuccess(req, res, `{this.url}.counterBC`)
    }

    indexBC = async (req: Request, res: Response): Promise<void> => {
        res.locals = {status: false, message: Messages.FETCH_FAILED};
        //@ts-expect-error
        let {query: {filters, search, sort:sorter, pageNumber, pageSize, column}} = req as IIndexBC
        //@ts-expect-error
        let sort: ISort = {}, cond: ICond = {isDeleted: false}, projection: IIndexProjection = {'__v': 0}

        if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
            sorter = sorter.replace(/'/g, '"');
            const {key: k, value: v} = await JSON.parse(sorter)
            sort = {[k]: v}
        }
        else sort = {createdAt: -1, updatedAt: -1}

        if(search && this.searchTerm.length) {
            search = search.replace(/'/g, '"')
            search = await JSON.parse(search)
            const _S: I_S = {$regex: search, $options: "i"}
            if(!(cond['$or'] instanceof Array)) cond['$or'] = []
            this.searchTerm.forEach(k => cond['$or'].push({[k]: _S}))
        }

        if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
            filters = filters.replace(/'/g, '"')
            filters = JSON.parse(filters)
            //@ts-expect-error
            filters.forEach(({key: k, value: v}: IIndexFilters): void => {
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

        // const aggregate = [{$match: cond}, {$project: projection}]
        const aggregate = [{$match: cond}]
        const sCond = [{$project: projection}]
        // const {data, page} = await this.repo.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
        const {data, page} = await this.repo.aggregateFaceTIndexBR(cond, [], sCond, sort, pageNumber, pageSize)
        res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
        await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`)
    }
}
