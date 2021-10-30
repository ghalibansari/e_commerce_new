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
        for (const [i, _] of newData.entries()) {
            const salt = await genSalt(8);
            newData[i].password = await hash(newData[i].password, salt);
        }
        return await this._model.bulkCreate(newData, { transaction });
    };



}