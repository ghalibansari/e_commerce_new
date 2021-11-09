import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMWishlist } from './wishlist.type';


const WishlistMd = DB.define<IMWishlist>(
    TableName.WISHLIST,
    {
        wishlist_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        product_id: { allowNull: false, type: DataTypes.STRING },
        user_id: { type: DataTypes.UUID, defaultValue: null },
        quantity: { allowNull: false, type: DataTypes.INTEGER },
        ...modelCommonColumns
    },
    modelCommonOptions
);

// async function doStuffWithUserModel() {
//     await WishlistMd.sync()
//     await WishlistMd.sync({ force: true })
//     const id = uuidv4()

//     const newUser = await WishlistMd.create({
//         wishlist_id: id,
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
// WishlistMd.sync()

export { WishlistMd };

