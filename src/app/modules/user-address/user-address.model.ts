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
    // await UserMd.sync({ force: true })
    // await UserAddressMd.sync({ force: true })

    const id = v4()

    await UserAddressMd.create({
        address_id: id,
        user_id: '2e5573d4-5ae2-402d-8707-5bc1ef18cde9',
        is_default: true,
        address_1: "Miraroad",
        address_2: "Miraroad 2",
        city: "MumBai Sub",
        state: "Maharashtra",
        pin_code: "400008",
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default address..."))
        .catch(e => console.log(e))

}
// doStuffWithUserModel()

// UserMd.sync({ force: true })
// UserAddressMd.sync({ force: true })

export { UserAddressMd };

