import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { OrderAddressMd } from '../order-address/order-address.model';
import { OrderCouponMd } from '../order-coupon/order-coupon.model';
import { OrderProductMd } from '../orders-products/order-products.model';
import { OrderMd } from '../orders/order.model';
import { IMOrderHistory } from './order-history.type';


const OrderHistoryMd = DB.define<IMOrderHistory>(
    TableName.ORDER_HISTORY,
    {
        history_id: cloneDeep(modelCommonPrimaryKeyProperty),
        order_id: { type: DataTypes.UUID, },
        status_id: { type: DataTypes.UUID, },
        comment: { type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

OrderMd.hasMany(OrderHistoryMd, { foreignKey: 'order_id', as: 'order_history' });
OrderHistoryMd.belongsTo(OrderMd, { foreignKey: 'order_id', as: 'order', targetKey: "order_id" });

export { OrderHistoryMd };

