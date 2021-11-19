import { genSalt, hash } from 'bcrypt';
import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CartMd } from '../cart/cart.model';
import { UserAddressMd } from '../user-address/user-address.model';
import { IMUser, UserGenderEnum } from './user.types';

const UserMd = DB.define<IMUser>(
    TableName.USER,
    {
        user_id: cloneDeep(modelCommonPrimaryKeyProperty),
        first_name: { allowNull: false, type: DataTypes.TEXT },
        last_name: { allowNull: false, type: DataTypes.TEXT },
        mobile: { allowNull: false, unique: true, type: DataTypes.TEXT },
        email: { allowNull: false, unique: true, type: DataTypes.TEXT },
        gender: { allowNull: false, type: DataTypes.ENUM(...Object.values(UserGenderEnum)) },
        email_verified_at: { type: DataTypes.DATE },
        remember_token: { unique: true, type: DataTypes.STRING },
        password: { allowNull: false, type: DataTypes.TEXT },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


UserMd.hasMany(UserAddressMd, { foreignKey: 'user_id', as: 'addresses' });
UserAddressMd.belongsTo(UserMd, { foreignKey: "user_id", as: "user", targetKey: "user_id" })


UserMd.hasMany(CartMd, { foreignKey: 'user_id', as: 'carts' });
CartMd.belongsTo(UserMd, { foreignKey: 'user_id', as: 'user', targetKey: "user_id" });


async function doStuffWithUserModel() {
    // await UserMd.sync({ force: true })

    const id = uuidv4()
    const salt = await genSalt(8);
    const password = await hash('demo1234', salt);

    await UserMd.create({
        user_id: id,
        first_name: "demo",
        last_name: "John",
        mobile: "8754219635",
        email: "demo@demo.com",
        gender: UserGenderEnum.m,
        email_verified_at: new Date(),
        password: password,
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
}

// doStuffWithUserModel();
// UserMd.sync({ force: true })

export { UserMd };

