import { Application, Request, Response, Router } from 'express'
import { Messages, Constant } from "../constants"
import { JsonResponse } from "../helper/JsonResponse"
import { BaseValidation } from "./BaseValidation";
import moment from 'moment';
import { BaseRepository } from './BaseRepository';
import { Op } from "sequelize";

export abstract class BaseController<T> {

    protected router: Router
    protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER

    abstract register(express: Application): Application
    abstract init(): void

    public constructor(
        protected readonly url: string,
        protected readonly repo: BaseRepository<T, any>,
        private readonly attributes = repo.attributes,
        private readonly order = repo.order,
        protected readonly include = repo.include,
        protected readonly searchColumn: Array<keyof T> = [],
        protected readonly pageSize = Constant.DEFAULT_PAGE_SIZE
    ) {
        this.router = Router();
    }


    indexBC = async (req: Request, res: Response): Promise<void> => {
        // await new BaseValidation().findBC(req, res)
        let { where, attributes, order, search, pageSize, pageNumber }: any = req.query;

        where ||= {}
        search ||= ''
        order ||= this.order
        attributes ||= this.attributes
        pageNumber ||= this.pageNumber
        pageSize ||= this.pageSize

        //search
        if (search && search.length > 2 && this.searchColumn.length) {
            where[Op.or] = []
            for (const col of this.searchColumn) {
                where[Op.or].push({ [col]: { [Op.iLike]: `%${search}%` } })
            }
        }

        const { page, data } = await this.repo.indexBR(where, attributes, this.include, order, pageNumber, pageSize)
        res.locals = { page, data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`)
    };

    findByIdBC = async (req: Request, res: Response): Promise<void> => {
        // await new BaseValidation().findBC(req, res)
        const { params: { id }, query: { attributes = this.attributes } }: any = req
        const data = await this.repo.findByIdBR(id, attributes, this.include)
        res.locals = { data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdBC`)
    };

    createOneBC = async (req: Request, res: Response): Promise<void> => {
        const data = await this.repo.createOneBR(req.body)
        res.locals = { data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.createOneBC`)
    };

    createBulkBC = async (req: Request, res: Response): Promise<void> => {
        const data = await this.repo.createBulkBR(req.body)
        res.locals = { data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.createOneBC`)
    };

