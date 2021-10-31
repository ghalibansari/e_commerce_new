import { BaseRepository } from "../BaseRepository";
import { IUser, IMUser } from "./user.types";
import { UserMd } from "./user.model";
import { Transaction } from "sequelize";
import { genSalt, hash } from "bcrypt";



export class UserRepository extends BaseRepository<IUser, IMUser> {
    constructor() {
        super(UserMd, "user_id", ['*'], [['last_name', 'DESC']], [])
    }

    createBulkBR = async (newData: IUser[], transaction?: Transaction): Promise<IMUser[]> => {
        for (let i = 0; i < newData.length; i++) {
            const salt = await genSalt(8);
            newData[i].password = await hash(newData[i].password, salt);
        }
        return await this._model.bulkCreate(newData, { transaction });
    };

    updateBulkBR = async (where: IMUser["_attributes"], newData: Partial<IMUser>, transaction?: Transaction): Promise<{ count: number, updated: IMUser[] }> => {
        if (newData.password) {
            const salt = await genSalt(8);
            newData.password = await hash(newData.password, salt);
        }
        const data = await this._model.update(newData, { where, returning: true, transaction })
        return { count: data[0], updated: data[1] || [] };
    };
}