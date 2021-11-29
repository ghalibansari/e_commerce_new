import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CouponEnum, IMCoupon } from './coupon.type';


const CouponMd = DB.define<IMCoupon>(
    TableName.COUPON,
    {
        coupon_id: cloneDeep(modelCommonPrimaryKeyProperty),
        type: { type: DataTypes.STRING },
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

// ImageMd.belongsTo(UserMd, { foreignKey: 'user_is', as: 'user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })

async function doStuffWithUserModel() {
    // await ImageMd.sync({ force: true })
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    await CouponMd.create({
        coupon_id: id,
        type: CouponEnum.percent,
        name: "coup",
        discount: 9.5,
        min_cart_amount: 12000,
        max_discount_amount: 20000,
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

