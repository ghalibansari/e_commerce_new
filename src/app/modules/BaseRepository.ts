import { BelongsToManyHasAssociationsMixin, Model, ModelCtor } from 'sequelize'
import { IRead } from '../interfaces/IRead'
import { IWrite } from "../interfaces/IWrite"
import { NonEmptyArray } from "./baseTypes";
import { Constant } from "../constants";

//@ts-expect-error
export class BaseRepository<T extends ModelCtor, U extends Model> implements IWrite<T>, IRead<T> {

    protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER

    protected constructor(
        protected readonly _model: ModelCtor<U>,
        public readonly primary_key: keyof T,
        public readonly attributes: string[] = ['created_on'],
        public readonly order: NonEmptyArray<keyof T> | NonEmptyArray<[keyof T, 'ASC' | 'DESC']>,
        public readonly include: object[] = [],
    ) { }


    indexBR = async (
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
            await this.CountAllBR(),
            await this.CountBR(where)
        ])

        //calculate pagination.
        totalPage = (count % pageSize === 0) ? count / pageSize : Math.ceil(count / pageSize)
        offset = (pageNumber - 1) * pageSize
        limit = pageNumber * pageSize
        if (limit < count) hasNextPage = true

        //@ts-expect-error
        const data = await this._model.findAll({ where, attributes, include, offset, limit, order, raw: true })

        return { data, page: { hasNextPage, totalCount, count, currentPage: pageNumber, totalPage } }
    };


    findBulkBR = async (
        where: object = {},
        attributes = this.attributes,
        include = this.include,
        order = this.order,
    ): Promise<any> => {
        //@ts-expect-error
        return await this._model.findAll({ where, attributes, include, order, raw: true })
    };


    findOneBR = async (where: object = {}, attributes = this.attributes, include = this.include): Promise<Model<T, U> | null> => {
        return await this._model.findOne({ where, attributes, include, raw: true })
    }


    findByIdBR = async (id: keyof T, attributes = this.attributes, include = this.include): Promise<Model<T, U> | null> => {
        return await this.findOneBR({ [this.primary_key]: id }, attributes, include)
    };


    //Todo need to work on it
    findByPkBR = async (
        where: object = {},
        attributes: string[] = ['created_on'],
    ): Promise<Model<T, U> | null> => {
        //@ts-expect-error
        return await this._model.findByPk({ user_id: '', attributes, raw: true })
    }


    createBulkBR = async (newData: T[]) => await this._model.bulkCreate(newData);


    createOneBR = async (newData: T): Promise<U> => {
        const [data] = await this.createBulkBR([newData])
        return data
    };


    updateBulkBR = async (where: U["_attributes"], newData: any): Promise<{ count: number, updated: U[] }> => {
        const data = await this._model.update(newData, { where, returning: true })
        return { count: data[0], updated: data[1] }
    };


    updateByIdBR = async (id: any, newData: Partial<U>): Promise<any> => {
        const { count, updated } = await this.updateBulkBR({ [this.primary_key]: id }, newData)
        return { count, updated: updated[0] }
    };


    deleteBulkBR = async (where: U["_attributes"]): Promise<number> => await this._model.destroy({ where });


    // Todo implement update user on delete docs
    deleteByIdBR = async (id: string): Promise<number> => await this.deleteBulkBR({ [this.primary_key]: id });


    CountBR = async (where: U["_attributes"] = {}): Promise<number> => await this._model.count({ where });


    CountAllBR = async (): Promise<number> => await this.CountBR({});

}