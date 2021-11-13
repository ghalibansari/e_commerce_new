import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderCoupon } from './order-coupon.type';


const OrderCouponMd = DB.define<IMOrderCoupon>(
    TableName.ORDER_COUPON,
    {
        order_product_id: cloneDeep(modelCommonPrimaryKeyProperty),
        order_id: {
            type: DataTypes.UUID
        },
        type: {
            type: DataTypes.BOOLEAN,//todo insert enum type for type of orderCoupon
        },
        discount: {
            type: DataTypes.FLOAT,
        },
        min_cart_amount: { allowNull: false, type: DataTypes.INTEGER },
        offer_start_date: { type: DataTypes.DATE },
        offer_end_date: { type: DataTypes.DATE },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

// ImageMd.belongsTo(UserMd, { foreignKey: 'user_is', as: 'user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })

async function doStuffWithUserModel() {
    // await ImageMd.sync({ force: true })
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    await OrderCouponMd.create({
        order_product_id: id,
        order_id: id,
        type: false,
        discount: 30,
        min_cart_amount: 90000,
        offer_start_date: new Date(),
        offer_end_date: new Date(),
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created Order Order_Coupon..."))
        .catch(e => console.log(e))

}

// doStuffWithUserModel()
// OrderCouponMd.sync()

export { OrderCouponMd };

