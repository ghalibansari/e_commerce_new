import {BaseRepository} from "../BaseRepository";
import mongoose, {Types} from "mongoose";
import {IIndexProjection} from "../../interfaces/IRepository";
import {IPermission} from "./permission.types";
import permissionModel from "./permission.model";
import {IUser} from "../user/user.types";
import {defaultColumnList} from "../display-configuration/display-configuration.defaultcolumnList";
import {PermissionDefaultValues} from "./permission.defaultValues";

export class PermissionRepository extends BaseRepository<IPermission>
{
    constructor ()
    {
        super(permissionModel);
    }

    index = async ({filters, sliders, search, sort:sorter, pageNumber, pageSize}: any): Promise<any> =>
    {
        let cond: any = {'isDeleted': false};
        let sort = { createdAt: -1, updatedAt: -1};
        if(filters && filters[0]=='[' && filters[filters.length-1]==']'){
            filters = JSON.parse(filters);
            filters.forEach(({key: k, value: v}: any) => {
                if(k[k.length-2] === 'I' && k[k.length-1] === 'd' && v instanceof Array) {v.forEach((val: any, i: number) => v[i] = mongoose.Types.ObjectId(val)); cond[k] = {$in: v}}
                else if(k[k.length-2] === 'I' && k[k.length-1] === 'd') cond[k] = mongoose.Types.ObjectId(v as string)
                else cond[k] = v
            });
        }
        // const skuAggregate = [{$match: cond}, {$unwind: '$config'}, {$match: {'config.isActive': true}}, {$group: {_id: '$_id', config: {$push: '$config'}}}]
        const skuAggregate = [{$match: cond}];
        // return await super.aggregateIndexBR(skuAggregate, sort, pageNumber, pageSize)
        return await super.aggregateFaceTIndexBR(cond, [], [], sort, pageNumber, pageSize)
    }

    defaultConfiguration = async (roleName: string): Promise<Object|void> => {
        return await new PermissionDefaultValues(roleName).getDefaultValues()
    }
}