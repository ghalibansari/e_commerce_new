import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMOrderAddress } from './order-address.types';


const OrderAddressMd = DB.define<IMOrderAddress>(
    TableName.ORDER_ADDRESS,
    {
        order_product_id: cloneDeep(modelCommonPrimaryKeyProperty),
        order_id: { allowNull: false, type: DataTypes.UUID },
        address_1: { allowNull: false, type: DataTypes.STRING },
        address_2: { allowNull: false, type: DataTypes.STRING, },
        city: { allowNull: false, type: DataTypes.STRING, },
        state:  { allowNull: false, type: DataTypes.STRING, },
        pin_code:  { allowNull: false, type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

// async function doStuffWithUserModel() {
//     await OrderAddressMd.sync()
//     await OrderAddressMd.sync({ force: true })
//     const id = uuidv4()

//     const newUser = await OrderAddressMd.create({
//         order_product_id: id,
//         order_id: id,
//         address_1: "Maharashtra",
//         address_2: "Maharashtra",
//         city: "mumbai",
//         state:"mumbai",
//         pin_code:"1001",
//         created_by: id,
//         updated_by: id
//     })
//         .then(() => console.log("Created default user..."))
//         .catch(e => console.log(e))
//     // console.log(newUser);
// }

// doStuffWithUserModel()
// // //categoriesMd.sync()

export { OrderAddressMd };

