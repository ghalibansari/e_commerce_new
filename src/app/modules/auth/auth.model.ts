import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { authActionEnum, IMAuth } from "./auth.types";


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
async function doStuffWithUserModel() {
    await AuthMd.sync()
    // await UserMd.sync({ force: true })
    const id = v4()

    const newUser = await AuthMd.create({
        auth_id: id,
        user_id: "b4bdfa28-7cf3-4970-af16-b2aac5cd4880",
        ip: "192.168.0.1",
        token: "98765466",
        action: authActionEnum.register,
        created_by: id,
        updated_by: id,
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
};

// doStuffWithUserModel()
// EmailMd.sync({ force: true 

// AuthMd.belongsTo(UserMd, { foreignKey: 'user_id', as: 'user' })
// AuthMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
// AuthMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })
// AuthMd.belongsTo(UserMd)

export { AuthMd };


