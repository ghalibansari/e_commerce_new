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

// AuthMd.belongsTo(UserMd, { foreignKey: 'user_id', as: 'user' })
// AuthMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
// AuthMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })
// AuthMd.belongsTo(UserMd)

export { AuthMd };

