import { Model, Transaction } from "sequelize";
import { IUser } from "./user/user.types";


export type NonEmptyArray<T> = [T, ...T[]];

export type TFindByIdBR = {
    id: string;
    attributes?: NonEmptyArray<string>
    include?: object[]
};

export type TCreateOneBR<T> = {
    newData: Omit<T, 'created_by' | 'updated_by' | 'deleted_by'>;
    created_by: IUser['user_id']
    transaction?: Transaction
};

export type TCreateBulkBR<T> = {
    newData: Omit<T, 'created_by' | 'updated_by' | 'deleted_by'>[];
    created_by: IUser['user_id']
    transaction?: Transaction
};

export type TUpdateByIdBR<U extends Model> = {
    id: string;
    newData: Partial<U>
    updated_by: IUser['user_id']
    transaction?: Transaction
};

export type TUpdateOneBR<U extends Model> = {
    where: object;
    newData: Partial<U>
    updated_by: IUser['user_id']
    transaction?: Transaction
};

export type TUpdateBulkBR<U extends Model> = {
    where: Partial<U['_attributes']>;
    newData: Omit<Partial<U>, 'created_by' | 'updated_by' | 'deleted_by'>
    updated_by: IUser['user_id']
    transaction?: Transaction
};

export type TDeleteByIdBR = {
    id: string
    deleted_by: IUser['user_id']
    delete_reason: string
    transaction?: Transaction
};

export type TDeleteOneBR = {
    where: Object
    deleted_by: IUser['user_id']
    delete_reason: string
    transaction?: Transaction
};

export type TDeleteBulkBR<U extends Model> = {
    where: U['_attributes'];
    deleted_by: IUser['user_id']
    delete_reason: string
    transaction?: Transaction
};

export type TRestoreByIdBR = {
    id: string
    transaction?: Transaction
};

export type TRestoreBulkBR<U extends Model> = {
    where: U['_attributes']
    transaction?: Transaction
};

export interface ICounter {
    key: string;
    value: string
}


export interface IBCommon {
    is_active?: boolean
    delete_reason?: string
    created_by: IUser['user_id']
    updated_by: IUser['user_id']
    deleted_by?: IUser['user_id']
}


export interface IMCommon {
    created_at: IUser['user_id']
    updated_at: IUser['user_id']
    deleted_at?: IUser['user_id']
};