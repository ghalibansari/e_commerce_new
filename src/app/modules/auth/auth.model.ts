import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMAuth } from "./auth.types";


const AuthMd = DB.define<IMAuth>(
    TableName.AUTH,
    {
        auth_id: cloneDeep(modelCommonPrimaryKeyProperty),
        user_id: { allowNull: false, type: DataTypes.UUID },
        ip: { allowNull: false, type: DataTypes.STRING },
        action: { allowNull: false, type: DataTypes.STRING },
        token: { unique: true, allowNull: true, type: DataTypes.TEXT },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { AuthMd };


