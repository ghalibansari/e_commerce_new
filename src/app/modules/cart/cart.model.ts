import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMCart } from './cart.types';


const CartMd = DB.define<IMCart>(
    TableName.CART,
    {
        cart_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: { allowNull: false, type: DataTypes.STRING },
        user_id: { type: DataTypes.UUID, defaultValue: null },
        quantity: { allowNull: false, type: DataTypes.INTEGER },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

// async function doStuffWithUserModel() {
//     await CartMd.sync()
//     await CartMd.sync({ force: true })
//     const id = uuidv4()

//     const newUser = await CartMd.create({
//         cart_id: id,
//         product_id: id,
//         user_id: id,
//         quantity: 78992338,
//         created_by: id,
//         updated_by: id
//     })
//         .then(() => console.log("Created default user..."))
//         .catch(e => console.log(e))
//     // console.log(newUser);
// }

// doStuffWithUserModel()
//categoriesMd.sync()

export { CartMd };

