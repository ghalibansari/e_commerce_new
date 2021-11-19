import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { IMWishlist } from './wishlist.type';


const WishlistMd = DB.define<IMWishlist>(
    TableName.WISHLIST,
    {
        wishlist_id: cloneDeep(modelCommonPrimaryKeyProperty),
        product_id: { allowNull: false, type: DataTypes.STRING },
        user_id: { type: DataTypes.UUID, defaultValue: null },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


async function doStuffWithUserModel() {
    await WishlistMd.sync()
    // await WishlistMd.sync({ force: true })
    const id = v4()

    const newUser = await WishlistMd.create({
        wishlist_id: id,
        product_id: id,
        user_id: id,
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

// doStuffWithUserModel()
// WishlistMd.sync()

export { WishlistMd };

