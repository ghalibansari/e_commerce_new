import { Model, ModelCtor } from 'sequelize'
import { IRead } from '../interfaces/IRead'
import { IWrite } from "../interfaces/IWrite"
import { ICounter } from "./baseTypes";
import { Constant } from "../constants";

//@ts-expect-error
export class BaseRepository<T extends ModelCtor, U extends Model> implements IWrite<T>, IRead<T> {

    protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER

    protected constructor(
        protected readonly _model: ModelCtor<U>,
        public readonly primary_key: keyof T,
        public readonly attributes: string[] = ['created_on'],
        public readonly order: string[] | [string, 'ASC' | 'DESC'][] = [],
        public readonly include: any[] = [],
    ) { }

    findBR = async (
        where: object = {},
        attributes = this.attributes,
        include = this.include,
        order = this.order,
        pageNumber = Constant.DEFAULT_PAGE_NUMBER,
        pageSize = Constant.DEFAULT_PAGE_SIZE
    ): Promise<any> => {
        let offset, limit, totalPage = 0, hasNextPage = false

        //get total count and count based on condition
        const [totalCount, count] = await Promise.all([
            await this._model.count(),
            await this._model.count(where)
        ])

        //calculate pagination.
        totalPage = (count % pageSize === 0) ? count / pageSize : Math.ceil(count / pageSize)
        offset = (pageNumber - 1) * pageSize
        limit = pageNumber * pageSize
        if (limit < count) hasNextPage = true

        const data = await this._model.findAll({ where, attributes, include, offset, limit, order, raw: true })

        return { data, page: { hasNextPage, totalCount, count, currentPage: pageNumber, totalPage } }
    };

    //Todo need to work on it
    findOneBR = async (
        where: object = {},
        attributes: string[] = ['created_on'],
        include: string[] = []
    ): Promise<Model<T, U> | null> => {
        return this._model.findOne({
            where, attributes, include, raw: true
        })
    }

    //Todo need to work on it
    findByPkBR = async (
        where: object = {},
        attributes: string[] = ['created_on'],
    ): Promise<Model<T, U> | null> => {
        //@ts-expect-error
        return this._model.findByPk({ user_id: '', attributes, raw: true })
    }

    deleteBR = async (where: {}) => this._model.destroy({ where });

    // Todo implement update user on delete docs
    deleteByIdBR = async (id: { [key: string]: string }): Promise<number> => this.deleteBR(id);

    CountBR = async (where: object = {}): Promise<number> => this._model.count({ where });

    CountAllBR = async (): Promise<number> => this._model.count();







    // findOneBR = async (cond: object = {}, sortObj: object = {},  populate?: object[], column : object = {}): Promise<T|null> => await this._model.findOne(cond, column).sort(sortObj).populate(populate).lean()

    //@ts-ignore    //Todo remove-this-line-ts-ignore
    // createBR = async (item: T|T[], session?: ClientSession): Promise<T|T[]> => await this._model.create(item)


    // findAndUpdateBR = async (cond: object, update: object, sort: object = {}, session?: ClientSession): Promise<T|T[]> => await this._model.findOneAndUpdate(cond,update,{new: true, upsert: true, sort}).lean()

    // updateManyBR = async (cond: object, item: T, session?: ClientSession): Promise<T|T[]|null> => await this._model.updateMany(cond, item, {new: true}).lean()

    // aggregateBR= async (aggregateCond: T[] = []): Promise<T[]> => await this._model.aggregate(aggregateCond)

    // findCountBR = async (cond: object = {}): Promise<number> => await this._model.countDocuments(cond)

    // groupBy = async (key: string[]): Promise<{[key: string]: string}[]> => {    //Todo optimize it.
    //     let data: {[key: string]: string}[] = []
    //     const returnData = key.map(key => this._model.aggregate([{"$group" : {_id: `$${key}`}}, {$set: {[key]: '$_id'}}, {$project: {_id: 0}}]))
    //     await Promise.all(returnData).then(async returnData => await returnData.forEach(dot => dot.forEach(dog => data.push(dog))))
    //     return data;
    // }

