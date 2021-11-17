import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMUserAddress } from './user-address.type';


const UserAddressMd = DB.define<IMUserAddress>(
    TableName.USER_ADDRESS,
    {
        address_id: cloneDeep(modelCommonPrimaryKeyProperty),
        user_id: { allowNull: false, type: DataTypes.UUID },
        is_default: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
        address_1: { allowNull: false, type: DataTypes.STRING },
        address_2: { allowNull: false, type: DataTypes.STRING, },
        city: { allowNull: false, type: DataTypes.STRING, },
        state: { allowNull: false, type: DataTypes.STRING, },
        pin_code: { allowNull: false, type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


async function doStuffWithUserModel() {
    // await UserAddressMd.sync({force:true})
    // await UserMd.sync({ force: true })
    await UserAddressMd.sync({ alter: true })
    const id = v4()

    const newUser = await UserAddressMd.create({
        address_id: id,
        user_id: id,
        is_default: true,
        address_1: "Maharashtra",
        address_2: "Maharashtra",
        city: "mumbai",
        state: "Maharashtra",
        pin_code: "gh",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default address..."))
        .catch(e => console.log(e))

    // console.log(newUser);
}
// doStuffWithUserModel()

export { UserAddressMd };

