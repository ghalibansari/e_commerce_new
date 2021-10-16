"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const constants_1 = require("../constants");
class BaseRepository {
    constructor(_model, primary_key, attributes = ['created_on'], order, include = []) {
        this._model = _model;
        this.primary_key = primary_key;
        this.attributes = attributes;
        this.order = order;
        this.include = include;
        this.pageNumber = constants_1.Constant.DEFAULT_PAGE_NUMBER;
        this.indexBR = async (where = {}, attributes = this.attributes, include = this.include, order = this.order, pageNumber = constants_1.Constant.DEFAULT_PAGE_NUMBER, pageSize = constants_1.Constant.DEFAULT_PAGE_SIZE) => {
            let offset, limit, totalPage = 0, hasNextPage = false;
            const [totalCount, count] = await Promise.all([
                await this.CountAllBR(),
                await this.CountBR(where)
            ]);
            totalPage = (count % pageSize === 0) ? count / pageSize : Math.ceil(count / pageSize);
            offset = (pageNumber - 1) * pageSize;
            limit = pageNumber * pageSize;
            if (limit < count)
                hasNextPage = true;
            const data = await this._model.findAll({ where, attributes, include, offset, limit, order, raw: true });
            return { data, page: { hasNextPage, totalCount, count, currentPage: pageNumber, totalPage } };
        };
        this.findBulkBR = async (where = {}, attributes = this.attributes, include = this.include, order = this.order) => {
            return await this._model.findAll({ where, attributes, include, order, raw: true });
        };
        this.findOneBR = async (where = {}, attributes = this.attributes, include = this.include) => {
            return await this._model.findOne({ where, attributes, include, raw: true });
        };
        this.findByIdBR = async (id, attributes = this.attributes, include = this.include) => {
            return await this.findOneBR({ [this.primary_key]: id }, attributes, include);
        };
        this.findByPkBR = async (where = {}, attributes = ['created_on']) => {
            return await this._model.findByPk({ user_id: '', attributes, raw: true });
        };
        this.createBulkBR = async (newData) => await this._model.bulkCreate(newData);
        this.createOneBR = async (newData) => {
            const [data] = await this.createBulkBR([newData]);
            return data;
        };
        this.updateBulkBR = async (where, newData) => {
            const data = await this._model.update(newData, { where, returning: true });
            return { count: data[0], updated: data[1] };
        };
        this.updateByIdBR = async (id, newData) => {
            const { count, updated } = await this.updateBulkBR({ [this.primary_key]: id }, newData);
            return { count, updated: updated[0] };
        };
        this.deleteBulkBR = async (where) => await this._model.destroy({ where });
        this.deleteByIdBR = async (id) => await this.deleteBulkBR({ [this.primary_key]: id });
        this.CountBR = async (where = {}) => await this._model.count({ where });
        this.CountAllBR = async () => await this.CountBR({});
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map