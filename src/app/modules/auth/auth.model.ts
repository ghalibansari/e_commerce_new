import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMAuth } from "./auth.types";


const AuthMd = DB.define<IMAuth>(
    TableName.AUTH,
    {
        auth_id: {
            allowNull: false, autoIncrement: false, primaryKey: true,
            type: DataTypes.UUID, defaultValue: () => uuidv4()
        },
        user_id: { allowNull: false, type: DataTypes.UUID },
        ip: { allowNull: false, type: DataTypes.STRING },
        action: { allowNull: false, type: DataTypes.STRING },
        token: { unique: true, allowNull: true, type: DataTypes.TEXT },
        ...modelCommonColumns
    },
    modelCommonOptions
);

export { AuthMd };

