import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMLogger } from "./logger.types";


const LoggerMd = DB.define<IMLogger>(
    TableName.LOGGER,
    {
        logger_id: cloneDeep(modelCommonPrimaryKeyProperty),
        url: { type: DataTypes.TEXT },
        method: { type: DataTypes.STRING },
        params: { type: DataTypes.TEXT },
        query: { type: DataTypes.TEXT },
        body: { type: DataTypes.TEXT },
        module: { type: DataTypes.TEXT },
        level: { type: DataTypes.TEXT },
        message: { type: DataTypes.TEXT, allowNull: false },
        stack: { type: DataTypes.TEXT, allowNull: false },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

// LoggerMd.sync({ force: true });

export { LoggerMd };

