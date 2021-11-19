import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CartMd } from '../cart/cart.model';
import { CategoriesMd } from '../categories/categories.model';
import { IMProduct } from './product.type';


const ProductMd = DB.define<IMProduct>(
    TableName.PRODUCT,
    {
        product_id: cloneDeep(modelCommonPrimaryKeyProperty),
        category_id: { allowNull: false, type: DataTypes.UUID },
        brand_id: { allowNull: false, type: DataTypes.UUID },
        name: { allowNull: false, type: DataTypes.STRING },
        description: { allowNull: true, type: DataTypes.STRING },
        weight: { allowNull: false, type: DataTypes.FLOAT },
        amount: { allowNull: false, type: DataTypes.INTEGER },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

ProductMd.hasMany(CartMd, { foreignKey: 'product_id', as: 'carts' });
CartMd.belongsTo(ProductMd, { foreignKey: 'product_id', as: 'product', targetKey: "product_id" });

CategoriesMd.hasMany(ProductMd, { foreignKey: 'category_id', as: 'categories' });
ProductMd.belongsTo(CategoriesMd, { foreignKey: 'category_id', as: 'category', targetKey: "category_id" });


async function doStuffWithUserModel() {
    // await ImageMd.sync({ force: true })
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    await ProductMd.create({
        product_id: id,
        category_id: id,
        brand_id: id,
        name: 'axe',
        description: 'House talc',
        weight: 1.12,
        amount: 3,
        created_by: id,
        updated_by: id
    })
        .then(() => console.log("Created default product..."))
        .catch(e => console.log(e))
    // console.log(newUser);
}

// doStuffWithUserModel()

// ProductMd.sync()

export { ProductMd };

