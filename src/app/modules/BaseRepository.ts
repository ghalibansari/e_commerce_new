import { Model, ModelCtor } from 'sequelize';
import { Constant } from "../constants";
import { IRead } from '../interfaces/IRead';
import { IWrite } from "../interfaces/IWrite";
import { NonEmptyArray, TCreateBulkBR, TCreateOneBR, TDeleteBulkBR, TDeleteByIdBR, TFindByIdBR, TUpdateBulkBR, TUpdateByIdBR } from "./baseTypes";

//@ts-expect-error
export class BaseRepository<T extends ModelCtor, U extends Model> implements IWrite<T>, IRead<T> {

    protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER

    protected constructor(
        protected readonly _model: ModelCtor<U>,
        public readonly primary_key: keyof T,
        public readonly attributes: NonEmptyArray<string> = ['created_on'],
        public readonly order: NonEmptyArray<keyof U> | NonEmptyArray<[keyof U, 'ASC' | 'DESC']>,
        public readonly include: object[] = [],
    ) { }


    indexBR = async ({
        where = {},
        attributes = this.attributes,
        include = this.include,
        order = this.order,
        pageNumber = Constant.DEFAULT_PAGE_NUMBER,
        pageSize = Constant.DEFAULT_PAGE_SIZE
    }): Promise<any> => {
        let offset, limit, totalPage = 0, hasNextPage = false

        //get total count and count based on condition
        const [totalCount, count] = await Promise.all([
            await this.CountAllBR(),
            await this.CountBR(where)
        ])

        //calculate pagination.
        totalPage = (count % pageSize === 0) ? count / pageSize : Math.ceil(count / pageSize)
        offset = (pageNumber - 1) * pageSize
        limit = pageNumber * pageSize
        if (limit < count) hasNextPage = true

        const data = await this.findBulkBR({ where, attributes, order, offset, limit, include });
        return { data, page: { hasNextPage, totalCount, count, currentPage: pageNumber, totalPage } }
    };


    findBulkBR = async ({
        where = {},
        attributes = this.attributes,
        order = this.order,
        offset = 0,
        limit = 10,
        include = this.include,
    }): Promise<U[] | []> => {
        //@ts-expect-error
        return await this._model.findAll({ where, attributes, offset, limit, include, order, raw: true })
    };


    findOneBR = async ({ where = {}, attributes = this.attributes, include = this.include }): Promise<U | null> => {
        return await this._model.findOne({ where, attributes, include, raw: true })
    }


    findByIdBR = async ({ id, attributes = this.attributes, include = this.include }: TFindByIdBR): Promise<U | null> => {
        return await this.findOneBR({ where: { [this.primary_key]: id }, attributes, include })
    };


    createBulkBR = async ({ newData, created_by, transaction }: TCreateBulkBR<T>): Promise<U[]> => {
        for (let i = 0; i < newData.length; i++) {
            //@ts-expect-error
            newData[i].created_by = created_by
            //@ts-expect-error
            newData[i].updated_by = created_by
        }
        return await this._model.bulkCreate(newData, { transaction })
    };


    createOneBR = async ({ newData, created_by, transaction }: TCreateOneBR<T>): Promise<U> => {
        const [data] = await this.createBulkBR({ newData: [newData], created_by, transaction })
        return data
    };


    updateBulkBR = async ({ where, newData, updated_by, transaction }: TUpdateBulkBR<U>): Promise<{ count: number, data: U[] }> => {
        //@ts-expect-error
        newData.updated_by = updated_by
        //@ts-expect-error
        const data = await this._model.update(newData, { where, returning: true, transaction });
        return { count: data[0], data: data[1] || [] }
    };


    updateByIdBR = async ({ id, newData, updated_by, transaction }: TUpdateByIdBR<U>): Promise<{ count: number, data?: U }> => {
        const { count, data } = await this.updateBulkBR({ where: { [this.primary_key]: id }, newData, updated_by, transaction })
        return { count, data: data[0] }
    };


    deleteBulkBR = async ({ where, deleted_by, delete_reason, transaction }: TDeleteBulkBR<U>): Promise<number> => {
        return await this._model.destroy({ where, transaction })
    };


    deleteByIdBR = async ({ id, deleted_by, delete_reason, transaction }: TDeleteByIdBR): Promise<number> => {
        return await this.deleteBulkBR({ where: { [this.primary_key]: id }, deleted_by, delete_reason, transaction })
    };


    CountBR = async (where: U["_attributes"] = {}): Promise<number> => {
        return await this._model.count({ where })
    };


    CountAllBR = async (): Promise<number> => {
        return await this.CountBR({})
    };
};