    getListBR = async ({ column: Select, filters, sort: sorter, pageNumber: pagenumber, pageSize: pagesize }: any): Promise<any> => {   //Todo re,ove any type
        let select: { [key: string]: 1 } = { _id: 1 }, sort: { [key: string]: -1 | 1 | 'DESC' | 'ASC' } = { updatedAt: -1 }
        if (sorter) sort = sorter;
        if (Select && Select[0] == '[' && Select[Select.length - 1] == ']') {
            Select = Select.replace(/'/g, '"')
            Select = JSON.parse(Select) as string[]
            Select.forEach((item: string) => select[item] = 1)
        }
        let hasNextPage = false, totalPage = 0, endIndex = 0
        let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
        let pageSize = Number(pagesize) || Constant.DEFAULT_PAGE_SIZE
        let startIndex = (pageNumber - 1) * pageSize;
        let cond: { [key: string]: string | boolean | { $in: any[] } } = { isDeleted: false }
        if (filters && filters[0] == '[' && filters[filters.length - 1] == ']') {
            filters = JSON.parse(filters);
            filters.forEach(({ key, value }: { key: string, value: string | any[] }) => value instanceof Array ? cond[key] = { $in: value } : cond[key] = value)
        }
        //@ts-expect-error
        const [data, totalCount] = await Promise.all([await this._model.find(cond, select).sort(sort).skip(startIndex).limit(pageSize).lean(), await this._model.find(cond).countDocuments()])
        totalPage = await (totalCount % pageSize === 0) ? totalCount / pageSize : Math.ceil(totalCount / pageSize)
        endIndex = pageNumber * pageSize;
        if (endIndex < totalCount) hasNextPage = true
        return { page: { hasNextPage, totalCount, currentPage: pageNumber, totalPage }, data }
    }

    // counterBR = async (counter: ICounter[]): Promise<{}> => {   //Todo can be improved more by remaining key and value pair replace it directly with data.
    //     let count: any = {}

    //     if(!counter.length) await this._model.countDocuments({ isDeleted: false }).then((value: Number) => count['total'] = value)
    //     let countMap = counter.map(async counter => {

    //         await this._model.countDocuments({ [`${counter.key}`] : `${counter.value}`, isDeleted: false })
    //             .then((value: Number) => {
    //             if(count[`${counter.key}`] === undefined) count[`${counter.key}`] = {}
    //             count[`${counter.key}`][`${counter.value}`] = value
    //             })
    //     })
    //     await Promise.all(countMap)
    //     return {count}
    // }

    // async aggregateIndexBR(aggregateCond: Aggregate<T>, sort: {}, pagenumber: number, pagesize: number = Constant.DEFAULT_PAGE_SIZE): Promise<any> {
    // async aggregateIndexBR(aggregateCond: any[], sort: {}, pagenumber: number, pagesize: number, totalcount: {[p:string]:any} = {isDeleted: false}): Promise<any> {
    //     let hasNextPage = false, totalPage = 0, endIndex = 0
    //     let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
    //     let filterCount = await this._model.aggregate(aggregateCond).count('filterCount')
    //     let pageSize
    //     if(pagesize === undefined) pageSize = Constant.DEFAULT_PAGE_SIZE
    //     else if(Number(pagesize) === 0) pageSize = filterCount[0]?.filterCount || Constant.DEFAULT_PAGE_SIZE
    //     else pageSize = Number(pagesize)
    //     let startIndex = (pageNumber - 1) * pageSize;
    //     let [data, totalCount] = await Promise.all([
    //         //@ts-expect-error
    //         await this._model.aggregate(aggregateCond).sort(sort).skip(startIndex).limit(pageSize),
    //         //@ts-expect-error
    //         await this._model.aggregate([{$match: totalcount}, {$count: 'totalCount'}])
    //     ])
    //     // console.log(totalCount, filterCount,'..................................')
    //     //@ts-expect-error
    //     totalCount = await totalCount[0]?.totalCount || 0
    //     filterCount = await filterCount[0]?.filterCount || 0

    //     totalPage = await (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize)
    //     endIndex = pageNumber * pageSize;

    //     if (endIndex < filterCount) hasNextPage = true
    //     return {page: {hasNextPage, totalCount, currentPage:pageNumber, filterCount, totalPage}, data}
    // }

    // async aggregateFaceTIndexBR(cond: {}, agree: any[], sCond: any[], sort: {}, pagenumber: number, pagesize: number): Promise<any> {
    //     let hasNextPage = false, totalPage = 0, endIndex = 0, pageSize
    //     let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
    //     if(!!pagesize && !!Number(pagesize)) pageSize = Number(pagesize)
    //     else if(!!pagesize && Number(pagesize) === 0) pageSize = Number(pagesize)
    //     else pageSize = Constant.DEFAULT_PAGE_SIZE
    //     let startIndex = (pageNumber - 1) * pageSize;
    //     let aggData = [{$match: cond}, ...agree, ...sCond, {$sort: sort}, {$skip: startIndex}]
    //     if(pageSize) aggData.push({$limit: pageSize})
    //     const data = await this._model.aggregate([  //Todo add proper aggregate<T> type...
    //         {$facet: {
    //             data: aggData,
    //             filterCount: [{$match: cond}, ...agree, ...sCond, {$count: 'filterCount'}],
    //             totalCount: [{$match: {isDeleted: false}}, ...agree, {$count: 'totalCount'}]
    //         }}
    //     ])
    //     let totalCount: number = await data[0]?.totalCount[0]?.totalCount || 0;
    //     let filterCount: number = await data[0]?.filterCount[0]?.filterCount || 0;
    //     totalPage = await (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize)
    //     //@ts-expect-error
    //     if(Number(filterCount) && filterCount && totalPage=='Infinity') totalPage = 1
    //     else if(!filterCount && !Number(totalPage)) totalPage = 0
    //     endIndex = pageNumber * pageSize;
    //     if (endIndex < filterCount) hasNextPage = true;
    //     if([0, 1].includes(totalPage)) hasNextPage = false
    //     return {page: {hasNextPage, totalCount, currentPage: pageNumber, filterCount, totalPage}, data: data[0]?.data || null}
    // }

    // async aggregateFaceTIndexForDeviceActivityBR(cond: {}, agree: any[], sCond: any[], sort: {}, pagenumber: number, pagesize: number): Promise<any> {
    //     let hasNextPage = false, totalPage = 0, endIndex = 0, pageSize
    //     let pageNumber = Number(pagenumber) || Constant.DEFAULT_PAGE_NUMBER
    //     if(!!pagesize && !!Number(pagesize)) pageSize = Number(pagesize)
    //     else if(!!pagesize && Number(pagesize) === 0) pageSize = Number(pagesize)
    //     else pageSize = Constant.DEFAULT_PAGE_SIZE
    //     let startIndex = (pageNumber - 1) * pageSize;
    //     let aggData = [{$match: cond}, ...agree, ...sCond, {$sort: sort}, {$skip: startIndex}]
    //     if(pageSize) aggData.push({$limit: pageSize})
    //     const data = await this._model.aggregate([  //Todo add proper aggregate<T> type...
    //         {$facet: {
    //             data: aggData,
    //             filterCount: [{$match: cond}, ...agree, ...sCond, {$count: 'filterCount'}],
    //             //@ts-expect-error
    //             totalCount: [{$match: {isDeleted: false, _id: cond?._id}}, ...agree, {$count: 'totalCount'}]
    //         }}
    //     ])
    //     let totalCount: number = await data[0]?.totalCount[0]?.totalCount || 0;
    //     let filterCount: number = await data[0]?.filterCount[0]?.filterCount || 0;
    //     totalPage = await (filterCount % pageSize === 0) ? filterCount / pageSize : Math.ceil(filterCount / pageSize)
    //     //@ts-expect-error
    //     if(Number(filterCount) && filterCount && totalPage=='Infinity') totalPage = 1
    //     else if(!filterCount && !Number(totalPage)) totalPage = 0
    //     endIndex = pageNumber * pageSize;
    //     if (endIndex < filterCount) hasNextPage = true;
    //     if([0, 1].includes(totalPage)) hasNextPage = false
    //     return {page: {hasNextPage, totalCount, currentPage: pageNumber, filterCount, totalPage}, data: data[0]?.data || null}
    // }


    //Need to Remove below Methods

    ////@ts-ignore
    // upsertBR = async (cond: object, item: T): Promise<any> => this._model.findOneAndUpdate(cond, item, {new: true, upsert: true,});

    /*findPopulateBR = async (cond: object = {}, populate: object[]): Promise<T[]> => await this._model.find(cond).populate(populate).lean()*/

    /* findByIdAndUpdateBR = async (_id: T['_id'], item: T): Promise<T|null> => await this._model.findByIdAndUpdate(this.toObjectId(_id), item, {new: true}).lean()*/

    /*updateBR = async (cond: object, item: T): Promise<T|T[]|null> => await this._model.update(cond, item, {new: true}).lean()*/

    /*findByIdAndDeleteBR = async (_id: T['_id']): Promise<T|null> => await this._model.findByIdAndDelete(this.toObjectId(_id)).lean()*/

    /*findOneByIdBR = async (cond = {}, populate: object[] = []): Promise<T|null> => await this._model.findOne(cond).populate(populate).lean()*/

    //@ts-ignore
    findIdByIdBR = async (_id: T['_id']): Promise<T | null> => await this._model.findById(_id).select('_id').lean();


    // public index(relation: object = [], select_column: any = '', order_by: object = [], where_con: any = ''): Promise<object> {
    //     let all_data = this._model.findAll({
    //         include: relation,
    //         where: where_con,
    //         attributes: select_column,
    //         order: order_by
    //     });
    //     return Promise.resolve(all_data);
    // }

    // public index(aggregateCond: any[], sort: {}, pagenumber: number, pagesize: number = Constant.DEFAULT_PAGE_SIZE): Promise<object> {
    //
    //     return {page: {hasNextPage, totalCount, currentPage:pageNumber, filterCount, totalPage}, data}
    // }



}

