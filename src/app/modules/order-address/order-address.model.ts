import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderAddress } from './order-address.types';


const OrderAddressMd = DB.define<IMOrderAddress>(
    TableName.ORDER_ADDRESS,
    {
        order_address_id: cloneDeep(modelCommonPrimaryKeyProperty),
        order_id: { allowNull: false, type: DataTypes.UUID },
        address_1: { allowNull: false, type: DataTypes.STRING },
        address_2: { allowNull: false, type: DataTypes.STRING, },
        city: { allowNull: false, type: DataTypes.STRING, },
        state: { allowNull: false, type: DataTypes.STRING, },
        pin_code: { allowNull: false, type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { OrderAddressMd };

