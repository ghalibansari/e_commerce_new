import {ICompany} from "./company/company.types";
import mongoose from "mongoose";
import skuModel from "./sku/sku.model";

export abstract class BaseBusiness<T> {
    protected Repository: any;//Todo fix any
    public repo: any;//Todo fix any

    protected constructor(Repository: any) {//Todo fix any
        this.Repository = Repository
        this.repo = Repository
    }

    findBB = async (cond: object = {}, column:object = {}, sortObj: object = {},limit: number, startIndex: number,populate: object[]=[], sliders = {}): Promise<T[]> =>  await this.Repository.findBR(cond,column,sortObj,limit,startIndex,populate, sliders)

    findOneBB = async (cond: object = {}, sort: object = {}, populate?: object[],column:object = {} ): Promise<T|null> =>  await this.Repository.findOneBR(cond, sort, populate,column)

    createBB = async (item: T|T[]): Promise<T|T[]> => await this.Repository.createBR(item)

    findAndUpdateBB = async (cond: object, update: object, sort?: object): Promise<T|null> => this.Repository.findAndUpdateBR(cond,update, sort)

    updateManyBB = async (cond: object, item: T): Promise<T|null> => await this.Repository.updateManyBR(cond, item)

    aggregateBB = async (aggregateCond: any[] = []): Promise<T[]> =>  await this.Repository.aggregateBR(aggregateCond)

    findCountBB = async (cond: object = {}, sliders = {}): Promise<number> =>  await this.Repository.findCountBR(cond, sliders)


    //Need to Remove below Methods

    /*upsertBB = async (cond: object, item: any): Promise<T> => await this.Repository.upsertBR(cond,item)*/

    /*updateBB = async (cond: object, item: T): Promise<T|null> => await this.Repository.updateBR(cond, item)*/

    /*findPopulateBB = async (cond: object = {}, populate: object[]): Promise<T[]> => await this.Repository.findPopulateBR(cond, populate)*/

    /*findByIdAndDeleteBB = async (_id: T['_id']): Promise<T|null> => await this.Repository.findByIdAndDeleteBR(_id)*/

   /* findByIdAndUpdateBB = async (_id: T['_id'], item: T): Promise<T|null> => await this.Repository.findByIdAndUpdateBR(_id,item)*/

    /*findOneByIdBB = async (cond = {}, populate: object[] = []): Promise<T|null> => await this.Repository.findOneByIdBR(cond, populate)*/

    //@ts-expect-error
    findIdByIdBB = async (_id: T['_id']): Promise<T|null> => await this.Repository.findIdByIdBR(_id)


}