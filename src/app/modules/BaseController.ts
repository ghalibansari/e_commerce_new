import { Application, Request, Response, Router } from 'express';
import { Model, Op } from "sequelize";
import { Constant, Messages } from "../constants";
import { JsonResponse } from "../helper";
import { BaseRepository } from './BaseRepository';
import { BaseValidation } from "./BaseValidation";

export abstract class BaseController<T, U extends Model> {

    protected router: Router
    protected readonly pageNumber = Constant.DEFAULT_PAGE_NUMBER

    abstract register(express: Application): Application
    abstract init(): void

    public constructor(
        protected readonly url: string,
        protected readonly repo: BaseRepository<T, U>,
        private readonly attributes = repo.attributes,
        private readonly order = repo.order,
        protected readonly include = repo.include,
        protected readonly searchColumn: Array<keyof T> = [],
        protected readonly pageSize = Constant.DEFAULT_PAGE_SIZE
    ) {
        this.router = Router();
    }


    indexBC = async (req: Request, res: Response): Promise<void> => {
        await BaseValidation.index.validateAsync(req.query);

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

        const { page, data } = await this.repo.indexBR({ where, attributes, include: this.include, order, pageNumber, pageSize })
        res.locals = { status: true, page, data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.indexBC`)
    };

    findByIdBC = async (req: Request, res: Response): Promise<void> => {
        await BaseValidation.findById.validateAsync(req.params);
        await BaseValidation.attributes.validateAsync(req.query);
        const { params: { id }, query: { attributes = this.attributes } }: any = req
        const data = await this.repo.findByIdBR({ id, attributes, include: this.include })
        res.locals = { status: true, data, message: Messages.FETCH_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.findByIdBC`)
    };

    createOneBC = async (req: Request, res: Response): Promise<void> => {
        const { body, user: { user_id } }: any = req
        const data = await this.repo.createOneBR({ newData: body, created_by: user_id })
        res.locals = { status: true, data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.createOneBC`)
    };

    createBulkBC = async (req: Request, res: Response): Promise<void> => {
        let { body, user: { user_id } }: any = req
        const data = await this.repo.createBulkBR({ newData: body, created_by: user_id })
        res.locals = { status: true, data, message: Messages.CREATE_SUCCESSFUL }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.createBulkBC`)
    };

    updateByIdkBC = async (req: Request, res: Response): Promise<void> => {
        await BaseValidation.findById.validateAsync(req.params);
        const { body, params: { id }, user: { user_id } }: any = req
        const { count, data } = await this.repo.updateByIdBR({ id, newData: body, updated_by: user_id })
        res.locals = { status: !!count, data, message: !!count ? Messages.UPDATE_SUCCESSFUL : Messages.UPDATE_FAILED };
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.updateByIdkBC`)
    };

    deleteByIdBC = async (req: Request, res: Response): Promise<void> => {
        await BaseValidation.findById.validateAsync(req.params);
        await BaseValidation.delete_reason.validateAsync(req.query);
        const { params: { id }, user: { user_id }, query: { delete_reason } }: any = req
        const data = await this.repo.deleteByIdBR({ id, deleted_by: user_id, delete_reason })
        res.locals = { status: !!data, message: !!data ? Messages.DELETE_SUCCESSFUL : Messages.DELETE_FAILED }
        return await JsonResponse.jsonSuccess(req, res, `{this.url}.deleteByIdBC`);
    };


};