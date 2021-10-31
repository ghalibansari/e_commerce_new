import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelDefaultColumns, modelDefaultOptions, modelDefaultPrimaryKeyProperty } from '../BaseModel';
import { IMLogger } from "./logger.types";


const loggerMd = DB.define<IMLogger>(
    TableName.LOGGER,
    {
        logger_id: modelDefaultPrimaryKeyProperty,
        url: { allowNull: false, type: DataTypes.TEXT },
        method: { allowNull: false, type: DataTypes.TEXT },
        params: { allowNull: false, type: DataTypes.TEXT },
        query: { allowNull: false, type: DataTypes.TEXT },
        body: { allowNull: false, type: DataTypes.TEXT },
        module: { type: DataTypes.TEXT, allowNull: true },
        level: { type: DataTypes.TEXT, allowNull: true },
        message: { type: DataTypes.TEXT, allowNull: true },
        stack: { type: DataTypes.TEXT, allowNull: true },
        ...modelDefaultColumns
    },
    modelDefaultOptions
);

// loggerMd.associations = function(_model: any){

// }

// loggerMd.hasMany(UserMd){

// }

export { loggerMd };
