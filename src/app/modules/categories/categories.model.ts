import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { ProductMd } from '../products/product.model';
import { IMCategories } from './categories.type';


const CategoriesMd = DB.define<IMCategories>(
    TableName.CATEGORIES,
    {
        category_id: cloneDeep(modelCommonPrimaryKeyProperty),
        category_name: { allowNull: false, type: DataTypes.STRING },
        parent_id: { type: DataTypes.UUID },
        order_sequence: { allowNull: false, type: DataTypes.INTEGER },
        show_on_home_screen: { type: DataTypes.BOOLEAN, defaultValue: false },
        show_on_header: { type: DataTypes.BOOLEAN, defaultValue: false },
        tag_id: { type: DataTypes.UUID, defaultValue: null },
        category_image: { allowNull: false, type: DataTypes.STRING, },
        ...cloneDeep(modelCommonColumns)
    },
    cloneDeep(modelCommonOptions)
);


CategoriesMd.hasMany(CategoriesMd, { foreignKey: "parent_id", as: "sub_cat" });
CategoriesMd.belongsTo(CategoriesMd, { foreignKey: "parent_id", as: "parent", targetKey: "category_id" });

CategoriesMd.hasMany(ProductMd, { foreignKey: 'category_id', as: 'products' });
ProductMd.belongsTo(CategoriesMd, { foreignKey: 'category_id', as: 'category', targetKey: "category_id" });

export { CategoriesMd };

