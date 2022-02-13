import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { AuthMd } from '../auth/auth.model';
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CartMd } from '../cart/cart.model';
import { UserAddressMd } from '../user-address/user-address.model';
import { WishlistMd } from '../wishlist/wishlist.model';
import { IMUser } from './user.types';

const UserMd = DB.define<IMUser>(
    TableName.USER,
    {
        user_id: cloneDeep(modelCommonPrimaryKeyProperty),
        first_name: { allowNull: false, type: DataTypes.TEXT },
        last_name: { allowNull: false, type: DataTypes.TEXT },
        mobile: { allowNull: false, unique: true, type: DataTypes.TEXT },
        email: { allowNull: false, unique: true, type: DataTypes.TEXT },
        gender: { allowNull: false, type: DataTypes.TEXT },
        email_verified_at: { type: DataTypes.DATE },
        remember_token: { unique: true, type: DataTypes.STRING },
        password: { allowNull: false, type: DataTypes.TEXT },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


UserMd.hasMany(UserAddressMd, { foreignKey: 'user_id', as: 'addresses' });
UserAddressMd.belongsTo(UserMd, { foreignKey: "user_id", as: "user", targetKey: "user_id" })

UserMd.hasMany(AuthMd, { foreignKey: 'user_id', as: 'auths' });
AuthMd.belongsTo(UserMd, { foreignKey: "user_id", as: "user", targetKey: "user_id" })

UserMd.hasOne(CartMd, { foreignKey: 'user_id', as: 'cart' });
CartMd.belongsTo(UserMd, { foreignKey: 'user_id', as: 'user', targetKey: "user_id" });

UserMd.hasOne(WishlistMd, { foreignKey: 'user_id', as: 'wishlist' });
WishlistMd.belongsTo(UserMd, { foreignKey: 'user_id', as: 'user', targetKey: "user_id" });


export { UserMd };

