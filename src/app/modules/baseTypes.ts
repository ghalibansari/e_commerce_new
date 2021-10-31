// import { IRole } from "./role/role.types";
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

export type TUpdateBulkBR<U extends Model> = {
    where: U['_attributes'];
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

export type TDeleteBulkBR<U extends Model> = {
    where: U['_attributes'];
    deleted_by: IUser['user_id']
    delete_reason: string
    transaction?: Transaction
};

export interface ICounter {
    key: string;
    value: string
}


//@ts-expect-error
export interface ILoggedInUser extends Required<Pick<IUser, '_id' | 'email' | 'companyId' | 'firstName' | 'lastName' | 'roleId'>> {
    //@ts-expect-error
    roleName: Pick<IRole, 'shortDescription'>;//IRole['shortDescription']
    iat: number;
    exp: number;
}

// export type IFindBR{}
