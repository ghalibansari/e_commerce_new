import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMCart } from './cart.types';


const CartMd = DB.define<IMCart>(
    TableName.CART,
    {
        cart_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: { allowNull: false, type: DataTypes.UUID },
        user_id: { allowNull: false, type: DataTypes.UUID },
        quantity: { allowNull: false, type: DataTypes.INTEGER, defaultValue: 1 },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


async function doStuffWithUserModel() {

    const id = v4()

    await CartMd.create({
        cart_id: id,
        product_id: id,
        user_id: '67fa328b-f5bd-4b23-88db-97e10803e428',
        quantity: 9,
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default cart..."))
        .catch(e => console.log(e))
}

// doStuffWithUserModel()

export { CartMd };

