import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CityMd } from '../city/city.model';
import { PinCodeMd } from '../pincode/pincode.model';
import { StatesMd } from '../state/state.model';
import { IMUserAddress } from './user-address.type';


const UserAddressMd = DB.define<IMUserAddress>(
    TableName.USER_ADDRESS,
    {
        address_id: cloneDeep(modelCommonPrimaryKeyProperty),
        user_id: { allowNull: false, type: DataTypes.UUID },
        is_default: { allowNull: false, type: DataTypes.BOOLEAN, defaultValue: false },
        address_1: { allowNull: false, type: DataTypes.STRING },
        address_2: { allowNull: false, type: DataTypes.STRING, },
        city_id: { allowNull: false, type: DataTypes.STRING, },
        state_id: { allowNull: false, type: DataTypes.STRING, },
        pincode_id: { allowNull: false, type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

UserAddressMd.belongsTo(CityMd, { foreignKey: "city_id", as: "city", targetKey: "city_id" });
UserAddressMd.belongsTo(StatesMd, { foreignKey: "state_id", as: "state", targetKey: "state_id" });
UserAddressMd.belongsTo(PinCodeMd, { foreignKey: "pincode_id", as: "pincode", targetKey: "pincode_id" });

export { UserAddressMd };

