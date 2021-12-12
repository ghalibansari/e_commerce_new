import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CartMd } from '../cart/cart.model';
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

// CategoriesMd.hasMany(ProductMd, { foreignKey: 'category_id', as: 'categories' });
// ProductMd.belongsTo(CategoriesMd, { foreignKey: 'category_id', as: 'category', targetKey: "category_id" });


async function doStuffWithUserModel() {
    // await ImageMd.sync({ force: true })
    // await UserMd.sync({ force: true })
    const id = uuidv4()

    await ProductMd.create({
        product_id: id,
        category_id: "776bbd6e-d00a-4efc-810c-6b71528a418f",
        brand_id: "5784f73b-6290-49b9-ae2e-42af4e00b91e",
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


export { ProductMd };