    updateByIdkBC = async (req: Request, res: Response): Promise<void> => {
        const data = await this.repo.updateByIdBR(req.params.id as any, req.body)
        res.locals = { data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.createOneBC`)
    };

    // exportBC = async (req: Request, res: Response, populate: object[] = []): Promise<any> => {
    //     await new BaseValidation().findBC(req, res)
    //     // @ts-expect-error
    //     let {query:{sliders, column, filters, filtersIn,rangeFilters,sort:sorter,search:searchData, count:counter}} : {query:{column: string, filters: string,filtersIn:string,rangeFilters:string, sort: string,search:string, pageSize: number, pageNumber: number, count: string}} = req

    //     if(!sliders) sliders = {}
    //     //access rights here.
    //     let access = {}
    //     let {body:{loggedInUser:{_id, companyId}}} = req
    //     let accessData = await new AclBusiness().findOneBB({userId: _id, companyId, module: this.url, isDeleted: false})
    //     if(accessData){

    //         delete accessData._id

    //         delete accessData.companyId

    //         delete accessData.userId

    //         delete accessData.module

    //         delete accessData.url

    //         delete accessData.isDelete

    //         delete accessData.updatedBy

    //         delete accessData.updatedAt

    //         delete accessData.createdBy

    //         delete accessData.createdAt
    //         delete accessData.__v
    //         access = accessData
    //     }



    //     let filterCount = 0, startIndex = 0, endIndex = 0
    //     let hasNextPage: boolean = false, totalPage: number;
    //     let sort = {}, count: any = {}, cond = {}, columnFields = {}
    //     let search={};
    //     let totalCount: number;


    //     if(this.isDeleted) totalCount = await this.business.findCountBB({isDeleted: false})
    //     else totalCount = await this.business.findCountBB()

    //     console.log("Populate ="+populate);

    //     if(column?.length && column[0] === '[' && column[column.length-1] === ']'){
    //         column = column.replace(/'/g, '"');
    //         column =  await JSON.parse(column)
    //         let temppopulate: any = []
    //         //@ts-expect-error
    //         column.forEach(col => {
    //             //@ts-expect-error
    //             columnFields[col] = 1

    //             populate.forEach(pop =>
    //             {
    //                 //@ts-expect-error
    //                 if(pop.path == col) temppopulate.push(pop)
    //             });
    //         })

    //         populate = temppopulate
    //     }

    //     if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
    //         sorter = sorter.replace(/'/g, '"');
    //         sorter = await JSON.parse(sorter)
    //         //@ts-expect-error
    //         console.log(sorter.key+" "+sorter.value);
    //         //@ts-expect-error
    //         sort = { [`${sorter.key}`] : `${sorter.value}`}
    //     }
    //     else sort = { updatedAt: 'desc', createdAt: 'desc'}

    //     if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']')
    //     {
    //         counter = counter.replace(/'/g, '"');
    //         counter =  await JSON.parse(counter)
    //         //@ts-expect-error
    //         let countMap = counter.map(async counter => {
    //             let counterData: Promise<number>
    //             if(this.isDeleted){
    //                 counterData = await this.business.findCountBB({ [`${counter.key}`] : `${counter.value}`, isDeleted: false })
    //                     .then((value: Number) => {
    //                         if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
    //                         count[`${counter.key}`][`${counter.value}`] = value
    //                     })
    //             }
    //             else {
    //                 counterData = await this.business.findCountBB({ [`${counter.key}`] : `${counter.value}`} )
    //                     .then((value: Number) => {
    //                         if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
    //                         count[`${counter.key}`][`${counter.value}`] = value
    //                     })
    //             }
    //             // if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
    //             // count[`${counter.key}`][`${counter.counterData}`] = await counterData
    //         })
    //         await Promise.all(countMap)
    //     }


    //     if(filtersIn?.length && filtersIn[0] === '[' && filtersIn[filtersIn.length-1] === ']') {

    //         filtersIn = filtersIn.replace(/'/g, '"');
    //         filtersIn = await JSON.parse(filtersIn)
    //         console.log(filtersIn);
    //         //@ts-expect-error
    //         filtersIn.forEach(filterIn => {

    //             if(filterIn.key==='fromDate'|| filterIn.key==='toDate')
    //             {
    //                 // @ts-ignore
    //                 var frmdate = filtersIn.find( function(item) { return item.key == 'fromDate' });
    //                 // @ts-ignore
    //                 var todate = filtersIn.find( function(item) { return item.key == 'toDate' });
    //                 var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
    //                 console.log(endOfDay+"")
    //                 // @ts-ignore
    //                 cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
    //             }
    //             else
    //             {
    //                 // @ts-ignore
    //                 cond[filterIn.key] = {$in: filterIn.value.split(",")};
    //             }

    //         });
    //         //@ts-expect-error
    //         if(this.isDeleted) cond.isDeleted = false
    //         filterCount = await this.business.findCountBB(cond, sliders)
    //         if (endIndex < filterCount) hasNextPage = true

    //     }
    //     else if(filters?.length && filters[0] === '[' && filters[filters.length-1] === ']') {
    //         filters = filters.replace(/'/g, '"');
    //         filters = await JSON.parse(filters)
    //         console.log(filters);
    //         //@ts-expect-error
    //         filters.forEach(filter => {

    //             if(filter.key==='fromDate'|| filter.key==='toDate')
    //             {
    //                 // @ts-ignore
    //                 var frmdate = filters.find( function(item) { return item.key == 'fromDate' });
    //                 // @ts-ignore
    //                 var todate = filters.find( function(item) { return item.key == 'toDate' });
    //                 var endOfDay = moment(new Date(todate.value)).endOf("day").toDate();
    //                 console.log(endOfDay+"")
    //                 // @ts-ignore
    //                 cond['createdAt'] = {"$gte": new Date(frmdate.value),"$lte": endOfDay};
    //             }
    //             else
    //             {
    //     //             var date = new Date();  //for current-month
    //     // var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
    //     // var lastDay = new Date(date.getFullYear(), date.getMonth()+1, 1);
    //     // console.log("FromDate->"+firstDay," - - - - - - - - -   [CURRENT M O N T H] - - - -- - - - - - -  ToDate->",lastDay);
    //     // // @ts-expect-error
    //     // cond['createdAt'] = {"$gte": firstDay,"$lte": lastDay};

    //                 // @ts-ignore
    //                 cond[filter.key] = filter.value;
    //             }

    //         });
    //         //@ts-expect-error
    //         if(this.isDeleted) cond.isDeleted = false
    //         filterCount = await this.business.findCountBB(cond, sliders)
    //         if (endIndex < filterCount) hasNextPage = true
    //     }
    //     else{
    //         //@ts-expect-error
    //         if(this.isDeleted) cond.isDeleted = false
    //         filterCount = totalCount
    //         if (endIndex < totalCount) hasNextPage = true
    //     }

    //     if(rangeFilters?.length && rangeFilters[0] === '[' && rangeFilters[rangeFilters.length-1] === ']') {
    //         rangeFilters = rangeFilters.replace(/'/g, '"');
    //         rangeFilters = await JSON.parse(rangeFilters)
    //         console.log(rangeFilters);
    //         //@ts-expect-error
    //         rangeFilters.forEach(filter => {

    //             if(filter.value.length>0)
    //             {
    //                 //@ts-expect-error
    //                 cond[filter.key] = {"$gte": filter.value[0],"$lte": filter.value[1]};

    //                 console.log(filter.key+" "+filter.value[0]+" "+filter.value[1]);
    //             }

    //         });
    //         //@ts-expect-error
    //         if(this.isDeleted) cond.isDeleted = false
    //         filterCount = await this.business.findCountBB(cond, sliders)
    //         if (endIndex < filterCount) hasNextPage = true
    //     }

    //     if(searchData?.length && searchData[0] === '{' && searchData[searchData.length-1] === '}') {
    //         searchData = searchData.replace(/'/g, '"');
    //         searchData = await JSON.parse(searchData)
    //         //@ts-expect-error
    //         cond[`${searchData.key}`] = {$regex: searchData.value, $options: "i"};//${searchData.value
    //         //@ts-expect-error
    //         if(this.isDeleted) cond.isDeleted = false
    //         filterCount = await this.business.findCountBB(cond, sliders)
    //         if (endIndex < filterCount) hasNextPage = true
    //     }

    //     if(sliders && Object.keys(sliders).length > 0) {
    //         //@ts-expect-error
    //         if(this.isDeleted) cond.isDeleted = false
    //         filterCount = await this.business.findCountBB(cond, sliders)
    //         if (endIndex < filterCount) hasNextPage = true
    //     }

    //     console.log('Condition = '+cond);
    //     res.locals.page = { hasNextPage, totalCount, filterCount, count, access}

    //     return  await this.business.findBB(cond, columnFields, sort, filterCount, startIndex, populate, sliders)
    // }

    // createBC = async (req: Request, res: Response): Promise<void> => {
    //     let {body, body:{loggedInUser:{_id:loggedInUserId}}} = req
    //     body.createdBy = body.updatedBy = loggedInUserId
    //     let data = await this.business.createBB(body);
    //     res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
    // }

    // createMultipleBC = async (req: Request, res: Response): Promise<void> => {
    //     let {body, body:{newData, loggedInUser:{_id:loggedInUserId}}} = req
    //     let dataToBeInserted: T[] = []
    //     //@ts-expect-error
    //     newData.forEach((data: T) => {data.createdBy = data.updatedBy = loggedInUserId; dataToBeInserted.push(data)} )
    //     const data = await this.business.createBB(dataToBeInserted)
    //     res.locals = {status: true, message: Messages.CREATE_SUCCESSFUL, data}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.createB`);
    // }

    // updateBC = async (req: Request, res: Response): Promise<void> => {
    //     let {body, body:{_id}, body:{loggedInUser:{_id:loggedInUserId}}} = req
    //     body.updatedBy = loggedInUserId
    //     const isDeleted = await this.business.findOneBB({_id, isDeleted: false})
    //     if(isDeleted){
    //         const data = await this.business.findAndUpdateBB({_id}, body)
    //         if(data) { res.locals.status = true;res.locals.data = 1; res.locals.message = Messages.UPDATE_SUCCESSFUL}
    //         else { res.locals.status = false;res.locals.data = 0; res.locals.message = Messages.UPDATE_FAILED}
    //     }
    //     else {res.locals.status = false; res.locals.data = 0; res.locals.message = Messages.UPDATE_FAILED}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.updateBC`);
    // }

    deleteByIdBC = async (req: Request, res: Response): Promise<void> => {
        res.locals = { status: false, data: 0, message: Messages.DELETE_FAILED }
        const data = await this.repo.deleteByIdBR(req.params.id)
        if (data) res.locals = { status: true, data, message: Messages.DELETE_SUCCESSFUL }
        else res.locals = { status: false, data, message: Messages.DELETE_FAILED }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteBC`);
    }

    // findByIdBC = async (req: Request, res: Response, populate: object[] = []): Promise<void> => {
    //     res.locals = { status: false, data: 0, message: Messages.FETCH_FAILED}
    //     const {query:{_id}} = req
    //     let data: Promise<T>
    //     data = await this.repo.findOneBB({_id, isDeleted: false},{},populate)
    //     if(await data) res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    // }

    // // upsertBC = async (req: Request, res: Response, populate: object[] = []): Promise<void> => {
    // //     res.locals = { status: false, data: 0, message: Messages.FETCH_FAILED}
    // //     const {query:{_id}} = req
    // //     let data: Promise<T>
    // //     data = await this.business.findOneBB({_id, isDeleted: false},{},populate)
    // //     if(data) res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
    // //     await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdB`)
    // // }

    // groupByBC= async(req: Request, res: Response): Promise<void> =>  {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED};
    //     // await new BaseValidation().groupByBC(req, res)   //Todo add validation
    //     //@ts-expect-error
    //     let {query: {key, companyId}}: {query: {key: string, companyId: string}} = req
    //     key = key.replace(/'/g, '"')
    //     // @ts-expect-error
    //     key = await JSON.parse(key) as String[]
    //     const data = await this.repo.groupBy(key);
    //     res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL};
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.groupByBC`);
    // }

    // paginationOfAnArray = async (req: Request, res: Response, dataList: any): Promise<void> => {
    //     //@ts-expect-error
    //     let {query: {_id, column, filters, sort: sorter, pageSize: pagesize, pageNumber: pagenumber, search: searchData, count: counter}}: {query: {filters: string, sort: string, pageSize: number, pageNumber: number}} = req
    //     let cond:any = {}, count: any = {}
    //     let filterCount = 0, startIndex = 0, endIndex = 0
    //     let hasNextPage: boolean = false, totalPage: number;
    //     let totalCount: number;
    //     let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
    //     let pageSize = (pagesize !== undefined && Number(pagesize) !== NaN) ? Number(pagesize) : Constant.DEFAULT_PAGE_SIZE
    //     totalCount = dataList.length
    //     startIndex = (pageNumber - 1) * pageSize;
    //     endIndex = pageNumber * pageSize;

    //     if (filters?.length && filters[0] === '[' && filters[filters.length - 1] === ']') {
    //         filters = filters.replace(/'/g, '"');
    //         filters = await JSON.parse(filters)
    //         //@ts-expect-error
    //         filters.forEach(filter => {
    //             let item: any
    //             if(filter.key.includes(".") ) {
    //                 item = filter.key.split(".")
    //                 cond[item[0]] = {}
    //                 cond[item[0]][item[1]] = filter.value
    //             }
    //             //@ts-expect-error
    //             else if(filter.key === "companyId") cond["companyId"] = {"_id": mongoose.Types.ObjectId(filter.value as string)} 
    //             else cond[filter.key] = filter.value
    //         })
    //         dataList = dataList.filter((itm: any) => { if (lo.isMatch(itm, cond)) return itm })
    //         filterCount = dataList.length
    //         totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
    //         if (endIndex < filterCount) hasNextPage = true
    //     }
    //     // else if (searchData?.length && searchData[0] === '{' && searchData[searchData.length - 1] === '}') {
    //     else if(searchData) {
    //         searchData = await JSON.parse(searchData)
    //         let filterArray = []
    //         for (var i = 0; i < dataList.length; i++) {
    //             var patt = new RegExp(searchData, "i");
    //             // if(searchData.key === "companyId" && dataList[i]["companyId"]){if (patt.test(dataList[i]["companyId"]["name"])) filterArray.push(dataList[i])}
    //             // else if(searchData.key === "lastOpenedBy" && dataList[i]["lastOpenedBy"]){if (patt.test(dataList[i]["lastOpenedBy"]["firstName"])) filterArray.push(dataList[i])}
    //             // else if(searchData.key === "lastClosedBy" && dataList[i]["lastClosedBy"]){if (patt.test(dataList[i]["lastClosedBy"]["firstName"])) filterArray.push(dataList[i])}
    //             // else{if (patt.test(dataList[i][searchData.key])) filterArray.push(dataList[i])}
    //             if (patt.test(dataList[i]["companyId"]["name"]) || patt.test(dataList[i]["lastOpenedBy"]["firstName"]) || patt.test(dataList[i]["lastOpenedBy"]["firstName"]) || patt.test(dataList[i]["action"])) filterArray.push(dataList[i])
    //         }
    //         dataList = filterArray
    //         filterCount = dataList.length
    //         totalPage = (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize);
    //         if (endIndex < filterCount) hasNextPage = true
    //     }
    //     else {
    //         totalPage = (totalCount % pageSize === 0) ? totalCount / pageSize : Math.ceil(totalCount / pageSize);
    //         if (endIndex < totalCount) hasNextPage = true
    //     }
    //     dataList = dataList.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    //     if (column?.length && column[0] === '[' && column[column.length - 1] === ']') {
    //         column = column.replace(/'/g, '"');
    //         column = await JSON.parse(column)
    //         dataList = dataList.map((dataObj: any) => {
    //             let data: any = {}
    //             for (let item of column) {
    //                 if(item.includes(".") ) {
    //                     item = item.split(".");
    //                     data[item[0]] = {};
    //                     data[item[0]][item[1]] = dataObj[item[0]][item[1]]
    //                 }
    //                 else data[item] = dataObj[item]
    //             }
    //             return data
    //         });
    //     }
    //     if (counter?.length && counter[0] === '[' && counter[counter.length - 1] === ']') {
    //         counter = counter.replace(/'/g, '"');
    //         counter = await JSON.parse(counter)
    //         for (let item of counter) count[item.key] = {}
    //         for (let item of counter) count[item.key][item.value] = dataList.filter((obj: any) => obj[item.key] === item.value).length;
    //     }
    //     if (sorter) {
    //         sorter = sorter.replace(/'/g, '"');
    //         sorter = await JSON.parse(sorter)
    //         dataList = await this.sortByKey(dataList, sorter)
    //     }
    //     if(filterCount === 0) filterCount = dataList.length
    //     res.locals.page = { hasNextPage, totalCount, filterCount, currentPage: pageNumber, totalPage, count }
    //     res.locals.data = dataList
    //     res.locals.message = Messages.FETCH_SUCCESSFUL;
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.detail`);
    // }

