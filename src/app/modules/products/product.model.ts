import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { CartMd } from '../cart/cart.model';
import { ProductImagesMd } from '../product-images/product-images.model';
import { WishlistMd } from '../wishlist/wishlist.model';
import { IMProduct } from './product.type';


const ProductMd = DB.define<IMProduct>(
    TableName.PRODUCT,
    {
        product_id: cloneDeep(modelCommonPrimaryKeyProperty),
        category_id: { allowNull: false, type: DataTypes.UUID },
        brand_id: { allowNull: false, type: DataTypes.UUID },
        tag_id: { allowNull: true, type: DataTypes.UUID },
        unit_id: { allowNull: false, type: DataTypes.UUID },
        name: { allowNull: false, type: DataTypes.STRING },
        code: { allowNull: false, type: DataTypes.STRING },
        out_of_stock: { allowNull: false, type: DataTypes.BOOLEAN },
        description: { allowNull: true, type: DataTypes.STRING },
        weight: { allowNull: false, type: DataTypes.FLOAT },
        base_price: { allowNull: false, type: DataTypes.FLOAT },
        selling_price: { allowNull: false, type: DataTypes.FLOAT },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);

ProductMd.hasMany(CartMd, { foreignKey: 'product_id', as: 'carts' });
CartMd.belongsTo(ProductMd, { foreignKey: 'product_id', as: 'product', targetKey: "product_id" });

ProductMd.hasMany(ProductImagesMd, { foreignKey: 'product_id', as: 'images' });
ProductImagesMd.belongsTo(ProductMd, { foreignKey: 'product_id', as: 'product', targetKey: "product_id" });

ProductMd.hasMany(WishlistMd, { foreignKey: 'product_id', as: 'wishlists' });
WishlistMd.belongsTo(ProductMd, { foreignKey: 'product_id', as: 'product', targetKey: "product_id" });

export { ProductMd };

