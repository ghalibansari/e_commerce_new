"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const express_1 = require("express");
const constants_1 = require("../constants");
const helper_1 = require("../helper");
const BaseValidation_1 = require("./BaseValidation");
const sequelize_1 = require("sequelize");
class BaseController {
    constructor(url, repo, attributes = repo.attributes, order = repo.order, include = repo.include, searchColumn = [], pageSize = constants_1.Constant.DEFAULT_PAGE_SIZE) {
        this.url = url;
        this.repo = repo;
        this.attributes = attributes;
        this.order = order;
        this.include = include;
        this.searchColumn = searchColumn;
        this.pageSize = pageSize;
        this.pageNumber = constants_1.Constant.DEFAULT_PAGE_NUMBER;
        this.indexBC = async (req, res) => {
            await BaseValidation_1.BaseValidation.index.validateAsync(req.query);
            let { where, attributes, order, search, pageSize, pageNumber } = req.query;
            where || (where = {});
            search || (search = '');
            order || (order = this.order);
            attributes || (attributes = this.attributes);
            pageNumber || (pageNumber = this.pageNumber);
            pageSize || (pageSize = this.pageSize);
            if (search && search.length > 2 && this.searchColumn.length) {
                where[sequelize_1.Op.or] = [];
                for (const col of this.searchColumn) {
                    where[sequelize_1.Op.or].push({ [col]: { [sequelize_1.Op.iLike]: `%${search}%` } });
                }
            }
            const { page, data } = await this.repo.indexBR(where, attributes, this.include, order, pageNumber, pageSize);
            res.locals = { page, data, message: constants_1.Messages.FETCH_SUCCESSFUL };
            return await helper_1.JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`);
        };
        this.findByIdBC = async (req, res) => {
            await BaseValidation_1.BaseValidation.findById.validateAsync(req.params);
            await BaseValidation_1.BaseValidation.attributes.validateAsync(req.query);
            const { params: { id }, query: { attributes = this.attributes } } = req;
            const data = await this.repo.findByIdBR(id, attributes, this.include);
            res.locals = { data, message: constants_1.Messages.FETCH_SUCCESSFUL };
            return await helper_1.JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdBC`);
        };
        this.createOneBC = async (req, res) => {
            const data = await this.repo.createOneBR(req.body);
            res.locals = { data, message: constants_1.Messages.CREATE_SUCCESSFUL };
            return await helper_1.JsonResponse.jsonSuccess(req, res, `{this.url}.createOneBC`);
        };
        this.createBulkBC = async (req, res) => {
            const data = await this.repo.createBulkBR(req.body);
            res.locals = { data, message: constants_1.Messages.CREATE_SUCCESSFUL };
            return await helper_1.JsonResponse.jsonSuccess(req, res, `{this.url}.createBulkBC`);
        };
        this.updateByIdkBC = async (req, res) => {
            await BaseValidation_1.BaseValidation.findById.validateAsync(req.params);
            const data = await this.repo.updateByIdBR(req.params.id, req.body);
            res.locals = { data, message: constants_1.Messages.UPDATE_SUCCESSFUL };
            return await helper_1.JsonResponse.jsonSuccess(req, res, `{this.url}.updateByIdkBC`);
        };
        this.deleteByIdBC = async (req, res) => {
            await BaseValidation_1.BaseValidation.findById.validateAsync(req.params);
            const data = await this.repo.deleteByIdBR(req.params.id);
            if (data)
                res.locals = { status: true, data, message: constants_1.Messages.DELETE_SUCCESSFUL };
            else
                res.locals = { status: false, data, message: constants_1.Messages.DELETE_FAILED };
            return await helper_1.JsonResponse.jsonSuccess(req, res, `{this.url}.deleteByIdBC`);
        };
        this.router = (0, express_1.Router)();
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map