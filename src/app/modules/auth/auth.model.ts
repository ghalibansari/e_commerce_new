import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { authActionEnum, IMAuth } from "./auth.types";

const AuthMd = DB.define<IMAuth>(
    TableName.AUTH,
    {
        auth_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        user_id: {
            allowNull: false,
            type: DataTypes.UUID,
        },
        ip: {
            allowNull: false,
            type: DataTypes.STRING
        },
        action: {
            allowNull: false,
            type: DataTypes.STRING
        },
        token: {
            unique: true,
            allowNull: true,
            type: DataTypes.TEXT
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
// DB.sync()
export { AuthMd };