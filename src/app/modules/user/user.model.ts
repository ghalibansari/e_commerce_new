import { IMUser } from './user.types'
import { Messages, TableName } from "../../constants";
import { Application, Request, Response, Router } from 'express'
// import { fingerPrintSchema } from "../fingerPrint/fingerPrint.model";
// //@ts-expect-error
// import bcrypt, {genSaltSync, hashSync} from "bcrypt";
// import { string } from "joi";

import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { v4 as uuidv4 } from 'uuid';

const UserMd = DB.define<IMUser>(
    TableName.USER,
    {
        user_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        first_name: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        last_name: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        mobile: {
            allowNull: false,
            unique: true,
            type: DataTypes.TEXT,
        },
        email: {
            allowNull: true,
            unique: true,
            type: DataTypes.TEXT,
        },
        is_status: {
            allowNull: true,
            unique: true,
            type: DataTypes.BOOLEAN,
        },
        email_verified_at: {
            allowNull: true,
            unique: true,
            type: DataTypes.STRING,
        },
        remember_token: {
            allowNull: true,
            unique: true,
            type: DataTypes.STRING,
        },
        password: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        created_by: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        updated_by: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        deleted_by: {
            allowNull: true,
            type: DataTypes.UUID,
        },
    },
    {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_on',
        updatedAt: 'updated_on',
        deletedAt: 'deleted_on'
    }
);


// Book.belongsTo(Author, {
//     foreignKey: 'authorId',
//     as: 'author'
// });


async function doStuffWithUserModel() {
    // await DB.sync({ force: true })
    // const newUser = await UserMd.create({
    //     "first_name": "Yo",
    //     "last_name": "John",
    //     "mobile": 8754219635,
    //     "email": "email",
    //     "email_verified_at": "sdfghjk",
    //     "is_status": true,
    //     "remember_token": "123456",
    //     "password": "ddd",
    //     "created_by": "c1cc539a-caaa-4738-a4af-a1a39c9edc2d",
    //     "updated_by": "c1cc539a-caaa-4738-a4af-a1a39c9edc2c"
    // });
    // console.log(newUser);

    // const foundUser = await User.findOne({ where: { name: "Johnny" } });
    // if (foundUser === null) return;
    // console.log(foundUser.name);
}

// doStuffWithUserModel();
// const createBulkBC = async (req: Request, res: Response): Promise<void> => {
//     const data = await this.repo.createBulkBR(req.body)
//     res.locals = { data, message: Messages.CREATE_SUCCESSFUL }
//     return await JsonResponse.jsonSuccess(req, res, `{this.url}.createBulkBC`)
// };

// UserMd.sync()

export { UserMd };