import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMCart } from './cart.types';


const CartMd = DB.define<IMCart>(
    TableName.CART,
    {
        cart_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: { allowNull: false, type: DataTypes.UUID },
        user_id: { allowNull: false, type: DataTypes.UUID },
        quantity: { allowNull: false, type: DataTypes.INTEGER, defaultValue: 1 },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { CartMd };

