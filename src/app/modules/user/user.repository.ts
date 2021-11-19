import { genSalt, hash } from "bcrypt";
import { BaseRepository } from "../BaseRepository";
import { TCreateBulkBR, TUpdateBulkBR } from "../baseTypes";
import { UserMd } from "./user.model";
import { IMUser, IUser } from "./user.types";



export class UserRepository extends BaseRepository<IUser, IMUser> {
    constructor() {
        super(UserMd, "user_id", ['first_name', 'last_name', 'mobile', 'email', 'gender'], [['last_name', 'DESC']], [])
    }

    createBulkBR = async ({ newData, created_by, transaction }: TCreateBulkBR<IUser>): Promise<IMUser[]> => {
        for (let i = 0; i < newData.length; i++) {
            const salt = await genSalt(8);
            newData[i].password = await hash(newData[i].password, salt);
            //@ts-expect-error
            newData[i].created_by = created_by
            //@ts-expect-error
            newData[i].updated_by = created_by
        }
        //@ts-expect-error
        return await this._model.bulkCreate(newData, { transaction });
    };

    updateBulkBR = async ({ where, newData, updated_by, transaction }: TUpdateBulkBR<IMUser>): Promise<{ count: number, data: IMUser[] }> => {
        if (newData.password) {
            const salt = await genSalt(8);
            newData.password = await hash(newData.password, salt);
        }
        //@ts-expect-error
        newData.updated_by = updated_by
        const data = await this._model.update(newData, { where, returning: true, transaction })
        return { count: data[0], data: data[1] || [] };
    };
}