import { Model, ModelCtor } from 'sequelize';
import { DB } from "../../configs/DB";
import { Constant } from "../constants";
import { IRead } from '../interfaces/IRead';
import { IWrite } from "../interfaces/IWrite";
import { NonEmptyArray, TCreateBulkBR, TCreateOneBR, TDeleteBulkBR, TDeleteByIdBR, TFindByIdBR, TRestoreBulkBR, TRestoreByIdBR, TUpdateBulkBR, TUpdateByIdBR } from "./baseTypes";

//@ts-expect-error
const { fn, col } = DB

//@ts-expect-error
export class BaseRepository<T extends ModelCtor, U extends Model> implements IWrite<T>, IRead<T> {

    protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER

    protected constructor(
        public readonly _model: ModelCtor<U>,
        public readonly primary_key: keyof U,
        public readonly attributes: NonEmptyArray<any | keyof U> = ['created_on'],
        public readonly order: Array<keyof U> | Array<[keyof U, 'ASC' | 'DESC']> = [],
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
        raw = false
    }): Promise<U[] | []> => {
        //@ts-expect-error
        where['is_active'] === undefined && (where['is_active'] = true);
        //@ts-expect-error
        return await this._model.findAll({ where, attributes, offset, limit, include, order, raw })
    };


    findOneBR = async ({ where = {}, attributes = this.attributes, order = this.order, include = this.include, raw = true }): Promise<U | null> => {
        //@ts-expect-error
        where['is_active'] === undefined && (where['is_active'] = true);
        //@ts-expect-error
        return await this._model.findOne({ where, attributes, include, order, raw })
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
        //@ts-expect-error
        const { count, data } = await this.updateBulkBR({ where: { [this.primary_key]: id }, newData, updated_by, transaction })
        return { count, data: data[0] }
    };


    deleteBulkBR = async ({ where, deleted_by, delete_reason, transaction }: TDeleteBulkBR<U>): Promise<number> => {
        const [data] = await this._model.update({ deleted_by, delete_reason, deleted_at: new Date() }, { where, transaction, silent: true })
        return data;
    };


    deleteByIdBR = async ({ id, deleted_by, delete_reason, transaction }: TDeleteByIdBR): Promise<number> => {
        return await this.deleteBulkBR({ where: { [this.primary_key]: id }, deleted_by, delete_reason, transaction })
    };

    // deleteOneBR = async ({ where, deleted_by, delete_reason, transaction }: TDeleteOneBR): Promise<number> => {
    //     return await this.deleteBulkBR({ where, deleted_by, delete_reason, transaction })
    // };


    restoreBulkBR = async ({ where, transaction }: TRestoreBulkBR<U>): Promise<void> => {
        return await this._model.restore({ where, transaction })
    };


    restoreByIdBR = async ({ id, transaction }: TRestoreByIdBR): Promise<void> => {
        return await this.restoreBulkBR({ where: { [this.primary_key]: id }, transaction })
    };


    CountBR = async (where: U["_attributes"] = {}): Promise<number> => {
        return await this._model.count({ where })
    };


    CountAllBR = async (): Promise<number> => {
        return await this.CountBR({})
    };

    findColumnMinMax = async ({ columnName }: { columnName: string }) => {
        // return await this.findBulkBR({   //TODO fix this 
        return await this._model.findAll({
            attributes: [
                [fn('max', col(columnName)), 'max'],
                [fn('min', col(columnName)), 'min'],
            ]
        })
    }
};