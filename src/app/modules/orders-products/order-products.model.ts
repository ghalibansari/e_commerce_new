import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderProduct } from './order-products.type';


const OrderProductMd = DB.define<IMOrderProduct>(
    TableName.ORDER_PRODUCT,
    {
        order_product_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: { type: DataTypes.UUID, },
        order_id: { type: DataTypes.UUID, },
        quantity: { type: DataTypes.INTEGER, },
        amount: { type: DataTypes.FLOAT, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { OrderProductMd };

