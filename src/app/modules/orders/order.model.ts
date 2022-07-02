import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { OrderAddressMd } from '../order-address/order-address.model';
import { OrderCouponMd } from '../order-coupon/order-coupon.model';
import { OrderStatusMd } from '../order-status/order-status.model';
import { OrderProductMd } from '../orders-products/order-products.model';
import { IMOrder } from './order.type';


const OrderMd = DB.define<IMOrder>(
    TableName.ORDER,
    {
        order_id: cloneDeep(modelCommonPrimaryKeyProperty),
        order_number: { type: DataTypes.STRING },
        user_id: { type: DataTypes.UUID, },
        transaction_id: { type: DataTypes.UUID, },
        grand_total: { type: DataTypes.FLOAT, },
        shipping_charges: { allowNull: false, type: DataTypes.INTEGER },
        type: { type: DataTypes.STRING },
        current_status: { type: DataTypes.UUID, },
        appcode: { type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

OrderMd.hasOne(OrderCouponMd, { foreignKey: 'order_id', as: 'order_coupon' });
OrderCouponMd.belongsTo(OrderMd, { foreignKey: 'order_id', as: 'order', targetKey: "order_id" });

OrderMd.hasOne(OrderAddressMd, { foreignKey: 'order_id', as: 'order_addresses' });
OrderAddressMd.belongsTo(OrderMd, { foreignKey: 'order_id', as: 'order', targetKey: "order_id" });

OrderMd.hasMany(OrderProductMd, { foreignKey: 'order_id', as: 'order_product' });
OrderProductMd.belongsTo(OrderMd, { foreignKey: 'order_id', as: 'order', targetKey: "order_id" });

OrderMd.hasOne(OrderStatusMd, { foreignKey: 'status_id', as: 'order_status', sourceKey: 'current_status' });
OrderStatusMd.belongsTo(OrderMd, { foreignKey: 'status_id', as: 'order', targetKey: "current_status"});

export { OrderMd };

