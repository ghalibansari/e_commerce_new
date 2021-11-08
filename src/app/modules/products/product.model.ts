import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions } from '../BaseModel';
import { IMProduct } from './product.type';


const ProductMd = DB.define<IMProduct>(
    TableName.PRODUCT,
    {
        product_id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: () => uuidv4()
        },
        category_id: {
            type: DataTypes.UUID,
        },
        brand_id: {
            type: DataTypes.UUID,
        },
        name: { allowNull: false, type: DataTypes.STRING },
        description: { allowNull: true, type: DataTypes.STRING },
        weight: { allowNull: false, type: DataTypes.FLOAT },
        amount: { allowNull: false, type: DataTypes.INTEGER },
        ...modelCommonColumns
    },
    modelCommonOptions
);

// ImageMd.belongsTo(UserMd, { foreignKey: 'user_is', as: 'user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'created_by', as: 'created_by_user' })
// ImageMd.belongsTo(UserMd, { foreignKey: 'updated_by', as: 'updated_by_user' })

async function doStuffWithUserModel() {
    // await ImageMd.sync({ force: true })
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    await ProductMd.create({
        product_id: id,
        category_id: id,
        brand_id: id,
        name: 'Dove',
        description: 'Beauty Soap',
        weight: 1.12,
        amount: 3,
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default user..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

//doStuffWithUserModel()

// ProductMd.sync()

export { ProductMd };
