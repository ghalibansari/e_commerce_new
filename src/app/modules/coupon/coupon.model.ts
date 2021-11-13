import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMCoupon } from './coupon.type';


const CouponMd = DB.define<IMCoupon>(
    TableName.COUPON,
    {
        coupon_id: cloneDeep(modelCommonPrimaryKeyProperty),
        type: {
            type: DataTypes.BOOLEAN,
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

    await CouponMd.create({
        coupon_id: id,
        type: true,
        discount: 9.5,
        min_cart_amount: 12000,
        offer_start_date: new Date(),
        offer_end_date: new Date(),
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created Coupon..."))
        .catch(e => console.log(e))

}

// doStuffWithUserModel()
// CouponMd.sync({ force: true })

export { CouponMd };

