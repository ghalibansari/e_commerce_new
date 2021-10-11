import { model, Schema, Document } from "mongoose";
import { IUser, UserInstance } from './user.types'
import { TableName } from "../../constants";
// import { fingerPrintSchema } from "../fingerPrint/fingerPrint.model";
// //@ts-expect-error
// import bcrypt, {genSaltSync, hashSync} from "bcrypt";
// import { string } from "joi";

import { Model, Optional, DataTypes, Sequelize } from 'sequelize';
import { DB } from "../../../configs/DB";
import { v4 as uuidv4 } from 'uuid';







const UserMd = DB.define<UserInstance>(
    TableName.USER,
    {
        user_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: uuidv4()
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
            type: DataTypes.TEXT,
        },
        email: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        password: {
            allowNull: false,
            type: DataTypes.TEXT,
        }
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
    const newUser = await UserMd.create({
        first_name: "wwwww",
        last_name: "John",
        mobile: 8754219635,
        email: "email",
        password: "wwwww"
    });
    // console.log(newUser);

    // const foundUser = await User.findOne({ where: { name: "Johnny" } });
    // if (foundUser === null) return;
    // console.log(foundUser.name);
}

// doStuffWithUserModel();



export default UserMd;