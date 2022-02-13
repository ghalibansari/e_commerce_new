import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
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

export { WishlistMd };

