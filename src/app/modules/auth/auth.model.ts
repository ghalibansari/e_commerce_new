import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelDefaultColumns, modelDefaultOptions, modelDefaultPrimaryKeyProperty } from '../BaseModel';
import { IMAuth } from "./auth.types";


const AuthMd = DB.define<IMAuth>(
    TableName.AUTH,
    {
        auth_id: modelDefaultPrimaryKeyProperty,
        user_id: { allowNull: false, type: DataTypes.UUID },
        ip: { allowNull: false, type: DataTypes.STRING },
        action: { allowNull: false, type: DataTypes.STRING },
        token: { unique: true, allowNull: true, type: DataTypes.TEXT },
        ...modelDefaultColumns
    },
    modelDefaultOptions
);

export { AuthMd };
