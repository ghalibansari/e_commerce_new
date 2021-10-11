import {BaseRepository} from "../BaseRepository";
import {IDisplayConfiguration} from "./diaplay-configuration.types";
import displayConfigurationModel from "./display-configuration.model";
import mongoose from "mongoose";
import {defaultColumnList} from "./display-configuration.defaultcolumnList";
import {IUser} from "../user/user.types";


export class DisplayConfigurationRepository extends BaseRepository<IDisplayConfiguration> {
    constructor () {
        super(displayConfigurationModel);
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize}: any): Promise<IUser[]> => {
        let cond: any = {'isDeleted': false};
        let sort = { createdAt: 'desc', updatedAt: 'desc'};
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = JSON.parse(filters);
            filters.forEach((filter: any) => {
                if(filter.key === "screen") cond[filter.key] = filter.value
                else cond[filter.key] = mongoose.Types.ObjectId(filter.value)
            });
        }
        const skuAggregate = [{$match: cond}, {$unwind: '$config'}, {$match: {'config.isDeleted': false}}, {$group: {_id: '$_id', config: {$push: '$config'}}}]
        return await super.aggregateIndexBR(skuAggregate, sort, pageNumber, pageSize)
    }

    //@ts-expect-error
    isActive = async (_id: IDisplayConfiguration['_id'], isActive: boolean, updatedBy: IUser['_id']): Promise<void> => displayConfigurationModel.update({_id}, {isActive, updatedBy})

    defaultConfiguration = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize}: any): Promise<Object> => {
        let modelName="";
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = JSON.parse(filters);
            filters.forEach((filter: any) => { if(filter.key==="screen") modelName=filter.value });
        }
        return await new defaultColumnList(modelName).getList()
    }
}