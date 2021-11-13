import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderProduct } from './order-products.type';


const OrderProductMd = DB.define<IMOrderProduct>(
    TableName.ORDER_PRODUCT,
    {
        order_product_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: {
            type: DataTypes.UUID,
        },
        order_id: {
            type: DataTypes.UUID,
        },
        quantity: {
            type: DataTypes.INTEGER,
        },
        amount: {
            type: DataTypes.FLOAT,
        },
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

    await OrderProductMd.create({
        order_product_id: id,
        order_id: id,
        product_id: id,
        quantity: 78,
        amount: 3700.66,
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created OrderProduct..."))
        .catch(e => console.log(e))

}

//doStuffWithUserModel()

//OrderProductMd.sync()

export { OrderProductMd };

