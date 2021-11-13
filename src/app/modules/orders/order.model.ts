import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrder } from './order.type';


const OrderMd = DB.define<IMOrder>(
    TableName.ORDER,
    {
        order_id: cloneDeep(modelCommonPrimaryKeyProperty),
        user_id: {
            type: DataTypes.UUID,
        },
        transaction_id: {
            type: DataTypes.UUID,
        },
        grand_total: {
            type: DataTypes.FLOAT,
        },
        shipping_charges: { allowNull: false, type: DataTypes.INTEGER },
        status: { type: DataTypes.STRING },
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

    await OrderMd.create({
        order_id: id,
        user_id: id,
        transaction_id: id,
        grand_total: 12000,
        shipping_charges: 120,
        status: 'placed',
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created Order..."))
        .catch(e => console.log(e))

}

// doStuffWithUserModel()
// CouponMd.sync({ force: true })
//OrderMd.sync()

export { OrderMd };

