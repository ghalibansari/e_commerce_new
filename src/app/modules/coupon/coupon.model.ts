import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMCoupon } from './coupon.type';


const CouponMd = DB.define<IMCoupon>(
    TableName.COUPON,
    {
        coupon_id: cloneDeep(modelCommonPrimaryKeyProperty),
        type: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT, allowNull: true },
        discount: { type: DataTypes.FLOAT },
        name: { type: DataTypes.STRING },
        min_cart_amount: { allowNull: false, type: DataTypes.INTEGER },
        offer_start_date: { type: DataTypes.DATE },
        offer_end_date: { type: DataTypes.DATE },
        max_discount_amount: { allowNull: false, type: DataTypes.INTEGER },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

export { CouponMd };

