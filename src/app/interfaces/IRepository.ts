import {Types} from "mongoose";




export type ICond = {
        [m:string]: string|number|boolean|Types.ObjectId|{}|{$in: number|string[]|string|Types.ObjectId[]};
        'isDeleted': boolean;
        'isActive': boolean;
        '$or': {[n:string]: I_S}[];
        'createdAt': {[o in '$gte'|'$lte']?: Date}
    }

export type secondCond = {
        [m:string]: string|number|boolean|Types.ObjectId|{}|{$in: number|string[]|string|Types.ObjectId[]};
        'isDeleted': boolean;
        'isActive': boolean;
        '$or': {[n:string]: I_S}[];
        'createdAt': {[o in '$gte'|'$lte']?: Date}
    }

export type I_S = {$regex: string, $options: "i"}

export type IIndexBC = {query: IIndexParam}

export type ISort = {[m:string]: -1|1|'desc'|'asc'}

export type IIndexFilters = {
        key: string, value: string|string[]|number[]|Types.ObjectId|Types.ObjectId[];
        'isDeleted': boolean;
        'isActive': boolean;
        '$or': {[n:string]: I_S}[];
        'createdAt': {[o in '$gte'|'$lte']: Date};
    }

export type IIndexParam = {filters: string, search: string, sort: string, pageNumber: number, pageSize: number, column: string, _id: string}

export type IIndexProjection = {[p:string]: 0|1}