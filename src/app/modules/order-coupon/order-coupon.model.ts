import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderCoupon } from './order-coupon.type';


const OrderCouponMd = DB.define<IMOrderCoupon>(
    TableName.ORDER_COUPON,
    {
        order_coupon_id: cloneDeep(modelCommonPrimaryKeyProperty),
        order_id: { type: DataTypes.UUID },
        type: { type: DataTypes.BOOLEAN, },
        discount: { type: DataTypes.FLOAT, },
        min_cart_amount: { allowNull: false, type: DataTypes.FLOAT },
        offer_start_date: { type: DataTypes.DATE },
        offer_end_date: { type: DataTypes.DATE },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { OrderCouponMd };

