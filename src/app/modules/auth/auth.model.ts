import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { UserMd } from '../user/user.model';
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

AuthMd.belongsTo(UserMd, { foreignKey: 'user_is', as: 'user' })
AuthMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
AuthMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })

// AuthMd.belongsTo(UserMd)
export { AuthMd };