    // async sortByKey(array: Array<object>, sort: string): Promise<any | never> {
    //     return array.sort(function (a, b) {
    //         // @ts-expect-error
    //         let x = a[sort.key], y = b[sort.key];
    //         // @ts-expect-error
    //         if (sort.value === "asc") return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    //         else return ((x < y) ? 1 : ((x > y) ? -1 : 0))
    //     });
    // }

    // getListBC = async (req: Request, res: Response): Promise<void> => {
    //     res.locals = { status: false, message: Messages.FETCH_FAILED}
    //     const {data, page} = await this.repo.getListBR(req.query)
    //     res.locals = {status: true, data, page, message: Messages.FETCH_SUCCESSFUL}
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.getListBC`)
    // }

    // counterBC = async (req: Request, res: Response): Promise<void> => {
    //     res.locals = { status: false, message: Messages.FETCH_FAILED}
    //     const {query:{count}} = req
    //     let counter: string|ICounter[] = count as string
    //     if(counter?.length && counter[0] === '[' && counter[counter.length-1] === ']') {
    //         counter = counter.replace(/'/g, '"');
    //         counter = await JSON.parse(counter) as ICounter[]
    //         const data = await this.repo.counterBR(counter)
    //         res.locals = {status: true, data, message: Messages.FETCH_SUCCESSFUL}
    //     }
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.counterBC`)
    // }

    // indexBC = async (req: Request, res: Response): Promise<void> => {
    //     res.locals = {status: false, message: Messages.FETCH_FAILED};
    //     //@ts-expect-error
    //     let {query: {filters, search, sort:sorter, pageNumber, pageSize, column}} = req as IIndexBC
    //     //@ts-expect-error
    //     let sort: ISort = {}, cond: ICond = {isDeleted: false}, projection: IIndexProjection = {'__v': 0}

    //     if(sorter?.length && sorter[0] === '{' && sorter[sorter.length-1] === '}') {
    //         sorter = sorter.replace(/'/g, '"');
    //         const {key: k, value: v} = await JSON.parse(sorter)
    //         sort = {[k]: v}
    //     }
    //     else sort = {createdAt: -1, updatedAt: -1}

    //     if(search && this.searchTerm.length) {
    //         search = search.replace(/'/g, '"')
    //         search = await JSON.parse(search)
    //         const _S: I_S = {$regex: search, $options: "i"}
    //         if(!(cond['$or'] instanceof Array)) cond['$or'] = []
    //         this.searchTerm.forEach(k => cond['$or'].push({[k]: _S}))
    //     }

    //     if(filters && filters[0]=='[' && filters[filters.length-1]==']') {
    //         filters = filters.replace(/'/g, '"')
    //         filters = JSON.parse(filters)
    //         //@ts-expect-error
    //         filters.forEach(({key: k, value: v}: IIndexFilters): void => {
    //             if(k === 'startDate' || k === 'endDate') {
    //                 if(!(cond['createdAt'] instanceof Object)) cond['createdAt'] = {}
    //                 if(k === 'startDate') cond['createdAt']['$gte'] = new Date(v as string)
    //                 if(k === 'endDate') cond['createdAt']['$lte'] = new Date(v as string)
    //             }
    //             //@ts-expect-error
    //             else if(k[k.length-3] === 'I' && k[k.length-2] === 'd' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
    //             //@ts-expect-error
    //             else if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
    //             //@ts-expect-error
    //             else if(k[k.length-3] === 'I' && k[k.length-2] === 'd' && k[k.length-1] === 's') cond[k] = mongoose.Types.ObjectId(v as string)
    //             //@ts-expect-error
    //             else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
    //             else v instanceof Array ? cond[k] = {$in: v} : cond[k] = v
    //         })
    //     }

    //     if(column && column[0]=='[' && column[column.length-1]==']'){
    //         column = column.replace(/'/g, '"')
    //         column = JSON.parse(column)
    //         projection = {}
    //         for(const col of column) projection[col] = 1
    //     }

    //     // const aggregate = [{$match: cond}, {$project: projection}]
    //     const aggregate = [{$match: cond}]
    //     const sCond = [{$project: projection}]
    //     // const {data, page} = await this.repo.aggregateIndexBR(aggregate, sort, pageNumber, pageSize)
    //     const {data, page} = await this.repo.aggregateFaceTIndexBR(cond, [], sCond, sort, pageNumber, pageSize)
    //     res.locals = {status: true, page, data, message: Messages.FETCH_SUCCESSFUL};
    //     await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`)
    // }
}
