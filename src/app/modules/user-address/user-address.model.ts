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
    // await UserAddressMd.sync({ force: true })
    const id = v4()

    await UserAddressMd.create({
        address_id: id,
        user_id: id,
        is_default: true,
        address_1: "Bhopal Road 1",
        address_2: "Bhopal Road 2nd lane",
        city: "Bhopal",
        state: "MP",
        pin_code: "400123",
        created_by: id,
        updated_by: id
    })
        .then((user) => console.log("Created default address...", user))
        .catch((e: any) => console.log(e));
}

// doStuffWithUserModel()

export { UserAddressMd };

