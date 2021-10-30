import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { IMLogger } from "./logger.types";


const loggerMd = DB.define<IMLogger>(
    TableName.LOGGER,
    {
        logger_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },

        url: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        method: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        query: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        body: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        module: { type: DataTypes.TEXT, allowNull: true, },
        level: { type: DataTypes.TEXT, allowNull: true, },
        message: { type: DataTypes.TEXT, allowNull: true, },
        stack: { type: DataTypes.TEXT, allowNull: true },
        created_by: {
            allowNull: true,
            type: DataTypes.UUID,
        },
        updated_by: {
            allowNull: true,
            type: DataTypes.UUID,
        },
        deleted_by: {
            allowNull: true,
            type: DataTypes.UUID,
        }
    }, {
    timestamps: true,
    paranoid: true
});

// loggerMd.associations = function(_model: any){

// }

// loggerMd.hasMany(UserMd){

// }

export { loggerMd };
