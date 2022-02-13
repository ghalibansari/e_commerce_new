import { cloneDeep } from 'lodash';
import { DataTypes } from 'sequelize';
import { DB } from "../../../configs/DB";
import { TableName } from "../../constants";
import { modelCommonColumns, modelCommonOptions, modelCommonPrimaryKeyProperty } from '../BaseModel';
import { BrandMd } from '../brand/brand.model';
import { CategoriesMd } from '../categories/categories.model';
import { ProductMd } from '../products/product.model';
import { IMTag } from './tags.types';

const TagMd = DB.define<IMTag>(
    TableName.TAG_MASTER,
    {
        tag_id: cloneDeep(modelCommonPrimaryKeyProperty),
        name: { allowNull: false, type: DataTypes.STRING },
        text_color_code: { allowNull: true, type: DataTypes.STRING },
        background_color_code: { allowNull: true, type: DataTypes.STRING },
        ...cloneDeep(modelCommonColumns)
    },

    cloneDeep(modelCommonOptions)
);

TagMd.hasMany(BrandMd, { foreignKey: 'tag_id', as: 'brands' });
BrandMd.belongsTo(TagMd, { foreignKey: 'tag_id', as: 'tag', targetKey: "tag_id" });

TagMd.hasMany(CategoriesMd, { foreignKey: 'tag_id', as: 'categories' });
CategoriesMd.belongsTo(TagMd, { foreignKey: 'tag_id', as: 'tag', targetKey: "tag_id" });

TagMd.hasMany(ProductMd, { foreignKey: 'tag_id', as: 'products' });
ProductMd.belongsTo(TagMd, { foreignKey: 'tag_id', as: 'tag', targetKey: "tag_id" });

export { TagMd };

